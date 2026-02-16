"use client";

import React, { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect will happen via useEffect
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-white to-teal-500 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">
          <span className="block xl:inline">Todo</span>{" "}
          <span className="block text-indigo-600 xl:inline">App</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 drop-shadow-md">
          Stay organized and boost your productivity with our simple and elegant
          todo management application.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 md:px-10 md:py-4 text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 md:px-10 md:py-4 text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 border-2 border-black hover:bg-indigo-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
