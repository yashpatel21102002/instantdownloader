"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import { FiDownload, FiMoon, FiSun } from "react-icons/fi";

const ReelDownloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // Ensure theme is correctly applied after mounting

  useEffect(() => {
    setMounted(true); // Mark as mounted when the component is loaded on the client
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/download",
        { code_or_id_or_url: url },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `content_${Date.now()}.mp4`;
      link.click();

      toast.success("Download successful!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download. Please try again.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If component is not mounted yet, don't render theme-related content to avoid hydration mismatch
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Content Saver Pro
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <form onSubmit={handleDownload} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste content URL here"
                  required
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white border-2 border-transparent rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FiDownload className="mr-2" />
                )}
                {isLoading ? "Processing..." : "Download Content"}
              </button>
            </form>
          </div>
        </div>
        <button
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="mt-8 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {currentTheme === "dark" ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-center"
        theme={currentTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default ReelDownloader;
