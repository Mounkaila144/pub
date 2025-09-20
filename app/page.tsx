"use client";

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StepsPublish from '@/components/StepsPublish';
import BooksGrid from '@/components/BooksGrid';
import AuthorsGrid from '@/components/AuthorsGrid';
import PartnersGrid from '@/components/PartnersGrid';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,209,198,0.08),_#ffffff_55%)] text-slate-900">
      <Header />
      <Hero />
      <StepsPublish />
      <BooksGrid />
      <AuthorsGrid />
      <PartnersGrid />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
