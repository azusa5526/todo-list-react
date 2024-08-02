import axiosInstance from './interceptor';

export interface Todo {
  id: string;
  completed: boolean;
  title: string;
}

export type TodoData = Omit<Todo, 'id'>;

export function getTodos() {
  return axiosInstance({ url: '/todos', method: 'GET' });
}

export function addTodo(data: TodoData) {
  return axiosInstance({ url: `/todos`, method: 'POST', data });
}

export function updateTodo(id: string, data: TodoData) {
  return axiosInstance({ url: `/todos/${id}`, method: 'PUT', data });
}

export function deleteTodo(id: string) {
  return axiosInstance({ url: `/todos/${id}`, method: 'DELETE' });
}
