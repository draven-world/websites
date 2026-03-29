/**
 * Sanity Seed Data Script for DRAVEN
 *
 * Jalankan dengan:
 *   cd studio
 *   npx sanity exec seed.ts --with-user-token
 *
 * Script ini akan membuat data awal: banner, announcement, FAQ, kategori, halaman statis, dan promo.
 * Aman dijalankan ulang — menggunakan _id tetap sehingga data lama di-overwrite, bukan duplikat.
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

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

// ─── EXECUTE SEED ───────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Sanity data for DRAVEN...\n')

  const allDocs = [
    ...banners,
    ...announcements,
    ...categories,
    ...faqs,
    ...pages,
    ...promos,
  ]

  for (const doc of allDocs) {
    tx.createOrReplace(doc as any)
  }

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
