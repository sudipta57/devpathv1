'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  type: 'mcq' | 'short';
  options?: string[];
}

interface RoomQuizPanelProps {
  roomId: string;
  isAdmin: boolean;
}

export default function RoomQuizPanel({ roomId, isAdmin }: RoomQuizPanelProps) {
  const [url, setUrl] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Record<number, string>>({});

  const generateQuestions = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/generate-questions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceUrl: url, roomId }),
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setQuestions(data.questions);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-5">
      {isAdmin && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-400">
            Generate quiz from resource
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
              placeholder="Paste YouTube / article URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={generateQuestions}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate questions'}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-green-400">
            ✓ {questions.length} questions — visible to all members
          </p>
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <p className="mb-3 text-sm font-medium text-white">
                Q{i + 1}. {q.question}
              </p>
              {q.type === 'mcq' && q.options ? (
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => setSelected((s) => ({ ...s, [q.id]: opt }))}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        selected[q.id] === opt
                          ? 'border-green-500 bg-green-950 text-green-300'
                          : 'border-gray-700 text-gray-300 hover:border-blue-500 hover:bg-gray-800'
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="Type your answer..."
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!isAdmin && questions.length === 0 && (
        <p className="text-sm text-gray-500">
          Waiting for admin to generate questions...
        </p>
      )}
    </div>
  );
}