import { create } from 'zustand';

type Image = {
    id: string;
    filename: string;
    uploaded_at: string | null;
}

type Album = {
    [title: string]: Image[];
}

type Story = Image[];

const useUserHomePageDataStore = create((set) => ({
  albums: [],
  stories: [],
  randomStories: [],

  setAlbums: (albums : Album) => set({ albums }),
  setStories: (stories : Story) => set({ stories }),
  setRandomStories: (randomStories : Story) => set({ randomStories }),
}));

export default useUserHomePageDataStore;
