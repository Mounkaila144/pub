"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Filter, Star } from 'lucide-react';
import { useBooksList } from '@/lib/hooks/use-books';
import { Skeleton } from '@/components/ui/skeleton';
import { BookDetailsModal } from './BookDetailsModal';
import { Book } from '@/lib/api/books';

const BooksGrid = () => {
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [sortBy, setSortBy] = useState('Populaire');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: booksResponse, isLoading, error } = useBooksList({
    per_page: 20,
    status: 'published'
  });

  const books = booksResponse?.data || [];

  // Extraire les langues uniques des livres
  const languages = ['Tous', ...Array.from(new Set(books.map((book) => book.language)))];

  const filteredBooks = books.filter(
    (book) => selectedGenre === 'Tous' || book.language === selectedGenre,
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'Titre':
        return a.title.localeCompare(b.title);
      case 'Date':
        return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (isLoading) {
    return (
      <section id="catalogue" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white/80 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)]">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-16 w-full mb-6" />
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="catalogue" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="text-center">
            <p className="text-red-500">Erreur lors du chargement des livres</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogue" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,243,232,0.6),_transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Catalogue signature
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Des ouvrages façonnés avec soin
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Parcourez une sélection raffinée d’œuvres ambitieuses et inspirantes issues de notre maison d’édition.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6 rounded-[36px] border border-slate-100 bg-white/80 p-8 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => setSelectedGenre(language)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus-elegant ${
                  selectedGenre === language
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'border border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {language}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
            <Filter className="h-4 w-4 text-amber-500" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-transparent text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 focus:outline-none"
            >
              <option value="Populaire">Populaire</option>
              <option value="Note">Note</option>
              <option value="Titre">Titre</option>
            </select>
          </div>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBooks.map((book, index) => (
            <article
              key={book.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white/80 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_45px_65px_-35px_rgba(15,23,42,0.45)] cursor-pointer"
              style={{ transitionDelay: `${index * 40}ms` }}
              onClick={() => window.location.href = `/livres/${book.slug}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={book.cover_url || '/images/placeholder-book.jpg'}
                  alt={`Couverture de ${book.title}`}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width:1280px) 280px, (min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                  unoptimized
                />

                <div className="absolute left-5 top-5 flex flex-col gap-2">
                  {book.status === 'published' && (
                    <Badge className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 shadow">
                      Publié
                    </Badge>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-500">
                  {book.language}
                </div>

                <h3 className="mt-3 font-playfair text-2xl text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                  {book.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  par {book.authors.map(author => `${author.first_name} ${author.last_name}`).join(', ')}
                </p>

                <p className="mt-4 line-clamp-3 text-sm text-slate-600 leading-relaxed">
                  {book.synopsis || 'Résumé non disponible'}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-sm font-semibold">{book.pages} pages</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                      setIsModalOpen(true);
                    }}
                  >
                    Aperçu rapide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border border-slate-300 px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900"
            onClick={() => window.location.href = '/livres'}
          >
            Voir plus de livres
          </Button>
        </div>
      </div>

      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
      />
    </section>
  );
};

export default BooksGrid;
