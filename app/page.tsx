"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTopic = topic.trim();

    // Reset previous results before starting a new request.
    setQuestions([]);
    setError("");

    if (!trimmedTopic) {
      setError("Please enter a job role, skill, or topic.");
      return;
    }

    setLoading(true);

    try {
      // Call the backend route so the Gemini API key stays on the server.
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: trimmedTopic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate questions.");
      }

      setQuestions(data.questions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            AI Interview Question Generator
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter a role, skill, or topic and generate five focused interview
            questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-800">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="eg: Customer Success Manager, Frontend Developer..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-950 focus:ring-4 focus:ring-gray-950/10 disabled:bg-gray-50"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-950 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </form>

        {loading ? (
          <p className="mt-5 text-center text-sm text-gray-600">
            Generating questions...
          </p>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {questions.length > 0 ? (
          <div className="mt-7">
            <h2 className="mb-3 text-lg font-semibold text-gray-950">
              Generated Questions
            </h2>
            <ol className="list-decimal space-y-3 pl-5 text-gray-800">
              {questions.map((question, index) => (
                <li key={`${question}-${index}`} className="leading-7">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>
    </main>
  );
}
