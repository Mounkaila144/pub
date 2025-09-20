"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Elegant White Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/kirikou/book-library-with-open-textbook.jpg"
          alt="Library background"
          fill
          className="object-cover opacity-5"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/90 to-slate-100/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/60" />
      </div>

      {/* Sophisticated White Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-100/40 to-slate-100/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-50/30 to-white/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-slate-100/20 to-gray-100/15 rounded-full blur-2xl" />

      <div className="container relative z-10 text-center px-4 lg:px-8">
        {/* Responsive Content Wrapper - Fixed navbar overlap */}
        <div className="pt-32 sm:pt-28 lg:pt-20">
          {/* Elegant Publishing Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md px-4 lg:px-6 py-2 lg:py-3 rounded-full shadow-2xl border-2 border-gray-100 mb-4 lg:mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600 animate-pulse" />
            <span className="text-xs lg:text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">✨ Maison d'Édition Premium</span>
          </div>

          {/* Responsive Main Title */}
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight animate-slide-up">
            <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent fade-in-up" style={{ animationDelay: '0.1s' }}>Success Publishing</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-4xl xl:text-5xl fade-in-up" style={{ animationDelay: '0.2s' }}>Votre Vision, Notre Expertise</span>
          </h1>

          {/* Responsive Subtitle */}
          <div className="max-w-4xl mx-auto mb-6 lg:mb-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-light leading-relaxed mb-2 lg:mb-3 text-balance">
              Découvrez notre <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">collection exclusive</span> de livres soigneusement sélectionnés
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
              📖 Leadership • Développement personnel • Business • Inspiration
            </p>
          </div>
        </div>

        {/* Responsive Elegant Action Section */}
        <div className="flex flex-col items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8 w-full max-w-6xl">
            {[
              { icon: "📚", label: "Catalogue Complet", desc: "Découvrez tous nos livres", gradient: "from-blue-500/10 to-purple-500/10", border: "border-blue-200" },
              { icon: "✍️", label: "Publier avec Nous", desc: "Rejoignez nos auteurs", gradient: "from-green-500/10 to-blue-500/10", border: "border-green-200" },
              { icon: "🎯", label: "Conseils Experts", desc: "Accompagnement premium", gradient: "from-purple-500/10 to-pink-500/10", border: "border-purple-200" },
              { icon: "🌟", label: "Success Stories", desc: "Témoignages d'auteurs", gradient: "from-orange-500/10 to-red-500/10", border: "border-orange-200" },
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${item.border} group`}>
                <div className="text-lg lg:text-2xl mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <div className="font-semibold text-gray-900 text-xs lg:text-sm mb-1">{item.label}</div>
                <div className="text-xs lg:text-xs text-gray-600 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Publishing Excellence Stats */}
        <div className="mt-8 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 pt-6 lg:pt-8 border-t border-gray-200 animate-fade-in w-full max-w-6xl mx-auto" style={{ animationDelay: '0.8s' }}>
          {[
            { number: '100+', label: 'Livres Publiés', icon: '📖', gradient: 'from-blue-500/10 to-cyan-500/10', accent: 'text-blue-600' },
            { number: '50+', label: 'Auteurs Accompagnés', icon: '✍️', gradient: 'from-green-500/10 to-emerald-500/10', accent: 'text-green-600' },
            { number: '20+', label: 'Partenaires Libraires', icon: '🏪', gradient: 'from-purple-500/10 to-violet-500/10', accent: 'text-purple-600' },
            { number: '98%', label: 'Satisfaction Client', icon: '💯', gradient: 'from-orange-500/10 to-red-500/10', accent: 'text-orange-600' },
          ].map((stat, index) => (
            <div key={index} className={`text-center group cursor-default hover-lift bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50`}>
              <div className="text-lg lg:text-xl mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <div className={`font-playfair text-xl lg:text-2xl xl:text-3xl font-bold ${stat.accent} mb-1 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-xs lg:text-xs text-gray-600 font-semibold tracking-wide uppercase leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;