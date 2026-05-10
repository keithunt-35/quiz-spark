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
    function syncSession() {
      const next = loadSession();
      if (next) setSession(next);
    }

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

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
    ? `${window.location.origin}/join?pin=${session.pin}`
    : `https://quizblast/join?pin=${session.pin}`;

  const isHost = session.isHost === true;

  if (isHost) {
    // HOST VIEW
    return (
      <main className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" onClick={() => clearSession()} className="text-sm text-muted-foreground hover:text-foreground">
            ← Cancel
          </Link>
        </div>

        <div
          className="rounded-3xl p-8 text-center border border-border"
          style={{ backgroundImage: "var(--gradient-card)" }}
        >
          <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold">Game created</p>
          <h1 className="text-4xl sm:text-5xl font-black mt-2">{session.quizTitle}</h1>

          <div className="mt-8 grid sm:grid-cols-2 gap-6 items-center justify-items-center">
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-[var(--shadow-pop)]">
                <QRCodeSVG value={joinUrl} size={180} bgColor="#ffffff" fgColor="#1f0a3a" level="M" />
                <p className="mt-2 text-xs font-bold text-background">Scan to join</p>
              </div>
            </div>
            <div>
              <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold mb-2">Share this PIN</p>
              <div className="font-mono font-black text-5xl sm:text-6xl tracking-[0.2em] mb-6 text-primary">
                {session.pin}
              </div>
              <p className="text-muted-foreground text-sm">Give this to players to join</p>
            </div>
          </div>

          <div className="mt-8 bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold mb-2">Players joined</p>
            <p className="text-3xl font-black text-primary">{session.players.length}</p>
            
            {session.players.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 justify-center">
                {session.players.map((p) => {
                  const av = getAvatar(p.avatar);
                  return (
                    <li
                      key={p.id}
                      className="px-3 py-2 rounded-full font-bold text-sm bg-background border border-border flex items-center gap-2"
                    >
                      <span className="text-lg">{av.emoji}</span>
                      {p.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {countdown === null ? (
            <button
              onClick={() => setCountdown(3)}
              className="mt-10 btn-pop btn-pop-active rounded-xl bg-primary text-primary-foreground font-extrabold text-lg px-10 py-4 hover:brightness-110"
            >
              Start game
            </button>
          ) : (
            <div className="mt-10 text-7xl font-black text-primary animate-bounce-in" key={countdown}>
              {countdown === 0 ? "GO!" : countdown}
            </div>
          )}
        </div>
      </main>
    );
  } else {
    // PLAYER VIEW
    return (
      <main className="min-h-screen px-6 py-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="flex items-center justify-between mb-8 w-full absolute top-0 left-0 px-6 py-8">
          <Link to="/" onClick={() => clearSession()} className="text-sm text-muted-foreground hover:text-foreground">
            ← Leave
          </Link>
        </div>

        <div
          className="rounded-3xl p-8 text-center border border-border max-w-md w-full"
          style={{ backgroundImage: "var(--gradient-card)" }}
        >
          <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold">You're in</p>
          <h1 className="text-4xl sm:text-5xl font-black mt-2">{session.quizTitle}</h1>

          <div className="mt-8 space-y-6">
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold mb-2">Your username</p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-4xl">{getAvatar(session.avatar).emoji}</span>
                <p className="text-2xl font-black">{session.nickname}</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold mb-3">Game PIN</p>
              <div className="font-mono font-black text-4xl tracking-[0.2em]">
                {session.pin}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="size-2 bg-primary rounded-full animate-pulse"></div>
              <p className="text-muted-foreground font-semibold">Waiting for host to start...</p>
              <div className="size-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <p className="text-sm text-muted-foreground">Get ready to answer!</p>
          </div>
        </div>
      </main>
    );
  }
}
