const paymentMethods = [
  'QRIS', 'OVO', 'Akulaku', 'Alfamart', 'Mandiri',
  'BRI', 'BNI', 'PermataBank', 'PermataBank Syariah',
  'Danamon', 'BSI', 'CIMB Niaga', 'VISA', 'JCB', 'MasterCard',
]

const shipmentMethods = ['JNE Express', 'Gosend', 'DHL']

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] py-12 text-center">
      {/* Payment Method */}
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <h3 className="text-sm font-bold text-white">Payment Method</h3>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="text-sm font-semibold text-white/70"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Shipment Method */}
      <div className="mx-auto mt-12 max-w-[1400px] px-5 lg:px-8">
        <h3 className="text-sm font-bold text-white">Shipment Method</h3>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {shipmentMethods.map((method) => (
            <span
              key={method}
              className="text-sm font-semibold text-white/70"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-12 max-w-[1400px] border-t border-white/10 px-5 pt-8 lg:px-8">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} DRAVEN. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
