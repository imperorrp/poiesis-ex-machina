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
    title: "The Artist",
    color: colors.pink,
    artists: ["attachment"],
  },
  {
    id: "1",
    title: "The Dragon Slayer",
    color: colors.teal,
    artists: ["duress"],
  },
  {
    id: "2",
    title: "The Hero",
    color: colors.orange,
    artists: ["frustration"],
  },
  {
    id: "3",
    title: "The Giver",
    color: colors.yellow,
    artists: ["devotion"],
  },
  {
    id: "4",
    title: "The Fixer",
    color: colors.green,
    artists: ["envy"],
  },
  {
    id: "5",
    title: "The Defender",
    color: colors.blue,
    artists: ["satisfaction"],
  },
  {
    id: "6",
    title: "The Scientist",
    color: colors.emerald,
    artists: ["anxiety"],
  },
  {
    id: "7",
    title: "The Wizard",
    color: colors.rose,
    artists: ["remorse"],
  },
  {
    id: "8",
    title: "The Architect",
    color: colors.purple,
    artists: ["revelation"],
  },

];

export const morePlaylists = [
  ...playlists.map((item) => ({
    ...item,
    id: item.id + "a",
  })),
];

export const sidebarEristicsArchetypes = [
  ...playlists.map((item) => ({
    ...item,
    //id: item.id + "_archetype",
    id: item.title.replace(/\s+/g, '_'), // Replace spaces with underscores
  })),
];

export const allPlaylists = [
  ...playlists,
  ...morePlaylists,
  ...sidebarEristicsArchetypes,
];
