import { create } from 'zustand';

interface AppState {
  boardSidebarOpen: boolean;
  toggleBoardSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  boardSidebarOpen: true,
  toggleBoardSidebar: () => set((state) => ({ boardSidebarOpen: !state.boardSidebarOpen })),
}));
