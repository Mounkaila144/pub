"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { usePartnersListAdmin, useDeletePartner, useTogglePartnerActive } from '@/lib/hooks/use-partners';
import { Skeleton } from '@/components/ui/skeleton';
import { PartnerFormModal } from '@/components/admin/partner-form-modal';
import { Partner } from '@/lib/api/partners';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';

export default function PartnersAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: partnersResponse, isLoading, error } = usePartnersListAdmin({
    search: searchTerm,
    per_page: 50
  });

  const partners = partnersResponse?.data || [];
  const deletePartner = useDeletePartner();
  const toggleActive = useTogglePartnerActive();
  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      deletePartner.mutate(id);
    }
  };

  const handleToggleActive = (id: string) => {
    toggleActive.mutate(id);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['partners', 'list', 'admin'] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-center space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erreur lors du chargement des partenaires</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partenaires</h1>
          <p className="text-gray-600">Gérez vos partenaires et leurs logos</p>
        </div>

        <Button
          className="flex items-center space-x-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un partenaire</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des partenaires..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="relative h-16 w-16 mx-auto mb-4">
                <Image
                  src={partner.logo_url || '/images/placeholder-partner.jpg'}
                  alt={`Logo de ${partner.name}`}
                  fill
                  className="object-contain rounded-full"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <CardTitle className="text-lg">{partner.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant={partner.is_active ? 'default' : 'secondary'}>
                  {partner.is_active ? 'Actif' : 'Inactif'}
                </Badge>
                <span className="text-sm text-gray-500">#{partner.display_order}</span>
              </div>
            </CardHeader>

            <CardContent>
              {partner.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {partner.description}
                </p>
              )}

              {partner.website_url && (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Visiter le site</span>
                </a>
              )}

              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(partner.id)}
                  className="flex items-center space-x-1"
                >
                  {partner.is_active ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>Désactiver</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Activer</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(partner)}
                >
                  <Edit className="h-3 w-3" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(partner.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun partenaire trouvé</p>
        </div>
      )}

      {/* Create Partner Modal */}
      <PartnerFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Partner Modal */}
      <PartnerFormModal
        partner={editingPartner}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPartner(null);
        }}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}