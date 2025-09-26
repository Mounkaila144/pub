"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book, Calendar, Globe, Hash, FileText, DollarSign, Users, X } from 'lucide-react';
import { Book as BookType } from '@/lib/api/books';

interface BookDetailsModalProps {
  book: BookType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailsModal = ({ book, isOpen, onClose }: BookDetailsModalProps) => {
  if (!book) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header with cover image */}
          <div className="relative h-64 bg-gradient-to-br from-amber-50 to-slate-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-48 w-36 overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={book.cover_url || '/images/placeholder-book.jpg'}
                  alt={`Couverture de ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="144px"
                  unoptimized
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80 p-0 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="font-playfair text-3xl text-slate-900 mb-2">
                    {book.title}
                  </DialogTitle>
                  {book.subtitle && (
                    <p className="text-lg text-slate-600 font-medium">
                      {book.subtitle}
                    </p>
                  )}
                </div>
                <Badge
                  variant={book.status === 'published' ? 'default' : 'secondary'}
                  className="ml-4"
                >
                  {book.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
            </DialogHeader>

            {/* Authors */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900">Auteurs</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {book.authors.map((author, index) => (
                  <Badge key={author.id} variant="outline" className="text-sm">
                    {author.first_name} {author.last_name}
                    {author.contribution_role && (
                      <span className="ml-2 text-xs text-slate-500">
                        ({author.contribution_role})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Book Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Langue</p>
                    <p className="text-slate-900">{book.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pages</p>
                    <p className="text-slate-900">{book.pages} pages</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Date de publication</p>
                    <p className="text-slate-900">{formatDate(book.publication_date)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Prix</p>
                    <p className="text-slate-900">{formatPrice(book.price_cfa, book.currency)}</p>
                  </div>
                </div>

                {book.isbn_13 && (
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">ISBN-13</p>
                      <p className="text-slate-900 font-mono text-sm">{book.isbn_13}</p>
                    </div>
                  </div>
                )}

                {book.isbn_10 && (
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">ISBN-10</p>
                      <p className="text-slate-900 font-mono text-sm">{book.isbn_10}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Synopsis */}
            {book.synopsis && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-slate-900">Résumé</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {book.synopsis}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator className="my-6" />
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Créé le {formatDate(book.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>ID: {book.id}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};