import { ReactNode } from 'react'

export default function LeaderRow({
  label,
  value,
  emphasis = false,
}: {
  label: ReactNode
  value: ReactNode
  emphasis?: boolean
}) {
  return (
    <div className={`flex items-baseline gap-2 ${emphasis ? 'text-display-sm font-bold text-ink-100' : 'text-sm text-ink-300'}`}>
      <span className="uppercase tracking-widest whitespace-nowrap">{label}</span>
      <span className="flex-1 border-b border-dotted border-ink-700 translate-y-[-4px]" aria-hidden />
      <span className={emphasis ? 'text-ink-100 font-bold' : 'text-ink-100'}>{value}</span>
    </div>
  )
}
