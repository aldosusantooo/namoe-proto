export type SeedSpeaker = { slug: string; name: string; handle: string; bio: string };

// Bios are placeholder text for Theo to replace before the event.
export const SPEAKERS: SeedSpeaker[] = [
  {
    slug: "theo-derick",
    name: "Theo Derick",
    handle: "byteproject",
    bio: "Theo Derick adalah founder byte.project dan penyelenggara Namoe Market. Ia merancang pasar keluarga ini agar tenant lokal dan keluarga muda bisa bertemu langsung di satu tempat.",
  },
  {
    slug: "billy-tanhadi",
    name: "Billy Tanhadi",
    handle: "billytanhadi",
    bio: "Billy Tanhadi adalah kreator konten dan pelaku usaha keluarga. Ia membagikan pengalaman membangun brand dari rumah sambil membesarkan anak.",
  },
  {
    slug: "natasha-surya",
    name: "Natasha Surya",
    handle: "natashadap",
    bio: "Natasha Surya adalah co-host Namoe Market dan kreator konten parenting. Ia menemani orang tua baru lewat cerita sehari-hari tentang menyusui, MPASI, dan bermain bersama anak.",
  },
];
