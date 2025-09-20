"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';
import authorsData from '@/data/authors.json';

const AuthorsGrid = () => {
  return (
    <section id="auteurs" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-primary mb-6">
            Nos Auteurs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez les talents qui font la richesse de notre catalogue littéraire
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {authorsData.authors.map((author) => (
            <div key={author.id} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    <img
                      src={author.avatar}
                      alt={`Portrait de ${author.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {author.isNew && (
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        Nouveau
                      </Badge>
                    )}
                    {author.isBestseller && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Best-seller
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-playfair text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {author.name}
                </h3>

                {/* Genres */}
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {author.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="text-xs px-2 py-1 bg-gray-100 text-muted-foreground rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {author.bio}
                </p>

                {/* Stats & CTA */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{author.booksCount} livre{author.booksCount > 1 ? 's' : ''}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-primary hover:text-accent p-0">
                    Voir le profil
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-4">
              Vous souhaitez rejoindre nos auteurs ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nous accompagnons les nouveaux talents dans leur parcours de publication
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3">
              Devenir auteur
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorsGrid;