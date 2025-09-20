"use client";

import { Badge } from '@/components/ui/badge';
import partnersData from '@/data/partners.json';

const PartnersGrid = () => {
  const categories = [...new Set(partnersData.partners.map(partner => partner.category))];

  return (
    <section id="partenaires" className="py-24 bg-gradient-to-b from-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-primary mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Un réseau de distribution premium pour maximiser la visibilité de vos œuvres
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="outline" 
              className="px-3 py-1 text-sm border-accent/30 text-muted-foreground hover:bg-accent/5 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {partnersData.partners.map((partner) => (
            <div 
              key={partner.id} 
              className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover-lift flex flex-col items-center justify-center text-center min-h-[140px] transition-all duration-300"
            >
              {/* Logo placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center group-hover:from-accent/10 group-hover:to-accent/20 transition-all duration-300">
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  className="w-12 h-12 object-contain rounded grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              {/* Partner Name */}
              <h3 className="font-semibold text-sm text-primary group-hover:text-accent transition-colors">
                {partner.name}
              </h3>
              
              {/* Category */}
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                {partner.category}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="font-playfair text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground font-medium">Partenaires actifs</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="font-playfair text-3xl font-bold text-primary mb-2">2000+</div>
            <div className="text-muted-foreground font-medium">Points de vente</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="font-playfair text-3xl font-bold text-primary mb-2">15</div>
            <div className="text-muted-foreground font-medium">Pays couverts</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-4">
              Vous êtes un professionnel du livre ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Rejoignez notre réseau de distribution et proposez nos titres à vos clients
            </p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold transition-all hover:scale-105">
              Devenir partenaire
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;