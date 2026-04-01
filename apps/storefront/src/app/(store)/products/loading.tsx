export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex gap-12">
        {/* Sidebar skeleton */}
        <div className="hidden w-[200px] flex-shrink-0 lg:block">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-brand-100" style={{ width: `${60 + i * 8}%` }} />
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          <div className="mb-10 flex items-end justify-between">
            <div className="h-10 w-32 animate-pulse rounded bg-brand-100" />
            <div className="hidden h-6 w-24 animate-pulse rounded bg-brand-100 lg:block" />
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-pulse bg-brand-100" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-brand-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-brand-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
