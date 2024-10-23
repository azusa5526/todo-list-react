import MoreHorizIcon from '../assets/more_horiz.svg?react';
import type { Container } from '../api/trello-type';
import Card from './Card.tsx';

export default function Container({ container }: { container: Container }) {
  return (
    <div className='container flex max-h-min w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-gray-900'>
      <div className='flex items-center justify-between py-2 text-white'>
        <div className='ml-4'>{container.name}</div>
        <MoreHorizIcon role='button' className='mr-2 h-5 w-5 text-gray-300' />
      </div>
      {container.cards.length > 0 && (
        <div className='custom-scrollbar overflow-y-auto'>
          <div className='flex flex-col gap-2 p-2 pb-0 text-2xl'>
            {container.cards.map((card) => (
              <Card key={card._id} card={card} />
            ))}
          </div>
        </div>
      )}
      <div className='flex items-center p-2'>
        <div
          className='mr-2 flex grow items-center rounded-lg bg-slate-800 px-2 py-1 text-white'
          role='button'
        >
          <MoreHorizIcon role='button' className='mr-2 h-5 w-5 text-gray-300' />
          新增卡片
        </div>
        <MoreHorizIcon role='button' className='h-5 w-5 text-gray-300' />
      </div>
    </div>
  );
}
