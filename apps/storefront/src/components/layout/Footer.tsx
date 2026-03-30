import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto max-w-container px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-medium uppercase tracking-tightest">DRAVEN</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Urban streetwear dari Indonesia.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-sm text-white/60 transition-colors hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/tentang-kami" className="text-sm text-white/60 transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/komunitas" className="text-sm text-white/60 transition-colors hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="text-sm text-white/60 transition-colors hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/cara-order" className="text-sm text-white/60 transition-colors hover:text-white">
                    Cara Order
                  </Link>
                </li>
                <li>
                  <Link href="/kebijakan-privasi" className="text-sm text-white/60 transition-colors hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-6 md:justify-end">
            <a href="https://instagram.com/draven.id" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 transition-colors hover:text-white">
              Instagram
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 transition-colors hover:text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-5 py-5 lg:px-8">
          <p className="text-[11px] uppercase tracking-widest text-white/20">
            &copy; {new Date().getFullYear()} DRAVEN
          </p>
        </div>
      </div>
    </footer>
  )
}
