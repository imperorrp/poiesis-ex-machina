import { colors } from "./colors";

export interface Playlist {
  id: string;
  title: string;
  color: (typeof colors)[keyof typeof colors];
  artists: string[];
}

export const playlists: Playlist[] = [
  {
    id: "0",
    title: "The Barbarian",
    color: colors.red,
    artists: ["strength", "primal rage", "fierce warrior"],
  },
  {
    id: "1", 
    title: "The Bard",
    color: colors.purple,
    artists: ["inspiration", "performance", "magic"],
  },
  {
    id: "2",
    title: "The Cleric",
    color: colors.gold,
    artists: ["divine power", "healing", "wisdom"],
  },
  {
    id: "3",
    title: "The Druid",
    color: colors.green,
    artists: ["nature", "shapeshifting", "primal magic"],
  },
  {
    id: "4",
    title: "The Fighter",
    color: colors.steel,
    artists: ["combat mastery", "discipline", "tactics"],
  },
  {
    id: "5",
    title: "The Monk",
    color: colors.blue,
    artists: ["martial arts", "discipline", "inner power"],
  },
  {
    id: "6",
    title: "The Paladin",
    color: colors.silver,
    artists: ["holy warrior", "devotion", "righteousness"],
  },
  {
    id: "7",
    title: "The Ranger",
    color: colors.forest,
    artists: ["wilderness", "tracking", "archery"],
  },
  {
    id: "8",
    title: "The Rogue",
    color: colors.shadow,
    artists: ["stealth", "cunning", "precision"],
  },
  {
    id: "9",
    title: "The Sorcerer",
    color: colors.crimson,
    artists: ["innate magic", "chaos", "power"],
  },
  {
    id: "10",
    title: "The Warlock",
    color: colors.violet,
    artists: ["eldritch", "pact magic", "otherworldly"],
  },
  {
    id: "11",
    title: "The Wizard",
    color: colors.sapphire,
    artists: ["arcane magic", "knowledge", "study"],
  }
];

export const morePlaylists = [
  ...playlists.map((item) => ({
    ...item,
    id: item.id + "a",
  })),
];

export const sidebarDnDArchetypes = [
  ...playlists.map((item) => ({
    ...item,
    id: item.title.replace(/\s+/g, '_'),
  })),
];

export const allDnDPlaylists = [
  ...playlists,
  ...morePlaylists,
  ...sidebarDnDArchetypes,
];