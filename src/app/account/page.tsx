"use client";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useAuth();
  const user = authContext?.user;
  const router = useRouter();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a174e] dark:bg-[#050c26]">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white/90 dark:bg-[#133b5c]/80 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              My Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* User Info Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Account Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Created
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.metadata.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Sign In
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.metadata.lastSignInTime ? 
                      new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Account Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing Out...
                    </div>
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                onClick={() => router.push("/")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
