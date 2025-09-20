"use client";

import { Button } from '@/components/ui/button';
import { FileText, Search, Palette, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Manuscrit affiné',
    description: 'Déposez votre texte et bénéficiez d’un premier diagnostic éditorial sous 72 h.',
    details: 'Formats Word, PDF ou Google Docs acceptés',
  },
  {
    icon: Search,
    title: 'Relecture experte',
    description: 'Nos éditeurs ajustent style, structure et tonalité pour valoriser votre voix.',
    details: 'Corrections linguistiques & suggestions personnalisées',
  },
  {
    icon: Palette,
    title: 'Signature visuelle',
    description: 'Une maquette élégante, une couverture originale et des finitions premium.',
    details: 'Design sur-mesure • Formats papier & numérique',
  },
  {
    icon: Rocket,
    title: 'Lancement orchestré',
    description: 'Distribution internationale et plan marketing pour installer votre ouvrage.',
    details: 'Amazon, FNAC, libraires partenaires + campagne médias',
  },
];

const StepsPublish = () => {
  return (
    <section id="publier" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.035),_transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#fdf8f1] via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Processus dédié
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Publier avec élégance, pas à pas
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Chaque étape est orchestrée par notre équipe pour garantir une sortie fluide, esthétique et impactante de votre livre.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group relative flex h-full flex-col justify-between rounded-[32px] border border-slate-100 bg-white/80 p-8 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_65px_-35px_rgba(15,23,42,0.45)]"
              >
                <div className="absolute -top-6 left-8 h-12 w-12 rounded-2xl border border-amber-100/70 bg-amber-50 text-center text-sm font-semibold uppercase tracking-[0.2em] text-amber-500 shadow">
                  <span className="inline-flex h-full w-full items-center justify-center">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-playfair text-2xl text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                <p className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {step.details}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-[36px] border border-slate-100 bg-white/80 px-10 py-8 text-center shadow-[0_20px_45px_-35px_rgba(15,23,42,0.4)] backdrop-blur sm:flex-row sm:gap-8">
          <p className="max-w-xl text-sm text-slate-600">
            Prêt à écrire le prochain chapitre de votre carrière d’auteur ? Nous coordonnons votre publication de A à Z avec un suivi dédié.
          </p>
          <Button className="rounded-full bg-amber-500 px-8 py-5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-amber-500/90">
            Planifier un appel découverte
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StepsPublish;
