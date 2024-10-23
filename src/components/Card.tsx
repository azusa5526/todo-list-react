import type { Card } from '../api/trello-type';
import { getRandomColor } from '@/utils/getRandomColor';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';

export default function Card({ card }: { card: Card }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div
      className='card overflow-hidden rounded-lg text-white'
      style={{ backgroundColor: getRandomColor() }}
      onClick={openDialog}
    >
      {card.coverImage && (
        <img
          src={`${apiUrl}/${card.coverImage}`}
          alt={card.title}
          className='h-auto w-full object-cover'
          draggable='false'
        />
      )}
      <h3 className='px-3 py-2 text-sm font-bold'>{card.title}</h3>
      <p className='text-sm'>{card.description}</p>
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

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='max-w-lg space-y-4 border bg-white p-12'>
          <DialogTitle className='font-bold'>Deactivate account</DialogTitle>
          <Description>This will permanently deactivate your account</Description>
          <p>
            Are you sure you want to deactivate your account? All of your data will be permanently
            removed.
          </p>
          <div className='flex gap-4'>
            <button onClick={onClose}>Cancel</button>
            <button onClick={onClose}>Deactivate</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
