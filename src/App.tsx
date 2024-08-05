import './App.css';
import { useState, useEffect } from 'react';
import { getTodos, addTodo, deleteTodo, updateTodo, type Todo } from '@/api/todo';
import DoneIcon from './assets/done.svg?react';
import PendingIcon from './assets/pending.svg?react';

function App() {
  const [addTodoText, setAddTodoText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [editText, setEditText] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      console.error('getTodos err', err);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!addTodoText.trim()) return;

    try {
      await addTodo({ title: addTodoText, completed: false });
      setAddTodoText('');
    } catch (err) {
      console.error('handleSubmit err', err);
    }

    fetchTodos();
  }

  async function handleDeleteTodo(id: string) {
    if (!id) return;

    try {
      await deleteTodo(id);
    } catch (err) {
      console.error('handleDeleteTodo err', err);
    }

    fetchTodos();
  }

  async function handleUpdateTodo() {
    if (!selectedTodo) return;

    try {
      await updateTodo(selectedTodo.id, { title: editText, completed: editCompleted });
      setSelectedTodo(undefined);
    } catch (error) {
      console.error('updateTodo err', error);
    }

    fetchTodos();
  }

  function handleSelectTodo(todo: Todo) {
    setSelectedTodo(todo);
    setEditText(todo.title);
    setEditCompleted(todo.completed);
  }

  return (
    <>
      <div className='rounded-3xl shadow-lg w-[600px] min-h-[600px] border'>
        <form onSubmit={handleSubmit} className='p-6 flex'>
          <input
            className='border w-full rounded-full min-h-10 py-2 px-5 mr-3'
            value={addTodoText}
            type='text'
            placeholder='Add todo'
            onChange={(e) => setAddTodoText(e.target.value)}
          />
          <button type='submit' className='border rounded-full bg-gray-500 text-white px-6'>
            Add
          </button>
        </form>

        <ul className='px-6 pb-6'>
          {todos.map((todo, index) => (
            <li
              className={`flex justify-between items-center rounded-full px-5 py-3 ${index % 2 === 0 ? 'bg-gray-100' : ''} ${todo.id === selectedTodo?.id ? 'outline outline-2 outline-gray-300' : ''}`}
              key={todo.id}
            >
              {todo.id === selectedTodo?.id ? (
                <div className='flex flex-grow items-center mr-3'>
                  <input
                    type='checkbox'
                    checked={editCompleted}
                    onChange={(e) => setEditCompleted(e.target.checked)}
                    className='accent-cyan-500 custom-checkbox w-6 h-6 mr-3'
                  ></input>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className='rounded-full w-full flex-grow px-3 py-0.5 outline outline-2 outline-gray-300'
                  ></input>
                </div>
              ) : (
                <div className='flex'>
                  <div className='mr-3 fill-current'>
                    {todo.completed ? (
                      <DoneIcon className='w-6 h-6 text-gray-300' />
                    ) : (
                      <PendingIcon className='w-6 h-6 text-gray-600' />
                    )}
                  </div>
                  <div className={todo.completed ? 'line-through opacity-40' : ''}>
                    {todo.title}
                  </div>
                </div>
              )}
              <div>
                {todo.id === selectedTodo?.id ? (
                  <>
                    <button
                      onClick={() => setSelectedTodo(undefined)}
                      className='border rounded-full px-6 py-0.5 bg-gray-500 text-white mr-2'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateTodo()}
                      className='border rounded-full px-6 py-0.5 bg-cyan-500 text-white '
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectTodo(todo)}
                      className='border rounded-full px-6 py-0.5 bg-gray-500 text-white mr-2'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className='border rounded-full px-6 py-0.5 bg-red-400 text-white'
                    >
                      Del
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
