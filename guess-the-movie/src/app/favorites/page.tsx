"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const auth = useAuth();
  const user = auth?.user;

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a174e] dark:bg-[#050c26]">
        <div className="bg-white/90 dark:bg-[#133b5c]/80 rounded-3xl shadow-2xl p-8 mx-4 max-w-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Sign in to view and manage your favorite movies.</p>
          <Link href="/signin" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#0a174e] dark:bg-[#050c26] overflow-auto">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">My Favorites</h1>
        {favorites.length === 0 ? (
          <div className="bg-white/90 dark:bg-[#133b5c]/80 rounded-2xl p-6 text-center">
            <p className="text-gray-700 dark:text-gray-200">No favorites yet. Play and add some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Details
                    </a>
                    <button
                      onClick={() => removeFavorite(movie.id)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


