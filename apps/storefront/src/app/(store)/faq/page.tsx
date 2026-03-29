import { getFaqs } from '@/lib/sanity'
import FaqList from '@/components/faq/FaqList'

export const metadata = {
  title: 'FAQ — Pertanyaan yang Sering Diajukan',
  description: 'Temukan jawaban untuk pertanyaan seputar pemesanan, pembayaran, pengiriman, dan pengembalian di Draven Store.',
}

const fallbackFaqs = [
  {
    question: 'Bagaimana cara memesan produk?',
    answer: 'Pilih produk yang kamu inginkan, tambahkan ke keranjang, lalu lanjutkan ke checkout. Isi alamat pengiriman, pilih kurir, dan selesaikan pembayaran.',
    category: 'pemesanan',
  },
  {
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menerima pembayaran via QRIS, GoPay, ShopeePay, DANA, OVO, transfer bank (BCA, BNI, Mandiri, BRI), serta pembayaran di Indomaret dan Alfamart.',
    category: 'pembayaran',
  },
  {
    question: 'Berapa lama pengiriman pesanan?',
    answer: 'Lama pengiriman tergantung lokasi dan kurir yang dipilih. Estimasi pengiriman akan ditampilkan saat checkout. Umumnya 2-5 hari kerja untuk Pulau Jawa.',
    category: 'pengiriman',
  },
  {
    question: 'Kurir apa saja yang tersedia?',
    answer: 'Kami bekerja sama dengan JNE, TIKI, dan POS Indonesia. Ongkos kirim dihitung otomatis berdasarkan berat barang dan kota tujuan.',
    category: 'pengiriman',
  },
  {
    question: 'Apakah bisa mengembalikan produk?',
    answer: 'Ya, pengembalian produk bisa dilakukan dalam 7 hari setelah barang diterima. Produk harus dalam kondisi belum digunakan dan masih memiliki tag. Hubungi CS kami via WhatsApp.',
    category: 'pengembalian',
  },
  {
    question: 'Bagaimana cara melacak pesanan saya?',
    answer: 'Setelah pesanan dikirim, kamu akan menerima notifikasi WhatsApp berisi nomor resi. Gunakan nomor resi tersebut untuk melacak di website kurir.',
    category: 'pengiriman',
  },
]

export default async function FaqPage() {
  let faqs = await getFaqs()

  if (faqs.length === 0) {
    faqs = fallbackFaqs
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-brand-900">FAQ</h1>
      <p className="mt-2 text-sm text-brand-400">
        Pertanyaan yang sering diajukan seputar Draven Store
      </p>
      <div className="mt-10">
        <FaqList faqs={faqs} />
      </div>
    </div>
  )
}
