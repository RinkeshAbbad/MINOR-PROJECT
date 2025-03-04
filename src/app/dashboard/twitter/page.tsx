"use client";

import { useState } from "react";
import { FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";

export default function TweetGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [tweets, setTweets] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze/twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tweets");
      }

      setTweets(data.tweets);
      toast.success("Tweets generated successfully!");
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
            <FaTwitter className="mr-2 text-blue-400" />
            Tweet Generator
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Enter a topic and select a tone to generate engaging tweets.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic or Context
              </label>
              <textarea
                id="topic"
                name="topic"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What would you like to tweet about?"
                required
              />
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                name="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Generating..." : "Generate Tweets"}
            </button>
          </form>
        </div>
      </div>

      {tweets.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Generated Tweets</h3>
            <div className="mt-4 space-y-4">
              {tweets.map((tweet, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-900">{tweet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 