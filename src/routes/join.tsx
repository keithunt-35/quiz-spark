import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { joinGame } from "@/lib/game-store";
import { AVATARS } from "@/lib/avatars";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join a Game — QuizBlast" },
      { name: "description", content: "Enter a game PIN and join a live quiz." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    pin: typeof search.pin === "string" || typeof search.pin === "number" ? String(search.pin) : "",
  }),
  component: JoinGame,
});

function JoinGame() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/join" });
  const [pin, setPin] = useState(search.pin || "");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (search.pin) {
      setPin(search.pin);
    }
  }, [search.pin]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = joinGame(pin, nickname, avatar);
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
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
      </header>

      <section className="flex-1 grid lg:grid-cols-2 gap-10 items-center px-6 pb-16 max-w-6xl mx-auto w-full">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05]">
            Join a{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              live game.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Get a game PIN from the host, pick your avatar, and battle for the top spot.
            Every second counts — faster answers earn more points.
          </p>
          <div id="how" className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              { n: "1", t: "Enter PIN", d: "From the host" },
              { n: "2", t: "Pick avatar", d: "Choose your character" },
              { n: "3", t: "Play & win", d: "Fast = more points" },
            ].map((s) => (
              <div key={s.n} className="rounded-xl p-4 bg-card/60 border border-border">
                <div className="size-7 rounded-md bg-primary/30 text-primary-foreground font-bold grid place-items-center text-sm">
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
              className="w-full text-center text-3xl tracking-[0.5em] font-black bg-input text-background rounded-xl py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="w-full bg-input text-background rounded-xl py-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={16}
            />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground">Pick your avatar</span>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAvatar(a.id)}
                  aria-label={a.label}
                  className={`aspect-square rounded-xl text-2xl grid place-items-center transition-all ${
                    avatar === a.id
                      ? "bg-primary ring-4 ring-primary-foreground scale-110"
                      : "bg-secondary hover:bg-secondary/70"
                  }`}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
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
