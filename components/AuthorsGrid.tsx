"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useAuthorsList } from '@/lib/hooks/use-authors';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorDetailsModal } from './AuthorDetailsModal';
import { Author } from '@/lib/api/authors';

const AuthorsGrid = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: authorsResponse, isLoading, error } = useAuthorsList({
    per_page: 20,
    is_active: true
  });

  const authors = authorsResponse?.data || [];

  if (isLoading) {
    return (
      <section id="auteurs" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex h-full flex-col items-center rounded-[28px] border border-slate-100 bg-white/80 p-8 text-center shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)]">
                <Skeleton className="h-24 w-24 rounded-full mb-6" />
                <Skeleton className="h-6 w-32 mb-3" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-16 w-full mb-6" />
                <div className="flex w-full items-center justify-between border-t border-slate-100 pt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24" />
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
      <section id="auteurs" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="text-center">
            <p className="text-red-500">Erreur lors du chargement des auteurs</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="auteurs" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.035),_transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#f7f3eb] via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Auteurs maison
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Les voix qui façonnent notre catalogue
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Une communauté éclectique d'écrivains, d'essayistes et de créatifs accompagnés avec exigence et bienveillance.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {authors.map((author) => (
            <article
              key={author.id}
              className="group flex h-full flex-col items-center rounded-[28px] border border-slate-100 bg-white/80 p-8 text-center shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_45px_60px_-35px_rgba(15,23,42,0.45)]"
            >
              <div className="relative mb-6">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-[0_15px_35px_-20px_rgba(15,23,42,0.45)]">
                  <Image
                    src={author.photo_url || '/images/placeholder-avatar.jpg'}
                    alt={`Portrait de ${author.first_name} ${author.last_name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    sizes="96px"
                    unoptimized
                  />
                </div>

                <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                  {author.is_active && (
                    <Badge className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                      Actif
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-playfair text-2xl text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                {author.first_name} {author.last_name}
              </h3>

              <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span className="rounded-full border border-slate-200 px-3 py-1">
                  Auteur
                </span>
              </div>

              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
                {author.bio || 'Biographie non disponible'}
              </p>

              <div className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  Auteur
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition-colors duration-300 hover:bg-slate-900 hover:text-white"
                  onClick={() => {
                    setSelectedAuthor(author);
                    setIsModalOpen(true);
                  }}
                >
                  Voir le profil
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-100 bg-white/80 px-8 py-10 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur">
            <h3 className="font-playfair text-3xl text-slate-900">
              Envie de rejoindre notre écurie d’auteurs ?
            </h3>
            <p className="mt-4 text-sm text-slate-600">
              Nous accueillons de nouvelles plumes avec un accompagnement personnalisé, de la conception éditoriale à la stratégie de lancement.
            </p>
            <Button className="mt-6 rounded-full bg-amber-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-amber-500/90">
              Devenir auteur maison
            </Button>
          </div>
        </div>
      </div>

      <AuthorDetailsModal
        author={selectedAuthor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
        }}
      />
    </section>
  );
};

export default AuthorsGrid;
