'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, Settings, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBooksList, useDeleteBook, useCreateBook, useUpdateBook, useBook } from '@/lib/hooks/use-books'
import { Book } from '@/lib/api/books'
import { DataTablePaginated, Column, Filter } from '@/components/ui/data-table-paginated'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { BookForm } from '@/components/forms/book-form'

export default function BooksPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const { data, isLoading, refetch } = useBooksList({
    page: currentPage,
    per_page: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    sort_by: sortBy || undefined,
    sort_order: sortOrder,
  })

  // Refetch data when component mounts to ensure fresh data
  React.useEffect(() => {
    refetch()
  }, [refetch])

  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook()
  const { mutate: createBook, isPending: isCreating } = useCreateBook()
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBook()

  const handleDelete = (id: string) => {
    deleteBook(id, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    refetch()
  }

  const handleUpdateSuccess = () => {
    setEditingBook(null)
    refetch()
  }

  const columns: Column<Book>[] = [
    {
      key: 'title',
      label: 'Livre',
      sortable: true,
      render: (book) => (
        <div className="flex flex-col">
          <span className="font-semibold">{book.title}</span>
          {book.subtitle && (
            <span className="text-sm text-muted-foreground">{book.subtitle}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {book.authors.map(author => `${author.first_name} ${author.last_name}`).join(', ')}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (book) => (
        <Badge variant={book.status === 'published' ? 'default' : 'secondary'}>
          {book.status === 'published' ? 'Publié' : 'Brouillon'}
        </Badge>
      ),
    },
    {
      key: 'language',
      label: 'Langue',
      render: (book) => (
        <span className="text-sm">{book.language}</span>
      ),
    },
    {
      key: 'publication_date',
      label: 'Date de publication',
      sortable: true,
      render: (book) => new Date(book.publication_date).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (book) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditingBook(book)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/admin/livres/${book.id}/options`)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Options d'achat & Promos
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le livre</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(book.id)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filters: Filter[] = [
    {
      key: 'status',
      label: 'Statut',
      options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'published', label: 'Publié' },
      ],
    },
  ]

  const handleFilter = (key: string, value: string) => {
    if (key === 'status') {
      setStatusFilter(value === '' ? '' : value)
    }
    setCurrentPage(1)
  }

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    setSortBy(key)
    setSortOrder(order)
    setCurrentPage(1)
  }

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Livres</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau livre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau livre</DialogTitle>
            </DialogHeader>
            <BookForm mode="create" onSuccess={handleCreateSuccess} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTablePaginated
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        currentPage={data?.meta.current_page || 1}
        totalPages={data?.meta.last_page || 1}
        total={data?.meta.total || 0}
        perPage={data?.meta.per_page || 10}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        filters={filters}
        searchPlaceholder="Rechercher par titre, auteur..."
        emptyMessage="Aucun livre trouvé"
      />

      {/* Edit Modal */}
      <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <BookForm
              mode="edit"
              book={editingBook}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setEditingBook(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}