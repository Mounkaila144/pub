"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Filter, ArrowRight } from 'lucide-react';
import booksData from '@/data/books.json';

const BooksGrid = () => {
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [sortBy, setSortBy] = useState('Populaire');
  
  const genres = ['Tous', ...new Set(booksData.books.map(book => book.genre))];
  
  const filteredBooks = booksData.books.filter(book => 
    selectedGenre === 'Tous' || book.genre === selectedGenre
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'Note':
        return b.rating - a.rating;
      case 'Titre':
        return a.title.localeCompare(b.title);
      default:
        return b.rating - a.rating;
    }
  });

  return (
    <section id="catalogue" className="section-padding mesh-gradient">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-responsive-4xl font-bold text-primary mb-6 fade-in-up">
            Notre Catalogue
          </h2>
          <p className="text-responsive-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed fade-in-up">
            Découvrez une sélection exceptionnelle d'œuvres publiées par nos auteurs
          </p>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 items-start lg:items-center justify-between glass p-6 rounded-2xl shadow-elegant fade-in-up">
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 focus-elegant ${
                  selectedGenre === genre
                    ? 'gradient-primary text-primary-foreground shadow-elegant'
                    : 'bg-white/60 text-muted-foreground hover:bg-white/80 hover:text-primary hover:scale-105 shadow-sm'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 glass px-4 py-3 rounded-xl border border-white/20">
            <Filter className="h-5 w-5 text-accent" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-primary focus:outline-none focus-elegant"
            >
              <option value="Populaire">Populaire</option>
              <option value="Note">Note</option>
              <option value="Titre">Titre</option>
            </select>
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {sortedBooks.map((book, index) => (
            <div key={book.id} className="group cursor-pointer fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-elegant border border-white/40 hover-lift hover:shadow-hover">
                {/* Enhanced Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.cover}
                    alt={`Couverture de ${book.title}`}
                    className="w-full h-full object-cover book-cover-hover"
                  />

                  {/* Enhanced Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {book.isNew && (
                      <Badge className="gradient-accent text-accent-foreground shadow-elegant animate-pulse">
                        Nouveau
                      </Badge>
                    )}
                    {book.isBestseller && (
                      <Badge className="gradient-primary text-primary-foreground shadow-elegant">
                        Best-seller
                      </Badge>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Enhanced Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {book.genre}
                    </span>
                  </div>

                  <h3 className="font-playfair text-responsive-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                    {book.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3 font-medium">
                    par {book.author}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {book.description}
                  </p>

                  {/* Enhanced Rating & CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-foreground">
                        {book.rating}
                      </span>
                    </div>

                    <Button variant="ghost" size="sm" className="text-primary hover:text-accent p-0 group/btn focus-elegant">
                      Voir la fiche
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Load More */}
        <div className="text-center mt-16 fade-in-up">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-primary/30 text-primary hover:bg-primary/8 hover:border-primary/50 hover:scale-105 px-10 py-4 rounded-full shadow-elegant hover:shadow-hover transition-all duration-300 focus-elegant"
          >
            Voir plus de livres
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BooksGrid;