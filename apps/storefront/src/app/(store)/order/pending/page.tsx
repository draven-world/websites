import Link from 'next/link'

export const metadata = {
  title: 'Awaiting Payment',
}

export default function OrderPendingPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center border border-brand-950">
        <svg className="h-6 w-6 text-brand-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
        Awaiting Payment
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-brand-400">
        Your order has been created. Please complete payment before the deadline.
      </p>
      <p className="mt-2 text-sm text-brand-400">
        Once confirmed, you&apos;ll receive a WhatsApp notification.
      </p>

      <div className="mt-12 flex flex-col gap-4">
        <Link href="/products" className="btn-primary py-4">
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
