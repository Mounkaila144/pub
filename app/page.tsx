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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3ede4,_#ffffff_45%)] text-slate-900">
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
