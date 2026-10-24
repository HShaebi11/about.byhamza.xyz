const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
}

export function formatMoney(amount: number, currency = 'GBP'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const hasFraction = Math.round(safeAmount * 100) % 100 !== 0
  const formatted = new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 2,
    minimumFractionDigits: hasFraction ? 2 : 0,
  }).format(safeAmount)
  const symbol = CURRENCY_SYMBOL[currency]
  return symbol ? `${symbol}${formatted}` : `${formatted} ${currency}`
}

export function formatTotals(totals: Map<string, number>): string {
  if (totals.size === 0) return formatMoney(0)
  return [...totals.entries()].map(([currency, amount]) => formatMoney(amount, currency)).join(' · ')
}

export function addAmount(totals: Map<string, number>, amount: number | null | undefined, currency: string | null | undefined) {
  const code = currency || 'GBP'
  totals.set(code, (totals.get(code) || 0) + (amount || 0))
}
