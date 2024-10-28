import { addCard, addContainer, deleteCard, deleteContainer, getContainers } from '@/api/trello';
import type { Container } from '@/api/trello-type';
import { create } from 'zustand';

interface ContainerState {
  containers: Container[];
  fetchContainers: () => Promise<void>;
  addNewContainer: (name: string) => Promise<void>;
  deleteContainer: (id: string) => Promise<void>;
  addCardToContainer: (containerId: string, cardTitle: string) => Promise<void>;
  deleteCardFromContainer: (containerId: string, cardId: string) => Promise<void>;
}

export const useContainerStore = create<ContainerState>((set) => ({
  containers: [],

  fetchContainers: async () => {
    try {
      const res = await getContainers();
      set({ containers: res.data });
    } catch (error) {
      console.error('fetchContainers error', error);
    }
  },

  addNewContainer: async (name) => {
    try {
      const res = await addContainer({ name });
      set((state) => ({
        containers: [...state.containers, res.data],
      }));
    } catch (error) {
      console.error('addContainer error', error);
    }
  },

  deleteContainer: async (id) => {
    try {
      await deleteContainer(id);
      set((state) => ({
        containers: state.containers.filter((container) => container._id !== id),
      }));
    } catch (error) {
      console.error('deleteContainer error', error);
    }
  },

  addCardToContainer: async (containerId, title) => {
    try {
      const res = await addCard({ title }, { containerId });
      set((state) => ({
        containers: state.containers.map((container) =>
          container._id === containerId
            ? { ...container, cards: [...container.cards, res.data] }
            : container,
        ),
      }));
    } catch (error) {
      console.error('addCard error', error);
    }
  },

  deleteCardFromContainer: async (containerId, cardId) => {
    try {
      await deleteCard(cardId);
      set((state) => ({
        containers: state.containers.map((container) =>
          container._id === containerId
            ? { ...container, cards: container.cards.filter((card) => card._id !== cardId) }
            : container,
        ),
      }));
    } catch (error) {
      console.error('deleteCard error', error);
    }
  },
}));
