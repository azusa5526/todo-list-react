import { getRandomColor } from '@/utils/get-random-color';

interface BoardSidebarProps {
  isOpen: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function BoardSidebar({ isOpen }: BoardSidebarProps) {
  return (
    <>
      <div className={`shrink-0 transition-[width] ${isOpen ? 'w-72' : 'w-0'}`}></div>
      <div
        className={`absolute bottom-0 left-0 top-0 flex w-72 shrink-0 flex-col bg-red-400 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-72'}`}
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
