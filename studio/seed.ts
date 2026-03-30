/**
 * Sanity Seed Data Script for DRAVEN
 *
 * Jalankan dengan:
 *   cd studio
 *   npx tsx seed.ts
 *
 * Pastikan set environment variable SANITY_TOKEN terlebih dahulu:
 *   - Buat token di https://www.sanity.io/manage → Project → API → Tokens → Add API Token (Editor)
 *   - Set: export SANITY_TOKEN="your-token-here"
 *
 * Script ini akan membuat data awal: banner, announcement, FAQ, kategori, halaman statis, produk, dan promo.
 * Aman dijalankan ulang — menggunakan _id tetap sehingga data lama di-overwrite, bukan duplikat.
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('❌ SANITY_TOKEN belum di-set!')
  console.error('   Buat token di: https://www.sanity.io/manage → Project → API → Tokens')
  console.error('   Lalu jalankan: export SANITY_TOKEN="your-token" && npx tsx seed.ts')
  process.exit(1)
}

const client = createClient({
  projectId: '01avolry',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Helper: create a transaction
const tx = client.transaction()

// ─── BANNERS ────────────────────────────────────────────────

const banners = [
  {
    _id: 'banner-hero-1',
    _type: 'banner',
    title: 'New Arrivals — Drop Terbaru',
    subtitle: 'Koleksi terbaru musim ini sudah tersedia',
    link: '/products',
    aktif: true,
    urutan: 0,
  },
  {
    _id: 'banner-hero-2',
    _type: 'banner',
    title: 'Flash Sale Weekend',
    subtitle: 'Diskon hingga 40% untuk item pilihan',
    link: '/products?category=kaos',
    aktif: true,
    urutan: 1,
  },
  {
    _id: 'banner-hero-3',
    _type: 'banner',
    title: 'Free Shipping',
    subtitle: 'Gratis ongkir ke seluruh Indonesia, min. belanja Rp 300.000',
    link: '/products',
    aktif: true,
    urutan: 2,
  },
]

// ─── ANNOUNCEMENTS ──────────────────────────────────────────

const announcements = [
  {
    _id: 'announcement-1',
    _type: 'announcement',
    text: '🔥 FLASH SALE — Diskon 30% semua Kaos Grafis! Gunakan kode: DRAVEN30',
    link: '/products?category=kaos',
    bgColor: 'black',
    aktif: true,
  },
  {
    _id: 'announcement-2',
    _type: 'announcement',
    text: '🚚 Gratis Ongkir ke seluruh Indonesia — min. belanja Rp 300.000',
    link: '/products',
    bgColor: 'black',
    aktif: false,
  },
]

// ─── KATEGORI UNGGULAN ──────────────────────────────────────

const categories = [
  {
    _id: 'cat-kaos',
    _type: 'categoryHighlight',
    name: 'Kaos',
    slug: { _type: 'slug', current: 'kaos' },
    description: 'Kaos grafis premium dengan desain eksklusif DRAVEN',
    urutan: 0,
    aktif: true,
  },
  {
    _id: 'cat-hoodie',
    _type: 'categoryHighlight',
    name: 'Hoodie',
    slug: { _type: 'slug', current: 'hoodie' },
    description: 'Hoodie streetwear untuk gaya urban sehari-hari',
    urutan: 1,
    aktif: true,
  },
  {
    _id: 'cat-celana',
    _type: 'categoryHighlight',
    name: 'Celana',
    slug: { _type: 'slug', current: 'celana' },
    description: 'Celana cargo & jogger untuk tampilan kasual',
    urutan: 2,
    aktif: true,
  },
  {
    _id: 'cat-jaket',
    _type: 'categoryHighlight',
    name: 'Jaket',
    slug: { _type: 'slug', current: 'jaket' },
    description: 'Jaket bomber & windbreaker kualitas tinggi',
    urutan: 3,
    aktif: true,
  },
  {
    _id: 'cat-aksesoris',
    _type: 'categoryHighlight',
    name: 'Aksesoris',
    slug: { _type: 'slug', current: 'aksesoris' },
    description: 'Topi, tas, dan aksesoris pelengkap gaya',
    urutan: 4,
    aktif: true,
  },
]

// ─── FAQ ────────────────────────────────────────────────────

const faqs = [
  // Pemesanan
  {
    _id: 'faq-order-1',
    _type: 'faq',
    question: 'Bagaimana cara memesan produk di DRAVEN?',
    answer:
      'Pilih produk yang diinginkan, pilih ukuran dan warna, lalu klik "Tambah ke Keranjang". Setelah selesai berbelanja, klik ikon keranjang, lalu lanjutkan ke halaman Checkout. Isi alamat pengiriman, pilih kurir, dan lakukan pembayaran.',
    category: 'pemesanan',
    urutan: 0,
  },
  {
    _id: 'faq-order-2',
    _type: 'faq',
    question: 'Apakah saya bisa membatalkan pesanan?',
    answer:
      'Pesanan bisa dibatalkan selama status masih "Menunggu Pembayaran". Setelah pembayaran dikonfirmasi dan pesanan diproses, pembatalan tidak bisa dilakukan. Hubungi CS kami via WhatsApp untuk bantuan lebih lanjut.',
    category: 'pemesanan',
    urutan: 1,
  },
  {
    _id: 'faq-order-3',
    _type: 'faq',
    question: 'Apakah bisa pesan lewat WhatsApp?',
    answer:
      'Saat ini pemesanan hanya bisa dilakukan melalui website. Namun Anda bisa menghubungi CS kami via WhatsApp untuk bertanya tentang stok, ukuran, atau bantuan lainnya.',
    category: 'pemesanan',
    urutan: 2,
  },

  // Pembayaran
  {
    _id: 'faq-pay-1',
    _type: 'faq',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer:
      'Kami menerima pembayaran melalui QRIS, GoPay, ShopeePay, OVO, DANA, transfer bank (BCA, BNI, BRI, Mandiri, BSI, Permata, CIMB Niaga), kartu kredit/debit (Visa, MasterCard, JCB), serta pembayaran tunai di Indomaret dan Alfamart.',
    category: 'pembayaran',
    urutan: 0,
  },
  {
    _id: 'faq-pay-2',
    _type: 'faq',
    question: 'Berapa lama batas waktu pembayaran?',
    answer:
      'Untuk transfer bank (Virtual Account), batas waktu pembayaran adalah 24 jam. Untuk e-wallet (GoPay, OVO, dll), batas waktu bervariasi tergantung provider. Pesanan akan otomatis dibatalkan jika melewati batas waktu.',
    category: 'pembayaran',
    urutan: 1,
  },
  {
    _id: 'faq-pay-3',
    _type: 'faq',
    question: 'Apakah transaksi di DRAVEN aman?',
    answer:
      'Ya, semua transaksi diproses melalui Midtrans, payment gateway yang sudah tersertifikasi PCI-DSS dan diawasi oleh Bank Indonesia. Data pembayaran Anda terenkripsi dan aman.',
    category: 'pembayaran',
    urutan: 2,
  },

  // Pengiriman
  {
    _id: 'faq-ship-1',
    _type: 'faq',
    question: 'Berapa lama estimasi pengiriman?',
    answer:
      'Estimasi pengiriman tergantung lokasi dan kurir yang dipilih. JNE REG: 2-7 hari kerja, JNE YES: 1-2 hari kerja. Pesanan diproses dalam 1-2 hari kerja setelah pembayaran terkonfirmasi.',
    category: 'pengiriman',
    urutan: 0,
  },
  {
    _id: 'faq-ship-2',
    _type: 'faq',
    question: 'Apakah ada gratis ongkir?',
    answer:
      'Ya! Gratis ongkir untuk pembelian minimum Rp 300.000 ke seluruh Indonesia (berlaku untuk pengiriman reguler). Promo ini bisa berubah sewaktu-waktu, cek banner di halaman utama untuk info terbaru.',
    category: 'pengiriman',
    urutan: 1,
  },
  {
    _id: 'faq-ship-3',
    _type: 'faq',
    question: 'Bagaimana cara melacak pesanan saya?',
    answer:
      'Setelah pesanan dikirim, Anda akan menerima notifikasi via WhatsApp dengan nomor resi. Gunakan nomor resi tersebut untuk melacak paket di website kurir (JNE, dll) atau di aplikasi seperti Cek Resi.',
    category: 'pengiriman',
    urutan: 2,
  },

  // Pengembalian
  {
    _id: 'faq-return-1',
    _type: 'faq',
    question: 'Apakah bisa tukar ukuran jika tidak pas?',
    answer:
      'Bisa! Penukaran ukuran bisa dilakukan dalam waktu 7 hari setelah barang diterima, dengan syarat: produk belum dicuci/dipakai, tag masih terpasang, dan kemasan asli masih ada. Ongkir penukaran ditanggung pembeli.',
    category: 'pengembalian',
    urutan: 0,
  },
  {
    _id: 'faq-return-2',
    _type: 'faq',
    question: 'Bagaimana jika barang yang diterima cacat/rusak?',
    answer:
      'Segera hubungi CS kami via WhatsApp dalam waktu 2x24 jam setelah barang diterima. Sertakan foto/video unboxing sebagai bukti. Kami akan mengirimkan pengganti tanpa biaya tambahan.',
    category: 'pengembalian',
    urutan: 1,
  },

  // Produk
  {
    _id: 'faq-product-1',
    _type: 'faq',
    question: 'Bagaimana cara memilih ukuran yang tepat?',
    answer:
      'Setiap halaman produk memiliki panduan ukuran (size chart) yang bisa dijadikan referensi. Ukur baju/celana yang biasa Anda pakai, lalu bandingkan dengan size chart kami. Jika ragu, hubungi CS kami untuk konsultasi ukuran.',
    category: 'produk',
    urutan: 0,
  },
  {
    _id: 'faq-product-2',
    _type: 'faq',
    question: 'Apakah warna produk sama persis dengan foto?',
    answer:
      'Kami berusaha menampilkan warna produk seakurat mungkin. Namun, warna yang tampil di layar bisa sedikit berbeda tergantung pengaturan monitor/layar perangkat Anda.',
    category: 'produk',
    urutan: 1,
  },
  {
    _id: 'faq-product-3',
    _type: 'faq',
    question: 'Bagaimana cara merawat produk DRAVEN?',
    answer:
      'Cuci dengan mesin pada suhu dingin (30°C), jangan gunakan pemutih, setrika pada suhu rendah dan balikkan baju sebelum disetrika. Untuk kaos dengan sablon, hindari menyetrika langsung pada area sablon. Jangan dry clean.',
    category: 'produk',
    urutan: 2,
  },
]

// ─── HALAMAN STATIS ─────────────────────────────────────────

const pages = [
  {
    _id: 'page-tentang-kami',
    _type: 'page',
    title: 'Tentang Kami',
    slug: { _type: 'slug', current: 'tentang-kami' },
    seoDescription: 'DRAVEN adalah brand streetwear lokal Indonesia yang menghadirkan fashion urban berkualitas tinggi dengan harga terjangkau.',
    content: [
      {
        _type: 'block',
        _key: 'tk1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'tk1s', text: 'Tentang DRAVEN', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'tk2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'tk2s',
            text: 'DRAVEN adalah brand streetwear lokal Indonesia yang lahir dari semangat urban culture. Kami percaya bahwa fashion bukan hanya soal penampilan, tapi juga tentang mengekspresikan identitas dan attitude.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'tk3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'tk3s',
            text: 'Setiap produk DRAVEN dirancang dan diproduksi dengan perhatian terhadap detail, menggunakan bahan berkualitas tinggi yang nyaman dipakai sehari-hari. Desain kami terinspirasi dari street culture, musik, dan seni urban yang menjadi bagian dari kehidupan anak muda Indonesia.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'tk4',
        style: 'h3',
        children: [{ _type: 'span', _key: 'tk4s', text: 'Misi Kami', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'tk5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'tk5s',
            text: 'Menghadirkan fashion streetwear berkualitas tinggi yang terjangkau untuk anak muda Indonesia. Kami berkomitmen untuk terus berinovasi dalam desain sambil menjaga kualitas produksi yang konsisten.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'page-kebijakan-privasi',
    _type: 'page',
    title: 'Kebijakan Privasi',
    slug: { _type: 'slug', current: 'kebijakan-privasi' },
    seoDescription: 'Kebijakan privasi DRAVEN — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
    content: [
      {
        _type: 'block',
        _key: 'kp1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'kp1s', text: 'Kebijakan Privasi', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'kp2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'kp2s',
            text: 'DRAVEN menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'kp3',
        style: 'h3',
        children: [{ _type: 'span', _key: 'kp3s', text: 'Informasi yang Kami Kumpulkan', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'kp4',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'kp4s',
            text: 'Saat Anda melakukan pemesanan, kami mengumpulkan: nama lengkap, alamat pengiriman, nomor telepon, dan alamat email. Informasi ini hanya digunakan untuk memproses pesanan dan mengirimkan notifikasi terkait pesanan Anda.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'kp5',
        style: 'h3',
        children: [{ _type: 'span', _key: 'kp5s', text: 'Keamanan Data', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'kp6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'kp6s',
            text: 'Kami menggunakan Midtrans sebagai payment gateway yang sudah tersertifikasi PCI-DSS. Data pembayaran Anda diproses secara aman dan terenkripsi. Kami tidak menyimpan informasi kartu kredit/debit Anda di server kami.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'page-syarat-ketentuan',
    _type: 'page',
    title: 'Syarat & Ketentuan',
    slug: { _type: 'slug', current: 'syarat-ketentuan' },
    seoDescription: 'Syarat dan ketentuan berbelanja di DRAVEN — panduan lengkap untuk pembeli.',
    content: [
      {
        _type: 'block',
        _key: 'sk1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'sk1s', text: 'Syarat & Ketentuan', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'sk2s',
            text: 'Dengan mengakses dan menggunakan website DRAVEN, Anda menyetujui syarat dan ketentuan berikut:',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk3',
        style: 'h3',
        children: [{ _type: 'span', _key: 'sk3s', text: 'Pemesanan & Pembayaran', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk4',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'sk4s',
            text: 'Semua harga yang tercantum dalam mata uang Rupiah (IDR) dan sudah termasuk PPN. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan. Pesanan dianggap sah setelah pembayaran diterima dan dikonfirmasi oleh sistem kami.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk5',
        style: 'h3',
        children: [{ _type: 'span', _key: 'sk5s', text: 'Pengiriman', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'sk6s',
            text: 'Pengiriman dilakukan oleh jasa kurir pihak ketiga. Estimasi waktu pengiriman yang tercantum adalah perkiraan dan dapat berubah tergantung kondisi. DRAVEN tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak kurir atau force majeure.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk7',
        style: 'h3',
        children: [{ _type: 'span', _key: 'sk7s', text: 'Pengembalian & Penukaran', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'sk8',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'sk8s',
            text: 'Penukaran produk bisa dilakukan dalam 7 hari setelah barang diterima dengan syarat: produk dalam kondisi baru (belum dicuci/dipakai), tag masih terpasang, dan kemasan asli masih ada. Pengembalian dana hanya berlaku untuk produk cacat/rusak dari pabrik.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'page-cara-order',
    _type: 'page',
    title: 'Cara Order',
    slug: { _type: 'slug', current: 'cara-order' },
    seoDescription: 'Panduan lengkap cara berbelanja di DRAVEN — dari memilih produk hingga menerima pesanan.',
    content: [
      {
        _type: 'block',
        _key: 'co1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'co1s', text: 'Cara Order di DRAVEN', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'co2s',
            text: 'Berbelanja di DRAVEN sangat mudah! Ikuti langkah-langkah berikut:',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co3',
        style: 'h3',
        children: [{ _type: 'span', _key: 'co3s', text: '1. Pilih Produk', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co4',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'co4s',
            text: 'Jelajahi katalog produk kami. Gunakan filter kategori dan harga untuk menemukan produk yang Anda cari. Klik produk untuk melihat detail, foto, ukuran, dan harga.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co5',
        style: 'h3',
        children: [{ _type: 'span', _key: 'co5s', text: '2. Tambahkan ke Keranjang', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'co6s',
            text: 'Pilih ukuran dan warna (jika ada), lalu klik tombol "Tambah ke Keranjang". Anda bisa melanjutkan belanja atau langsung ke checkout.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co7',
        style: 'h3',
        children: [{ _type: 'span', _key: 'co7s', text: '3. Checkout & Bayar', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co8',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'co8s',
            text: 'Isi alamat pengiriman lengkap, pilih kurir pengiriman, lalu klik "Bayar Sekarang". Pilih metode pembayaran yang Anda inginkan (QRIS, transfer bank, e-wallet, dll) dan selesaikan pembayaran.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co9',
        style: 'h3',
        children: [{ _type: 'span', _key: 'co9s', text: '4. Terima Pesanan', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'co10',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'co10s',
            text: 'Setelah pembayaran terkonfirmasi, pesanan akan diproses dalam 1-2 hari kerja. Anda akan menerima notifikasi via WhatsApp berisi nomor resi untuk melacak paket.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
]

// ─── PROMO ──────────────────────────────────────────────────

const promos = [
  {
    _id: 'promo-ramadan-2026',
    _type: 'promo',
    nama: 'Ramadan Sale 2026',
    slug: { _type: 'slug', current: 'ramadan-sale-2026' },
    deskripsi:
      'Sambut bulan suci Ramadan dengan koleksi terbaru DRAVEN! Dapatkan diskon hingga 40% untuk produk pilihan. Berlaku selama bulan Ramadan.',
    syaratKetentuan:
      'Berlaku untuk produk bertanda "Ramadan Sale". Tidak bisa digabung dengan promo lain. Stok terbatas. Harga sudah termasuk diskon.',
    tanggalMulai: '2026-02-18T00:00:00+07:00',
    tanggalSelesai: '2026-03-19T23:59:59+07:00',
    aktif: true,
  },
  {
    _id: 'promo-new-arrival',
    _type: 'promo',
    nama: 'New Arrival Drop — April 2026',
    slug: { _type: 'slug', current: 'new-arrival-april-2026' },
    deskripsi:
      'Koleksi terbaru DRAVEN untuk Q2 2026 sudah hadir! Early bird discount 20% untuk pembelian di minggu pertama.',
    syaratKetentuan:
      'Diskon early bird berlaku 1-7 April 2026. Berlaku untuk semua item New Arrival. Tidak bisa digabung dengan kode promo lain.',
    tanggalMulai: '2026-04-01T00:00:00+07:00',
    tanggalSelesai: '2026-04-30T23:59:59+07:00',
    aktif: true,
  },
]

// ─── PRODUK ─────────────────────────────────────────────────

const products = [
  // KAOS
  {
    _id: 'product-kaos-grafis-vol1',
    _type: 'product',
    title: 'Kaos Grafis Draven Vol.1',
    handle: { _type: 'slug', current: 'kaos-grafis-draven-vol1' },
    shortDescription: 'Kaos cotton combed 30s dengan desain grafis eksklusif DRAVEN edisi pertama.',
    category: { _type: 'reference', _ref: 'cat-kaos' },
    tags: ['kaos', 'bestseller', 'grafis'],
    price: 189000,
    compareAtPrice: 249000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Putih', hex: '#FFFFFF' },
    ],
    stock: 120,
    weight: 200,
    sku: 'DRV-KG-001',
    status: 'active',
    featured: true,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Kaos grafis premium dari koleksi perdana DRAVEN. Material cotton combed 30s yang lembut dan adem, cocok untuk iklim tropis Indonesia. Desain eksklusif dengan teknik sablon plastisol berkualitas tinggi yang tahan lama.', marks: [] }],
      },
      {
        _type: 'block', _key: 'p2', style: 'h3', markDefs: [],
        children: [{ _type: 'span', _key: 'p2s', text: 'Detail Produk', marks: [] }],
      },
      {
        _type: 'block', _key: 'p3', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p3s', text: 'Material: Cotton Combed 30s (180 GSM)', marks: [] }],
      },
      {
        _type: 'block', _key: 'p4', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p4s', text: 'Sablon: Plastisol high-density', marks: [] }],
      },
      {
        _type: 'block', _key: 'p5', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p5s', text: 'Fit: Regular fit', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-kaos-essential-black',
    _type: 'product',
    title: 'Kaos Essential Hitam',
    handle: { _type: 'slug', current: 'kaos-essential-hitam' },
    shortDescription: 'Kaos polos premium warna hitam, must-have untuk daily wear.',
    category: { _type: 'reference', _ref: 'cat-kaos' },
    tags: ['kaos', 'essential', 'polos'],
    price: 149000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
    ],
    stock: 200,
    weight: 200,
    sku: 'DRV-KE-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Kaos polos hitam dari lini Essential DRAVEN. Dibuat dari cotton combed 24s yang tebal dan kokoh. Warna hitam pekat yang tidak mudah luntur. Cocok untuk mix & match dengan outfit apapun.', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-kaos-oversize-shadow',
    _type: 'product',
    title: 'Kaos Oversize "Shadow"',
    handle: { _type: 'slug', current: 'kaos-oversize-shadow' },
    shortDescription: 'Kaos oversize dengan desain shadow print, cutting modern.',
    category: { _type: 'reference', _ref: 'cat-kaos' },
    tags: ['kaos', 'oversize', 'new-arrival'],
    price: 219000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Abu-Abu Gelap', hex: '#333333' },
      { _key: 'c2', _type: 'object', name: 'Hitam', hex: '#000000' },
    ],
    stock: 80,
    weight: 250,
    sku: 'DRV-KO-001',
    status: 'active',
    featured: true,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Kaos oversize dengan cutting drop-shoulder yang modern. Desain shadow print dengan teknik discharge yang menghasilkan efek pudar natural. Material cotton combed 24s (220 GSM) yang tebal dan berat jatuh sempurna.', marks: [] }],
      },
    ],
  },

  // HOODIE
  {
    _id: 'product-hoodie-classic',
    _type: 'product',
    title: 'Hoodie Classic Draven',
    handle: { _type: 'slug', current: 'hoodie-classic-draven' },
    shortDescription: 'Hoodie fleece premium dengan bordir logo DRAVEN di dada.',
    category: { _type: 'reference', _ref: 'cat-hoodie' },
    tags: ['hoodie', 'bestseller', 'classic'],
    price: 389000,
    compareAtPrice: 459000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Abu-Abu', hex: '#808080' },
      { _key: 'c3', _type: 'object', name: 'Navy', hex: '#1B1B3A' },
    ],
    stock: 65,
    weight: 550,
    sku: 'DRV-HC-001',
    status: 'active',
    featured: true,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Hoodie classic DRAVEN dari bahan fleece premium 320 GSM. Hangat, tebal, dan nyaman untuk daily wear. Logo DRAVEN dibordir dengan teknik chain-stitch di bagian dada kiri. Tersedia dengan kangaroo pocket dan drawstring hood.', marks: [] }],
      },
      {
        _type: 'block', _key: 'p2', style: 'h3', markDefs: [],
        children: [{ _type: 'span', _key: 'p2s', text: 'Detail Produk', marks: [] }],
      },
      {
        _type: 'block', _key: 'p3', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p3s', text: 'Material: Fleece Premium 320 GSM', marks: [] }],
      },
      {
        _type: 'block', _key: 'p4', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p4s', text: 'Logo: Bordir chain-stitch', marks: [] }],
      },
      {
        _type: 'block', _key: 'p5', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p5s', text: 'Fit: Regular fit, unisex', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-hoodie-zip-urban',
    _type: 'product',
    title: 'Hoodie Zip Urban',
    handle: { _type: 'slug', current: 'hoodie-zip-urban' },
    shortDescription: 'Hoodie zipper dengan desain urban minimalis.',
    category: { _type: 'reference', _ref: 'cat-hoodie' },
    tags: ['hoodie', 'zipper', 'urban'],
    price: 429000,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Olive', hex: '#556B2F' },
    ],
    stock: 45,
    weight: 600,
    sku: 'DRV-HZ-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Hoodie zip-up dengan desain urban minimalis. Zipper YKK berkualitas tinggi, double-lined hood, dan split kangaroo pocket. Material fleece CVC (Cotton Viscose) 300 GSM yang lembut di dalam.', marks: [] }],
      },
    ],
  },

  // CELANA
  {
    _id: 'product-cargo-tactical',
    _type: 'product',
    title: 'Celana Cargo Tactical',
    handle: { _type: 'slug', current: 'celana-cargo-tactical' },
    shortDescription: 'Celana cargo 6 pocket dengan material ripstop tahan lama.',
    category: { _type: 'reference', _ref: 'cat-celana' },
    tags: ['celana', 'cargo', 'tactical'],
    price: 329000,
    compareAtPrice: 399000,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Khaki', hex: '#C3B091' },
    ],
    stock: 55,
    weight: 450,
    sku: 'DRV-CT-001',
    status: 'active',
    featured: true,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Celana cargo tactical DRAVEN dengan 6 pocket fungsional. Material ripstop canvas yang tahan sobek dan awet. Dilengkapi dengan adjustable ankle strap dan elastic waistband untuk kenyamanan maksimal.', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-jogger-street',
    _type: 'product',
    title: 'Jogger Pants Street',
    handle: { _type: 'slug', current: 'jogger-pants-street' },
    shortDescription: 'Celana jogger dengan cutting slim-tapered, nyaman untuk harian.',
    category: { _type: 'reference', _ref: 'cat-celana' },
    tags: ['celana', 'jogger', 'casual'],
    price: 279000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Abu-Abu', hex: '#808080' },
    ],
    stock: 90,
    weight: 350,
    sku: 'DRV-JS-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Jogger pants dengan cutting slim-tapered yang modern. Material baby terry 280 GSM, lembut dan breathable. Elastic waistband dengan drawstring, side pocket, dan ribbed ankle cuff.', marks: [] }],
      },
    ],
  },

  // JAKET
  {
    _id: 'product-bomber-draven',
    _type: 'product',
    title: 'Bomber Jacket Draven',
    handle: { _type: 'slug', current: 'bomber-jacket-draven' },
    shortDescription: 'Jaket bomber MA-1 dengan bordir DRAVEN di punggung.',
    category: { _type: 'reference', _ref: 'cat-jaket' },
    tags: ['jaket', 'bomber', 'premium'],
    price: 549000,
    compareAtPrice: 699000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Army Green', hex: '#4B5320' },
    ],
    stock: 30,
    weight: 700,
    sku: 'DRV-BJ-001',
    status: 'active',
    featured: true,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Jaket bomber MA-1 style dengan material taslan water-resistant. Bordir besar logo DRAVEN di punggung dan bordir kecil di dada. Lining satin halus, ribbed collar, cuff, dan hem. Zipper YKK premium.', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-windbreaker-mono',
    _type: 'product',
    title: 'Windbreaker Monochrome',
    handle: { _type: 'slug', current: 'windbreaker-monochrome' },
    shortDescription: 'Windbreaker ringan water-resistant dengan desain monochrome.',
    category: { _type: 'reference', _ref: 'cat-jaket' },
    tags: ['jaket', 'windbreaker', 'new-arrival'],
    price: 479000,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam/Abu', hex: '#1A1A1A' },
    ],
    stock: 40,
    weight: 350,
    sku: 'DRV-WM-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Windbreaker ringan dengan desain color-block monochrome. Material parasut micro water-resistant. Packable — bisa dilipat masuk ke pocket sendiri. Cocok untuk outdoor activity dan traveling.', marks: [] }],
      },
    ],
  },

  // AKSESORIS
  {
    _id: 'product-topi-snapback',
    _type: 'product',
    title: 'Snapback Cap Draven',
    handle: { _type: 'slug', current: 'snapback-cap-draven' },
    shortDescription: 'Topi snapback dengan bordir logo DRAVEN 3D.',
    category: { _type: 'reference', _ref: 'cat-aksesoris' },
    tags: ['aksesoris', 'topi', 'snapback'],
    price: 159000,
    sizes: ['ALL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Hitam', hex: '#000000' },
      { _key: 'c2', _type: 'object', name: 'Putih', hex: '#FFFFFF' },
    ],
    stock: 100,
    weight: 120,
    sku: 'DRV-SC-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Topi snapback dengan bordir 3D logo DRAVEN di depan. Material cotton twill premium, adjustable snap closure di belakang. One size fits all.', marks: [] }],
      },
    ],
  },
  {
    _id: 'product-totebag-canvas',
    _type: 'product',
    title: 'Tote Bag Canvas Draven',
    handle: { _type: 'slug', current: 'totebag-canvas-draven' },
    shortDescription: 'Tote bag canvas tebal dengan print DRAVEN artwork.',
    category: { _type: 'reference', _ref: 'cat-aksesoris' },
    tags: ['aksesoris', 'tas', 'totebag'],
    price: 129000,
    sizes: ['ALL'],
    colors: [
      { _key: 'c1', _type: 'object', name: 'Natural', hex: '#F5F5DC' },
      { _key: 'c2', _type: 'object', name: 'Hitam', hex: '#000000' },
    ],
    stock: 150,
    weight: 180,
    sku: 'DRV-TB-001',
    status: 'active',
    featured: false,
    description: [
      {
        _type: 'block', _key: 'p1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p1s', text: 'Tote bag dari canvas 12oz yang tebal dan kokoh. Print artwork eksklusif DRAVEN dengan teknik sablon manual. Kapasitas besar, cocok untuk daily carry, kuliah, atau belanja. Handle panjang untuk shoulder carry.', marks: [] }],
      },
    ],
  },
]

// ─── EXECUTE SEED ───────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Sanity data for DRAVEN...\n')

  const allDocs = [
    ...categories, // seed categories first (products reference them)
    ...banners,
    ...announcements,
    ...faqs,
    ...pages,
    ...promos,
    ...products,
  ]

  for (const doc of allDocs) {
    tx.createOrReplace(doc as any)
  }

  console.log(`👕 ${products.length} produk`)
  console.log(`📝 ${banners.length} banners`)
  console.log(`📢 ${announcements.length} announcements`)
  console.log(`📁 ${categories.length} kategori`)
  console.log(`❓ ${faqs.length} FAQ`)
  console.log(`📄 ${pages.length} halaman statis`)
  console.log(`🏷️  ${promos.length} promo`)
  console.log(`\n📦 Total: ${allDocs.length} dokumen\n`)

  try {
    await tx.commit()
    console.log('✅ Seed data berhasil! Buka Sanity Studio untuk melihat hasilnya.')
    console.log('   Jalankan: cd studio && pnpm dev')
    console.log('\n⚠️  Catatan: Gambar perlu diupload manual via Sanity Studio.')
  } catch (err) {
    console.error('❌ Error saat seeding:', err)
    process.exit(1)
  }
}

seed()
