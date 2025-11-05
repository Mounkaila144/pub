"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Livres', href: '/livres' },
    { label: 'Auteurs', href: '/auteurs' },
    { label: 'Publier un livre', href: '/#publier' },
    { label: 'Partenaires', href: '/#partenaires' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-500 bg-gradient-to-r from-slate-50/95 via-white/95 to-sky-50/95 backdrop-blur-xl shadow-2xl border-b border-teal-200/30"
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Elegant White Logo */}
          <Link href="/" className="flex items-center space-x-3 group focus-elegant relative">
            <div className="relative">
              <Image
                src="/images/kirikou/iconLogo-Success-Publishing.png"
                alt="Success Publishing"
                width={40}
                height={40}
                className="h-8 w-8 lg:h-10 lg:w-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 filter drop-shadow-lg relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500 blur-md"></div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
            </div>
            <div className="relative">
              <span className="font-playfair text-responsive-lg font-bold bg-gradient-to-r from-slate-800 via-teal-700 to-blue-700 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:via-cyan-600 group-hover:to-blue-600 transition-all duration-500 drop-shadow-lg">
                Success Publishing
              </span>
              <Star className="absolute -top-1 -right-2 h-3 w-3 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-100" />
            </div>
          </Link>

          {/* Elegant White Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent hover:from-teal-600 hover:to-blue-600 transition-all duration-500 relative group focus-elegant px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-teal-200/30 hover:scale-105"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 group-hover:w-8 rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
              </Link>
            ))}
          </nav>

          {/* Elegant Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 hover:scale-110 transition-all duration-300 focus-elegant shadow-lg hover:shadow-xl hover:shadow-teal-300/40"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Elegant Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl animate-slide-up">
            <nav className="section-padding-sm space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-6 py-4 text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent hover:from-teal-600 hover:to-blue-600 transition-all duration-300 rounded-xl focus-elegant shadow-md hover:shadow-lg hover:shadow-teal-200/30 hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;