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
    title: "The Ruler",
    color: colors.navy,
    artists: ["control", "power", "structure"],
  },
  {
    id: "1",
    title: "The Artist",
    color: colors.azure,
    artists: ["innovation", "creativity", "expression"],
  },
  {
    id: "2",
    title: "The Innocent",
    color: colors.cyan,
    artists: ["safety", "trust", "optimism"],
  },
  {
    id: "3",
    title: "The Sage",
    color: colors.emerald,
    artists: ["knowledge", "wisdom", "understanding"],
  },
  {
    id: "4",
    title: "The Explorer",
    color: colors.lime,
    artists: ["freedom", "discovery", "adventure"],
  },
  {
    id: "5",
    title: "The Outlaw",
    color: colors.yellow,
    artists: ["liberation", "revolution", "rebellion"],
  },
  {
    id: "6",
    title: "The Magician",
    color: colors.amber,
    artists: ["power", "transformation", "vision"],
  },
  {
    id: "7",
    title: "The Hero",
    color: colors.orange,
    artists: ["mastery", "courage", "triumph"],
  },
  {
    id: "8",
    title: "The Lover",
    color: colors.red,
    artists: ["intimacy", "passion", "commitment"],
  },
  {
    id: "9",
    title: "The Jester",
    color: colors.pink,
    artists: ["pleasure", "joy", "spontaneity"],
  },
  {
    id: "10",
    title: "The Everyman",
    color: colors.purple,
    artists: ["belonging", "connection", "authenticity"],
  },
  {
    id: "11",
    title: "The Caregiver",
    color: colors.indigo,
    artists: ["service", "nurture", "compassion"],
  }
];

export const morePlaylists = [
  ...playlists.map((item) => ({
    ...item,
    id: item.id + "a",
  })),
];

export const sidebarJungianArchetypes = [
  ...playlists.map((item) => ({
    ...item,
    id: item.title.replace(/\s+/g, '_'),
  })),
];

export const allJungPlaylists = [
  ...playlists,
  ...morePlaylists,
  ...sidebarJungianArchetypes,
];