"use client";

// Admin route - always client-side rendered, no static generation needed
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Package,
  Building2,
  Tag,
  Gift,
  Save,
  X,
  Calendar,
  TrendingDown,
  Percent,
  DollarSign,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import { tokenStorage } from '@/lib/utils/token';

interface PurchaseType {
  id?: number;
  type: 'unique' | 'pack' | 'corporate';
  name: string;
  description: string;
  min_quantity: number;
  max_quantity: number | null;
  price_cfa: number;
  discount_percentage: number;
  is_active: boolean;
  display_order: number;
}

interface Tier {
  min: number;
  max: number | null;
  discount: number;
}

interface Promotion {
  id?: number;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'tiered';
  discount_percentage: number | null;
  discount_amount_cfa: number | null;
  buy_quantity: number | null;
  get_quantity: number | null;
  tiers: Tier[] | null;
  start_date: string | null;
  end_date: string | null;
  min_purchase_quantity: number;
  max_uses: number | null;
  is_active: boolean;
  display_order: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Purchase Type Form Component
function PurchaseTypeForm({
  bookId,
  purchaseType,
  onClose,
}: {
  bookId: number;
  purchaseType?: PurchaseType;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PurchaseType>(
    purchaseType || {
      type: 'unique',
      name: '',
      description: '',
      min_quantity: 1,
      max_quantity: null,
      price_cfa: 0,
      discount_percentage: 0,
      is_active: true,
      display_order: 0,
    }
  );

  const mutation = useMutation({
    mutationFn: async (data: PurchaseType) => {
      const token = tokenStorage.get();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (data.id) {
        return axios.put(
          `${API_BASE}/admin/books/${bookId}/purchase-types/${data.id}`,
          data,
          config
        );
      } else {
        return axios.post(
          `${API_BASE}/admin/books/${bookId}/purchase-types`,
          data,
          config
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-types', bookId] });
      toast.success(
        purchaseType ? 'Type d\'achat modifié' : 'Type d\'achat ajouté'
      );
      onClose();
    },
    onError: () => {
      toast.error('Une erreur est survenue');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unique">Achat unique</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
              <SelectItem value="corporate">Entreprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nom</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ex: Achat simple, Pack 3 livres..."
            required
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description optionnelle"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Quantité minimum</Label>
          <Input
            type="number"
            min="1"
            value={formData.min_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                min_quantity: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div>
          <Label>Quantité maximum (optionnel)</Label>
          <Input
            type="number"
            min="1"
            value={formData.max_quantity || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_quantity: e.target.value ? parseInt(e.target.value) : null,
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prix (CFA)</Label>
          <Input
            type="number"
            min="0"
            value={formData.price_cfa}
            onChange={(e) =>
              setFormData({
                ...formData,
                price_cfa: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div>
          <Label>Réduction (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.discount_percentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_percentage: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">Actif</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: checked })
          }
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Promotion Form Component
function PromotionForm({
  bookId,
  promotion,
  onClose,
}: {
  bookId: number;
  promotion?: Promotion;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Promotion>(
    promotion || {
      name: '',
      description: '',
      type: 'percentage',
      discount_percentage: null,
      discount_amount_cfa: null,
      buy_quantity: null,
      get_quantity: null,
      tiers: null,
      start_date: null,
      end_date: null,
      min_purchase_quantity: 1,
      max_uses: null,
      is_active: true,
      display_order: 0,
    }
  );

  const [tiers, setTiers] = useState<Tier[]>(
    promotion?.tiers || [{ min: 1, max: null, discount: 0 }]
  );

  const mutation = useMutation({
    mutationFn: async (data: Promotion) => {
      const token = tokenStorage.get();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = { ...data };
      if (data.type === 'tiered') {
        payload.tiers = tiers;
      }

      if (data.id) {
        return axios.put(
          `${API_BASE}/admin/books/${bookId}/promotions/${data.id}`,
          payload,
          config
        );
      } else {
        return axios.post(
          `${API_BASE}/admin/books/${bookId}/promotions`,
          payload,
          config
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions', bookId] });
      toast.success(
        promotion ? 'Promotion modifiée' : 'Promotion ajoutée'
      );
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addTier = () => {
    setTiers([...tiers, { min: 1, max: null, discount: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof Tier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Nom de la promotion</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ex: Promo Black Friday, Achetez 3 payez 2..."
            required
          />
        </div>

        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description de la promotion"
            rows={2}
          />
        </div>

        <div className="col-span-2">
          <Label>Type de promotion</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Réduction en pourcentage</SelectItem>
              <SelectItem value="fixed">Montant fixe</SelectItem>
              <SelectItem value="buy_x_get_y">Acheter X, obtenir Y gratuit</SelectItem>
              <SelectItem value="tiered">Réduction par paliers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Percentage Discount */}
      {formData.type === 'percentage' && (
        <div>
          <Label>Réduction (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.discount_percentage || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_percentage: parseFloat(e.target.value) || null,
              })
            }
            placeholder="Ex: 20"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Réduction en pourcentage sur le prix total
          </p>
        </div>
      )}

      {/* Fixed Amount Discount */}
      {formData.type === 'fixed' && (
        <div>
          <Label>Montant de réduction (CFA)</Label>
          <Input
            type="number"
            min="0"
            value={formData.discount_amount_cfa || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount_amount_cfa: parseInt(e.target.value) || null,
              })
            }
            placeholder="Ex: 5000"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Montant fixe déduit du prix total
          </p>
        </div>
      )}

      {/* Buy X Get Y */}
      {formData.type === 'buy_x_get_y' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Acheter X livres</Label>
            <Input
              type="number"
              min="1"
              value={formData.buy_quantity || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buy_quantity: parseInt(e.target.value) || null,
                })
              }
              placeholder="Ex: 3"
              required
            />
          </div>
          <div>
            <Label>Obtenir Y gratuit</Label>
            <Input
              type="number"
              min="1"
              value={formData.get_quantity || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  get_quantity: parseInt(e.target.value) || null,
                })
              }
              placeholder="Ex: 1"
              required
            />
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500">
              Ex: Acheter 3 livres, obtenir 1 gratuit
            </p>
          </div>
        </div>
      )}

      {/* Tiered Discount */}
      {formData.type === 'tiered' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Paliers de réduction</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addTier}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un palier
            </Button>
          </div>

          {tiers.map((tier, index) => (
            <Card key={index} className="p-4 space-y-3 border-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Palier {index + 1}</h4>
                {tiers.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTier(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Min</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tier.min}
                    onChange={(e) =>
                      updateTier(index, 'min', parseInt(e.target.value))
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Max</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tier.max || ''}
                    onChange={(e) =>
                      updateTier(
                        index,
                        'max',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="∞"
                  />
                </div>
                <div>
                  <Label className="text-xs">Réduction (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={tier.discount}
                    onChange={(e) =>
                      updateTier(index, 'discount', parseFloat(e.target.value))
                    }
                    required
                  />
                </div>
              </div>
            </Card>
          ))}

          <p className="text-xs text-slate-500">
            Ex: 5-9 livres = -10%, 10+ livres = -20%
          </p>
        </div>
      )}

      <Separator />

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date de début (optionnel)</Label>
          <Input
            type="datetime-local"
            value={formData.start_date ? formData.start_date.slice(0, 16) : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                start_date: e.target.value || null,
              })
            }
          />
        </div>
        <div>
          <Label>Date de fin (optionnel)</Label>
          <Input
            type="datetime-local"
            value={formData.end_date ? formData.end_date.slice(0, 16) : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                end_date: e.target.value || null,
              })
            }
          />
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Quantité minimum</Label>
          <Input
            type="number"
            min="1"
            value={formData.min_purchase_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                min_purchase_quantity: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>
        <div>
          <Label>Limite d'utilisations (optionnel)</Label>
          <Input
            type="number"
            min="1"
            value={formData.max_uses || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_uses: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder="Illimité"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="promo_active">Promotion active</Label>
        <Switch
          id="promo_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: checked })
          }
        />
      </div>

      <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function BookOptionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPurchaseTypeDialog, setShowPurchaseTypeDialog] = useState(false);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<
    PurchaseType | undefined
  >();
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<
    Promotion | undefined
  >();

  // Fetch purchase types
  const {
    data: purchaseTypes = [],
    isLoading: loadingPurchaseTypes,
  } = useQuery({
    queryKey: ['purchase-types', id],
    queryFn: async () => {
      const token = tokenStorage.get();
      const response = await axios.get(
        `${API_BASE}/admin/books/${id}/purchase-types`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    },
  });

  // Fetch promotions
  const {
    data: promotions = [],
    isLoading: loadingPromotions,
  } = useQuery({
    queryKey: ['promotions', id],
    queryFn: async () => {
      const token = tokenStorage.get();
      const response = await axios.get(
        `${API_BASE}/admin/books/${id}/promotions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    },
  });

  // Delete purchase type
  const deletePurchaseType = useMutation({
    mutationFn: async (purchaseTypeId: number) => {
      const token = tokenStorage.get();
      return axios.delete(
        `${API_BASE}/admin/books/${id}/purchase-types/${purchaseTypeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-types', id] });
      toast.success('Type d\'achat supprimé');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  // Delete promotion
  const deletePromotion = useMutation({
    mutationFn: async (promotionId: number) => {
      const token = tokenStorage.get();
      return axios.delete(
        `${API_BASE}/admin/books/${id}/promotions/${promotionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions', id] });
      toast.success('Promotion supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const typeIcons = {
    unique: ShoppingCart,
    pack: Package,
    corporate: Building2,
  };

  const promotionTypeLabels = {
    percentage: 'Pourcentage',
    fixed: 'Montant fixe',
    buy_x_get_y: 'Acheter X obtenir Y',
    tiered: 'Paliers',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/livres')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Options d'achat & Promotions</h1>
            <p className="text-slate-600 mt-1">
              Gérez les types d'achats et promotions pour ce livre
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Types Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Types d'achat</h2>
          </div>
          <Button
            onClick={() => {
              setSelectedPurchaseType(undefined);
              setShowPurchaseTypeDialog(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {loadingPurchaseTypes ? (
          <div className="text-center py-8">Chargement...</div>
        ) : purchaseTypes.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucun type d'achat défini
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {purchaseTypes.map((pt: PurchaseType) => {
              const Icon = typeIcons[pt.type];
              return (
                <Card
                  key={pt.id}
                  className="p-4 space-y-3 border-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-500" />
                      <h3 className="font-bold">{pt.name}</h3>
                    </div>
                    {pt.is_active && (
                      <Badge variant="outline" className="text-green-600">
                        Actif
                      </Badge>
                    )}
                  </div>

                  {pt.description && (
                    <p className="text-sm text-slate-600">{pt.description}</p>
                  )}

                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Quantité: {pt.min_quantity} - {pt.max_quantity || '∞'}</p>
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {pt.price_cfa.toLocaleString()} CFA
                      </p>
                      {pt.discount_percentage > 0 && (
                        <p className="text-sm text-red-600">
                          -{pt.discount_percentage}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedPurchaseType(pt);
                        setShowPurchaseTypeDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Supprimer ce type d\'achat ?')) {
                          deletePurchaseType.mutate(pt.id!);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Promotions Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Promotions</h2>
          </div>
          <Button
            onClick={() => {
              setSelectedPromotion(undefined);
              setShowPromotionDialog(true);
            }}
            className="gap-2 bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {loadingPromotions ? (
          <div className="text-center py-8">Chargement...</div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucune promotion définie
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {promotions.map((promo: any) => (
              <Card
                key={promo.id}
                className={`p-4 space-y-3 border-2 ${
                  promo.is_valid
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-slate-200'
                } hover:border-red-400 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Tag className="h-5 w-5 text-red-500" />
                    <h3 className="font-bold">{promo.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {promo.is_valid && (
                      <Badge className="bg-green-500">Valide</Badge>
                    )}
                    {promo.is_expired && (
                      <Badge variant="destructive">Expirée</Badge>
                    )}
                    {!promo.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>

                {promo.description && (
                  <p className="text-sm text-slate-600">{promo.description}</p>
                )}

                <div className="space-y-2">
                  <Badge variant="secondary">
                    {promotionTypeLabels[promo.type as keyof typeof promotionTypeLabels]}
                  </Badge>

                  {promo.type === 'percentage' && (
                    <p className="text-lg font-bold text-red-600">
                      -{promo.discount_percentage}% de réduction
                    </p>
                  )}

                  {promo.type === 'fixed' && (
                    <p className="text-lg font-bold text-red-600">
                      -{promo.discount_amount_cfa?.toLocaleString()} CFA
                    </p>
                  )}

                  {promo.type === 'buy_x_get_y' && (
                    <p className="text-sm font-semibold">
                      Achetez {promo.buy_quantity}, obtenez {promo.get_quantity} gratuit
                    </p>
                  )}

                  {promo.type === 'tiered' && promo.tiers && (
                    <div className="text-sm space-y-1">
                      {promo.tiers.map((tier: Tier, idx: number) => (
                        <p key={idx}>
                          {tier.min} - {tier.max || '∞'}: -{tier.discount}%
                        </p>
                      ))}
                    </div>
                  )}

                  {(promo.start_date || promo.end_date) && (
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {promo.start_date && (
                        <span>Du {new Date(promo.start_date).toLocaleDateString('fr-FR')}</span>
                      )}
                      {promo.end_date && (
                        <span>au {new Date(promo.end_date).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedPromotion(promo);
                      setShowPromotionDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Supprimer cette promotion ?')) {
                        deletePromotion.mutate(promo.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Purchase Type Dialog */}
      <Dialog open={showPurchaseTypeDialog} onOpenChange={setShowPurchaseTypeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPurchaseType ? 'Modifier' : 'Ajouter'} un type d'achat
            </DialogTitle>
            <DialogDescription>
              Configurez les options d'achat pour ce livre
            </DialogDescription>
          </DialogHeader>
          <PurchaseTypeForm
            bookId={parseInt(id)}
            purchaseType={selectedPurchaseType}
            onClose={() => setShowPurchaseTypeDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Promotion Dialog */}
      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPromotion ? 'Modifier' : 'Ajouter'} une promotion
            </DialogTitle>
            <DialogDescription>
              Configurez une promotion pour ce livre
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            bookId={parseInt(id)}
            promotion={selectedPromotion}
            onClose={() => setShowPromotionDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
