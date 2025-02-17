import { describe, it, expect, vi } from 'vitest';
import { App } from '@/App';
import { fireEvent, render, within } from '@testing-library/react';
import { flushAll } from 'tests/helper';
import { addTodo, deleteTodo, updateTodo, updateTodoSortIndex } from '@/api/todo';
import userEvent from '@testing-library/user-event';
import Sortable from 'sortablejs';

const todos = [
  {
    title: 'todo_item_1',
    completed: false,
    sortIndex: 0,
    id: '66b3098cd230f17da611becb',
  },
  {
    title: 'todo_item_2',
    completed: true,
    sortIndex: 1,
    id: '66b3098dd230f17da611bece',
  },
];

vi.mock(import('@/api/todo'), async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getTodos: vi.fn(() => {
      return { data: todos };
    }),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodo: vi.fn(),
    updateTodoSortIndex: vi.fn(),
  };
});

describe('App.tsx', () => {
  it('初次載入時渲染所有 todos', async () => {
    const { getByText, getByTestId } = render(<App></App>);
    await flushAll();

    const ul = getByTestId('todo_ul');
    [...ul.children].forEach((child, index) => {
      expect(child.textContent).toContain(todos[index].title);
      expect(getByText(todos[index].title)).toBeVisible();
    });
  });

  it('使用正確參數呼叫 API 添加 todo', async () => {
    const user = userEvent.setup();
    const { getByRole, getByPlaceholderText } = render(<App></App>);
    await flushAll();

    const todoData = {
      title: 'todo_item_3',
      completed: false,
    };

    const addBtn = getByRole('button', { name: 'Add' });
    const addTodoInput = getByPlaceholderText('Add todo') as HTMLInputElement;
    await user.type(addTodoInput, todoData.title);
    addBtn.click();

    await flushAll();
    expect(addTodo).toBeCalledWith(todoData);
  });

  it('使用正確參數呼叫 API 刪除 todo', async () => {
    const { getByTestId } = render(<App></App>);
    await flushAll();

    const ul = getByTestId('todo_ul');
    const deleteBtns = within(ul).getAllByText('Del');
    deleteBtns[0].click();

    await flushAll();
    expect(deleteTodo).toBeCalledWith(todos[0].id);
  });

  it('使用正確的參數呼叫 API 更新 todo', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<App></App>);
    await flushAll();

    const ul = getByTestId('todo_ul');
    const firstLi = ul.querySelector('li')!;

    const editBtn = within(firstLi).getByText('Edit');
    editBtn.click();

    await flushAll();

    const saveBtn = within(firstLi).getByText('Save');
    const completedCheckbox = within(firstLi).getByRole('checkbox');
    const titleInput = within(firstLi).getByPlaceholderText('title');
    const newTodoTitle = 'new_todo_item_1';

    await user.clear(titleInput);
    await user.type(titleInput, newTodoTitle);
    await user.click(completedCheckbox);
    saveBtn.click();

    await flushAll();

    expect(updateTodo).toBeCalledWith(todos[0].id, {
      title: newTodoTitle,
      completed: !todos[0].completed,
    });
  });

  it('使用拖拉改變順序後， 使用正確的新排序資料呼叫 API 改變 todos', async () => {
    const { getByTestId } = render(<App></App>);
    await flushAll();

    const ul = getByTestId('todo_ul');
    const todoItems = within(ul).getAllByRole('listitem');
    const sortableInstance = Sortable.get(ul);

    expect(sortableInstance).not.toBeUndefined();

    // 模擬 Sortable onEnd
    //@ts-ignore
    sortableInstance.option('onEnd')({
      oldIndex: 1,
      newIndex: 0,
      item: todoItems[1],
      from: ul,
      to: ul,
      //@ts-ignore
      clone: null,
      pullMode: undefined,
    });

    await flushAll();

    expect(updateTodoSortIndex).toBeCalledWith(
      [todos[1], todos[0]].map((todo, index) => ({ ...todo, sortIndex: index })),
    );
  });
});
