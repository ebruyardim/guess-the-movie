"use client";
import { useState, useEffect } from "react";
import { tmdbService } from "@/lib/tmdb/api";

interface Genre {
  id: number;
  name: string;
}

interface GenreSelectorProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export default function GenreSelector({ selectedGenre, onGenreSelect }: GenreSelectorProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await tmdbService.getGenres();
      setGenres(response.genres);
    } catch (err) {
      setError("Failed to load genres");
      console.error("Error loading genres:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = (genreId: number) => {
    if (selectedGenre === genreId) {
      // If clicking the same genre, deselect it
      onGenreSelect(null);
    } else {
      onGenreSelect(genreId);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-72 bg-white/95 dark:bg-[#133b5c]/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🎭</span>
          Genres
        </h3>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-72 bg-white/95 dark:bg-[#133b5c]/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🎭</span>
          Genres
        </h3>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={loadGenres}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-72 bg-white/95 dark:bg-[#133b5c]/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 flex-shrink-0">
        <span className="text-2xl">🎭</span>
        Genres
      </h3>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
        <div className="space-y-3">
          <button
            onClick={() => onGenreSelect(null)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold transform hover:scale-[1.02] ${
              selectedGenre === null
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-400/50'
                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-gray-200 dark:border-gray-600/30'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🎬</span>
              All Genres
            </span>
          </button>
          
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold transform hover:scale-[1.02] ${
                selectedGenre === genre.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-400/50'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 border border-gray-200 dark:border-gray-600/30'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center flex-shrink-0">
        {genres.length} genres available
      </div>
    </div>
  );
}
