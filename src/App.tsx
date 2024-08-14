import './App.css';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  updateTodoSortIndex,
  type Todo,
} from '@/api/todo';
import DoneIcon from './assets/done.svg?react';
import PendingIcon from './assets/pending.svg?react';
import { TodoFilterDropdown } from './todoFilterDropdown';
import Sortable from 'sortablejs';

function App() {
  const [addTodoText, setAddTodoText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const filterOptions = ['All', 'Progress', 'Completed'];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const todoListRef = useRef<HTMLUListElement>(null);
  const sortable = useRef<Sortable>();

  useEffect(() => {
    fetchTodos();
    if (todoListRef.current) {
      sortable.current = new Sortable(todoListRef.current, {});
    }

    return () => {
      if (sortable.current) {
        sortable.current.destroy();
      }
    };
  }, []);

  const handleOnEnd = useCallback(
    (event: Sortable.SortableEvent) => {
      const { oldIndex, newIndex } = event;
      if (oldIndex !== undefined && newIndex !== undefined) {
        let updatedTodos = [...todos];
        const [movedTodo] = updatedTodos.splice(oldIndex, 1);
        updatedTodos.splice(newIndex, 0, movedTodo);

        updatedTodos = updateSortIndex(updatedTodos);
        setTodos(updatedTodos);
        handleSortTodo(updatedTodos);
      }
    },
    [todos],
  );

  useEffect(() => {
    if (sortable.current) {
      sortable.current.option('onEnd', handleOnEnd);
    }
  }, [handleOnEnd]);

  useEffect(() => {
    if (sortable.current) {
      sortable.current.option('disabled', selectedFilter !== 'All');
    }
  }, [selectedFilter]);

  const filteredTodos = useMemo(() => {
    switch (selectedFilter) {
      case 'All':
        return todos;
      case 'Progress':
        return todos.filter((todo) => todo.completed);
      case 'Completed':
        return todos.filter((todo) => !todo.completed);
      default:
        return [];
    }
  }, [todos, selectedFilter]);

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
      await updateTodo(selectedTodo.id, {
        title: selectedTodo.title,
        completed: selectedTodo.completed,
      });
      setSelectedTodo(null);
    } catch (error) {
      console.error('updateTodo err', error);
    }

    fetchTodos();
  }

  async function handleSortTodo(todos: Todo[]) {
    try {
      await updateTodoSortIndex(todos);
    } catch (error) {
      console.error('handleSortTodo err', error);
    }
  }

  function handleSelectTodo(todo: Todo) {
    setSelectedTodo(todo);
  }

  const handleEditTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (selectedTodo) {
      setSelectedTodo({
        ...selectedTodo,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  function handleFilterChange(filter: string) {
    setSelectedFilter(filter);
  }

  function updateSortIndex(todos: Todo[]) {
    return todos.map((todo, index) => ({
      ...todo,
      sortIndex: index,
    }));
  }

  return (
    <>
      <div className='flex min-h-[600px] w-[600px] flex-col rounded-3xl border p-6 shadow-lg'>
        <div>
          <form onSubmit={handleSubmit} className='flex'>
            <input
              className='mr-3 min-h-10 w-full rounded-full border px-5 py-2 focus:outline-none'
              value={addTodoText}
              type='text'
              placeholder='Add todo'
              onChange={(e) => setAddTodoText(e.target.value)}
            />
            <button type='submit' className='rounded-full border bg-gray-500 px-6 text-white'>
              Add
            </button>
          </form>

          <div className='flex justify-end pt-3'>
            <TodoFilterDropdown
              handleFilterChange={handleFilterChange}
              options={filterOptions}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>

        <ul className='flex-grow overflow-y-auto pt-3' ref={todoListRef}>
          {filteredTodos.map((todo, index) => (
            <li
              className={`flex items-center justify-between rounded-full px-5 py-3 ${index % 2 === 0 ? 'bg-gray-100' : ''} ${todo.id === selectedTodo?.id ? 'outline outline-2 outline-gray-300' : ''}`}
              key={todo.id}
            >
              {todo.id === selectedTodo?.id ? (
                <div className='mr-3 flex flex-grow items-center'>
                  <input
                    type='checkbox'
                    name='completed'
                    checked={selectedTodo.completed}
                    onChange={handleEditTodoChange}
                    className='custom-checkbox mr-3 h-6 w-6 accent-cyan-500'
                  ></input>
                  <input
                    name='title'
                    value={selectedTodo.title}
                    onChange={handleEditTodoChange}
                    className='w-full flex-grow rounded-full px-3 py-0.5 outline outline-2 outline-gray-300'
                  ></input>
                </div>
              ) : (
                <div className='flex'>
                  <div className='mr-3 fill-current'>
                    {todo.completed ? (
                      <DoneIcon className='h-6 w-6 text-gray-300' />
                    ) : (
                      <PendingIcon className='h-6 w-6 text-gray-600' />
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
                      onClick={() => setSelectedTodo(null)}
                      className='mr-2 rounded-full border bg-gray-500 px-6 py-0.5 text-white'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateTodo()}
                      className='rounded-full border bg-cyan-500 px-6 py-0.5 text-white'
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectTodo(todo)}
                      className='mr-2 rounded-full border bg-gray-500 px-6 py-0.5 text-white'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className='rounded-full border bg-red-400 px-6 py-0.5 text-white'
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
