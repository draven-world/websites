export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-container px-5 py-8 lg:px-8 lg:py-14">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-10 animate-pulse rounded bg-ink-100" />
        <span className="text-ink-700">/</span>
        <div className="h-3 w-10 animate-pulse rounded bg-ink-100" />
        <span className="text-ink-700">/</span>
        <div className="h-3 w-24 animate-pulse rounded bg-ink-100" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-20">
        {/* Image skeleton */}
        <div className="space-y-2">
          <div className="aspect-[3/4] animate-pulse bg-ink-100" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-ink-100" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="lg:pt-8">
          <div className="h-8 w-3/4 animate-pulse rounded bg-ink-100" />
          <div className="mt-3 h-6 w-1/4 animate-pulse rounded bg-ink-100" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-ink-50" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-ink-50" />
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-12 animate-pulse bg-ink-100" />
            ))}
          </div>
          <div className="mt-8 h-14 w-full animate-pulse bg-ink-100" />
          <div className="mt-10 space-y-3 border-t border-ink-100 pt-6">
            <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-ink-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
