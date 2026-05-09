import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { loadSession, clearSession } from "@/lib/game-store";
import { getAvatar } from "@/lib/avatars";

export const Route = createFileRoute("/lobby")({
  head: () => ({ meta: [{ title: "Lobby — QuizBlast" }] }),
  component: Lobby,
});

function Lobby() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => loadSession());
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      navigate({ to: "/" });
      return;
    }
    setSession(s);
  }, [navigate]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      navigate({ to: "/play" });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  if (!session) return null;

  const joinUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?pin=${session.pin}`
    : `https://quizblast/?pin=${session.pin}`;

  return (
    <main className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" onClick={() => clearSession()} className="text-sm text-muted-foreground hover:text-foreground">
          ← Leave
        </Link>
      </div>

      <div
        className="rounded-3xl p-8 text-center border border-border"
        style={{ backgroundImage: "var(--gradient-card)" }}
      >
        <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold">You're in</p>
        <h1 className="text-4xl sm:text-5xl font-black mt-2">{session.quizTitle}</h1>

        <div className="mt-6 grid sm:grid-cols-2 gap-6 items-center justify-items-center">
          <div className="bg-white rounded-2xl p-4 shadow-[var(--shadow-pop)]">
            <QRCodeSVG value={joinUrl} size={180} bgColor="#ffffff" fgColor="#1f0a3a" level="M" />
            <p className="mt-2 text-xs font-bold text-background">Scan to join</p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold">Game PIN</p>
            <div className="font-mono font-black text-5xl sm:text-6xl tracking-[0.2em] mt-1">
              {session.pin}
            </div>
          </div>
        </div>

        <p className="mt-8 text-muted-foreground">
          <span className="text-foreground font-semibold">{session.players.length}</span> players ready
        </p>

        <ul className="mt-4 flex flex-wrap gap-2 justify-center">
          {session.players.map((p) => {
            const av = getAvatar(p.avatar);
            return (
              <li
                key={p.id}
                className={`px-3 py-2 rounded-full font-bold text-sm border flex items-center gap-2 animate-bounce-in ${
                  p.isYou
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground border-border"
                }`}
              >
                <span className="text-xl">{av.emoji}</span>
                {p.name}
                {p.isYou && " (you)"}
              </li>
            );
          })}
        </ul>

        {countdown === null ? (
          <button
            onClick={() => setCountdown(3)}
            className="mt-10 btn-pop btn-pop-active rounded-xl bg-primary text-primary-foreground font-extrabold text-lg px-10 py-4 hover:brightness-110"
          >
            Start game
          </button>
        ) : (
          <div className="mt-10 text-7xl font-black text-primary-foreground animate-bounce-in" key={countdown}>
            {countdown === 0 ? "GO!" : countdown}
          </div>
        )}
      </div>
    </main>
  );
}
