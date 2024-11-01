import MoreHorizIcon from '../assets/more_horiz.svg?react';
import type { Container } from '../api/trello-type';
import Card, { NewCardButton } from './Card.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useContainerStore } from '@/store/useContainerStore.ts';
import Sortable from 'sortablejs';

interface ContainerProps {
  container: Container;
}

export function Container({ container }: ContainerProps) {
  const { deleteContainer, moveCardToContainer, updateCardOrder } = useContainerStore();
  const cardListRef = useRef<HTMLDivElement>(null);
  const sortable = useRef<Sortable>();

  useEffect(() => {
    if (cardListRef.current) {
      sortable.current = new Sortable(cardListRef.current, {
        group: 'cards',
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
      });
    }

    return () => {
      if (sortable.current) {
        sortable.current.destroy();
      }
    };
  });

  const handleOnEnd = useCallback(
    (event: Sortable.SortableEvent) => {
      const { oldIndex, newIndex, from, to, item } = event;
      const cardId = item.getAttribute('data-id');
      if (!cardId) return;

      if (from === to) {
        // 同 container 內部拖曳排序卡片
        const updatedCards = [...container.cards];
        const [movedCard] = updatedCards.splice(oldIndex!, 1);
        updatedCards.splice(newIndex!, 0, movedCard);
        // updateCardOrder(container._id, updatedCards);
      } else {
        // 跨 container 拖曳排序卡片
        const targetContainerId = to.getAttribute('data-container-id');
        if (targetContainerId) {
          moveCardToContainer(cardId, targetContainerId, newIndex!);
        }
      }
    },
    [container._id, container.cards, moveCardToContainer, updateCardOrder],
  );

  const handleOnAdd = useCallback((event: Sortable.SortableEvent) => {
    const { item, from } = event;
    if (from && item && !from.contains(item)) {
      from.appendChild(item);
    }
  }, []);

  useEffect(() => {
    if (sortable.current) {
      sortable.current.option('onEnd', handleOnEnd);
      sortable.current.option('onAdd', handleOnAdd);
    }
  }, [handleOnAdd, handleOnEnd]);

  return (
    <div className='container flex max-h-min w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-gray-900'>
      <div className='container-handle flex items-center justify-between py-2 text-white'>
        <div className='ml-4'>{container.name}</div>
        <MoreHorizIcon
          role='button'
          className='mr-2 h-5 w-5 text-gray-300'
          onClick={() => {
            deleteContainer(container._id);
          }}
        />
      </div>

      <div className='custom-scrollbar overflow-y-auto'>
        <div
          ref={cardListRef}
          className='flex flex-col gap-2 p-2 pb-0.5 text-2xl'
          data-container-id={container._id}
        >
          {container.cards.map((card) => (
            <Card
              className='transition hover:shadow-[0_0_0_2px_white]'
              key={`${container._id}-${card._id}`}
              card={card}
            />
          ))}
        </div>
      </div>

      <div className='flex items-center p-2'>
        <NewCardButton containerId={container._id}></NewCardButton>
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
