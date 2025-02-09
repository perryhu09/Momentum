import create from 'zustand';

interface ImageStore {
  imageMap: { [key: string]: any }; 
  addImage: (filename: string, image: any) => void;  
}

const useImageStore = create<ImageStore>((set) => ({
  imageMap: {}, 
  addImage: (filename, image) => set((state) => ({
    imageMap: { ...state.imageMap, [filename]: image },  
  })),
}));

export default useImageStore;