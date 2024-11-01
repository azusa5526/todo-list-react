import type { Card } from '../api/trello-type';
import { getRandomColor } from '@/utils/get-random-color';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useRef, useState } from 'react';
import MoreHorizIcon from '../assets/more_horiz.svg?react';
import { isSupportedImageUrl } from '@/utils/is-supported-image';
import { clsx } from 'clsx';
import { useContainerStore } from '@/store/useContainerStore';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

interface CardProps {
  card: Card;
  className?: string;
}

export default function Card({ card, className }: CardProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  return (
    <div
      className={clsx('card overflow-hidden rounded-lg border text-white', className)}
      onClick={openDialog}
      data-id={card._id}
    >
      {card.coverImage && (
        <img
          src={`${apiUrl}/${card.coverImage}`}
          alt={card.title}
          className='h-auto w-full object-cover'
          draggable='false'
        />
      )}
      <h3 className='px-3 py-2 text-sm font-bold'>
        {card.title} {card._id.slice(-4)}
      </h3>
      <div className='flex gap-x-2 px-3'>
        {card.attachments && card.attachments.length > 0 && (
          <div className='mb-2 flex items-center'>
            <MoreHorizIcon className='mr-1 h-5 w-5' />
            <div className='text-sm'>{card.attachments?.length}</div>
          </div>
        )}

        {card.description && card.description.length > 0 && (
          <MoreHorizIcon className='mb-2 mr-1 h-5 w-5' />
        )}
      </div>
      {/* <p className='text-xs text-gray-400'>{new Date(card.date).toLocaleDateString()}</p> */}
      <CardDialog card={card} isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  );
}

interface CardDialogProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

