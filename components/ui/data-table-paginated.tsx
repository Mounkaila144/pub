'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface Filter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface DataTablePaginatedProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  currentPage: number
  totalPages: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
  onSearch?: (search: string) => void
  onFilter?: (key: string, value: string) => void
  onSort?: (key: string, order: 'asc' | 'desc') => void
  filters?: Filter[]
  searchPlaceholder?: string
  emptyMessage?: string
  persistFilters?: boolean
}

export function DataTablePaginated<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
  onSearch,
  onFilter,
  onSort,
  filters = [],
  searchPlaceholder = 'Rechercher...',
  emptyMessage = 'Aucun résultat trouvé',
  persistFilters = false,
}: DataTablePaginatedProps<T>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState('')
  const [sortKey, setSortKey] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Initialize from URL params
  useEffect(() => {
    if (persistFilters) {
      const urlSearch = searchParams.get('search') || ''
      const urlSort = searchParams.get('sort') || ''
      const urlOrder = (searchParams.get('order') as 'asc' | 'desc') || 'asc'

      setSearchValue(urlSearch)
      setSortKey(urlSort)
      setSortOrder(urlOrder)

      const urlFilters: Record<string, string> = {}
      filters.forEach(filter => {
        const value = searchParams.get(filter.key)
        if (value) {
          urlFilters[filter.key] = value
        }
      })
      setActiveFilters(urlFilters)
    }
  }, [searchParams, persistFilters, filters])

  const updateURL = (params: Record<string, string | null>) => {
    if (!persistFilters) return

    const current = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`, { scroll: false })
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
    updateURL({ search: value || null, page: '1' })
  }

  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortOrder(newOrder)
    onSort?.(key, newOrder)
    updateURL({ sort: key, order: newOrder })
  }

  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...activeFilters }
    if (value) {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }
    setActiveFilters(newFilters)
    onFilter?.(key, value)
    updateURL({ [key]: value || null, page: '1' })
  }

  const clearFilter = (key: string) => {
    handleFilter(key, '')
  }

  const clearAllFilters = () => {
    setSearchValue('')
    setActiveFilters({})
    setSortKey('')
    setSortOrder('asc')
    onSearch?.('')
    filters.forEach(filter => onFilter?.(filter.key, ''))

    const clearedParams: Record<string, null> = {
      search: null,
      sort: null,
      order: null,
      page: null,
    }
    filters.forEach(filter => {
      clearedParams[filter.key] = null
    })
    updateURL(clearedParams)
  }

  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, total)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {onSearch && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || ''}
              onValueChange={(value) => handleFilter(filter.key, value)}
            >
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {(searchValue || Object.keys(activeFilters).length > 0 || sortKey) && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {(searchValue || Object.keys(activeFilters).length > 0) && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: "{searchValue}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleSearch('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key)
            const option = filter?.options.find(o => o.value === value)
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {filter?.label}: {option?.label || value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => clearFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key as string}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key as string)}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      {column.label}
                      {sortKey === column.key && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: perPage }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {startItem} à {endItem} sur {total} résultats
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}