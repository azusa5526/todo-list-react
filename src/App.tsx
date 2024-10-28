import './App.css';
import { useState, useEffect } from 'react';
import { Container, NewContainerButton } from './components/Container';
import { BoardSidebar } from './components/BoardSidebar';
import { useContainerStore } from './store/useContainerStore';

export function App() {
  const { containers, fetchContainers } = useContainerStore();
  const [boardSidebarOpen, setBoardSidebarOpen] = useState(true);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  function onBoardSidebarToggle(isOpen: boolean) {
    setBoardSidebarOpen(isOpen);
  }

  return (
    <>
      <div className='flex h-appbar shrink-0 items-center bg-green-200'>
        <h1 className='text-xl'>吹囉</h1>
      </div>
      <div className='relative flex'>
        <BoardSidebar isOpen={boardSidebarOpen} onToggle={onBoardSidebarToggle}></BoardSidebar>
        <div className='flex grow flex-col overflow-x-auto bg-sky-700'>
          <div className='flex h-boardbar items-center bg-yellow-200'>
            <div
              role='button'
              className='mr-4'
              onClick={() => setBoardSidebarOpen(!boardSidebarOpen)}
            >
              {boardSidebarOpen ? 'close' : 'open'}
            </div>
            <div>假的吹囉看板</div>
          </div>
          <div
            className='flex grow gap-3 overflow-x-auto p-3'
            style={{ height: 'calc(100vh - var(--appbar-height) - var(--boardbar-height))' }}
          >
            {containers.map((container) => (
              <Container key={container._id} container={container} />
            ))}
            <NewContainerButton></NewContainerButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
