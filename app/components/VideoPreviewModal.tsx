import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Settings,
  Info,
  Film,
  Clock,
  Calendar,
  User,
} from "lucide-react";

interface VideoPreviewModalProps {
  videoUrl: string;
  onClose: () => void;
  videoData?: {
    duration?: string;
    uploadDate?: string;
    views?: number;
    size?: number;
    format?: string;
    resolution?: string;
  };
}

const VideoPreviewModal = ({
  videoUrl,
  onClose,
  videoData,
}: VideoPreviewModalProps) => {
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStats, setVideoStats] = useState({
    duration: "00:00",
    size: "0 MB",
    resolution: "0x0",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Get video metadata when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => {
        // Format duration
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const formattedDuration = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        setVideoStats((prev) => ({
          ...prev,
          duration: formattedDuration,
          resolution: `${video.videoWidth}x${video.videoHeight}`,
        }));
      };
    }
  }, [videoUrl]);

  // Calculate file size from blob
  useEffect(() => {
    const getFileSize = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const sizeInMB = (blob.size / (1024 * 1024)).toFixed(1);
        setVideoStats((prev) => ({
          ...prev,
          size: `${sizeInMB} MB`,
        }));
      } catch (error) {
        console.error("Error getting file size:", error);
      }
    };
    getFileSize();
  }, [videoUrl]);

  const filters = [
    { id: "none", label: "Original", value: "none" },
    { id: "grayscale", label: "Grayscale", value: "grayscale(100%)" },
    { id: "sepia", label: "Sepia", value: "sepia(100%)" },
    { id: "brightness", label: "Bright", value: "brightness(130%)" },
    { id: "contrast", label: "High Contrast", value: "contrast(150%)" },
  ];

  const qualities = ["1080p", "720p", "480p", "360p"];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `reel_${Date.now()}.mp4`;
    link.click();
  };

  // Format current date for upload date if not provided
  const formattedUploadDate =
    videoData?.uploadDate || new Date().toISOString().split("T")[0];

  // Format views with K/M suffix
  const formatViews = (views?: number) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl mx-auto overflow-hidden"
      >
        <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Film className="w-5 h-5" />
            Video Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Video Preview Section - Made more compact */}
          <div className="lg:w-2/3">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full max-h-[60vh] object-contain"
                style={{
                  filter:
                    selectedFilter !== "none"
                      ? filters.find((f) => f.id === selectedFilter)?.value
                      : "none",
                }}
              />
            </div>

            {/* Video Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <p className="mt-1 text-gray-800 dark:text-white font-semibold">
                  {videoStats.duration}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Date</span>
                </div>
                <p className="mt-1 text-gray-800 dark:text-white font-semibold">
                  {formattedUploadDate}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Views</span>
                </div>
                <p className="mt-1 text-gray-800 dark:text-white font-semibold">
                  {formatViews(videoData?.views)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">Size</span>
                </div>
                <p className="mt-1 text-gray-800 dark:text-white font-semibold">
                  {videoStats.size}
                </p>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:w-1/3 space-y-6">
            {/* Video Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Technical Details
              </h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Format:</dt>
                  <dd className="text-gray-800 dark:text-gray-200">MP4</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Resolution:
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {videoStats.resolution}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Selected Quality:
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {selectedQuality}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Active Filter:
                  </dt>
                  <dd className="text-gray-800 dark:text-gray-200">
                    {filters.find((f) => f.id === selectedFilter)?.label}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quality Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quality
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {qualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        selectedQuality === quality
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Filters
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        selectedFilter === filter.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
