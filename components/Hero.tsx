"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';


const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden text-[var(--text)]">
      <div className="absolute inset-0 ocean-hero" aria-hidden="true" />

      <div className="container relative z-10 pt-10 pb-40 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-20">

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
                    className="rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 px-9 py-6 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105"
                  >
                    Déposer mon manuscrit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full border-2 border-gradient-to-r from-purple-400 to-pink-400 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 backdrop-blur-sm px-9 py-6 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-purple-500/30 hover:via-pink-500/30 hover:to-rose-500/30 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
                  >
                    Découvrir le catalogue
                  </Button>
                </div>

              </div>

              <div className="relative order-1 flex justify-center lg:order-2">
                <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
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

      {/* Courbures océaniques améliorées */}
      <div className="ocean-wave-divider pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-48 lg:h-64" aria-hidden="true">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <defs>
            <linearGradient id="ocean-to-cream-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(12, 101, 133, 0.85)' }} />
              <stop offset="25%" style={{ stopColor: 'rgba(36, 209, 198, 0.7)' }} />
              <stop offset="50%" style={{ stopColor: 'rgba(124, 205, 255, 0.5)' }} />
              <stop offset="75%" style={{ stopColor: 'rgba(240, 249, 255, 0.8)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(248, 250, 252, 1)' }} />
            </linearGradient>
            <linearGradient id="wave-overlay-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(241, 245, 249, 0.2)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(248, 250, 252, 1)' }} />
            </linearGradient>
          </defs>

          {/* Première vague - fond océanique */}
          <path
            d="M0,120 C240,80 480,160 720,120 C960,80 1200,140 1440,100 L1440,320 L0,320 Z"
            fill="url(#ocean-to-cream-gradient)"
            opacity="0.9"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="M0,120 C240,80 480,160 720,120 C960,80 1200,140 1440,100 L1440,320 L0,320 Z;
                      M0,140 C240,100 480,180 720,140 C960,100 1200,160 1440,120 L1440,320 L0,320 Z;
                      M0,120 C240,80 480,160 720,120 C960,80 1200,140 1440,100 L1440,320 L0,320 Z"
            />
          </path>

          {/* Deuxième vague - transition */}
          <path
            d="M0,180 C360,140 720,220 1080,180 C1260,160 1350,170 1440,180 L1440,320 L0,320 Z"
            fill="url(#wave-overlay-gradient)"
            opacity="0.8"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="M0,180 C360,140 720,220 1080,180 C1260,160 1350,170 1440,180 L1440,320 L0,320 Z;
                      M0,200 C360,160 720,240 1080,200 C1260,180 1350,190 1440,200 L1440,320 L0,320 Z;
                      M0,180 C360,140 720,220 1080,180 C1260,160 1350,170 1440,180 L1440,320 L0,320 Z"
            />
          </path>

          {/* Troisième vague - blanc pur */}
          <path
            d="M0,240 C480,200 960,280 1440,240 L1440,320 L0,320 Z"
            fill="rgba(248, 250, 252, 1)"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="M0,240 C480,200 960,280 1440,240 L1440,320 L0,320 Z;
                      M0,260 C480,220 960,300 1440,260 L1440,320 L0,320 Z;
                      M0,240 C480,200 960,280 1440,240 L1440,320 L0,320 Z"
            />
          </path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
