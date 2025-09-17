"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from "@/lib/firebase/config"


interface AuthContextType {
    user: User | null;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
  }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true); 

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

    setUser(user ?? null);
      setLoading(false);
    });

    // useEffect'in cleanup fonksiyonu. Bileşen unmount olduğunda
    // (örneğin başka bir sayfaya geçildiğinde) listener'ı kapatır.
    // Bu, memory leak (hafıza sızıntısı) olmasını engeller.
    return () => unsubscribe();
  }, []); 

  
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};