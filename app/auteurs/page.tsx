"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Users, Search } from 'lucide-react';
import { useAuthorsList } from '@/lib/hooks/use-authors';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorDetailsModal } from '@/components/AuthorDetailsModal';
import { Author } from '@/lib/api/authors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';

const AuthorsPage = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'tous' | 'actifs'>('tous');

  const { data: authorsResponse, isLoading, error } = useAuthorsList({
    per_page: 100,
  });

  const authors = authorsResponse?.data || [];

  const filteredAuthors = authors.filter((author) => {
    const matchesSearch = searchQuery === '' ||
      `${author.first_name} ${author.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = filterActive === 'tous' || (filterActive === 'actifs' && author.is_active);
    return matchesSearch && matchesActive;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,209,198,0.08),_transparent_50%)]" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 mb-6">
              <Users className="h-4 w-4" />
              Nos auteurs
            </div>

            <h1 className="font-playfair text-5xl lg:text-6xl text-slate-900 mb-6">
              Tous nos auteurs
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Découvrez les plumes talentueuses qui composent notre maison d'édition.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher un auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-slate-200 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Authors Grid Section */}
      <section className="py-16">
        <div className="container">
          {/* Filters */}
          <div className="mb-12 flex flex-col gap-6 rounded-[36px] border border-slate-100 bg-white/80 p-8 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterActive('tous')}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  filterActive === 'tous'
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'border border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterActive('actifs')}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  filterActive === 'actifs'
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'border border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                Actifs
              </button>
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filteredAuthors.length}</span> auteur{filteredAuthors.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(12)].map((_, i) => (
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
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Erreur lors du chargement des auteurs</p>
            </div>
          )}

          {/* Authors Grid */}
          {!isLoading && !error && (
            <>
              {filteredAuthors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg text-slate-600">Aucun auteur trouvé</p>
                  <p className="text-sm text-slate-500 mt-2">Essayez de modifier vos filtres ou votre recherche</p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAuthors.map((author, index) => (
                    <article
                      key={author.id}
                      className="group flex h-full flex-col items-center rounded-[28px] border border-slate-100 bg-white/80 p-8 text-center shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_45px_60px_-35px_rgba(15,23,42,0.45)]"
                      style={{ transitionDelay: `${index * 40}ms` }}
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
              )}
            </>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-100 bg-white/80 px-8 py-10 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.4)] backdrop-blur">
              <h3 className="font-playfair text-3xl text-slate-900">
                Envie de rejoindre notre écurie d'auteurs ?
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
      </section>

      <Footer />

      <AuthorDetailsModal
        author={selectedAuthor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
        }}
      />
    </div>
  );
};

export default AuthorsPage;
