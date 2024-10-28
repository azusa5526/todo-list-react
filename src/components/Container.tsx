import MoreHorizIcon from '../assets/more_horiz.svg?react';
import type { Container } from '../api/trello-type';
import Card, { NewCardButton } from './Card.tsx';
import { useState } from 'react';
import { useContainerStore } from '@/store/useContainerStore.ts';

interface ContainerProps {
  container: Container;
}

export function Container({ container }: ContainerProps) {
  const { deleteContainer } = useContainerStore();

  return (
    <div className='container flex max-h-min w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-gray-900'>
      <div className='flex items-center justify-between py-2 text-white'>
        <div className='ml-4'>{container.name}</div>
        <MoreHorizIcon
          role='button'
          className='mr-2 h-5 w-5 text-gray-300'
          onClick={() => {
            deleteContainer(container._id);
          }}
        />
      </div>
      {container.cards.length > 0 && (
        <div className='custom-scrollbar overflow-y-auto'>
          <div className='flex flex-col gap-2 p-2 pb-0.5 text-2xl'>
            {container.cards.map((card) => (
              <Card
                className='transition hover:shadow-[0_0_0_2px_white]'
                key={card._id}
                card={card}
              />
            ))}
          </div>
        </div>
      )}
      <div className='flex items-center p-2'>
        <NewCardButton onAdd={() => {}}></NewCardButton>
      </div>
    </div>
  );
}

export function NewContainerButton() {
  const { addNewContainer } = useContainerStore();
  const [newContainerOpen, setNewContainerOpen] = useState(false);
  const [newContainerText, setNewContainerText] = useState('');

  async function onAddContainer() {
    if (newContainerText.trim().length) {
      try {
        await addNewContainer(newContainerText);
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
