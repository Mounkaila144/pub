"use client";

// Public route - always client-side rendered, no static generation needed
export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  ShoppingCart,
  Tag,
  TrendingDown,
  Users,
  Package,
  Building2,
  Gift,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface PurchaseType {
  id: number;
  type: 'unique' | 'pack' | 'corporate';
  name: string;
  description: string | null;
  min_quantity: number;
  max_quantity: number | null;
  price_cfa: number;
  discount_percentage: number;
  final_price: number;
  savings: number;
  is_active: boolean;
}

interface Promotion {
  id: number;
  name: string;
  description: string | null;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'tiered';
  discount_percentage: number | null;
  discount_amount_cfa: number | null;
  buy_quantity: number | null;
  get_quantity: number | null;
  tiers: Array<{ min: number; max: number | null; discount: number }> | null;
  start_date: string | null;
  end_date: string | null;
  is_valid: boolean;
  is_expired: boolean;
}

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  contribution_role: string;
}

interface BookDetail {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  isbn_10: string | null;
  isbn_13: string | null;
  synopsis: string | null;
  status: string;
  language: string;
  publication_date: string;
  pages: number;
  cover_url: string | null;
  price_cfa: number;
  currency: string;
  authors: Author[];
  purchase_types: PurchaseType[];
  promotions: Promotion[];
}

