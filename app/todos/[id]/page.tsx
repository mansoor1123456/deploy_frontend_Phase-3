'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import { todoApi } from '../../../lib/todo-api';
import { Todo } from '../../../shared/types/todo';

const TodoDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadTodo();
    }
  }, [user, authLoading, router, id]);

  const loadTodo = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const fetchedTodo = await todoApi.getTodoById(id as string);
      setTodo(fetchedTodo);
    } catch (err: any) {
      setError(err.message || 'Failed to load todo');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Todo not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Welcome, {user?.name}</span>
                  <button
                    onClick={() => {
                      // Add logout functionality here
                    }}
                    className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Todo Details</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <h2 className={`ml-3 text-xl font-bold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {todo.title}
                </h2>
              </div>

              {todo.description && (
                <div className="mt-4">
                  <p className="text-gray-700">{todo.description}</p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500">Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(todo.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoDetailPage;