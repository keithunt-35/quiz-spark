import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadSession, clearSession, type Player } from "@/lib/game-store";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Results — QuizBlast" }] }),
  component: Results,
});

function Results() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      navigate({ to: "/" });
      return;
    }
    setPlayers([...s.players].sort((a, b) => b.score - a.score));
    setTitle(s.quizTitle);
  }, [navigate]);

  if (!players) return null;
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = ["h-32", "h-44", "h-24"];
  const places = [2, 1, 3];

  return (
    <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <p className="uppercase tracking-widest text-xs text-muted-foreground font-bold">Final results</p>
        <h1 className="text-4xl sm:text-5xl font-black mt-2">{title}</h1>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 items-end mb-8">
        {podiumOrder.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center">
            <div
              className={`w-full rounded-t-2xl ${heights[i]} grid place-items-center text-center px-2`}
              style={{ backgroundImage: "var(--gradient-card)", border: "1px solid var(--color-border)" }}
            >
              <div>
                <div className="text-2xl">{["🥈", "🥇", "🥉"][i]}</div>
                <div className="font-extrabold truncate max-w-[10rem]">{p.name}</div>
                <div className="font-mono text-sm text-muted-foreground">{p.score} pts</div>
              </div>
            </div>
            <div className="w-full text-center font-black py-2 bg-primary text-primary-foreground rounded-b-xl">
              {places[i]}
            </div>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <ol className="space-y-2 mb-8">
          {rest.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border border-border ${
                p.isYou ? "bg-primary/20" : "bg-card/60"
              }`}
            >
              <span className="font-black w-6 text-muted-foreground">{i + 4}</span>
              <span className="flex-1 font-bold">{p.name}{p.isYou && " (you)"}</span>
              <span className="font-mono font-bold">{p.score}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="flex gap-3">
        <Link
          to="/"
          onClick={() => clearSession()}
          className="flex-1 text-center btn-pop btn-pop-active rounded-xl bg-primary text-primary-foreground font-extrabold py-4 hover:brightness-110"
        >
          Play again
        </Link>
      </div>
    </main>
  );
}
