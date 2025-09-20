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
    <main className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-amber-50/20">
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