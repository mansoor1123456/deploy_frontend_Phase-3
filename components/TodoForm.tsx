'use client';

import React, { useState } from 'react';
import { TodoCreate } from '../shared/types/todo';
import { todoApi } from '../lib/todo-api';

interface TodoFormProps {
  onTodoCreated?: (todo: any) => void;
  onRefresh?: () => void; // Add refresh callback
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoCreated, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const todoData: TodoCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      // 🔹 Get token from localStorage or cookie
      const token =
        localStorage.getItem('access_token') ||
        document.cookie.split('; ').find(row => row.startsWith('todo_app_token='))?.split('=')[1];

      if (!token) throw new Error('You are not authorized. Please login again.');

      // 🔹 Send Authorization header in POST request
      const response = await fetch('http://127.0.0.1:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail?.message || 'Failed to create todo');
      }

      const newTodo = await response.json();

      setTitle('');
      setDescription('');

      if (onTodoCreated) {
        onTodoCreated(newTodo);
      }

      // Refresh the todo list to show the new todo
      if (onRefresh) {
        onRefresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add a new task</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Create a new todo item to stay organized.</p>
        </div>

        {error && (
          <div className="mt-2 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
              placeholder="Add details about the task..."
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
