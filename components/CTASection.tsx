"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_65%)]" />
        <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/40 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(148,163,184,0.05))]" />
      </div>

      <div className="container relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          Programme auteur signature
        </div>

        <h2 className="mt-8 font-playfair text-4xl leading-tight sm:text-5xl lg:text-6xl">
          Nous façonnons votre livre comme une œuvre
        </h2>

        <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-200">
          Profitez d’une équipe éditoriale dédiée, d’un studio de direction artistique et d’une diffusion internationale pour donner un éclat durable à votre projet.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full bg-white px-10 py-6 text-base font-semibold text-slate-900 shadow-lg shadow-white/10 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Prendre rendez-vous
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border border-white/40 px-10 py-6 text-base font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            Recevoir la brochure
          </Button>
        </div>

        <div className="mt-16 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[{
            value: 'Gratuit',
            label: 'Audit éditorial'
          }, {
            value: '30 jours',
            label: 'Pour la première mise en librairie'
          }, {
            value: '24/7',
            label: 'Contact avec l’équipe éditoriale'
          }, {
            value: '100%',
            label: 'Droits conservés par l’auteur'
          }].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/15 bg-white/5 px-6 py-6 shadow-lg shadow-black/10 backdrop-blur">
              <div className="font-playfair text-3xl font-semibold">{item.value}</div>
              <p className="mt-2 text-sm text-slate-200">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
