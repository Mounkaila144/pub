"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent/80 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 editorial-grain opacity-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Rejoignez plus de 500 auteurs</span>
        </div>

        {/* Main Content */}
        <h2 className="font-playfair text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Prêt à publier
          <br />
          <span className="text-accent">votre livre ?</span>
        </h2>

        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transformez votre manuscrit en succès de librairie avec l'accompagnement premium de Success Publishing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10 py-6 text-lg rounded-full group shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Publier maintenant
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-10 py-6 text-lg rounded-full"
          >
            Découvrir nos services
          </Button>
        </div>

        {/* Trust Elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="text-white/80">
            <div className="font-playfair text-2xl font-bold text-white mb-1">
              Gratuit
            </div>
            <div className="text-sm">
              Devis personnalisé
            </div>
          </div>
          <div className="text-white/80">
            <div className="font-playfair text-2xl font-bold text-white mb-1">
              30 jours
            </div>
            <div className="text-sm">
              Première publication
            </div>
          </div>
          <div className="text-white/80">
            <div className="font-playfair text-2xl font-bold text-white mb-1">
              24/7
            </div>
            <div className="text-sm">
              Support auteur
            </div>
          </div>
          <div className="text-white/80">
            <div className="font-playfair text-2xl font-bold text-white mb-1">
              100%
            </div>
            <div className="text-sm">
              Droits conservés
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;