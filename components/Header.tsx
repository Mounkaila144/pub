"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
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
    { label: 'Accueil', href: '#' },
    { label: 'Publier un livre', href: '#publier' },
    { label: 'Catalogue', href: '#catalogue' },
    { label: 'Auteurs', href: '#auteurs' },
    { label: 'Partenaires', href: '#partenaires' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_20px_45px_-25px_rgba(15,23,42,0.45)] border-b border-slate-100'
          : 'bg-white/40 backdrop-blur-md'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Elegant White Logo */}
          <Link href="/" className="flex items-center space-x-3 group focus-elegant">
            <Image
              src="/images/kirikou/iconLogo-Success-Publishing.png"
              alt="Success Publishing"
              width={40}
              height={40}
              className="h-8 w-8 lg:h-10 lg:w-10 transition-all duration-500 group-hover:scale-105"
            />
            <span className="font-playfair text-responsive-lg font-bold text-gray-900 group-hover:text-gray-700 transition-all duration-300 drop-shadow-lg">
              Success Publishing
            </span>
          </Link>

          {/* Elegant White Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-sm font-semibold text-slate-600 transition-colors duration-300 focus-elegant hover:text-slate-900"
              >
                {item.label}
                <span className="pointer-events-none absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-slate-900 transition-all duration-500 group-hover:w-10" />
              </Link>
            ))}
          </nav>

          {/* Elegant Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-full p-2.5 text-slate-700 transition-all duration-300 hover:bg-white/70 focus-elegant"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Elegant Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="animate-slide-up border-t border-slate-100 bg-white/95 backdrop-blur-xl shadow-xl lg:hidden">
            <nav className="section-padding-sm space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-xl px-6 py-4 text-sm font-semibold text-slate-700 transition-all duration-300 focus-elegant hover:bg-slate-50"
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
