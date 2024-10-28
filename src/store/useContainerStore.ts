import { addContainer, deleteContainer, getContainers } from '@/api/trello';
import type { Container } from '@/api/trello-type';
import { create } from 'zustand';

interface ContainerState {
  containers: Container[];
  fetchContainers: () => Promise<void>;
  addNewContainer: (name: string) => Promise<void>;
  deleteContainer: (id: string) => Promise<void>;
}

export const useContainerStore = create<ContainerState>((set) => ({
  containers: [],

  fetchContainers: async () => {
    try {
      const res = await getContainers();
      set({ containers: res.data });
    } catch (err) {
      console.error('fetchContainers error', err);
    }
  },

  addNewContainer: async (name) => {
    try {
      const res = await addContainer({ name });
      set((state) => ({
        containers: [...state.containers, res.data],
      }));
    } catch (err) {
      console.error('addContainer error', err);
    }
  },

  deleteContainer: async (id) => {
    try {
      await deleteContainer(id);
      set((state) => ({
        containers: state.containers.filter((container) => container._id !== id),
      }));
    } catch (err) {
      console.error('deleteContainer error', err);
    }
  },
}));
