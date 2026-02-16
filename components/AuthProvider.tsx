"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Simple token utils
export const getAuthToken = () => localStorage.getItem("todo_app_token");
export const setAuthToken = (token: string) =>
  localStorage.setItem("todo_app_token", token);
export const removeAuthToken = () => localStorage.removeItem("todo_app_token");

interface AuthContextType {
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check token on initial load
  useEffect(() => {
    const token = getAuthToken();
    // Don't set a user initially just because a token exists
    // Let individual pages handle authentication
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail?.message || "Login failed");
      }

      const data = await res.json();
      setAuthToken(data.access_token); // save token in localStorage using correct key

      // 🔹 ADD THIS LINE FOR MIDDLEWARE COOKIE
      document.cookie = `todo_app_token=${data.access_token}; path=/; Secure; SameSite=Lax`;

      setUser({ email, name: email.split("@")[0] }); // set user state
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail?.message || "Registration failed");
      }
      const data = await res.json();
      setAuthToken(data.access_token);
      setUser({ email, name });
      router.replace("/dashboard"); // redirect after register
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.replace("/login"); // redirect after logout
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
