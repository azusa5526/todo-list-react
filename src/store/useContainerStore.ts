import {
  addCard,
  addContainer,
  deleteCard,
  deleteContainer,
  getContainers,
  moveCard,
  updateCardOrder,
  updateContainerOrder,
} from '@/api/trello';
import type { Card, Container } from '@/api/trello-type';
import { create } from 'zustand';

interface ContainerState {
  containers: Container[];
  fetchContainers: () => Promise<void>;
  addNewContainer: (name: string) => Promise<void>;
  deleteContainer: (id: string) => Promise<void>;
  addCardToContainer: (containerId: string, cardTitle: string) => Promise<void>;
  deleteCardFromContainer: (containerId: string, cardId: string) => Promise<void>;
  updateContainerOrder: (newContainers: Container[]) => Promise<void>;
  updateCardOrder: (containerId: string, newCards: Card[]) => Promise<void>;
  moveCardToContainer: (
    cardId: string,
    targetContainerId: string,
    newIndex: number,
  ) => Promise<void>;
}

export const useContainerStore = create<ContainerState>((set, get) => ({
  containers: [],

  fetchContainers: async () => {
    try {
      const res = await getContainers();
      const sortedContainers = res.data.sort((a, b) => a.sortIndex - b.sortIndex);
      for (const container of sortedContainers) {
        container.cards.sort((a, b) => a.sortIndex - b.sortIndex);
      }

      set({ containers: sortedContainers });
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

  updateContainerOrder: async (newContainers) => {
    try {
      set({ containers: newContainers });

      const payload = newContainers.map(({ _id, sortIndex }) => ({
        _id,
        sortIndex,
      }));

      await updateContainerOrder(payload);
    } catch (error) {
      console.error('updateContainerOrder error', error);
    }
  },

  updateCardOrder: async (containerId: string, newCards: Card[]) => {
    try {
      set((state) => ({
        containers: state.containers.map((container) =>
          container._id === containerId ? { ...container, cards: newCards } : container,
        ),
      }));

      const payload = newCards.map((card, index) => ({
        _id: card._id,
        sortIndex: index,
      }));
      await updateCardOrder(containerId, payload);
    } catch (error) {
      console.error('Failed to update card order:', error);
    }
  },

  moveCardToContainer: async (cardId: string, targetContainerId: string, newIndex: number) => {
    try {
      const state = get();
      const sourceContainer = state.containers.find((c) =>
        c.cards.some((card) => card._id === cardId),
      );
      const targetContainer = state.containers.find((c) => c._id === targetContainerId);

      if (sourceContainer && targetContainer) {
        const card = sourceContainer.cards.find((c) => c._id === cardId)!;

        // 先同步狀態
        set({
          containers: state.containers.map((container) => {
            if (container._id === sourceContainer._id) {
              return { ...container, cards: container.cards.filter((c) => c._id !== cardId) };
            }
            if (container._id === targetContainer._id) {
              const updatedCards = [...container.cards];
              updatedCards.splice(newIndex, 0, { ...card, containerId: targetContainerId }); // 插入到 newIndex
              return { ...container, cards: updatedCards };
            }
            return container;
          }),
        });

        // 調用 API 更新後端資料
        await moveCard(cardId, targetContainerId, { newIndex });
      }
    } catch (error) {
      console.error('Failed to move card:', error);
    }
  },
}));
