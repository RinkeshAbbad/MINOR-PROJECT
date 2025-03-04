import { FaYoutube, FaTwitter, FaBook } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to AI Hub</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose from our selection of AI-powered tools to enhance your content creation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/youtube"
          className="block bg-white shadow sm:rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FaYoutube className="h-8 w-8 text-red-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">YouTube Video Analyzer</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Get detailed analysis and insights from YouTube videos using AI.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/research"
          className="block bg-white shadow sm:rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FaBook className="h-8 w-8 text-blue-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Research Report Generator</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Generate comprehensive research reports on any topic.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/twitter"
          className="block bg-white shadow sm:rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <FaTwitter className="h-8 w-8 text-blue-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Tweet Generator</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Create engaging tweets with different tones and styles.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
} 