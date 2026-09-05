import type { Category } from "@prisma/client";

export type SeedTenant = {
  slug: string;
  name: string;
  category: Category;
  instagram: string;
  size: string;
  color: string | null;
  promo: string;
  /** Raw activity text from docs/seed-tenants.md; parsed into TenantSlot rows by parseActivity(). */
  activity: string;
  intro: string;
  booths: string[];
};

// Generated from docs/seed-tenants.md and the booth assignment table in docs/namoe-build-spec.md section 6.3.
// Intros, promos and activities are verbatim copies.
export const TENANTS: SeedTenant[] = [
  {
    slug: "little-palmerhaus",
    name: "Little Palmerhaus",
    category: "PAKAIAN_IBU_ANAK",
    instagram: "littlepalmerhaus",
    size: "4x2",
    color: null,
    promo: "Diskon 20% untuk pembelian sleepsuit kedua",
    activity: "Sesi pilih ukuran dan bahan bareng tim produk 13.00",
    intro:
      "Little Palmerhaus adalah brand lokal pakaian bayi dan anak yang mengutamakan bahan lembut seperti bambu dan tencel untuk kulit sensitif si kecil. Kami merancang sleepsuit, romper, dan setelan harian agar nyaman dipakai dari usia newborn sampai balita.",
    booths: ["A1","A2"],
  },
  {
    slug: "velvet-junior",
    name: "Velvet Junior",
    category: "PAKAIAN_IBU_ANAK",
    instagram: "velvetjunior",
    size: "4x2",
    color: null,
    promo: "Beli 3 setelan gratis 1 celana pendek",
    activity: "Demo kain anti nyamuk dan tummy time 11.00",
    intro:
      "Velvet Junior menghadirkan pakaian bayi dan anak berbahan katun berkualitas yang nyaman untuk dipakai setiap hari. Koleksi kami mencakup setelan harian, jumper, dan pakaian dengan teknologi anti nyamuk untuk menemani tumbuh kembang si kecil.",
    booths: ["A7","A8"],
  },
  {
    slug: "bohopanna",
    name: "Bohopanna",
    category: "PAKAIAN_IBU_ANAK",
    instagram: "bohopannaofficial",
    size: "4x4",
    color: null,
    promo: "Diskon 15% untuk bundling ibu dan anak",
    activity: "Mini photo corner twinning outfit 15.00",
    intro:
      "Bohopanna adalah brand fashion anak asal Indonesia yang sejak 2017 dikenal dengan pilihan warna earthy dan bahan yang nyaman. Kami percaya anak bisa tampil stylish dengan harga yang tetap terjangkau, dan koleksi kami kini juga hadir untuk twinning bersama ibu.",
    booths: ["A11","A12","A13","A14"],
  },
  {
    slug: "nice-kids",
    name: "Nice Kids",
    category: "PAKAIAN_IBU_ANAK",
    instagram: "nicekids.official",
    size: "2x2",
    color: null,
    promo: "Gratis tote bag untuk pembelian 3 bodysuit",
    activity: "Kuis warna dan ukuran bodysuit 14.30",
    intro:
      "Nice Kids menyediakan bodysuit, playsuit, dan pakaian harian untuk bayi dan balita dengan bahan katun yang adem dan mudah dirawat. Kami hadir untuk ibu yang mencari pakaian basic berkualitas dengan pilihan warna yang mudah dipadukan.",
    booths: ["A3"],
  },
  {
    slug: "ziel-kids",
    name: "Ziel Kids",
    category: "PAKAIAN_IBU_ANAK",
    instagram: "zielkids",
    size: "4x2",
    color: null,
    promo: "Diskon 25% untuk set couple mom and girl",
    activity: "Fitting couple set dan styling singkat 16.00",
    intro:
      "Ziel Kids adalah brand pakaian anak yang dikenal dengan koleksi couple ibu dan anak perempuan bergaya kasual premium. Kami ingin momen kebersamaan ibu dan anak terasa lebih istimewa lewat busana yang kompak dan nyaman dipakai.",
    booths: ["A15","A16"],
  },
  {
    slug: "dialogue-baby",
    name: "Dialogue Baby",
    category: "AKSESORI_ANAK",
    instagram: "dialogue_baby",
    size: "4x2",
    color: null,
    promo: "Gratis bib untuk setiap pembelian bantal peluk",
    activity: "Konsultasi posisi tidur bayi 12.00",
    intro:
      "Dialogue Baby adalah brand perlengkapan bayi asal Indonesia yang dikenal dengan bantal, guling, dan selimut bayi berbahan lembut. Kami merancang setiap produk agar aman dan nyaman untuk waktu tidur dan bermain si kecil.",
    booths: ["A19","A20"],
  },
  {
    slug: "cuddleme",
    name: "CuddleMe",
    category: "AKSESORI_ANAK",
    instagram: "cuddleme_id",
    size: "4x2",
    color: null,
    promo: "Diskon 20% untuk gendongan seri Wingme",
    activity: "Demo gendongan hip seat dan carrier 14.00",
    intro:
      "CuddleMe adalah brand gendongan bayi asal Indonesia yang merancang carrier, hip seat, dan gendongan kain yang ergonomis untuk orang tua dan bayi. Kami ingin setiap orang tua merasa percaya diri menggendong dengan posisi yang aman dan nyaman.",
    booths: ["A23","A24"],
  },
  {
    slug: "petite-mimi",
    name: "Petite Mimi",
    category: "AKSESORI_ANAK",
    instagram: "petitemimi.official",
    size: "2x2",
    color: null,
    promo: "Beli 2 headband gratis 1 clip rambut",
    activity: "Custom nama di bib dan hair clip on the spot",
    intro:
      "Petite Mimi menghadirkan aksesori bayi dan anak seperti bib, headband, dan hair clip dengan desain manis dan bahan yang lembut. Setiap koleksi kami dibuat dalam jumlah terbatas agar tetap spesial untuk si kecil.",
    booths: ["A6"],
  },
  {
    slug: "mooimom",
    name: "MOOIMOM",
    category: "PERLENGKAPAN_IBU",
    instagram: "mooimom.id",
    size: "6x2",
    color: null,
    promo: "Gratis nursing cover untuk pembelian pompa ASI",
    activity: "Talkshow menyusui nyaman bersama konselor laktasi 13.30",
    intro:
      "MOOIMOM adalah brand perlengkapan ibu hamil dan menyusui yang menyediakan pompa ASI, bra menyusui, korset, dan pakaian maternity. Kami menemani perjalanan ibu sejak kehamilan hingga masa menyusui dengan produk yang nyaman dan praktis.",
    booths: ["A27","A28","A29"],
  },
  {
    slug: "mamas-choice",
    name: "Mama's Choice",
    category: "PERLENGKAPAN_IBU",
    instagram: "mamaschoiceid",
    size: "4x4",
    color: "#2AA79B",
    promo: "Diskon 20% untuk paket perawatan bumil",
    activity: "Coba gratis stretch mark cream dan konsultasi kulit bumil",
    intro:
      "Mama's Choice adalah brand perawatan untuk ibu hamil, ibu menyusui, dan bayi dengan formula yang aman dan bebas bahan berbahaya. Kami hadir agar setiap mama bisa merawat diri dan si kecil tanpa rasa khawatir.",
    booths: ["A33","A34","A35","A36"],
  },
  {
    slug: "gabag-indonesia",
    name: "GabaG Indonesia",
    category: "PERLENGKAPAN_IBU",
    instagram: "gabagindonesia",
    size: "4x2",
    color: null,
    promo: "Gratis ice gel untuk setiap cooler bag",
    activity: "Demo penyimpanan ASI perah 15.30",
    intro:
      "GabaG adalah brand lokal yang dikenal dengan cooler bag ASI, kantong ASI, dan perlengkapan ibu menyusui yang stylish dan fungsional. Kami membantu ibu bekerja dan ibu aktif menyimpan ASI perah dengan aman ke mana pun pergi.",
    booths: ["A37","A38"],
  },
  {
    slug: "kayu-seru",
    name: "Kayu Seru",
    category: "MAINAN_HOBI",
    instagram: "kayuseru",
    size: "4x2",
    color: null,
    promo: "Diskon 15% untuk balok susun",
    activity: "Area bermain balok kayu terbuka sepanjang hari",
    intro:
      "Kayu Seru adalah produsen mainan kayu edukatif dari Jawa Barat yang membuat balok susun, puzzle, dan alat peraga untuk anak usia dini. Kami percaya bermain dengan mainan kayu membantu anak belajar sambil melatih motorik dan imajinasinya.",
    booths: ["A41","A42"],
  },
  {
    slug: "mainkayoo",
    name: "mainkayoo",
    category: "MAINAN_HOBI",
    instagram: "mainkayoo",
    size: "2x2",
    color: null,
    promo: "Beli 2 mainan montessori gratis kartu aktivitas",
    activity: "Sesi coba mainan montessori usia 1 sampai 3 tahun 11.30",
    intro:
      "mainkayoo membuat mainan kayu edukasi bergaya montessori untuk anak usia 1 sampai 6 tahun dengan finishing yang aman. Setiap mainan kami dirancang agar anak belajar konsep bentuk, warna, dan angka lewat permainan yang sederhana.",
    booths: ["A45"],
  },
  {
    slug: "kummara",
    name: "Kummara",
    category: "MAINAN_HOBI",
    instagram: "kummaraworld",
    size: "4x2",
    color: null,
    promo: "Diskon 20% untuk board game keluarga",
    activity: "Main bareng board game keluarga 16.30",
    intro:
      "Kummara adalah penerbit board game asal Bandung yang mengembangkan permainan keluarga dan edukatif dengan cerita lokal Indonesia. Kami ingin waktu bermain bersama di rumah kembali menjadi kebiasaan yang menyenangkan untuk semua usia.",
    booths: ["A47","A48"],
  },
  {
    slug: "ganara-art-space",
    name: "Ganara Art Space",
    category: "EDUKASI",
    instagram: "ganaraartspace",
    size: "4x4",
    color: null,
    promo: "Gratis 1 kelas trial untuk pendaftaran di booth",
    activity: "Workshop melukis anak 10.30 dan 15.00",
    intro:
      "Ganara Art Space adalah ruang belajar seni untuk anak dan keluarga dengan kelas melukis, menggambar, dan pottery di beberapa lokasi di Jakarta. Kami percaya setiap anak punya cara berekspresi yang unik dan layak diberi ruang untuk berkarya.",
    booths: ["A55","A56","A57","A58"],
  },
  {
    slug: "rabbit-hole",
    name: "Rabbit Hole",
    category: "EDUKASI",
    instagram: "rabbitholeid",
    size: "4x2",
    color: null,
    promo: "Diskon 20% untuk paket buku usia 0 sampai 3 tahun",
    activity: "Read aloud cerita anak 12.30",
    intro:
      "Rabbit Hole adalah pembuat buku anak untuk usia 0 bulan sampai 7 tahun dengan cerita dan ilustrasi yang dirancang sesuai tahapan tumbuh kembang. Kami ingin membaca bersama menjadi rutinitas yang hangat antara orang tua dan anak.",
    booths: ["A49","A50"],
  },
  {
    slug: "oxone",
    name: "Oxone",
    category: "PERALATAN_DAPUR",
    instagram: "oxone.indonesia",
    size: "6x2",
    color: "#D71920",
    promo: "Gratis pisau dapur untuk pembelian blender",
    activity: "Demo masak cepat MPASI dengan blender 14.00",
    intro:
      "Oxone adalah produsen peralatan dapur dan home appliance asal Indonesia yang telah menemani dapur keluarga selama puluhan tahun. Kami menghadirkan blender, cookware, dan peralatan masak yang praktis untuk kebutuhan sehari-hari termasuk menyiapkan MPASI.",
    booths: ["A52","A53","A54"],
  },
  {
    slug: "twin-tulipware",
    name: "Twin Tulipware",
    category: "PERALATAN_DAPUR",
    instagram: "twintulipware_indo",
    size: "4x2",
    color: null,
    promo: "Diskon 20% untuk set bento anak",
    activity: "Demo bekal sekolah anak 11.00",
    intro:
      "Twin Tulipware adalah brand wadah makan dan minum asal Indonesia yang dikenal dengan produk plastik food grade untuk keluarga. Kami membantu ibu menyiapkan bekal anak dan menyimpan makanan dengan rapi dan aman.",
    booths: ["A59","A60"],
  },
  {
    slug: "kanva-home-living",
    name: "Kanva Home & Living",
    category: "DEKORASI_RUMAH",
    instagram: "ka.n.va",
    size: "4x2",
    color: null,
    promo: "Diskon 15% untuk wall art kamar anak",
    activity: "Workshop menyusun gallery wall kamar anak 13.00",
    intro:
      "Kanva Home & Living adalah brand dekorasi rumah asal Jakarta yang menghadirkan wall art, cushion, dan aksesori rumah dengan desain ilustratif. Kami ingin setiap sudut rumah, termasuk kamar anak, terasa personal dan penuh cerita.",
    booths: ["A63","A64"],
  },
  {
    slug: "little-giant",
    name: "Little Giant",
    category: "ELEKTRONIK",
    instagram: "littlegiant_id",
    size: "4x2",
    color: null,
    promo: "Garansi tambahan 6 bulan untuk pembelian di booth",
    activity: "Demo sterilizer dan dryer UV 12.00",
    intro:
      "Little Giant adalah brand perlengkapan bayi asal Indonesia yang dikenal dengan sterilizer, dryer, dan warmer untuk botol susu dan peralatan makan bayi. Kami mengembangkan produk dengan teknologi UV dan uap agar higienitas perlengkapan si kecil lebih terjaga.",
    booths: ["A67","A68"],
  },
  {
    slug: "babysafe",
    name: "BabySafe",
    category: "ELEKTRONIK",
    instagram: "babysafe_indonesia",
    size: "4x2",
    color: null,
    promo: "Gratis botol susu untuk pembelian warmer",
    activity: "Demo penghangat susu dan sterilizer 15.00",
    intro:
      "BabySafe menghadirkan perlengkapan bayi seperti sterilizer, penghangat susu, dan botol susu yang dirancang aman dan mudah digunakan. Kami menemani orang tua baru dengan produk yang membantu rutinitas menyusui dan makan si kecil lebih praktis.",
    booths: ["A69","A70"],
  },
  {
    slug: "crystal-of-the-sea",
    name: "Crystal of the Sea",
    category: "MAKANAN_MINUMAN",
    instagram: "crystalofthesea",
    size: "2x2",
    color: null,
    promo: "Beli 2 kaldu bubuk gratis 1 sachet trial",
    activity: "Coba gratis sampel MPASI kaldu ikan",
    intro:
      "Crystal of the Sea adalah brand bumbu keluarga dan MPASI berbahan alami seperti bubuk ikan teri dan kaldu ikan tanpa MSG. Kami membantu ibu memperkaya rasa dan gizi makanan si kecil dengan bahan laut Indonesia.",
    booths: ["A74"],
  },
  {
    slug: "ladang-lima",
    name: "Ladang Lima",
    category: "MAKANAN_MINUMAN",
    instagram: "ladanglima.id",
    size: "4x2",
    color: "#2E7D32",
    promo: "Diskon 15% untuk bundling tepung dan premix",
    activity: "Icip kue gluten free dan demo baking singkat 14.30",
    intro:
      "Ladang Lima adalah brand pangan sehat gluten free asal Surabaya yang mengolah tepung singkong dan mocaf menjadi tepung, premix, dan camilan. Kami ingin keluarga Indonesia bisa menikmati makanan lezat yang lebih sehat dari bahan lokal.",
    booths: ["A77","A78"],
  },
  {
    slug: "nayz",
    name: "Nayz",
    category: "MAKANAN_MINUMAN",
    instagram: "nayzofficial_id",
    size: "2x2",
    color: null,
    promo: "Beli 3 bubur organik gratis 1 rasa baru",
    activity: "Coba gratis sampel bubur MPASI organik",
    intro:
      "Nayz adalah brand MPASI organik yang menyediakan beras dan bubur bayi dari bahan organik untuk mendukung masa awal makan si kecil. Kami memudahkan ibu menyiapkan MPASI bergizi dengan pilihan varian rasa yang beragam.",
    booths: ["A81"],
  },
];