async function getBookDetail(slug: string): Promise<BookDetail> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/books/${slug}/detail`
  );
  return response.data.data;
}

const typeIcons = {
  unique: ShoppingCart,
  pack: Package,
  corporate: Building2,
};

const typeLabels = {
  unique: 'Achat unique',
  pack: 'Pack',
  corporate: 'Entreprise',
};

const typeColors = {
  unique: 'from-blue-500 to-blue-600',
  pack: 'from-purple-500 to-purple-600',
  corporate: 'from-amber-500 to-amber-600',
};

export default function BookDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book-detail', slug],
    queryFn: () => getBookDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600">Livre non trouvé</p>
              <Link href="/livres">
                <Button className="mt-4">Retour au catalogue</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section with Book Cover */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(36,209,198,0.08),_transparent_50%)]" />

        <div className="container relative z-10">
          <Link href="/livres">
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au catalogue
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Book Cover */}
            <div className="relative">
              <div className="sticky top-32">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border-4 border-white">
                  <Image
                    src={book.cover_url || '/images/placeholder-book.jpg'}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                    unoptimized
                  />
                </div>

                {book.status === 'published' && (
                  <Badge className="absolute -top-4 -right-4 bg-green-500 text-white px-6 py-3 text-sm font-bold shadow-lg">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Disponible
                  </Badge>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-8">
              {/* Title & Subtitle */}
              <div>
                <h1 className="font-playfair text-5xl lg:text-6xl text-slate-900 mb-4">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-xl text-slate-600">{book.subtitle}</p>
                )}
              </div>

              {/* Authors */}
              <div className="flex flex-wrap gap-4">
                {book.authors.map((author) => (
                  <Link key={author.id} href={`/auteurs`}>
                    <div className="flex items-center gap-3 bg-white rounded-full pr-6 pl-2 py-2 border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md">
                      {author.photo_url && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={author.photo_url}
                            alt={author.full_name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{author.full_name}</p>
                        <p className="text-xs text-slate-500">{author.contribution_role}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500">Publication</p>
                    <p className="text-sm font-semibold">
                      {new Date(book.publication_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500">Pages</p>
                    <p className="text-sm font-semibold">{book.pages} pages</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <Globe className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-500">Langue</p>
                    <p className="text-sm font-semibold uppercase">{book.language}</p>
                  </div>
                </div>

                {(book.isbn_10 || book.isbn_13) && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Tag className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500">ISBN</p>
                      <p className="text-sm font-semibold">{book.isbn_13 || book.isbn_10}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {book.synopsis && (
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h2 className="font-playfair text-2xl text-slate-900 mb-4">Synopsis</h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {book.synopsis}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Types Section */}
      {book.purchase_types && book.purchase_types.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl text-slate-900 mb-4">
                Options d'achat
              </h2>
              <p className="text-lg text-slate-600">
                Choisissez la formule qui vous convient le mieux
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {book.purchase_types.map((purchaseType) => {
                const Icon = typeIcons[purchaseType.type];
                const color = typeColors[purchaseType.type];

                return (
                  <Card
                    key={purchaseType.id}
                    className="relative overflow-hidden border-2 border-slate-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl group"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />

                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">
                              {purchaseType.name}
                            </h3>
                            {purchaseType.description && (
                              <p className="text-xs text-slate-500 mt-1">
                                {purchaseType.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Info */}
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {purchaseType.min_quantity === purchaseType.max_quantity
                            ? `${purchaseType.min_quantity} livre${purchaseType.min_quantity > 1 ? 's' : ''}`
                            : purchaseType.max_quantity
                            ? `${purchaseType.min_quantity} à ${purchaseType.max_quantity} livres`
                            : `Minimum ${purchaseType.min_quantity} livre${purchaseType.min_quantity > 1 ? 's' : ''}`
                          }
                        </span>
                      </div>

                      <Separator />

                      {/* Pricing */}
                      <div className="space-y-2">
                        {purchaseType.discount_percentage > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 line-through">
                                {purchaseType.price_cfa.toLocaleString()} {book.currency}
                              </span>
                              <Badge variant="destructive" className="gap-1">
                                <TrendingDown className="h-3 w-3" />
                                -{purchaseType.discount_percentage}%
                              </Badge>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-3xl font-bold text-slate-900">
                                  {purchaseType.final_price.toLocaleString()}
                                </span>
                                <span className="text-lg text-slate-600 ml-2">{book.currency}</span>
                              </div>
                            </div>
                            <p className="text-xs text-green-600 font-semibold">
                              Économisez {purchaseType.savings.toLocaleString()} {book.currency}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-3xl font-bold text-slate-900">
                                {purchaseType.price_cfa.toLocaleString()}
                              </span>
                              <span className="text-lg text-slate-600 ml-2">{book.currency}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                        size="lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Commander
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Promotions Section */}
      {book.promotions && book.promotions.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold mb-4 animate-pulse">
                <Gift className="h-5 w-5" />
                Promotions en cours
              </div>
              <h2 className="font-playfair text-4xl text-slate-900 mb-4">
                Offres spéciales
              </h2>
              <p className="text-lg text-slate-600">
                Profitez de nos offres exceptionnelles
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {book.promotions.map((promotion) => (
                <Card
                  key={promotion.id}
                  className="relative overflow-hidden border-2 border-amber-200 bg-white shadow-lg"
                >
                  <div className="absolute top-0 right-0">
                    <div className="bg-red-500 text-white px-8 py-2 transform rotate-45 translate-x-8 -translate-y-4 text-xs font-bold">
                      PROMO
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
                        <Tag className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 mb-1">
                          {promotion.name}
                        </h3>
                        {promotion.description && (
                          <p className="text-sm text-slate-600">{promotion.description}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Promotion Details */}
                    <div className="space-y-2">
                      {promotion.type === 'percentage' && (
                        <p className="text-2xl font-bold text-red-600">
                          -{promotion.discount_percentage}% de réduction
                        </p>
                      )}

                      {promotion.type === 'fixed' && (
                        <p className="text-2xl font-bold text-red-600">
                          -{promotion.discount_amount_cfa?.toLocaleString()} {book.currency}
                        </p>
                      )}

                      {promotion.type === 'buy_x_get_y' && (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                          <p className="text-lg font-bold text-slate-900">
                            Achetez {promotion.buy_quantity}, obtenez {promotion.get_quantity} gratuit{promotion.get_quantity! > 1 ? 's' : ''} !
                          </p>
                        </div>
                      )}

                      {promotion.type === 'tiered' && promotion.tiers && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-slate-700">Réductions par paliers :</p>
                          {promotion.tiers.map((tier, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2">
                              <span className="text-sm text-slate-600">
                                {tier.min} - {tier.max || '∞'} livres
                              </span>
                              <span className="font-bold text-red-600">-{tier.discount}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Validity Period */}
                    {(promotion.start_date || promotion.end_date) && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {promotion.end_date
                            ? `Valable jusqu'au ${new Date(promotion.end_date).toLocaleDateString('fr-FR')}`
                            : 'Offre à durée limitée'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
