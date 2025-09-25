'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAuthorsList, useDeleteAuthor, useToggleAuthorActive, useCreateAuthor, useUpdateAuthor, useAuthor } from '@/lib/hooks/use-authors'
import { Author } from '@/lib/api/authors'
import { DataTablePaginated, Column, Filter } from '@/components/ui/data-table-paginated'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { AuthorForm } from '@/components/forms/author-form'

export default function AuthorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>()
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)

  const { data, isLoading, refetch } = useAuthorsList({
    page: currentPage,
    per_page: 10,
    search: search || undefined,
    is_active: isActiveFilter,
    sort_by: sortBy || undefined,
    sort_order: sortOrder,
  })

  // Refetch data when component mounts to ensure fresh data
  React.useEffect(() => {
    refetch()
  }, [refetch])

  const { mutate: deleteAuthor, isPending: isDeleting } = useDeleteAuthor()
  const { mutate: toggleActive, isPending: isToggling } = useToggleAuthorActive()
  const { mutate: createAuthor, isPending: isCreating } = useCreateAuthor()
  const { mutate: updateAuthor, isPending: isUpdating } = useUpdateAuthor()

  const handleDelete = (id: string) => {
    deleteAuthor(id, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActive({ id, is_active: !isActive }, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const handleCreate = (data: any) => {
    createAuthor(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
        refetch()
      },
    })
  }

  const handleUpdate = (data: any) => {
    if (!editingAuthor) return

    updateAuthor(
      { id: editingAuthor.id, data },
      {
        onSuccess: () => {
          setEditingAuthor(null)
          refetch()
        },
      }
    )
  }

  const columns: Column<Author>[] = [
    {
      key: 'first_name',
      label: 'Auteur',
      sortable: true,
      render: (author) => {
        const initials = `${author.first_name?.[0] ?? ''}${author.last_name?.[0] ?? ''}`.toUpperCase()

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={author.photo_url ?? undefined}
                alt={`${author.first_name} ${author.last_name}`}
              />
              <AvatarFallback>{initials || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{`${author.first_name} ${author.last_name}`}</span>
              {author.email && (
                <span className="text-xs text-muted-foreground">{author.email}</span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'is_active',
      label: 'Statut',
      render: (author) => (
        <Badge variant={author.is_active ? 'default' : 'secondary'}>
          {author.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Créé le',
      sortable: true,
      render: (author) => new Date(author.created_at).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (author) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditingAuthor(author)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToggleActive(author.id, author.is_active)}
              disabled={isToggling}
            >
              {author.is_active ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Désactiver
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Activer
                </>
              )}
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
                  <AlertDialogTitle>Supprimer l&apos;auteur</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cet auteur ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(author.id)}
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
      key: 'is_active',
      label: 'Statut',
      options: [
        { value: 'true', label: 'Actif' },
        { value: 'false', label: 'Inactif' },
      ],
    },
  ]

  const handleFilter = (key: string, value: string) => {
    if (key === 'is_active') {
      setIsActiveFilter(value === '' ? undefined : value === 'true')
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
        <h1 className="text-3xl font-bold">Auteurs</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel auteur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvel auteur</DialogTitle>
            </DialogHeader>
            <AuthorForm mode="create" onSuccess={() => setIsCreateModalOpen(false)} onCancel={() => setIsCreateModalOpen(false)} />
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
       searchPlaceholder="Rechercher par nom ou email..."
       emptyMessage="Aucun auteur trouvé"
     />

     {/* Edit Modal */}
     <Dialog open={!!editingAuthor} onOpenChange={() => setEditingAuthor(null)}>
       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Modifier l'auteur</DialogTitle>
         </DialogHeader>
         {editingAuthor && (
           <AuthorForm mode="edit" author={editingAuthor} onSuccess={() => setEditingAuthor(null)} onCancel={() => setEditingAuthor(null)} />
         )}
       </DialogContent>
     </Dialog>
   </div>
 )
}
