import { describe, it, expect, vi } from 'vitest';
import { App } from '@/App';
import { render } from '@testing-library/react';
import { flushAll } from 'tests/helper';

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
  };
});

describe('App.tsx', () => {
  it('第一次載入畫面，渲染兩個 Todo 項目，SortIndex 在正確位置', async () => {
    const { getByText, getByTestId } = render(<App></App>);
    await flushAll();

    const ul = getByTestId('todo_ul');
    expect(ul.children[0].textContent).contain(todos[0].title);
    expect(ul.children[1].textContent).contain(todos[1].title);

    expect(getByText(todos[0].title)).toBeVisible();
    expect(getByText(todos[1].title)).toBeVisible();
  });
});
