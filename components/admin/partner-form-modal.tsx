"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreatePartner, useUpdatePartner } from '@/lib/hooks/use-partners';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Partner } from '@/lib/api/partners';

interface PartnerFormModalProps {
  partner?: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PartnerFormModal = ({ partner, isOpen, onClose, onSuccess }: PartnerFormModalProps) => {
  const isEditing = !!partner;
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    is_active: true,
    display_order: 0,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        description: partner.description || '',
        website_url: partner.website_url || '',
        is_active: partner.is_active,
        display_order: partner.display_order,
      });
      setLogoPreview(partner.logo_url || null);
    } else {
      setFormData({
        name: '',
        description: '',
        website_url: '',
        is_active: true,
        display_order: 0,
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
  }, [partner, isOpen]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDelete = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Le nom du partenaire est requis');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('website_url', formData.website_url);
    submitData.append('is_active', formData.is_active ? 'true' : 'false');
    submitData.append('display_order', formData.display_order.toString());

    // Ajouter le fichier logo seulement s'il y en a un
    if (logoFile) {
      submitData.append('logo', logoFile);
    }
    // Si pas de fichier, ne pas envoyer le champ logo du tout

    if (isEditing && partner) {
      updatePartner.mutate({ id: partner.id, data: submitData }, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        }
      });
    } else {
      createPartner.mutate(submitData, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        }
      });
    }
  };

  const isLoading = isEditing ? updatePartner.isPending : createPartner.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le partenaire' : 'Nouveau partenaire'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du partenaire *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Université de Niamey"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website_url">Site web</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://exemple.com"
                />
              </div>

              <div>
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ordre d'apparition dans la liste (0 = premier)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Partenaire actif</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez brièvement le partenaire..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Logo</Label>
                <ImageUploader
                  onUpload={handleLogoUpload}
                  onDelete={handleLogoDelete}
                  currentImageUrl={logoPreview || undefined}
                  placeholder="Cliquez pour ajouter/modifier le logo"
                  className="h-32 w-32 mx-auto"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Formats acceptés: JPEG, PNG, GIF, SVG. Taille max: 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading
                ? (isEditing ? 'Modification...' : 'Création...')
                : (isEditing ? 'Modifier' : 'Créer')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};