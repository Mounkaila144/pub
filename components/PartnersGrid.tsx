"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import partnersData from '@/data/partners.json';

const PartnersGrid = () => {
  const categories = [...new Set(partnersData.partners.map((partner) => partner.category))];

  return (
    <section id="partenaires" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,236,225,0.6),_transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Réseau de diffusion
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Nos partenaires de confiance
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Une sélection de libraires, plateformes et médias spécialisés qui accompagnent la visibilité des livres Success Publishing.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 backdrop-blur"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {partnersData.partners.map((partner) => (
            <div
              key={partner.id}
              className="group flex h-full flex-col items-center justify-center rounded-[26px] border border-slate-100 bg-white/80 p-6 text-center shadow-[0_22px_45px_-32px_rgba(15,23,42,0.45)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_38px_65px_-35px_rgba(15,23,42,0.5)]"
            >
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/80 group-hover:border-amber-200 group-hover:bg-amber-50/60">
                <Image
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  fill
                  className="object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 group-hover:text-amber-600">
                {partner.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{partner.category}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 text-center sm:grid-cols-3">
          {[{
            value: '50+',
            label: 'Partenaires actifs'
          }, {
            value: '2 000+',
            label: 'Points de vente'
          }, {
            value: '15',
            label: 'Pays couverts'
          }].map((stat) => (
            <div key={stat.label} className="rounded-[30px] border border-slate-100 bg-white/80 px-6 py-8 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)]">
              <div className="font-playfair text-3xl font-semibold text-slate-900">{stat.value}</div>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-[36px] border border-slate-100 bg-white/85 px-10 py-10 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.4)] backdrop-blur">
            <h3 className="font-playfair text-3xl text-slate-900">
              Vous êtes un professionnel du livre ?
            </h3>
            <p className="mt-4 text-sm text-slate-600">
              Échangeons sur les prochaines parutions et sur les dispositifs de lancement disponibles pour vos points de vente.
            </p>
            <button className="mt-6 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-800">
              Devenir partenaire
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
