"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';


const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden text-[var(--text)]">
      <div className="absolute inset-0 ocean-hero" aria-hidden="true" />

      <div className="container relative z-10 pt-10 pb-10 sm:pt-32 sm:pb-40 lg:pt-10 lg:pb-20">

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:gap-16">
              <div className="order-2 space-y-10 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100 shadow-sm ">
                  <Sparkles className="h-4 w-4 text-teal-100" />
                  Maison d&rsquo;édition
                </div>

                <h1 className="font-playfair text-4xl leading-[1.05] text-sky-50 sm:text-5xl lg:text-[3.6rem]">
                  <span className="block">Des ouvrages élégants</span>
                  <span className="mt-2 block bg-gradient-to-r from-teal-200 via-sky-200 to-white bg-clip-text text-transparent">
                    pour des voix singulières
                  </span>
                </h1>

                <p className="max-w-2xl text-lg text-sky-100/80 sm:text-xl">
                  Success Publishing offre un accompagnement sur-mesure, de la relecture au lancement, pour transformer chaque manuscrit en expérience de lecture mémorable.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="rounded-full bg-white px-9 py-6 text-base font-semibold text-slate-900 shadow-lg shadow-sky-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                  >
                    Déposer mon manuscrit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full border border-white/40 px-9 py-6 text-base font-semibold text-sky-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Découvrir le catalogue
                  </Button>
                </div>

              </div>

              <div className="relative order-1 flex justify-center lg:order-2">
                <div className="relative max-w-sm">
                  <div className="rounded-[36px] bg-[linear-gradient(130deg,var(--bg-3)_0%,rgba(124,205,255,0.65)_50%,rgba(2,26,53,0.9)_100%)] p-[2px] shadow-[0_45px_80px_-50px_rgba(2,26,53,0.8)]">
                    <div className="relative overflow-hidden rounded-[32px] bg-slate-950/30">
                      <Image
                        src="/images/kirikou/high-angle-girl-library-reading.jpg"
                        alt="Autrice inspirée dans une bibliothèque lumineuse"
                        width={960}
                        height={1280}
                        className="h-full w-full object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div className="absolute -top-12 right-0 w-40 rounded-3xl border border-white/20 bg-slate-950/40 p-4 text-left shadow-2xl backdrop-blur-xl sm:-top-14 sm:right-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-100">
                      À la une
                    </p>
                    <p className="mt-3 text-sm font-semibold text-white">
                      &laquo; Le Leadership de Kirikou &raquo;
                    </p>
                    <p className="mt-1 text-xs text-sky-100/70">
                      Disponible dès maintenant sur toutes les plateformes partenaires.
                    </p>
                  </div>

                  <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/20 bg-slate-950/30 px-6 py-5 text-left shadow-xl backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-100">
                      Lancement réussi
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <p className="font-playfair text-3xl font-semibold text-white">+32%</p>
                      <p className="max-w-[220px] text-sm text-sky-100/80">
                        de ventes sur les six premiers mois grâce à notre stratégie de diffusion premium.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>

      <div className="ocean-wave-divider pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32" aria-hidden="true">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hero-wave-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'rgba(36, 209, 198, 0.45)' }} />
              <stop offset="45%" style={{ stopColor: 'rgba(124, 205, 255, 0.4)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0.95)' }} />
            </linearGradient>
          </defs>
          <path
            d="M0,64 C120,96 240,128 360,128 C520,128 640,80 800,80 C960,80 1080,128 1240,128 C1320,128 1380,96 1440,80 L1440,0 L0,0 Z"
            fill="url(#hero-wave-gradient)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
