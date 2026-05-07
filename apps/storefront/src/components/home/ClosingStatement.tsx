export default function ClosingStatement({ statement }: { statement: string }) {
  return (
    <section className="relative w-full bg-ink-950 flex flex-col items-center justify-center px-5 py-24 pb-40">
      <h2 className="font-display text-[clamp(3rem,8vw,7rem)] uppercase font-bold text-ink-100/30 tracking-tighter text-center max-w-5xl leading-[0.95]">
        {statement}
      </h2>
      <div className="mt-16 flex flex-col items-center gap-3">
        <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">JAKARTA, INDONESIA</p>
        <div className="flex gap-6">
          <a href="https://instagram.com/dravenworldwide" target="_blank" rel="noopener noreferrer"
             className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 hover:text-accent-lime transition-colors">INSTAGRAM</a>
          <a href="https://wa.me/62" target="_blank" rel="noopener noreferrer"
             className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 hover:text-accent-lime transition-colors">WHATSAPP</a>
          <a href="https://tiktok.com/@dravenworldwide" target="_blank" rel="noopener noreferrer"
             className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 hover:text-accent-lime transition-colors">TIKTOK</a>
        </div>
      </div>
    </section>
  )
}
