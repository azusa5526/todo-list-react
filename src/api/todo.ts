import axiosInstance from './interceptor';

export interface Todo {
  id: string;
  completed: boolean;
  title: string;
  sortIndex?: number;
}

export type TodoData = Omit<Todo, 'id'>;

export function getTodos() {
  return axiosInstance.get('/todos');
}

export function addTodo(data: TodoData) {
  return axiosInstance.post('/todos', data);
}

export function updateTodo(id: string, data: TodoData) {
  return axiosInstance.put(`/todos/${id}`, data);
}

export function deleteTodo(id: string) {
  return axiosInstance.delete(`/todos/${id}`);
}

export function updateTodoSortIndex(data: Todo[]) {
  return axiosInstance.patch('/todos/sortIndex', data);
}
