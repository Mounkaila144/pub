"use client";

import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import testimonialsData from '@/data/testimonials.json';

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.03),_transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            Expériences auteurs
          </p>
          <h2 className="mt-4 font-playfair text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Ils racontent leur collaboration avec Success Publishing
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Nos auteurs témoignent d’une aventure éditoriale fluide, attentive et ambitieuse, du manuscrit à la tournée presse.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="relative flex h-full flex-col justify-between rounded-[28px] border border-slate-100 bg-white/85 p-8 shadow-[0_22px_48px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_42px_68px_-32px_rgba(15,23,42,0.45)]"
            >
              <Quote className="absolute right-8 top-8 h-10 w-10 text-amber-200" />

              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                <blockquote className="mt-6 text-sm leading-relaxed text-slate-600">
                  “{testimonial.text}”
                </blockquote>
              </div>

              <footer className="mt-8 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-4 border-white shadow-[0_10px_25px_-18px_rgba(15,23,42,0.6)]">
                  <Image
                    src={testimonial.avatar}
                    alt={`Portrait de ${testimonial.name}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{testimonial.role}</p>
                  <p className="mt-1 text-xs text-amber-600">Auteur de “{testimonial.book}”</p>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-[36px] border border-slate-100 bg-white/80 px-6 py-12 text-center shadow-[0_20px_55px_-35px_rgba(15,23,42,0.4)] backdrop-blur">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { value: '4.9/5', label: 'Note moyenne des auteurs' },
              { value: '98%', label: 'Recommandent Success Publishing' },
              { value: '500+', label: 'Avis positifs vérifiés' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="font-playfair text-3xl font-semibold text-slate-900">{stat.value}</div>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
