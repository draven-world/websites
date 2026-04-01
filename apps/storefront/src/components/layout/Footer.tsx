import Link from 'next/link'

function QrisLogo() {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-auto" fill="currentColor">
      <rect x="0" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="12" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15" y="5" width="2" height="2" />
      <rect x="0" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="17" width="2" height="2" />
      <rect x="13" y="15" width="2" height="2" />
      <rect x="17" y="15" width="2" height="2" />
      <rect x="13" y="19" width="2" height="2" />
      <rect x="17" y="19" width="2" height="2" />
      <rect x="15" y="17" width="2" height="2" />
      <text x="24" y="17" fontSize="11" fontWeight="800" letterSpacing="0.5">QRIS</text>
    </svg>
  )
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 16" className="h-4 w-auto" fill="currentColor">
      <text x="0" y="13" fontSize="14" fontWeight="700" fontStyle="italic" letterSpacing="-0.5">VISA</text>
    </svg>
  )
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 32 20" className="h-5 w-auto">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="10" r="9" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function BankLogo({ name }: { name: string }) {
  return (
    <span className="text-[13px] font-bold tracking-wide text-white/40">{name}</span>
  )
}

function ShipperLogo({ name, sub }: { name: string; sub?: string }) {
  return (
    <span className="flex flex-col items-center">
      <span className="text-[13px] font-extrabold italic tracking-tight text-white/40">{name}</span>
      {sub && <span className="text-[7px] uppercase tracking-widest text-white/25">{sub}</span>}
    </span>
  )
}

const paymentLogos = [
  { key: 'qris', el: <QrisLogo /> },
  { key: 'ovo', el: <span className="text-[15px] font-black tracking-tight text-white/40">OVO</span> },
  { key: 'gopay', el: <span className="text-[13px] font-bold text-white/40">GoPay</span> },
  { key: 'shopeepay', el: <span className="text-[12px] font-bold text-white/40">ShopeePay</span> },
  { key: 'dana', el: <span className="text-[14px] font-black tracking-tight text-white/40">DANA</span> },
  { key: 'alfamart', el: <span className="text-[12px] font-extrabold italic text-white/40">Alfamart</span> },
  { key: 'indomaret', el: <span className="text-[12px] font-extrabold italic text-white/40">Indomaret</span> },
  { key: 'bca', el: <BankLogo name="BCA" /> },
  { key: 'bri', el: <BankLogo name="BRI" /> },
  { key: 'bni', el: <BankLogo name="BNI" /> },
  { key: 'mandiri', el: <span className="text-[12px] font-bold italic tracking-tight text-white/40">mandiri</span> },
  { key: 'bsi', el: <span className="text-[14px] font-black text-white/40">BSI</span> },
  { key: 'cimb', el: <span className="text-[11px] font-bold tracking-tight text-white/40">CIMB NIAGA</span> },
  { key: 'danamon', el: <span className="text-[12px] font-bold italic text-white/40">Danamon</span> },
  { key: 'permata', el: <span className="text-[11px] font-bold text-white/40">PermataBank</span> },
  { key: 'visa', el: <VisaLogo /> },
  { key: 'mastercard', el: <MastercardLogo /> },
]

const shipmentLogos = [
  { key: 'jne', name: 'JNE', sub: 'EXPRESS' },
  { key: 'jnt', name: 'J&T', sub: 'EXPRESS' },
  { key: 'sicepat', name: 'SiCepat', sub: 'EKSPRES' },
  { key: 'anteraja', name: 'AnterAja', sub: undefined },
  { key: 'tiki', name: 'TIKI', sub: undefined },
  { key: 'pos', name: 'POS', sub: 'INDONESIA' },
]

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
            {/* Instagram */}
            <a
              href="https://instagram.com/dravenworldwide"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-white/40 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-sm">@dravenworldwide</span>
            </a>
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

          {/* Empty col */}
          <div />
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-5 py-10 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Payment Method
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            {paymentLogos.map((p) => (
              <div key={p.key} className="flex items-center text-white/40">
                {p.el}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shipment Method */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-5 py-10 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Shipment Method
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {shipmentLogos.map((s) => (
              <ShipperLogo key={s.key} name={s.name} sub={s.sub} />
            ))}
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-5 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/30">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-[10px] uppercase tracking-widest">100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="text-[10px] uppercase tracking-widest">Pengiriman Terpercaya</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              <span className="text-[10px] uppercase tracking-widest">Produk Original</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-5 py-5 lg:px-8">
          <p className="text-center text-[11px] uppercase tracking-widest text-white/20">
            &copy; {new Date().getFullYear()} DRAVEN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
