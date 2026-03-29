export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-14">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="aspect-square animate-pulse bg-brand-100" />
        <div>
          <div className="h-7 w-3/4 animate-pulse bg-brand-100" />
          <div className="mt-4 h-6 w-1/3 animate-pulse bg-brand-50" />
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-12 animate-pulse bg-brand-100" />
            ))}
          </div>
          <div className="mt-6 h-14 w-full animate-pulse bg-brand-100" />
          <div className="mt-8 space-y-3 border-t border-brand-100 pt-6">
            <div className="h-4 w-full animate-pulse bg-brand-50" />
            <div className="h-4 w-5/6 animate-pulse bg-brand-50" />
            <div className="h-4 w-2/3 animate-pulse bg-brand-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
