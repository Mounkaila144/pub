"use client";

import { Star, Quote } from 'lucide-react';
import testimonialsData from '@/data/testimonials.json';

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl lg:text-5xl font-bold text-primary mb-6">
            Témoignages
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            La satisfaction de nos auteurs fait notre fierté
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-lift relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/20">
                <Quote className="h-8 w-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                  <img
                    src={testimonial.avatar}
                    alt={`Portrait de ${testimonial.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <div className="font-semibold text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-accent font-medium">
                    Auteur de "{testimonial.book}"
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-playfair text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-white/90">Note moyenne</div>
            </div>
            <div>
              <div className="font-playfair text-4xl font-bold mb-2">98%</div>
              <div className="text-white/90">Auteurs satisfaits</div>
            </div>
            <div>
              <div className="font-playfair text-4xl font-bold mb-2">500+</div>
              <div className="text-white/90">Avis positifs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;