"use client";

import { FileText, Search, Palette, Rocket } from 'lucide-react';

const StepsPublish = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Manuscrit',
      description: 'Soumettez votre manuscrit complet via notre plateforme sécurisée.',
      details: 'Formats acceptés: Word, PDF, Google Docs'
    },
    {
      icon: Search,
      title: 'Relecture',
      description: 'Notre équipe éditoriale examine et améliore votre texte.',
      details: 'Correction, révision stylistique et suggestions'
    },
    {
      icon: Palette,
      title: 'Maquette',
      description: 'Création professionnelle de la couverture et mise en page.',
      details: 'Design personnalisé et formats multiples'
    },
    {
      icon: Rocket,
      title: 'Publication',
      description: 'Distribution sur toutes les plateformes et libraires partenaires.',
      details: 'Amazon, FNAC, libraires indépendants'
    },
  ];

  return (
    <section id="publier" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-primary mb-6">
            Comment publier votre livre
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Un processus simple et professionnel pour transformer votre manuscrit en livre publié
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <div key={index} className="relative group">
                  {/* Timeline Dot */}
                  <div className="hidden lg:block absolute -top-16 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg z-10" />
                  
                  {/* Step Number */}
                  <div className="lg:hidden absolute -top-4 -left-4 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover-lift group-hover:shadow-xl transition-all duration-300">
                    <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    
                    <h3 className="font-playfair text-xl font-bold text-primary mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="text-sm text-accent font-medium">
                      {step.details}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Prêt à commencer votre parcours de publication ?
          </p>
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            Soumettre mon manuscrit
          </button>
        </div>
      </div>
    </section>
  );
};

export default StepsPublish;