import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createSession } from "@/lib/game-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuizBlast — Live Multiplayer Quiz" },
      { name: "description", content: "Join a live quiz with a game PIN. Answer fast, climb the leaderboard." },
      { property: "og:title", content: "QuizBlast — Live Multiplayer Quiz" },
      { property: "og:description", content: "Join a live quiz with a game PIN." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = createSession(pin, nickname);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    navigate({ to: "/lobby" });
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black shadow-[var(--shadow-pop)]">
            Q!
          </div>
          <span className="font-extrabold text-xl tracking-tight">QuizBlast</span>
        </Link>
        <a
          href="#how"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          How it works
        </a>
      </header>

      <section className="flex-1 grid lg:grid-cols-2 gap-10 items-center px-6 pb-16 max-w-6xl mx-auto w-full">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05]">
            Play live quizzes.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              Climb the board.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Enter a game PIN, pick a nickname, and battle for the top spot. Every second
            counts — faster answers earn more points.
          </p>
          <div id="how" className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              { n: "1", t: "Enter PIN", d: "Try 123456 or 654321" },
              { n: "2", t: "Pick name", d: "Your alias on the board" },
              { n: "3", t: "Play & win", d: "Fast = more points" },
            ].map((s) => (
              <div key={s.n} className="rounded-xl p-4 bg-card/60 border border-border">
                <div className="size-7 rounded-md bg-primary/20 text-primary font-bold grid place-items-center text-sm">
                  {s.n}
                </div>
                <div className="mt-2 font-bold">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleJoin}
          className="rounded-3xl p-6 sm:p-8 border border-border space-y-4"
          style={{ backgroundImage: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
        >
          <h2 className="text-2xl font-extrabold">Join a game</h2>
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-semibold text-muted-foreground">
              Game PIN
            </label>
            <input
              id="pin"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="123456"
              className="w-full text-center text-3xl tracking-[0.5em] font-black bg-input rounded-xl py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={8}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">
              Nickname
            </label>
            <input
              id="name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. RocketRabbit"
              className="w-full bg-input rounded-xl py-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={16}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full btn-pop btn-pop-active rounded-xl bg-primary text-primary-foreground font-extrabold text-lg py-4 hover:brightness-110"
          >
            Enter game →
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Demo PINs: <span className="font-semibold text-foreground">123456</span> · <span className="font-semibold text-foreground">654321</span>
          </p>
        </form>
      </section>
    </main>
  );
}
