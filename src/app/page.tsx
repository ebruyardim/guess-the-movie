'use client'
import { useState } from "react";
import MovieGame from "@/components/MovieGame";
import GenreSelector from "@/components/GenreSelector";
import { Movie } from "@/lib/tmdb/api";

export default function Home() {
  const [gameResult, setGameResult] = useState<{ correct: boolean; movie: Movie } | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [showMobileGenres, setShowMobileGenres] = useState(false);

  const handleGameComplete = (correct: boolean, movie: Movie) => {
    setGameResult({ correct, movie });
  };

  return (
    <main className="h-[calc(100dvh-4rem)] overflow-hidden bg-[#0a174e] dark:bg-[#050c26]">
      <section className="w-full max-w-6xl h-full flex items-stretch gap-6 p-4">
        {/* Genre Selector - Desktop */}
        <div className="hidden lg:block">
          <GenreSelector 
            selectedGenre={selectedGenre} 
            onGenreSelect={setSelectedGenre} 
          />
        </div>
        
        {/* Main Game Area */}
        <div className="bg-white/90 dark:bg-[#133b5c]/80 rounded-3xl shadow-2xl p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
          {/* Mobile Genre Toggle */}
          <div className="lg:hidden mb-4 flex-shrink-0">
            <button
              onClick={() => setShowMobileGenres(!showMobileGenres)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>🎬 {selectedGenre ? 'Change Genre' : 'Select Genre'}</span>
              <span className={`transform transition-transform ${showMobileGenres ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showMobileGenres && (
              <div className="mt-3">
                <GenreSelector 
                  selectedGenre={selectedGenre} 
                  onGenreSelect={(genreId) => {
                    setSelectedGenre(genreId);
                    setShowMobileGenres(false);
                  }} 
                />
              </div>
            )}
          </div>

          <div className="text-center mb-3 flex-shrink-0">
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Test your movie knowledge! Can you identify the movie from this scene?
            </p>
            {selectedGenre && (
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                Filtering by selected genre
              </p>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <MovieGame onGameComplete={handleGameComplete} selectedGenre={selectedGenre} />
          </div>

          {gameResult && (
            <div className="mt-4 text-center flex-shrink-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                gameResult.correct 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
              
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
