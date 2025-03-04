"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast.error("Please enter a research topic");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/analyze/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.report);
      toast.success("Research report generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate research report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Research Report Generator</h1>
        <p className="text-gray-600 mb-4">
          Generate comprehensive research reports on any topic using advanced AI analysis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Research Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Impact of Artificial Intelligence on Healthcare"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Report..." : "Generate Research Report"}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Research Report</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
} 