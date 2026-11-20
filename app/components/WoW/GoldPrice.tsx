import type { ReactNode } from 'react'
import { formatCopperAmount, goldToCoins } from '../../utils/WoW/formatGold'

/**
 * AAA-style gold / silver / copper price display.
 * Expects a gold amount (API prices with up to 4 copper decimals of precision).
 */
export default function GoldPrice({
  amount
}: Readonly<{
  amount: number
}>): ReactNode {
  if (!Number.isFinite(amount)) {
    return <span>—</span>
  }

  const { gold, silver, copper } = goldToCoins(amount)
  const negative = amount < 0

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 font-semibold tabular-nums">
      {negative ? (
        <span className="text-red-600 dark:text-red-400">-</span>
      ) : null}
      <span className="text-amber-500 dark:text-amber-400">
        {Math.abs(gold).toLocaleString()}
        <span className="ml-0.5 text-xs font-bold">g</span>
      </span>
      <span className="text-slate-500 dark:text-slate-300">
        {Math.abs(silver)}
        <span className="ml-0.5 text-xs font-bold">s</span>
      </span>
      <span className="text-orange-600 dark:text-orange-400">
        {formatCopperAmount(copper)}
        <span className="ml-0.5 text-xs font-bold">c</span>
      </span>
    </span>
  )
}
