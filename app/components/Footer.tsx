import React from "react";
import { FiGithub, FiTwitter } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0 text-center sm:text-left">
            © {new Date().getFullYear()} Content Saver Pro. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <a
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FiTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
