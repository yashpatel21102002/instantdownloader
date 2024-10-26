"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import {
  FiDownload,
  FiMoon,
  FiSun,
  FiLink,
  FiCheckCircle,
  FiVideo,
} from "react-icons/fi";
import VideoPreviewModal from "./VideoPreviewModal"; // Import the modal component

const ReelDownloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
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
      const videoObjectUrl = window.URL.createObjectURL(blob);
      setVideoUrl(videoObjectUrl);
      setShowModal(true); // Show modal with the video

      toast.success("Download successful!", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } catch {
      toast.error("Failed to download. Please try again.", {
        position: "bottom-center",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-500 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-all duration-300">
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col justify-center items-center px-8 py-16 sm:px-10 lg:px-16">
          <div className="w-full max-w-3xl text-center">
            {" "}
            {/* Increased max width */}
            <h1 className="text-5xl sm:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 dark:from-pink-300 dark:via-purple-400 dark:to-blue-500">
              ReelSaver Pro
            </h1>
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-12">
              Easily download your favorite Instagram Reels in just a few steps!
            </p>
            {/* Download form */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 mb-12">
              <form onSubmit={handleDownload} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Reel URL"
                    required
                    className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:border-pink-500 transition-colors duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-3 text-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-lg hover:from-yellow-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
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
                    <FiDownload className="mr-2 text-white" />
                  )}
                  {isLoading ? "Processing..." : "Download Reel"}
                </button>
              </form>
            </div>
            {/* Steps to Download */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                How to Download
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiLink className="mr-3 text-pink-500" size={24} />
                  <span>
                    1. Copy the URL of the Instagram Reel you want to download.
                  </span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiVideo className="mr-3 text-pink-500" size={24} />
                  <span>2. Paste the URL in the input box above.</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiDownload className="mr-3 text-pink-500" size={24} />
                  <span>
                    3. Click the &quot;Download Reel&quot; button to save the
                    video.
                  </span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCheckCircle className="mr-3 text-pink-500" size={24} />
                  <span>4. Enjoy your downloaded reel!</span>
                </div>
              </div>
            </div>
            {/* Disclaimer Section */}
            <div className="bg-gray-200/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 mb-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Disclaimer
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                ReelSaver Pro is not affiliated, endorsed, or sponsored by
                Instagram. All downloaded content must comply with
                Instagram&apos;s terms of use. We do not store any data or
                content related to downloaded reels. Please ensure you have the
                necessary permissions to download any content.
              </p>
            </div>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </main>

        <Footer />
      </div>

      <ToastContainer
        position="bottom-center"
        theme={theme === "dark" ? "dark" : "light"}
      />

      {/* Video Preview Modal */}
      {showModal && videoUrl && (
        <VideoPreviewModal
          videoUrl={videoUrl}
          onClose={() => setShowModal(false)}
          //onSaveVideo={handleSaveVideo} // Pass save function to modal
        />
      )}
    </div>
  );
};

export default ReelDownloader;
