import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Success Publishing - Publiez. Brillez. Inspirez.',
  description: 'La maison d\'édition où vos histoires trouvent leurs lecteurs. Publication, promotion et distribution de livres de qualité.',
  keywords: 'édition, publication, livre, auteur, manuscrit, éditeur',
  openGraph: {
    title: 'Success Publishing - Publiez. Brillez. Inspirez.',
    description: 'La maison d\'édition où vos histoires trouvent leurs lecteurs.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}