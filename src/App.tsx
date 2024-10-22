import './App.css';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { getContainers } from '@/api/trello';
import { Container } from './api/trello-type';
import MoreHorizIcon from './assets/more_horiz.svg?react';

export function App() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b})`;
  };

  return (
    <>
      <div className='h-appbar shrink-0 bg-green-200'>header</div>
      <div className='relative flex'>
        <div className={`shrink-0 transition-[width] ${sidebarOpen ? 'w-72' : 'w-0'}`}></div>
        <div
          className={`absolute bottom-0 left-0 top-0 flex w-72 shrink-0 flex-col bg-red-400 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-72'}`}
        >
          ABC123 工作區
        </div>
        <div className='flex grow flex-col overflow-x-auto bg-sky-700'>
          <div className='flex h-boardbar items-center bg-yellow-200'>
            <div role='button' onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? 'close' : 'open'}
            </div>
            <div>board header</div>
          </div>
          <div
            className='flex grow gap-3 overflow-x-auto p-3'
            style={{ maxHeight: 'calc(100vh - var(--appbar-height) - var(--boardbar-height))' }}
          >
            {containers.map((container) => (
              <div className='flex w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-gray-900'>
                <div className='flex justify-between p-2 text-white'>
                  <div>Container: {container.name}</div>
                  <MoreHorizIcon role='button' className='h-6 w-6 text-gray-300' />
                </div>
                <div className='grow overflow-y-scroll' key={container._id}>
                  <div className='flex flex-col gap-2 p-2 text-2xl'>
                    {Array.from({ length: 10 }, (_, index) => index++).map((item) => (
                      <div
                        className='py-12'
                        style={{ backgroundColor: getRandomColor() }}
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className='grow bg-gray-300'>
              <div role='button' className='w-72 whitespace-nowrap bg-gray-700 p-3 text-white'>
                新增容器
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
