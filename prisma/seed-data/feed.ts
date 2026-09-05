export type SeedFeedPost = {
  id: string;
  body: string;
  /** Tenant slug for tenant posts, null for visitor posts. */
  tenant: string | null;
  displayName: string | null;
  photo: string;
  /** Event day and WIB time of the post. */
  day: 1 | 2 | 3 | 4;
  time: string;
};

export const FEED_POSTS: SeedFeedPost[] = [
  { id: "seed-feed-01", body: "Booth kami sudah siap di A23 dan A24. Mampir untuk coba gendongan hip seat.", tenant: "cuddleme", displayName: null, photo: "/img/cuddleme?n=4", day: 1, time: "10.20" },
  { id: "seed-feed-02", body: "Demo blender MPASI mulai jam 14.00 di A52. Ada sampel bubur untuk si kecil.", tenant: "oxone", displayName: null, photo: "/img/oxone?n=4", day: 1, time: "12.45" },
  { id: "seed-feed-03", body: "Workshop melukis anak siang ini penuh, sesi sore masih ada tempat.", tenant: "ganara-art-space", displayName: null, photo: "/img/ganara-art-space?n=4", day: 2, time: "11.30" },
  { id: "seed-feed-04", body: "Anak saya betah di area balok kayu setengah jam lebih. Rekomendasi buat yang bawa balita.", tenant: null, displayName: "Rina", photo: "/img/kayu-seru?n=5", day: 1, time: "15.10" },
  { id: "seed-feed-05", body: "Twinning outfit dari booth Bohopanna, langsung dipakai keliling mal.", tenant: null, displayName: "Dewi Anggraini", photo: "/img/bohopanna?n=5", day: 2, time: "16.05" },
  { id: "seed-feed-06", body: "Stempel kelima dapat dari booth Nayz. Kode hadiah langsung muncul.", tenant: null, displayName: null, photo: "/img/nayz?n=5", day: 3, time: "13.50" },
];

export type SeedTenantPost = {
  id: string;
  tenant: string;
  body: string;
  displayName: string | null;
  reply: string | null;
  pinned: boolean;
  day: 1 | 2 | 3 | 4;
  time: string;
};

export const TENANT_POSTS: SeedTenantPost[] = [
  {
    id: "seed-tp-01",
    tenant: "cuddleme",
    body: "Gendongan hip seat aman untuk bayi usia berapa?",
    displayName: "Maya",
    reply: "Hip seat kami disarankan mulai usia 6 bulan, saat bayi sudah bisa duduk tegak. Untuk newborn ada seri carrier dengan penyangga kepala.",
    pinned: true,
    day: 1,
    time: "11.05",
  },
  {
    id: "seed-tp-02",
    tenant: "oxone",
    body: "Blender yang didemo bisa untuk menghaluskan daging?",
    displayName: null,
    reply: null,
    pinned: false,
    day: 1,
    time: "14.20",
  },
];
