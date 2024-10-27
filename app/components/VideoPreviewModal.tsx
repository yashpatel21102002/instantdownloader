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

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => {
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
    {
      id: "none",
      label: "Original",
      value: "none",
      gradient: "bg-white dark:bg-gray-800",
    },
    {
      id: "grayscale",
      label: "Grayscale",
      value: "grayscale(100%)",
      gradient: "bg-gradient-to-r from-gray-300 to-gray-600",
    },
    {
      id: "sepia",
      label: "Sepia",
      value: "sepia(100%)",
      gradient: "bg-gradient-to-r from-yellow-200 to-amber-600",
    },
    {
      id: "brightness",
      label: "Bright",
      value: "brightness(130%)",
      gradient: "bg-gradient-to-r from-white via-yellow-100 to-white",
    },
    {
      id: "contrast",
      label: "High Contrast",
      value: "contrast(150%)",
      gradient: "bg-gradient-to-r from-black via-gray-600 to-black",
    },
  ];

  const qualities = ["1080p", "720p", "480p", "360p"];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `reel_${Date.now()}.mp4`;
    link.click();
  };

  const formattedUploadDate =
    videoData?.uploadDate || new Date().toISOString().split("T")[0];

  const formatViews = (views?: number) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto min-h-screen">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 w-full max-w-6xl mx-auto my-4 sm:my-8 rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-3 sm:p-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Film className="w-5 h-5" />
            Video Preview
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-6">
          {/* Video Preview Section */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  filter:
                    selectedFilter !== "none"
                      ? filters.find((f) => f.id === selectedFilter)?.value
                      : "none",
                }}
              />
            </div>

            {/* Video Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {[
                { icon: Clock, label: "Duration", value: videoStats.duration },
                {
                  icon: Calendar,
                  label: "Upload Date",
                  value: formattedUploadDate,
                },
                {
                  icon: User,
                  label: "Views",
                  value: formatViews(videoData?.views),
                },
                { icon: Info, label: "Size", value: videoStats.size },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-lg"
                >
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      {label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base text-gray-800 dark:text-white font-semibold truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-6">
            {/* Video Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                Technical Details
              </h4>
              <dl className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {[
                  { label: "Format", value: "MP4" },
                  { label: "Resolution", value: videoStats.resolution },
                  { label: "Selected Quality", value: selectedQuality },
                  {
                    label: "Active Filter",
                    value: filters.find((f) => f.id === selectedFilter)?.label,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">
                      {label}:
                    </dt>
                    <dd className="text-gray-800 dark:text-gray-200">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Quality Selection */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                Quality
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {qualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
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
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                      ${
                        selectedFilter === filter.id
                          ? "text-white ring-2 ring-blue-500"
                          : "text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
                      }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-lg opacity-50 ${filter.gradient}`}
                    />
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 transition-colors mt-auto"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
