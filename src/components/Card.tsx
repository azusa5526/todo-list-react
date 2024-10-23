import type { Card } from '../api/trello-type';
import { getRandomColor } from '@/utils/getRandomColor';

export default function Card({ card }: { card: Card }) {
  return (
    <div className='card rounded-md py-12 text-white' style={{ backgroundColor: getRandomColor() }}>
      <h3 className='text-lg font-bold'>{card.title}</h3>
      <p className='text-sm'>{card.description}</p>
      {/* <p className='text-xs text-gray-400'>{new Date(card.date).toLocaleDateString()}</p> */}
      {/* {card.coverImage && (
        <img
          src={card.coverImage}
          alt={card.title}
          className='mt-2 h-32 w-full rounded object-cover'
        />
      )} */}
    </div>
  );
}
