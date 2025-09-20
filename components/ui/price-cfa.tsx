'use client'

import { formatCFA } from '@/lib/utils/currency'

interface PriceCFAProps {
  amount: number
  className?: string
  showCurrency?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PriceCFA({
  amount,
  className = '',
  showCurrency = true,
  size = 'md',
}: PriceCFAProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  }

  const formattedPrice = showCurrency
    ? formatCFA(amount)
    : new Intl.NumberFormat('fr-FR').format(amount)

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formattedPrice}
    </span>
  )
}