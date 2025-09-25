'use client'

import { useState, useRef } from 'react'
import { X, GripVertical, Plus } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useAuthorsList } from '@/lib/hooks/use-authors'
import { Author } from '@/lib/api/authors'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface SelectedAuthor {
  id: string
  first_name: string
  last_name: string
  contribution_order: number
  contribution_role: string
}

interface AuthorsMultiSelectProps {
  value: SelectedAuthor[]
  onChange: (authors: SelectedAuthor[]) => void
  className?: string
  error?: string
}

const CONTRIBUTION_ROLES = [
  { value: 'author', label: 'Auteur' },
  { value: 'co-author', label: 'Co-auteur' },
  { value: 'editor', label: 'Éditeur' },
  { value: 'translator', label: 'Traducteur' },
  { value: 'illustrator', label: 'Illustrateur' },
  { value: 'contributor', label: 'Contributeur' },
]

export function AuthorsMultiSelect({ value, onChange, className = '', error }: AuthorsMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: authorsData } = useAuthorsList({
    search: search || undefined,
    per_page: 50,
    is_active: true,
  })

  const authors = authorsData?.data || []
  const selectedAuthorIds = value.map(a => a.id)
  const availableAuthors = authors.filter(author => !selectedAuthorIds.includes(author.id))

  const addAuthor = (author: Author) => {
    const newAuthor: SelectedAuthor = {
      id: author.id,
      first_name: author.first_name,
      last_name: author.last_name,
      contribution_order: value.length + 1,
      contribution_role: 'author',
    }
    onChange([...value, newAuthor])
    setOpen(false)
    setSearch('')
  }

  const removeAuthor = (id: string) => {
    const updated = value.filter(author => author.id !== id)
    // Reorder remaining authors
    const reordered = updated.map((author, index) => ({
      ...author,
      contribution_order: index + 1,
    }))
    onChange(reordered)
  }

  const updateAuthorRole = (id: string, role: string) => {
    const updated = value.map(author =>
      author.id === id ? { ...author, contribution_role: role } : author
    )
    onChange(updated)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(value)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update contribution_order
    const reordered = items.map((author, index) => ({
      ...author,
      contribution_order: index + 1,
    }))

    onChange(reordered)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Auteurs *</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Command>
              <CommandInput
                placeholder="Rechercher un auteur..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandEmpty>Aucun auteur trouvé</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {availableAuthors.map((author) => (
                  <CommandItem
                    key={author.id}
                    onSelect={() => addAuthor(author)}
                    className="cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">
                        {author.first_name} {author.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{author.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          Aucun auteur sélectionné
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="authors">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {value.map((author, index) => (
                  <Draggable key={author.id} draggableId={author.id.toString()} index={index}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          flex items-center space-x-3 p-3 bg-white border rounded-lg
                          ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}
                        `}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        <Badge variant="secondary" className="min-w-[2rem] justify-center">
                          {author.contribution_order}
                        </Badge>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {author.first_name} {author.last_name}
                          </div>
                        </div>

                        <Select
                          value={author.contribution_role}
                          onValueChange={(role) => updateAuthorRole(author.id, role)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTRIBUTION_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAuthor(author.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {value.length > 0 && (
        <p className="text-xs text-gray-500">
          Glissez-déposez pour réorganiser l'ordre des auteurs
        </p>
      )}
    </div>
  )
}