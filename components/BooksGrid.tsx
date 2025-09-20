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
    <section id="catalogue" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-primary mb-6">
            Notre Catalogue
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez une sélection exceptionnelle d'œuvres publiées par nos auteurs
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Populaire">Populaire</option>
              <option value="Note">Note</option>
              <option value="Titre">Titre</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedBooks.map((book) => (
            <div key={book.id} className="group cursor-pointer">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover-lift">
                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.cover}
                    alt={`Couverture de ${book.title}`}
                    className="w-full h-full object-cover book-cover-hover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {book.isNew && (
                      <Badge className="bg-accent text-accent-foreground">
                        Nouveau
                      </Badge>
                    )}
                    {book.isBestseller && (
                      <Badge className="bg-primary text-primary-foreground">
                        Best-seller
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-accent uppercase tracking-wide">
                      {book.genre}
                    </span>
                  </div>
                  
                  <h3 className="font-playfair text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                    {book.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    par {book.author}
                  </p>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {book.description}
                  </p>
                  
                  {/* Rating & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-foreground">
                        {book.rating}
                      </span>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-primary hover:text-accent p-0">
                      Voir la fiche
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-2 border-primary/20 text-primary hover:bg-primary/5">
            Voir plus de livres
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BooksGrid;