import './App.css';
import { useState, useEffect } from 'react';
import { getContainers } from '@/api/trello';
import type { Container as ContainerType } from './api/trello-type';
import Container from './components/Container';
import MoreHorizIcon from '@/assets/more_horiz.svg?react';
import { addContainer } from '@/api/trello';

export function App() {
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newContainerOpen, setNewContainerOpen] = useState(false);
  const [newContainerText, setNewContainerText] = useState('');

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

  async function onAddContainer() {
    if (newContainerText.trim().length) {
      try {
        const res = await addContainer({ name: newContainerText });
        setContainers([...containers, res.data]);
        setNewContainerOpen(false);
        setNewContainerText('');
      } catch (error) {
        console.log('addContainer err: ', error);
      }
    }
  }

  async function onDeleteContainer(id: string) {
    setContainers(containers.filter((container) => container._id !== id));
  }

  return (
    <>
      <div className='flex h-appbar shrink-0 items-center bg-green-200'>
        <h1 className='text-xl'>吹囉</h1>
      </div>
      <div className='relative flex'>
        <div className={`shrink-0 transition-[width] ${sidebarOpen ? 'w-72' : 'w-0'}`}></div>
        <div
          className={`absolute bottom-0 left-0 top-0 flex w-72 shrink-0 flex-col bg-red-400 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-72'}`}
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
        <div className='flex grow flex-col overflow-x-auto bg-sky-700'>
          <div className='flex h-boardbar items-center bg-yellow-200'>
            <div role='button' className='mr-4' onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? 'close' : 'open'}
            </div>
            <div>假的吹囉看板</div>
          </div>
          <div
            className='flex grow gap-3 overflow-x-auto p-3'
            style={{ height: 'calc(100vh - var(--appbar-height) - var(--boardbar-height))' }}
          >
            {containers.map((container) => (
              <Container key={container._id} container={container} onDelete={onDeleteContainer} />
            ))}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
