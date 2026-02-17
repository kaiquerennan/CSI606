"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Admin {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

interface AuthContextType {
  admin: Admin | null;
  login: (admin: Admin) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Recuperar dados do localStorage
    const stored = localStorage.getItem("admin");
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin");
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    // Se não está logado e não está na página de login, redireciona
    if (!admin && pathname !== "/login") {
      router.push("/login");
    }
  }, [admin, pathname, loaded, router]);

  const login = (adminData: Admin) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
    router.push("/");
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    router.push("/login");
  };


  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
