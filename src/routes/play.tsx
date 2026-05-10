import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadSession, saveSession, scoreAnswer, type Player } from "@/lib/game-store";
import { findQuizByPin } from "@/lib/quiz-data";
import { getAvatar } from "@/lib/avatars";

export const Route = createFileRoute("/play")({
  head: () => ({ meta: [{ title: "Playing — QuizSpark" }] }),
  component: Play,
});

const COLORS = [
  { bg: "bg-quiz-red", fg: "text-quiz-red-foreground", shape: "▲" },
  { bg: "bg-quiz-blue", fg: "text-quiz-blue-foreground", shape: "◆" },
  { bg: "bg-quiz-yellow", fg: "text-quiz-yellow-foreground", shape: "●" },
  { bg: "bg-quiz-green", fg: "text-quiz-green-foreground", shape: "■" },
];

// question -> reveal (show correct answer) -> scoreboard-intro (animation) -> interlude (leaderboard)
type Phase = "question" | "reveal" | "scoreboard-intro" | "interlude";

function Play() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => loadSession());
  const quiz = useMemo(() => (session ? findQuizByPin(session.pin) : undefined), [session]);
  const question = quiz?.questions[session?.questionIndex ?? 0];

  const [timeLeft, setTimeLeft] = useState(question?.timeLimit ?? 15);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session || !quiz) {
      navigate({ to: "/" });
    }
  }, [session, quiz, navigate]);

  useEffect(() => {
    function syncSession() {
      const next = loadSession();
      if (next) setSession(next);
    }

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  // Reset on question change
  useEffect(() => {
    if (!question) return;
    setTimeLeft(question.timeLimit);
    setSelected(null);
    setPhase("question");
  }, [question?.id]);

  // Timer — runs the full duration so players can see countdown after picking
  useEffect(() => {
    if (phase !== "question" || !question) return;
    if (timeLeft <= 0) {
      finalize();
      return;
    }
    tickRef.current = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, [timeLeft, phase, question]);

  function handlePick(i: number) {
    if (phase !== "question" || selected !== null) return;
    setSelected(i);
    // Don't reveal yet — wait for the timer to run out.
  }

  function finalize() {
    if (!session || !question) return;
    const correctIdx = question.correctIndex;
    const youCorrect = selected !== null && selected === correctIdx;
    const youGained = youCorrect ? scoreAnswer(timeLeft, question.timeLimit) : 0;

    const updatedPlayers: Player[] = session.players.map((p) => {
      if (p.isYou) {
        return { ...p, score: p.score + youGained, lastDelta: youGained, lastCorrect: youCorrect };
      }
      // Bots: 65% chance correct, simulate random answer time
      const correct = Math.random() < 0.65;
      const simTimeLeft = correct ? Math.random() * question.timeLimit : 0;
      const delta = correct ? scoreAnswer(simTimeLeft, question.timeLimit) : 0;
      return { ...p, score: p.score + delta, lastDelta: delta, lastCorrect: correct };
    });
    const next = { ...session, players: updatedPlayers };
    saveSession(next);
    setSession(next);
    setPhase("reveal");
    // After reveal, play scoreboard intro animation, then show leaderboard.
    window.setTimeout(() => setPhase("scoreboard-intro"), 2500);
    window.setTimeout(() => setPhase("interlude"), 4200);
  }

  function nextQuestion() {
    if (!session || !quiz) return;
    const nextIndex = session.questionIndex + 1;
    if (nextIndex >= quiz.questions.length) {
      navigate({ to: "/results" });
      return;
    }
    const next = { ...session, questionIndex: nextIndex };
    saveSession(next);
    setSession(next);
  }

  if (!session || !quiz || !question) return null;

  const total = quiz.questions.length;
  const idx = session.questionIndex;
  const correctIdx = question.correctIndex;
  const you = session.players.find((p) => p.isYou);
  const youGained = you?.lastDelta ?? 0;
  const wasCorrect = !!you?.lastCorrect;
  const reveal = phase === "reveal" || phase === "scoreboard-intro";

  return (
    <main className="min-h-screen px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="font-bold">
          Q{idx + 1}<span className="text-muted-foreground"> / {total}</span>
        </div>
        <div className="text-muted-foreground">{session.quizTitle}</div>
        <div className="font-mono font-bold">{you?.score ?? 0} pts</div>
      </div>

      {phase === "scoreboard-intro" ? (
        <div className="flex-1 grid place-items-center text-center py-20">
          <div>
            <div className="text-7xl animate-wiggle inline-block">🏆</div>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black animate-bounce-in">
              Scoreboard incoming...
            </h2>
          </div>
        </div>
      ) : phase === "interlude" ? (
        <Leaderboard players={session.players} onNext={nextQuestion} isLast={idx + 1 >= total} />
      ) : (
        <>
          {/* Question card */}
          <div
            className="rounded-3xl p-6 sm:p-10 text-center border border-border"
            style={{ backgroundImage: "var(--gradient-card)" }}
          >
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">{question.prompt}</h1>
            <div className="mt-6 flex items-center justify-center gap-6">
              <TimerRing timeLeft={timeLeft} total={question.timeLimit} />
              {selected !== null && phase === "question" && (
                <div className="text-lg font-bold text-muted-foreground animate-pop-up">
                  Locked in! Waiting for others...
                </div>
              )}
              {reveal && (
                <div className={`text-2xl font-black animate-bounce-in ${wasCorrect ? "text-success" : "text-destructive"}`}>
                  {wasCorrect ? `+${youGained}` : selected === null ? "Time's up!" : "Wrong!"}
                </div>
              )}
            </div>
          </div>

          {/* Answer grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((opt, i) => {
              const c = COLORS[i % COLORS.length];
              const isPicked = selected === i;
              const isCorrect = i === correctIdx;
              const dim = reveal && !isCorrect && !isPicked;
              const wrong = reveal && isPicked && !isCorrect;
              return (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  disabled={phase !== "question" || selected !== null}
                  className={`btn-pop btn-pop-active ${c.bg} ${c.fg} rounded-2xl p-5 sm:p-6 text-left font-extrabold text-lg sm:text-xl flex items-center gap-4 transition-all ${
                    dim ? "opacity-30" : ""
                  } ${reveal && isCorrect ? "ring-4 ring-success scale-[1.02]" : ""} ${
                    wrong ? "ring-4 ring-destructive" : ""
                  } ${isPicked && phase === "question" ? "ring-4 ring-primary-foreground" : ""} disabled:cursor-not-allowed`}
                >
                  <span className="text-2xl sm:text-3xl">{c.shape}</span>
                  <span className="flex-1">{opt}</span>
                  {reveal && isCorrect && <span>✓</span>}
                  {wrong && <span>✗</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = Math.max(0, Math.min(1, timeLeft / total));
  const deg = pct * 360;
  return (
    <div
      className="size-20 rounded-full grid place-items-center font-black text-2xl"
      style={{
        background: `conic-gradient(var(--color-primary) ${deg}deg, var(--color-muted) ${deg}deg)`,
      }}
      aria-label={`${timeLeft} seconds left`}
    >
      <div className="size-16 rounded-full bg-card grid place-items-center">{timeLeft}</div>
    </div>
  );
}

function Leaderboard({
  players,
  onNext,
  isLast,
}: {
  players: Player[];
  onNext: () => void;
  isLast: boolean;
}) {
  const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, 5);
  return (
    <div
      className="rounded-3xl p-6 sm:p-8 border border-border animate-pop-up"
      style={{ backgroundImage: "var(--gradient-card)" }}
    >
      <h2 className="text-2xl font-black mb-4">Leaderboard</h2>
      <ol className="space-y-2">
        {sorted.map((p, i) => {
          const av = getAvatar(p.avatar);
          return (
            <li
              key={p.id}
              style={{ animationDelay: `${i * 120}ms` }}
              className={`animate-pop-up flex items-center gap-3 rounded-xl px-4 py-3 ${
                p.isYou ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <span className="font-black w-6">{i + 1}</span>
              <span className="text-2xl">{av.emoji}</span>
              <span className="flex-1 font-bold truncate">{p.name}{p.isYou && " (you)"}</span>
              {typeof p.lastDelta === "number" && p.lastDelta > 0 && (
                <span className="text-xs font-bold opacity-70">+{p.lastDelta}</span>
              )}
              <span className="font-mono font-extrabold">{p.score}</span>
            </li>
          );
        })}
      </ol>
      <button
        onClick={onNext}
        className="mt-6 w-full btn-pop btn-pop-active rounded-xl bg-primary text-primary-foreground font-extrabold text-lg py-4 hover:brightness-110"
      >
        {isLast ? "See final results →" : "Next question →"}
      </button>
    </div>
  );
}
