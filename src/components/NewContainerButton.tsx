import { useState } from 'react';
import MoreHorizIcon from '@/assets/more_horiz.svg?react';
import { addContainer } from '@/api/trello';
import type { Container } from '@/api/trello-type';

interface NewContainerButtonProps {
  onAdd: (container: Container) => void;
}

export function NewContainerButton({ onAdd }: NewContainerButtonProps) {
  const [newContainerOpen, setNewContainerOpen] = useState(false);
  const [newContainerText, setNewContainerText] = useState('');

  async function onAddContainer() {
    if (newContainerText.trim().length) {
      try {
        const res = await addContainer({ name: newContainerText });
        onAdd(res.data);
        setNewContainerOpen(false);
        setNewContainerText('');
      } catch (error) {
        console.log('addContainer err: ', error);
      }
    }
  }

  return (
    <>
      {newContainerOpen ? (
        <div className='flex max-h-fit w-72 shrink-0 flex-col rounded-xl bg-gray-900 p-2'>
          <input
            value={newContainerText}
            onChange={(e) => setNewContainerText(e.target.value)}
            type='text'
            className='text- mb-2 grow rounded px-2 py-1'
          />
          <div className='flex items-center'>
            <div
              onClick={onAddContainer}
              role='button'
              className='mr-2 rounded bg-blue-400 px-3 py-1.5 text-sm text-gray-900'
            >
              新增容器
            </div>
            <MoreHorizIcon
              role='button'
              className='h-5 w-5'
              onClick={() => {
                setNewContainerOpen(false);
                setNewContainerText('');
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className='max-h-fit w-72 shrink-0 rounded-xl bg-sky-500'
          onClick={() => setNewContainerOpen(true)}
        >
          <div role='button' className='flex items-center p-3 text-white'>
            <MoreHorizIcon role='button' className='mr-2 h-5 w-5 text-gray-300' />
            新增容器
          </div>
        </div>
      )}
    </>
  );
}
