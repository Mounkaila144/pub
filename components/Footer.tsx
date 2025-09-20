"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email && consent) {
      // Placeholder for newsletter subscription service
      console.log('Newsletter subscription:', { email, consent });
      setEmail('');
      setConsent(false);
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(148,163,184,0.08),rgba(148,163,184,0))]" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />
      </div>

      <div className="relative">
        <div className="container py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-white">
                <span className="font-playfair text-3xl font-semibold">Success Publishing</span>
              </Link>
              <p className="mt-6 max-w-md text-sm text-slate-200/90">
                Maison d’édition boutique spécialisée dans l’accompagnement d’auteurs francophones. Nous transformons les manuscrits en parutions élégantes, diffusées en France et à l’international.
              </p>

              <div className="mt-8 grid gap-6 text-sm text-slate-300 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-amber-400" />
                  <span>123 boulevard Saint-Germain, 75006 Paris</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-amber-400" />
                  <span>+33 1 42 86 78 90</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-amber-400" />
                  <span>contact@successpublishing.fr</span>
                </div>
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="font-playfair text-xl font-semibold">Services</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {[
                    'Accompagnement éditorial',
                    'Design & maquette',
                    'Impression premium',
                    'Distribution internationale',
                    'Marketing & relations presse',
                    'Coaching auteur',
                  ].map((service) => (
                    <li key={service}>
                      <span className="transition-colors duration-300 hover:text-white">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-playfair text-xl font-semibold">Newsletter privée</h3>
                <p className="mt-4 text-sm text-slate-300">
                  Recevez chaque mois nos conseils éditoriaux, appels à manuscrits et coulisses des lancements.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3">
                  <Input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus:border-amber-400"
                  />
                  <label className="flex items-start gap-2 text-xs text-slate-300">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(Boolean(checked))}
                      className="mt-0.5 border-white/40 data-[state=checked]:bg-amber-400"
                    />
                    <span>J’accepte de recevoir les communications de Success Publishing.</span>
                  </label>
                  <Button
                    type="submit"
                    disabled={!email || !consent}
                    className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    S’inscrire
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-slate-300/80">
              © {new Date().getFullYear()} Success Publishing. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6 text-slate-300">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <Link key={label} href="#" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:text-white">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 py-8 text-xs uppercase tracking-[0.25em] text-slate-400">
            {['Mentions légales', 'Politique de confidentialité', 'CGV', 'Cookies'].map((item) => (
              <Link key={item} href="#" className="transition-colors duration-300 hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
