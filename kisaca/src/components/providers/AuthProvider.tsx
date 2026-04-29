"use client";

import { getCurrentUser } from "@/api/auth";
import { clearTokens, getToken } from "@/lib/auth";
import { resetAxiosAuthState } from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  setUser: (u: any) => void;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  isAuthenticated: false,
  loading: true,
  initialized: false,
  logoutUser: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const boot = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const me = await getCurrentUser();
        setUser(me);
      } catch (err) {
        console.error("getCurrentUser failed:", err);
        clearTokens();
        resetAxiosAuthState();
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    boot();
  }, []);

  const logoutUser = () => {
    clearTokens();
    resetAxiosAuthState();
    setUser(null);
    setInitialized(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        initialized,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
