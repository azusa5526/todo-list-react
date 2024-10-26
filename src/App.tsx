import './App.css';
import { useState, useEffect } from 'react';
import { getContainers } from '@/api/trello';
import type { Container as ContainerType } from './api/trello-type';
import Container from './components/Container';
import { NewContainerButton } from './components/NewContainerButton';
import { BoardSidebar } from './components/BoardSidebar';

export function App() {
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [boardSidebarOpen, setBoardSidebarOpen] = useState(true);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const res = await getContainers();
      setContainers(res.data);
    } catch (err) {
      console.error('fetchContainers error', err);
    }
  };

  function onAddContainer(container: ContainerType) {
    setContainers([...containers, container]);
  }

  function onDeleteContainer(id: string) {
    setContainers(containers.filter((container) => container._id !== id));
  }

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
              <Container key={container._id} container={container} onDelete={onDeleteContainer} />
            ))}
            <NewContainerButton onAdd={onAddContainer}></NewContainerButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
