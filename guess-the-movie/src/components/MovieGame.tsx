"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { tmdbService, Movie } from "@/lib/tmdb/api";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface MovieGameProps {
  onGameComplete?: (correct: boolean, movie: Movie) => void;
  selectedGenre?: number | null;
}

export default function MovieGame({ onGameComplete, selectedGenre }: MovieGameProps) {
  const [movieData, setMovieData] = useState<{ movie: Movie; sceneImage: string; options: Movie[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Movie | null>(null);
  const [error, setError] = useState("");
  const { addFavorite, isFavorite } = useFavorites();
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const scrollableContentRef = useRef<HTMLDivElement | null>(null);
  const resultsBannerRef = useRef<HTMLDivElement | null>(null);

  // Load daily movie
  useEffect(() => {
    loadDailyMovie();
  }, [selectedGenre]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDailyMovie = async () => {
    setIsLoading(true);
    setError("");
    setSelectedAnswer(null);
    setShowResults(false);
    
    try {
      const data = await tmdbService.getRandomMovie(selectedGenre || undefined);
      setMovieData(data);
    } catch (err) {
      setError("Failed to load movie. Please try again.");
      console.error("Error loading movie:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (selectedMovie: Movie) => {
    if (!movieData) return;

    setSelectedAnswer(selectedMovie);
    const isCorrect = selectedMovie.id === movieData.movie.id;
    setShowResults(true);
    
    if (onGameComplete) {
      onGameComplete(isCorrect, movieData.movie);
    }
  };

  // Ensure the results banner is visible by scrolling to top when view changes
  useEffect(() => {
    if (showResults) {
      if (resultsBannerRef.current) {
        resultsBannerRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
    }
  }, [showResults]);

  const handleNewGame = () => {
    setSelectedAnswer(null);
    setShowResults(false);
    loadDailyMovie();
  };

  const handleExploreMore = () => {
    // This could open a new page or modal with more movie information
    window.open(`https://www.themoviedb.org/movie/${movieData?.movie.id}`, '_blank');
  };

  const handleAddFavorite = () => {
    if (!movieData) return;
    if (!user) {
      router.push("/signin");
      return;
    }
    if (!isFavorite(movieData.movie.id)) {
      addFavorite(movieData.movie);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center h-full flex flex-col justify-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadDailyMovie}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!movieData) {
    return null;
  }

  // Create options array with correct answer and 3 wrong answers
  const allOptions = [movieData.movie, ...movieData.options];
  // Shuffle the options
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

  return (
    <div className="h-full min-h-0 flex flex-col space-y-3 sm:space-y-4 overflow-x-hidden">
      {/* Movie Scene Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <Image
          src={movieData.sceneImage}
          alt="Movie scene to guess"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <p className="text-white/90 text-sm">What movie is this scene from?</p>
        </div>
      </div>

      {!showResults ? (
        /* Multiple Choice Options */
        <div ref={scrollableContentRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent flex flex-col">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shuffledOptions.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleAnswerSelect(movie)}
                  className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{movie.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div ref={scrollableContentRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent flex flex-col space-y-3 sm:space-y-4">
          <div ref={resultsBannerRef} className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
              selectedAnswer?.id === movieData.movie.id
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {selectedAnswer?.id === movieData.movie.id ? '🎉 Correct!' : '❌ Wrong guess'}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
              {movieData.movie.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-center text-sm">
              {movieData.movie.release_date ? new Date(movieData.movie.release_date).getFullYear() : 'Unknown Year'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {movieData.movie.overview}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExploreMore}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] text-sm"
            >
              Explore More
            </button>
            {user && (
              <button
                onClick={handleAddFavorite}
                disabled={!movieData || isFavorite(movieData.movie.id)}
                className={`flex-1 flex items-center justify-center gap-2 border border-red-400 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold py-2 px-4 rounded-xl transition-all duration-200 ${isFavorite(movieData.movie.id) ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                aria-label={isFavorite(movieData.movie.id) ? 'Added to favorites' : 'Add to favorites'}
                title={isFavorite(movieData.movie.id) ? 'Added to favorites' : 'Add to favorites'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(movieData.movie.id) ? 'currentColor' : 'none'} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {isFavorite(movieData.movie.id) ? 'Favorited' : 'Add Favorite'}
              </button>
            )}
            <button
              onClick={handleNewGame}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] text-sm"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
