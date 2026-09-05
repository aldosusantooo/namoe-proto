export type SeedSession = {
  slug: string;
  day: 1 | 2 | 3 | 4;
  /** "13.00" WIB */
  time: string;
  title: string;
  description: string;
  speakers: string[];
};

const DATES: Record<1 | 2 | 3 | 4, string> = {
  1: "2026-10-22",
  2: "2026-10-23",
  3: "2026-10-24",
  4: "2026-10-25",
};

export const SESSION_MINUTES = 45;

/** Builds an absolute instant from an event day and a WIB clock time such as "13.30". */
export function wib(day: 1 | 2 | 3 | 4, time: string): Date {
  const [h, m] = time.split(".").map(Number);
  return new Date(`${DATES[day]}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+07:00`);
}

export const SESSIONS: SeedSession[] = [
  {
    slug: "kamis-1300",
    day: 1,
    time: "13.00",
    title: "Membuka Namoe Market: cerita di balik pasar keluarga",
    description: "Kenapa pasar keluarga, kenapa di mal, dan apa yang ingin kami bangun bersama tenant selama empat hari.",
    speakers: ["theo-derick"],
  },
  {
    slug: "kamis-1500",
    day: 1,
    time: "15.00",
    title: "Belanja cerdas untuk kebutuhan bayi tahun pertama",
    description: "Mana yang perlu dibeli, mana yang bisa dipinjam, dan mana yang sebenarnya tidak perlu.",
    speakers: ["natasha-surya"],
  },
  {
    slug: "kamis-1700",
    day: 1,
    time: "17.00",
    title: "Membangun brand keluarga dari nol",
    description: "Cerita jujur tentang memulai usaha dari meja makan sampai punya tim kecil.",
    speakers: ["billy-tanhadi"],
  },
  {
    slug: "jumat-1300",
    day: 2,
    time: "13.00",
    title: "MPASI tanpa drama",
    description: "Cara menyusun menu MPASI yang realistis untuk orang tua yang sibuk.",
    speakers: ["natasha-surya"],
  },
  {
    slug: "jumat-1500",
    day: 2,
    time: "15.00",
    title: "Konten keluarga yang jujur di media sosial",
    description: "Batas antara berbagi dan menjaga privasi anak, dari sudut pandang kreator.",
    speakers: ["billy-tanhadi"],
  },
  {
    slug: "jumat-1700",
    day: 2,
    time: "17.00",
    title: "Ngobrol santai bareng tenant: dari ide sampai booth",
    description: "Beberapa tenant Namoe Market bercerita bagaimana produk mereka lahir.",
    speakers: ["theo-derick"],
  },
  {
    slug: "sabtu-1100",
    day: 3,
    time: "11.00",
    title: "Bermain bersama anak di rumah tanpa layar",
    description: "Ide bermain sederhana untuk usia 1 sampai 6 tahun dengan barang yang sudah ada di rumah.",
    speakers: ["natasha-surya"],
  },
  {
    slug: "sabtu-1330",
    day: 3,
    time: "13.30",
    title: "Mengelola keuangan keluarga muda",
    description: "Membagi pos pengeluaran, menabung untuk anak, dan tetap punya ruang untuk diri sendiri.",
    speakers: ["billy-tanhadi"],
  },
  {
    slug: "sabtu-1530",
    day: 3,
    time: "15.30",
    title: "Tanya jawab orang tua baru",
    description: "Sesi terbuka. Bawa pertanyaan kamu, kami jawab bersama.",
    speakers: ["theo-derick", "natasha-surya"],
  },
  {
    slug: "sabtu-1730",
    day: 3,
    time: "17.30",
    title: "Dari hobi jadi usaha rumahan",
    description: "Langkah pertama mengubah kegiatan yang kamu sukai menjadi sumber penghasilan.",
    speakers: ["billy-tanhadi"],
  },
  {
    slug: "minggu-1100",
    day: 4,
    time: "11.00",
    title: "Merancang rumah yang ramah anak",
    description: "Menata rumah kecil agar aman untuk anak tanpa kehilangan gaya.",
    speakers: ["theo-derick"],
  },
  {
    slug: "minggu-1330",
    day: 4,
    time: "13.30",
    title: "Menyusui dan kembali bekerja",
    description: "Persiapan praktis untuk ibu yang kembali ke kantor sambil tetap menyusui.",
    speakers: ["natasha-surya"],
  },
  {
    slug: "minggu-1530",
    day: 4,
    time: "15.30",
    title: "Penutupan: cerita empat hari Namoe Market",
    description: "Kilas balik empat hari bersama tenant, pembicara, dan keluarga yang datang.",
    speakers: ["theo-derick", "billy-tanhadi"],
  },
];
