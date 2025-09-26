"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Globe, Calendar, BookOpen, X } from 'lucide-react';
import { Author } from '@/lib/api/authors';

interface AuthorDetailsModalProps {
  author: Author | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorDetailsModal = ({ author, isOpen, onClose }: AuthorDetailsModalProps) => {
  if (!author) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header with author photo */}
          <div className="relative h-64 bg-gradient-to-br from-amber-50 to-slate-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-2xl">
                <Image
                  src={author.photo_url || '/images/placeholder-avatar.jpg'}
                  alt={`Photo de ${author.first_name} ${author.last_name}`}
                  fill
                  className="object-cover"
                  sizes="192px"
                  unoptimized
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80 p-0 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="font-playfair text-3xl text-slate-900 mb-2">
                    {author.first_name} {author.last_name}
                  </DialogTitle>
                  {author.full_name && author.full_name !== `${author.first_name} ${author.last_name}` && (
                    <p className="text-lg text-slate-600 font-medium">
                      {author.full_name}
                    </p>
                  )}
                </div>
                <Badge
                  variant={author.is_active ? 'default' : 'secondary'}
                  className="ml-4"
                >
                  {author.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </DialogHeader>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {author.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Email</p>
                      <p className="text-slate-900">{author.email}</p>
                    </div>
                  </div>
                )}

                {author.website_url && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Site web</p>
                      <a
                        href={author.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 underline"
                      >
                        {author.website_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            {author.bio && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold text-slate-900">Biographie</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {author.bio}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Social Links */}
            {author.socials && Object.keys(author.socials).length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Réseaux sociaux</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(author.socials).map(([platform, url]) => (
                      <Badge key={platform} variant="outline" className="text-sm">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-700"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Statistics */}
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-slate-900">Statut</span>
                </div>
                <p className="text-slate-600">
                  {author.is_active ? 'Auteur actif' : 'Auteur inactif'}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-slate-900">Membre depuis</span>
                </div>
                <p className="text-slate-600">
                  {formatDate(author.created_at)}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-slate-900">ID Auteur</span>
                </div>
                <p className="text-slate-600 font-mono text-sm">
                  {author.id}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <Separator className="my-6" />
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Dernière mise à jour: {formatDate(author.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};