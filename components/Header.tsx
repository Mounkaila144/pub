"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen } from 'lucide-react';
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
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100'
          : 'bg-white/10 backdrop-blur-sm'
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
              className="h-8 w-8 lg:h-10 lg:w-10 group-hover:scale-110 transition-all duration-300 filter drop-shadow-lg"
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
                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-all duration-300 relative group focus-elegant px-4 py-2 rounded-lg hover:bg-white/20 shadow-lg hover:shadow-xl"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-8 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Elegant Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-gray-900 hover:text-gray-700 hover:bg-white/20 transition-all duration-300 focus-elegant shadow-lg"
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
                  className="block px-6 py-4 text-sm font-semibold text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 rounded-xl focus-elegant shadow-md hover:shadow-lg"
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