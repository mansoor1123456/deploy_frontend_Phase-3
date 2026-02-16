import { Todo, TodoCreate, TodoUpdate, TodoListResponse } from '../shared/types/todo';
import { apiClient } from './api-client';

export const todoApi = {
  async getAllTodos(limit: number = 20, offset: number = 0, status?: 'all' | 'completed' | 'incomplete'): Promise<TodoListResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status && status !== 'all') {
      params.append('status', status);
    }

    return apiClient.get(`/todos?${params.toString()}`);
  },

  async getTodoById(id: string): Promise<Todo> {
    return apiClient.get(`/todos/${id}`);
  },

  async createTodo(todoData: TodoCreate): Promise<Todo> {
    return apiClient.post('/todos', todoData);
  },

  async updateTodo(id: string, todoData: TodoUpdate): Promise<Todo> {
    return apiClient.put(`/todos/${id}`, todoData);
  },

  async deleteTodo(id: string): Promise<void> {
    return apiClient.delete(`/todos/${id}`);
  },
};