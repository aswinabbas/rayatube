import { Channel } from "@/types";

export const CHANNELS: Channel[] = [
  {
    id: "yufid-kids",
    name: "Yufid Kids",
    handle: "@YufidKids",
    youtubeChannelId: "UCwAvDg6rCh6LMNUh6cZSk8A",
    description: "Konten Islam edukatif untuk anak-anak",
    color: "#FF6B35",
    emoji: "🌙",
    category: "Islami",
  },
  {
    id: "indonesian-quran",
    name: "Indonesian Free Quran Education",
    handle: "@IndonesianFreeQuranEducation",
    youtubeChannelId: "UC6oKCWoU1h-cosifExjMorA",
    description: "Belajar Al-Quran gratis untuk semua",
    color: "#4CAF50",
    emoji: "📖",
    category: "Quran",
  },
  {
    id: "annawawi-tv",
    name: "An-Nawawi TV",
    handle: "@ANNAWAWITV",
    youtubeChannelId: "UCzETnrXUGsC1zpf37-UecTA",
    description: "Konten dakwah dan pendidikan Islam",
    color: "#2196F3",
    emoji: "🕌",
    category: "Islami",
  },
  {
    id: "rofif-kids",
    name: "Rofif Kids",
    handle: "@RofifKids",
    youtubeChannelId: "UCuha29WoP3SEosqWCSBlYRQ",
    description: "Lagu anak Islami dan cerita edukatif",
    color: "#E91E96",
    emoji: "🎵",
    category: "Lagu",
  },
  {
    id: "hada-kiddy",
    name: "HaDa Kiddy",
    handle: "@HaDaKiddy",
    youtubeChannelId: "Acaha29WoP3SEosqWCSBlYRQ1",
    description: "Kisah para nabi",
    color: "#9C27B0",
    emoji: "📚",
    category: "Kisah",
  },
];

export const DEFAULT_PARENTAL_SETTINGS = {
  dailyLimitMinutes: 60,
  requirePinToUnlock: false,
  pin: "1234",
  allowedChannels: CHANNELS.map((c) => c.id),
};

export const CATEGORIES = ["Semua", "Islami", "Quran", "Lagu", "Kisah"];
