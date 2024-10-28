import { getRandomColor } from '@/utils/get-random-color';
import { useAppStore } from '@/store/useAppStore';
import { Container, NewContainerButton } from './Container';
import { useContainerStore } from '@/store/useContainerStore';
import { useEffect } from 'react';

export function BoardSidebar() {
  const { boardSidebarOpen } = useAppStore();

  return (
    <>
      <div className={`shrink-0 transition-[width] ${boardSidebarOpen ? 'w-72' : 'w-0'}`}></div>
      <div
        className={`absolute bottom-0 left-0 top-0 flex w-72 shrink-0 flex-col bg-red-400 transition-transform ${boardSidebarOpen ? 'translate-x-0' : '-translate-x-72'}`}
      >
        <div className='flex h-boardbar shrink-0 items-center'>你的看板</div>
        <div className='custom-scrollbar overflow-y-auto'>
          {Array.from({ length: 20 }, (_, index) => index++).map((item) => (
            <div className='py-4' style={{ backgroundColor: getRandomColor() }} key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function BoardHeader() {
  const { boardSidebarOpen, toggleBoardSidebar } = useAppStore();

  return (
    <div className='flex h-boardbar items-center bg-yellow-200'>
      <div role='button' className='mr-4' onClick={() => toggleBoardSidebar()}>
        {boardSidebarOpen ? 'close' : 'open'}
      </div>
      <div>假的吹囉看板</div>
    </div>
  );
}

export function BoardContent() {
  const { containers, fetchContainers } = useContainerStore();

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return (
    <div
      className='flex grow gap-3 overflow-x-auto p-3'
      style={{ height: 'calc(100vh - var(--appbar-height) - var(--boardbar-height))' }}
    >
      {containers.map((container) => (
        <Container key={container._id} container={container} />
      ))}
      <NewContainerButton></NewContainerButton>
    </div>
  );
}
