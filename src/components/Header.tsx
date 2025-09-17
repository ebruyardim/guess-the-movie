"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const authContext = useAuth();
  const user = authContext?.user;
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAccountClick = () => {
    if (user) {
      router.push("/account");
    } else {
      router.push("/signin");
    }
  };

  return (
    <header className="w-full bg-[#0a174e] dark:bg-[#050c26] text-white shadow-md sticky top-0 z-50 h-16">
      <div className="h-full flex items-center justify-between px-4">
        <Link href="/">
          <span className="text-2xl font-bold tracking-tight select-none">Guess The Movie</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/favorites"
            className="rounded-full px-3 py-2 bg-[#133b5c] hover:bg-[#1e5a99] transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#133b5c]"
          >
            My Favorites
          </Link>
          <button
            className="rounded-full px-3 py-2 bg-[#133b5c] hover:bg-[#1e5a99] transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#133b5c] flex items-center justify-center"
            onClick={handleAccountClick}
            aria-label={user ? "Account" : "Sign In"}
            title={user ? "My Account" : "Account"}
          >
            {user ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25a4.5 4.5 0 00-4.5 4.5v.75a4.5 4.5 0 109 0V6.75A4.5 4.5 0 0012 2.25zm-8.25 15a6.75 6.75 0 0113.5 0v.75a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-.75z" clipRule="evenodd" />
              </svg>
            ) : (
              <span>Account</span>
            )}
          </button>
          <button
            aria-label="Toggle Dark Mode"
            className="rounded-full p-2 bg-[#133b5c] hover:bg-[#1e5a99] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#133b5c]"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.664-7.626 6.398-9.093a.75.75 0 01.908.325.75.75 0 01-.062.954A7.501 7.501 0 0012 19.5c2.485 0 4.712-1.21 6.157-3.09a.75.75 0 01.954-.062.75.75 0 01.325.908z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
