"use client";

import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";

export default function YouTubeAnalyzer() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze video");
      }

      setAnalysis(data.analysis);
      toast.success("Video analyzed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <FaYoutube className="mr-2 text-red-600" />
            YouTube Video Analyzer
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Enter a YouTube video URL to get an AI-powered analysis of its content.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex rounded-md shadow-sm">
              <input
                type="url"
                name="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {analysis && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Analysis Results</h3>
            <div className="mt-2 prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 