'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import TodoList from '../../components/TodoList';
import TodoForm from '../../components/TodoForm';
import AIChat from '../../components/AIChat';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'ai'

  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };


  useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Show loading while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // At this point, loading is false but user might still be null if not authenticated
  // The useEffect will handle redirecting to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

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
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-0 sm:ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                My Tasks
              </h1>
            </div>

            {/* Tab navigation */}
            <div className="mt-4 sm:mt-0">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`${
                      activeTab === 'tasks'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`${
                      activeTab === 'ai'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                  >
                    AI Assistant
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Conditional rendering based on active tab */}
          {activeTab === 'tasks' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TodoList refreshTrigger={refreshTrigger} />
              </div>
              <div>
                <TodoForm onRefresh={handleRefresh} />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
               {/* @ts-ignore */}
               <AIChat userId={user.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
