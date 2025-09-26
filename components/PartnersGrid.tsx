"use client";

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { usePartnersList } from '@/lib/hooks/use-partners';
import { Skeleton } from '@/components/ui/skeleton';

const PartnersGrid = () => {
  const { data: partnersResponse, isLoading, error } = usePartnersList({
    per_page: 20,
    is_active: true
  });

  const partners = partnersResponse?.data || [];

  if (isLoading) {
    return (
      <section id="partenaires" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-8 w-96 mx-auto mb-6" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="partenaires" className="relative overflow-hidden py-24">
        <div className="container relative">
          <div className="text-center">
            <p className="text-red-500">Erreur lors du chargement des partenaires</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section id="partenaires" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,243,232,0.4),_transparent_55%)]" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Nos partenaires
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Ils nous font confiance
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Découvrez les organisations et institutions qui collaborent avec notre maison d'édition.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <article
              key={partner.id}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-slate-100 bg-white shadow-lg transition-all duration-300 group-hover:shadow-xl">
                <Image
                  src={partner.logo_url || '/images/placeholder-partner.jpg'}
                  alt={`Logo de ${partner.name}'s`}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  sizes="80px"
                  unoptimized
                />
              </div>

              <h3 className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                {partner.name}
              </h3>

              {partner.website_url && (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-xs text-slate-500 transition-colors duration-300 hover:text-amber-500"
                >
                  Visiter le site
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {partner.description && (
                <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                  {partner.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersGrid;
