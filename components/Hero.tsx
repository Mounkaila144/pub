"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden editorial-grain">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      {/* Book Stack Illustration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="relative">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-16 h-64 rounded-r-lg shadow-lg absolute transition-all duration-1000 delay-${i * 200}`}
              style={{
                backgroundColor: ['#1a2332', '#d4a574', '#8b7355', '#6b5b73', '#4a5568'][i],
                transform: `translateX(${i * 12}px) translateY(${i * -8}px) rotate(${i * 2 - 4}deg)`,
                zIndex: 5 - i,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 mb-8">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-primary">Votre histoire mérite d'être publiée</span>
        </div>

        {/* Main Title */}
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
          <span className="block">Publiez.</span>
          <span className="block text-accent">Brillez.</span>
          <span className="block">Inspirez.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl mx-auto text-balance">
          La maison où vos histoires trouvent leurs lecteurs.
          <br />
          <span className="text-primary font-medium">Accompagnement premium de l'écriture à la distribution.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full group"
          >
            Commencer la publication
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary/20 text-primary hover:bg-primary/5 font-semibold px-8 py-6 text-lg rounded-full"
          >
            Découvrir les livres
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200/50">
          {[
            { number: '1000+', label: 'Livres publiés' },
            { number: '500+', label: 'Auteurs accompagnés' },
            { number: '50+', label: 'Partenaires libraires' },
            { number: '95%', label: 'Satisfaction clients' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-playfair text-2xl lg:text-3xl font-bold text-primary mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;