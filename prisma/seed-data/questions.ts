export type SeedQuestion = {
  /** Stable id so the seed can be re-run. */
  id: string;
  session: string;
  body: string;
  displayName: string | null;
  /** Minutes after session start. */
  offsetMin: number;
  /** Number of synthetic devices (seed-dev-01..) that upvoted. */
  upvotes: number;
  answered?: boolean;
};

export const SEED_DEVICES = Array.from({ length: 9 }, (_, i) => `seed-dev-${String(i + 1).padStart(2, "0")}`);

export const QUESTIONS: SeedQuestion[] = [
  // kamis-1300, finished in the story, two answered
  { id: "seed-q-k13-01", session: "kamis-1300", body: "Bagaimana proses memilih tenant untuk Namoe Market? Apakah ada kurasi khusus untuk brand lokal?", displayName: "Rina", offsetMin: 5, upvotes: 9, answered: true },
  { id: "seed-q-k13-02", session: "kamis-1300", body: "Apakah tahun depan akan ada Namoe Market di kota lain selain Jakarta?", displayName: null, offsetMin: 8, upvotes: 6 },
  { id: "seed-q-k13-03", session: "kamis-1300", body: "Kenapa memilih format pasar di mal, bukan pameran di convention hall?", displayName: "Dewi Anggraini", offsetMin: 12, upvotes: 6 },
  { id: "seed-q-k13-04", session: "kamis-1300", body: "Ada area menyusui dan ganti popok di dekat panggung?", displayName: null, offsetMin: 15, upvotes: 4, answered: true },
  { id: "seed-q-k13-05", session: "kamis-1300", body: "Bagaimana cara brand kecil ikut jadi tenant tahun depan?", displayName: "Fajar", offsetMin: 21, upvotes: 2 },
  // jumat-1300, finished in the story, two answered
  { id: "seed-q-j13-01", session: "jumat-1300", body: "Anak saya 8 bulan masih menolak tekstur kasar. Kapan sebaiknya mulai khawatir?", displayName: "Maya", offsetMin: 4, upvotes: 8, answered: true },
  { id: "seed-q-j13-02", session: "jumat-1300", body: "Boleh pakai kaldu bubuk kemasan untuk MPASI, atau harus bikin sendiri?", displayName: null, offsetMin: 7, upvotes: 7 },
  { id: "seed-q-j13-03", session: "jumat-1300", body: "Bagaimana mengatur waktu masak MPASI kalau dua orang tua bekerja penuh waktu?", displayName: "Andini", offsetMin: 10, upvotes: 5, answered: true },
  { id: "seed-q-j13-04", session: "jumat-1300", body: "Apakah blender khusus MPASI benar-benar perlu, atau blender biasa cukup?", displayName: null, offsetMin: 13, upvotes: 3 },
  { id: "seed-q-j13-05", session: "jumat-1300", body: "Tips kalau anak lebih suka makan sambil digendong?", displayName: "Bunda Kenzo", offsetMin: 18, upvotes: 1 },
  { id: "seed-q-j13-06", session: "jumat-1300", body: "Berapa lama MPASI beku aman disimpan di freezer?", displayName: null, offsetMin: 24, upvotes: 0 },
  // sabtu-1330, the pitch session, all open
  { id: "seed-q-s13-01", session: "sabtu-1330", body: "Berapa persen penghasilan yang ideal disisihkan untuk dana pendidikan anak?", displayName: "Hendra", offsetMin: 3, upvotes: 7 },
  { id: "seed-q-s13-02", session: "sabtu-1330", body: "Mulai dari mana kalau selama ini tidak pernah mencatat pengeluaran?", displayName: null, offsetMin: 6, upvotes: 5 },
  { id: "seed-q-s13-03", session: "sabtu-1330", body: "Bagaimana membicarakan uang dengan pasangan tanpa berujung bertengkar?", displayName: "Sinta", offsetMin: 9, upvotes: 5 },
  { id: "seed-q-s13-04", session: "sabtu-1330", body: "Apakah asuransi pendidikan masih relevan dibanding reksa dana?", displayName: null, offsetMin: 11, upvotes: 3 },
  { id: "seed-q-s13-05", session: "sabtu-1330", body: "Pos mana yang biasanya paling bocor di keluarga muda?", displayName: "Yoga", offsetMin: 14, upvotes: 0 },
];

export type SeedThanks = { id: string; session: string; body: string; displayName: string | null; offsetMin: number };

export const THANKS: SeedThanks[] = [
  { id: "seed-t-k13-01", session: "kamis-1300", body: "Terima kasih sudah menghadirkan pasar seperti ini di Jakarta. Anak saya senang sekali.", displayName: "Rina", offsetMin: 50 },
  { id: "seed-t-k13-02", session: "kamis-1300", body: "Ceritanya menginspirasi. Semoga Namoe Market rutin setiap tahun.", displayName: null, offsetMin: 55 },
  { id: "seed-t-j13-01", session: "jumat-1300", body: "Terima kasih Kak Natasha, akhirnya MPASI terasa lebih ringan setelah sesi ini.", displayName: "Maya", offsetMin: 52 },
];
