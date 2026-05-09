import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createCustomGame } from "@/lib/game-store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Game — QuizBlast" },
      { name: "description", content: "Create a live quiz and challenge your friends." },
    ],
  }),
  component: CreateGame,
});

type Question = {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  timeLimit: number;
};

const OPTION_COLORS = [
  { label: "A", color: "bg-quiz-red", label_text: "Red" },
  { label: "B", color: "bg-quiz-blue", label_text: "Blue" },
  { label: "C", color: "bg-quiz-yellow", label_text: "Yellow" },
  { label: "D", color: "bg-quiz-green", label_text: "Green" },
] as const;

function CreateGame() {
  const navigate = useNavigate();
  const [gameTitle, setGameTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      prompt: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      timeLimit: 15,
    },
  ]);
  const [editingIndex, setEditingIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const question = questions[editingIndex];

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        id: `q${questions.length + 1}`,
        prompt: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        timeLimit: 15,
      },
    ]);
    setEditingIndex(questions.length);
  }

  function removeQuestion(idx: number) {
    if (questions.length === 1) {
      setError("You need at least one question");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
    setEditingIndex(Math.min(idx, questions.length - 2));
  }

  function updateQuestion(updates: Partial<Question>) {
    const updated = [...questions];
    updated[editingIndex] = { ...question, ...updates };
    setQuestions(updated);
  }

  function handleCreateGame() {
    setError(null);

    // Validation
    if (!gameTitle.trim()) {
      setError("Please enter a game title");
      return;
    }

    for (const q of questions) {
      if (!q.prompt.trim()) {
        setError("All questions must have a prompt");
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        setError("All options must be filled in");
        return;
      }
      if (q.timeLimit < 5 || q.timeLimit > 60) {
        setError("Time limit must be between 5 and 60 seconds");
        return;
      }
    }

    const result = createCustomGame(gameTitle, questions);
    if ("error" in result) {
      setError(result.error);
      return;
    }

    navigate({ to: "/lobby" });
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/50">
      <header className="px-6 py-5 flex items-center justify-between border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black shadow-[var(--shadow-pop)]">
            Q!
          </div>
          <span className="font-extrabold text-xl tracking-tight">QuizBlast</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
      </header>

      <section className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          {/* Game Title */}
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold">
              Game Title
            </label>
            <input
              id="title"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              placeholder="e.g. Science Trivia, Geography Quiz"
              className="w-full bg-input text-foreground rounded-xl py-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">{gameTitle.length}/50 characters</p>
          </div>

          {/* Questions List & Editor */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Questions Sidebar */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-sm font-semibold">Questions ({questions.length})</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setEditingIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                      editingIndex === idx
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-card border border-border hover:bg-card/80"
                    }`}
                  >
                    <div className="font-semibold">Q{idx + 1}</div>
                    <div className="text-xs mt-1 line-clamp-2 opacity-75">
                      {q.prompt || "(No question yet)"}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={addQuestion}
                className="w-full py-2 px-3 rounded-lg bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
              >
                + Add Question
              </button>
            </div>

            {/* Question Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold">Question {editingIndex + 1}</h2>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(editingIndex)}
                      className="text-xs px-3 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Question Prompt */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Question</label>
                  <textarea
                    value={question.prompt}
                    onChange={(e) => updateQuestion({ prompt: e.target.value })}
                    placeholder="What is the largest planet in our solar system?"
                    className="w-full bg-input text-foreground rounded-lg py-2 px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    rows={2}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">{question.prompt.length}/200 characters</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">Answer Options</label>
                  <div className="space-y-2">
                    {question.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`size-10 rounded-lg ${OPTION_COLORS[i].color} grid place-items-center font-bold text-white flex-shrink-0`}>
                          {OPTION_COLORS[i].label}
                        </div>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...question.options] as [string, string, string, string];
                            newOptions[i] = e.target.value;
                            updateQuestion({ options: newOptions });
                          }}
                          placeholder={`Option ${OPTION_COLORS[i].label}`}
                          className="flex-1 bg-input text-foreground rounded-lg py-2 px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          maxLength={50}
                        />
                        <button
                          type="button"
                          onClick={() => updateQuestion({ correctIndex: i as 0 | 1 | 2 | 3 })}
                          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                            question.correctIndex === i
                              ? "bg-green-500/20 text-green-600 border border-green-500/50"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {question.correctIndex === i ? "✓ Correct" : "Mark"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Time Limit</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={question.timeLimit}
                      onChange={(e) => updateQuestion({ timeLimit: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <div className="text-right">
                      <div className="font-bold text-lg">{question.timeLimit}s</div>
                      <div className="text-xs text-muted-foreground">seconds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {error && <div className="text-sm text-destructive font-medium flex-1">{error}</div>}
                <button
                  onClick={handleCreateGame}
                  disabled={!gameTitle.trim()}
                  className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-extrabold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Create Game & Get PIN →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
