"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && consent) {
      // Newsletter subscription logic
      console.log('Newsletter subscription:', { email, consent });
      setEmail('');
      setConsent(false);
    }
  };

  return (
    <footer id="contact" className="bg-primary text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-7 w-7 text-accent" />
              <span className="font-playfair text-2xl font-bold">
                Success Publishing
              </span>
            </Link>
            
            <p className="text-white/80 leading-relaxed mb-6">
              La maison d'édition qui accompagne vos histoires vers le succès. 
              Depuis 10 ans, nous publions et promouvons les talents littéraires.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-white/80">
                  123 Boulevard Saint-Germain, 75006 Paris
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-white/80">+33 1 42 86 78 90</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-white/80">contact@successpublishing.fr</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                'Publication de livres',
                'Édition et relecture',
                'Création de couvertures',
                'Distribution et diffusion',
                'Marketing littéraire',
                'Accompagnement auteur'
              ].map((service) => (
                <li key={service}>
                  <Link 
                    href="#" 
                    className="text-white/80 hover:text-accent transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-6">Liens utiles</h3>
            <ul className="space-y-3">
              {[
                { label: 'Catalogue', href: '#catalogue' },
                { label: 'Nos auteurs', href: '#auteurs' },
                { label: 'Partenaires', href: '#partenaires' },
                { label: 'Blog littéraire', href: '#' },
                { label: 'Événements', href: '#' },
                { label: 'FAQ', href: '#' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-playfair text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-white/80 text-sm mb-6">
              Recevez nos actualités littéraires et découvrez en avant-première nos nouveautés.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-accent"
              />
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-accent"
                />
                <label htmlFor="consent" className="text-xs text-white/80 leading-relaxed">
                  J'accepte de recevoir la newsletter et les communications de Success Publishing
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={!email || !consent}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                S'abonner
              </Button>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white/80 text-sm">
              © 2024 Success Publishing. Tous droits réservés.
            </div>
            
            <div className="flex items-center space-x-6">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-white/60 hover:text-accent transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/10">
            {[
              'Mentions légales',
              'Politique de confidentialité',
              'CGV',
              'Plan du site'
            ].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-white/60 hover:text-accent transition-colors text-sm"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;