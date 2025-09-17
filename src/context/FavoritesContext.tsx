"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Movie } from "@/lib/tmdb/api";
import { useAuth } from "@/context/AuthContext";

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const userId = auth?.user?.uid ?? "guest";
  const storageKey = useMemo(() => `favorites:${userId}`, [userId]);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setFavorites(JSON.parse(raw));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      // ignore persistence errors
    }
  }, [favorites, storageKey]);

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((movieId: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.some((m) => m.id === movieId);
  }, [favorites]);

  const value = useMemo(() => ({ favorites, addFavorite, removeFavorite, isFavorite }), [favorites, addFavorite, removeFavorite, isFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (ctx === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}