function CardDialog({ card, isOpen, onClose }: CardDialogProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className='fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition ease-out data-[closed]:opacity-0'
    >
      <DialogBackdrop className='fixed inset-0 bg-black/50' />
      <div className='fixed inset-0 w-screen overflow-y-auto p-4'>
        <div className='flex min-h-full items-center justify-center'>
          <DialogPanel className='relative max-w-3xl grow overflow-hidden rounded-xl border border-gray-600 bg-gray-700'>
            <MoreHorizIcon onClick={onClose} className='absolute right-5 top-5 h-5 w-5' />

            {card.coverImage && (
              <img
                ref={imgRef}
                src={`${apiUrl}/${card.coverImage}`}
                alt={card.title}
                className='h-40 w-full bg-slate-500 object-contain'
                draggable='false'
                crossOrigin='anonymous'
              />
            )}

            <div className='grid grid-cols-[28px_1fr] items-center gap-x-3 p-4 pr-12 text-lg text-gray-300'>
              <MoreHorizIcon className='h-5 w-5 justify-self-center' />
              <div className='font-bold'>{card.title}</div>
            </div>

            <div className='flex flex-col md:flex-row'>
              <div className='flex grow flex-col gap-y-4 p-4'>
                <div className='grid grid-cols-[28px_1fr_56px] items-center gap-x-3 gap-y-4 border border-gray-700 text-white'>
                  <MoreHorizIcon className='h-5 w-5 justify-self-center' />
                  <div className={`py-2 ${card.description ?? 'col-span-2'}`}>描述</div>
                  {card.description && (
                    <div className='rounded bg-gray-500 p-2 text-center text-sm' role='button'>
                      編輯
                    </div>
                  )}
                  <div className='col-span-2 col-start-2'>
                    {card.description ?? (
                      <div className='rounded-md bg-gray-600 p-3 pb-8 text-sm' role='button'>
                        新增更詳細的敘述...
                      </div>
                    )}
                  </div>
                </div>

                {card.attachments && card.attachments.length > 0 && (
                  <div className='grid grid-cols-[28px_1fr_56px] items-center gap-x-3 gap-y-4 border border-gray-700 text-white'>
                    <MoreHorizIcon className='h-5 w-5 justify-self-center' />
                    <div className='py-2'>附件</div>

                    <div className='rounded bg-gray-500 p-2 text-center text-sm' role='button'>
                      新增
                    </div>

                    <div className='col-span-2 col-start-2 flex flex-col gap-y-2'>
                      {card.attachments.map((attachment) => (
                        <div
                          key={attachment.url}
                          className='grid grid-cols-[68px_1fr_80px] gap-x-3'
                        >
                          <div className='grid place-content-center rounded-md border object-contain'>
                            {isSupportedImageUrl(attachment.url) ? (
                              <img src={`${apiUrl}/${attachment.url}`} alt='' />
                            ) : (
                              <div className='font-bold opacity-80'>File</div>
                            )}
                          </div>
                          <div className='flex flex-col overflow-hidden text-ellipsis whitespace-nowrap'>
                            <div className=''>{attachment.title}</div>
                            <div>{attachment.uploadedAt}</div>
                          </div>
                          <div className='grid grid-cols-2 place-content-center gap-x-2'>
                            <div
                              role='button'
                              className='grid grow place-content-center rounded bg-gray-400 py-1'
                            >
                              <MoreHorizIcon className='h-5 w-5' />
                            </div>
                            <div
                              role='button'
                              className='grid grow place-content-center rounded bg-gray-400 py-1'
                            >
                              <MoreHorizIcon className='h-5 w-5' />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='grid shrink-0 auto-rows-min grid-cols-2 gap-2 p-4 pl-4 md:w-[180px] md:grid-cols-1 md:pl-0'>
                {Array.from({ length: 5 }, (_, index) => index++).map((item) => (
                  <div
                    key={item}
                    className='flex items-center rounded px-2 py-1 text-white'
                    role='button'
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <MoreHorizIcon className='mr-2 h-5 w-5' />
                    {item}
                  </div>
                ))}
                <DeleteCardPopover card={card} />
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

interface NewCardButtonProps {
  containerId: string;
}

export function NewCardButton({ containerId }: NewCardButtonProps) {
  const { addCardToContainer } = useContainerStore();
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');

  async function onAddCard() {
    if (cardTitle.trim()) {
      await addCardToContainer(containerId, cardTitle);
      setNewCardOpen(false);
      setCardTitle('');
    }
  }

  return (
    <>
      {newCardOpen ? (
        <div className='flex shrink-0 grow flex-col rounded-xl bg-gray-900'>
          <input
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            type='text'
            className='text- mb-2 grow rounded px-2 py-1'
          />
          <div className='flex items-center'>
            <div
              onClick={onAddCard}
              role='button'
              className='mr-2 rounded bg-blue-400 px-3 py-1.5 text-sm text-gray-900'
            >
              新增卡片
            </div>
            <MoreHorizIcon
              role='button'
              className='h-5 w-5'
              onClick={() => {
                setNewCardOpen(false);
                setCardTitle('');
              }}
            />
          </div>
        </div>
      ) : (
        <div className='flex grow items-center'>
          <div
            className='mr-2 flex grow items-center rounded-lg bg-slate-800 px-2 py-1 text-white'
            role='button'
            onClick={() => setNewCardOpen(true)}
          >
            <MoreHorizIcon role='button' className='mr-2 h-5 w-5 text-gray-300' />
            新增卡片
          </div>
          <MoreHorizIcon role='button' className='h-5 w-5 text-gray-300' />
        </div>
      )}
    </>
  );
}

interface DeleteCardProps {
  card: Card;
}

function DeleteCardPopover({ card }: DeleteCardProps) {
  const { deleteCardFromContainer } = useContainerStore();

  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton className='w-full'>
            <div
              className='flex items-center rounded px-2 py-1 text-white'
              style={{ backgroundColor: getRandomColor() }}
            >
              <MoreHorizIcon className='mr-2 h-5 w-5' />
              刪除卡片
            </div>
          </PopoverButton>
          <PopoverPanel
            anchor={{ to: 'top start', gap: '8px' }}
            transition
            className='flex origin-top flex-col rounded-lg bg-gray-800 text-gray-100 outline outline-1 outline-gray-500 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0'
          >
            <div className='relative flex w-72 flex-col p-3'>
              <div className='pb-2 text-center'>刪除卡片</div>
              <div role='button' onClick={close}>
                <MoreHorizIcon className='absolute right-3.5 top-3.5 h-5 w-5' />
              </div>

              <div className='pb-4 text-sm'>
                此動作將刪除卡片與相關附件，你將無法再次復原，是否刪除？
              </div>
              <div
                role='button'
                className='grow rounded bg-red-400 p-1.5 text-center text-sm text-gray-800'
                onClick={() => {
                  deleteCardFromContainer(card.containerId, card._id);
                  close();
                }}
              >
                刪除
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
