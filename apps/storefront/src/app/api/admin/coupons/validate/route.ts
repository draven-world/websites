import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/sanity'

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json()

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Kode kupon harus diisi' }, { status: 400 })
  }

  const coupon = await validateCoupon(code)

  if (!coupon) {
    return NextResponse.json({ valid: false, error: 'Kupon tidak ditemukan atau sudah kedaluwarsa' })
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, error: 'Kupon sudah habis digunakan' })
  }

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return NextResponse.json({
      valid: false,
      error: `Belanja minimum Rp ${coupon.minPurchase.toLocaleString('id-ID')}`,
    })
  }

  let discount = 0
  if (coupon.type === 'percentage') {
    discount = Math.round(subtotal * (coupon.value / 100))
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  } else if (coupon.type === 'fixed') {
    discount = coupon.value
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    },
  })
}
