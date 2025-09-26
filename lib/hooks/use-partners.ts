import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnersApi, PartnersListParams, CreatePartnerRequest, UpdatePartnerRequest, UpdatePartnersOrderRequest } from '@/lib/api/partners'
import { toast } from '@/hooks/use-toast'

// Query keys
export const PARTNERS_QUERY_KEYS = {
  all: ['partners'] as const,
  lists: () => [...PARTNERS_QUERY_KEYS.all, 'list'] as const,
  list: (params: PartnersListParams) => [...PARTNERS_QUERY_KEYS.lists(), params] as const,
  details: () => [...PARTNERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PARTNERS_QUERY_KEYS.details(), id] as const,
}

// Hook for fetching partners list (public)
export const usePartnersList = (params: PartnersListParams = {}) => {
  return useQuery({
    queryKey: PARTNERS_QUERY_KEYS.list(params),
    queryFn: () => partnersApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching partners list (admin)
export const usePartnersListAdmin = (params: PartnersListParams = {}) => {
  return useQuery({
    queryKey: [...PARTNERS_QUERY_KEYS.lists(), 'admin', params],
    queryFn: () => partnersApi.listAdmin(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching a single partner (public)
export const usePartner = (id: string) => {
  return useQuery({
    queryKey: PARTNERS_QUERY_KEYS.detail(id),
    queryFn: () => partnersApi.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching a single partner (admin)
export const usePartnerAdmin = (id: string) => {
  return useQuery({
    queryKey: PARTNERS_QUERY_KEYS.detail(`${id}-admin`),
    queryFn: () => partnersApi.getAdmin(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for creating a partner
export const useCreatePartner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePartnerRequest | FormData) => partnersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.lists() })
      toast({
        title: 'Succès',
        description: 'Partenaire créé avec succès',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Erreur lors de la création du partenaire',
        variant: 'destructive',
      })
    },
  })
}

// Hook for updating a partner
export const useUpdatePartner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerRequest | FormData }) =>
      partnersApi.update(id, data),
    onSuccess: (updatedPartner) => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(updatedPartner.id) })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(`${updatedPartner.id}-admin`) })
      toast({
        title: 'Succès',
        description: 'Partenaire mis à jour avec succès',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Erreur lors de la mise à jour du partenaire',
        variant: 'destructive',
      })
    },
  })
}

// Hook for deleting a partner
export const useDeletePartner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => partnersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.lists() })
      toast({
        title: 'Succès',
        description: 'Partenaire supprimé avec succès',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Erreur lors de la suppression du partenaire',
        variant: 'destructive',
      })
    },
  })
}

// Hook for toggling partner active status
export const useTogglePartnerActive = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => partnersApi.toggleActive(id),
    onSuccess: (updatedPartner) => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(updatedPartner.id) })
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.detail(`${updatedPartner.id}-admin`) })
      toast({
        title: 'Succès',
        description: `Partenaire ${updatedPartner.is_active ? 'activé' : 'désactivé'} avec succès`,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Erreur lors du changement de statut du partenaire',
        variant: 'destructive',
      })
    },
  })
}

// Hook for updating partners order
export const useUpdatePartnersOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePartnersOrderRequest) => partnersApi.updateOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEYS.lists() })
      toast({
        title: 'Succès',
        description: 'Ordre des partenaires mis à jour avec succès',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error?.message || 'Erreur lors de la mise à jour de l\'ordre',
        variant: 'destructive',
      })
    },
  })
}