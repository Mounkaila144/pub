export function formatCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function parseCFA(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0
}