import { getSizeGuide } from '@/lib/sanity'

export const revalidate = 60
export const metadata = { title: 'Size Guide' }

export default async function SizeGuidePage() {
  let data: any = null
  try {
    data = await getSizeGuide()
  } catch {
    data = null
  }

  return (
    <div className="mx-auto max-w-3xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none mb-12">
        SIZE GUIDE
      </h1>
      {data?.intro && <p className="text-sm text-ink-300 leading-relaxed mb-12">{data.intro}</p>}

      {(data?.sections ?? []).map((section: any, i: number) => (
        <section key={i} className="mt-16 border-t border-ink-700 pt-8">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
            {section.garmentType}
          </h2>
          {section.note && <p className="mt-3 text-sm text-ink-300">{section.note}</p>}
          {section.measurements?.length > 0 && (
            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left py-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">SIZE</th>
                  <th className="text-left py-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">CHEST</th>
                  <th className="text-left py-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">LENGTH</th>
                  <th className="text-left py-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">SLEEVE</th>
                </tr>
              </thead>
              <tbody>
                {section.measurements.map((m: any, j: number) => (
                  <tr key={j} className="border-b border-ink-700/50">
                    <td className="py-3 text-ink-100 font-bold">{m.size}</td>
                    <td className="py-3 text-ink-300">{m.chest}</td>
                    <td className="py-3 text-ink-300">{m.length}</td>
                    <td className="py-3 text-ink-300">{m.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}

      {(!data?.sections || data.sections.length === 0) && (
        <div className="mt-16 border-t border-ink-700 pt-8">
          <p className="text-sm text-ink-300">Size guide content coming soon.</p>
        </div>
      )}
    </div>
  )
}
