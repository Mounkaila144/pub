"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Auteurs accompagnés' },
  { value: '100+', label: 'Lancements annuels' },
  { value: '98%', label: 'Satisfaction clients' },
  { value: '15', label: 'Pays de diffusion' },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white">

      <div className="container relative pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-20 lg:pb-32">
        <div className="relative overflow-hidden rounded-[44px] border border-white/50 bg-white/65 px-2 py-5 shadow-[0_45px_80px_-50px_rgba(15,23,42,0.6)] backdrop-blur-md sm:px-10 sm:py-16 lg:rounded-[56px] lg:px-16 lg:py-20">
          <div className="hero-aurora pointer-events-none absolute inset-0" />
          <div className="hero-orb hero-orb--amber pointer-events-none absolute -top-24 -left-20 h-64 w-64 sm:h-72 sm:w-72" />
          <div className="hero-orb hero-orb--rose pointer-events-none absolute top-1/2 -right-16 h-72 w-72 sm:h-80 sm:w-80" />
          <div className="hero-orb hero-orb--indigo pointer-events-none absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 sm:-bottom-24 sm:h-80 sm:w-80" />

          <div className="relative">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr,0.95fr] lg:gap-16">
              <div className="order-2 space-y-10 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-100/80 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Maison d&rsquo;édition boutique
                </div>

                <h1 className="font-playfair text-4xl leading-[1.05] text-slate-900 sm:text-5xl lg:text-[3.75rem]">
                  <span className="block text-slate-900">Des ouvrages élégants</span>
                  <span className="mt-2 block bg-gradient-to-r from-amber-500 via-rose-500 to-slate-900 bg-clip-text text-transparent">
                    pour des voix singulières
                  </span>
                </h1>

                <p className="max-w-2xl text-lg text-slate-600 sm:text-xl">
                  Success Publishing offre un accompagnement sur-mesure, de la relecture au lancement, pour transformer chaque manuscrit en expérience de lecture mémorable.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="rounded-full bg-slate-900 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Déposer mon manuscrit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full border border-slate-200 px-8 py-6 text-base font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Découvrir le catalogue
                  </Button>
                </div>

                <dl className="grid max-w-2xl grid-cols-2 gap-x-10 gap-y-8 text-left sm:gap-x-12">
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1 border-l border-slate-200 pl-6">
                      <dt className="font-playfair text-3xl font-semibold text-slate-900">
                        {stat.value}
                      </dt>
                      <dd className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-5 -z-10 rounded-[48px] bg-gradient-to-br from-amber-100/25 via-white to-transparent opacity-90 blur-2xl sm:-inset-6" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_25px_50px_-25px_rgba(15,23,42,0.35)] backdrop-blur sm:rounded-[40px]">
                  <Image
                    src="/images/kirikou/high-angle-girl-library-reading.jpg"
                    alt="Autrice inspirée dans une bibliothèque lumineuse"
                    width={960}
                    height={1280}
                    className="h-full w-full object-cover"
                    priority
                  />

                  <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/60 bg-white/90 px-5 py-5 shadow-lg backdrop-blur sm:inset-x-6 sm:bottom-6 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                      Lancement réussi
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="font-playfair text-3xl font-semibold text-slate-900">
                        +32%
                      </div>
                      <p className="max-w-[220px] text-sm text-slate-500">
                        de ventes sur les six premiers mois grâce à notre stratégie de diffusion premium.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-10 right-4 w-36 rounded-3xl border border-slate-100 bg-white/95 p-4 text-left shadow-xl backdrop-blur sm:right-6 sm:w-40">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-600">
                    À la une
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    &laquo; Le Leadership de Kirikou &raquo;
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Disponible dès maintenant sur toutes les plateformes partenaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
