import ReelDownloader from "./components/ReelDownloader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Reel Downloader | Download Instagram Reels Easily",
  description:
    "Download Instagram Reels quickly and easily with our free online tool. No registration required.",
  keywords: "Instagram, Reel, Downloader, Video, Social Media",
};

export default function Home() {
  return <ReelDownloader />;
}
