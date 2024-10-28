import './App.css';
import { BoardSidebar, BoardHeader, BoardContent } from './components/Board';

export function App() {
  return (
    <>
      <Appbar></Appbar>
      <div className='relative flex'>
        <BoardSidebar></BoardSidebar>
        <div className='flex grow flex-col overflow-x-auto bg-sky-700'>
          <BoardHeader></BoardHeader>
          <BoardContent></BoardContent>
        </div>
      </div>
    </>
  );
}

function Appbar() {
  return (
    <div className='flex h-appbar shrink-0 items-center bg-green-200'>
      <h1 className='text-xl'>吹囉</h1>
    </div>
  );
}

export default App;
