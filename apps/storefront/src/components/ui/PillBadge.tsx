import { ReactNode } from 'react'

export default function PillBadge({
  children,
  variant = 'lime',
}: {
  children: ReactNode
  variant?: 'lime' | 'outline'
}) {
  const styles = variant === 'lime'
    ? 'bg-accent-lime text-ink-950'
    : 'border border-ink-700 text-ink-100'
  return (
    <span className={`inline-block ${styles} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]`}>
      {children}
    </span>
  )
}
