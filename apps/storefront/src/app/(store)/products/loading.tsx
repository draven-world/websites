export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
      <div className="flex gap-10">
        {/* Sidebar skeleton */}
        <div className="hidden w-[260px] flex-shrink-0 lg:block">
          <div className="space-y-6">
            <div className="h-10 w-full animate-pulse bg-brand-100" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 w-3/4 animate-pulse bg-brand-50" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-5 w-2/3 animate-pulse bg-brand-50" />
              ))}
            </div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse bg-brand-100" />
            <div className="mt-2 h-4 w-24 animate-pulse bg-brand-50" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-square animate-pulse bg-brand-100" />
                <div className="mt-3 h-4 w-3/4 animate-pulse bg-brand-50" />
                <div className="mt-2 h-4 w-1/3 animate-pulse bg-brand-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
