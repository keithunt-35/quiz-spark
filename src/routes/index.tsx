import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuizBlast — Live Multiplayer Quiz" },
      { name: "description", content: "Create or join a live quiz. Answer fast, climb the leaderboard." },
      { property: "og:title", content: "QuizBlast — Live Multiplayer Quiz" },
      { property: "og:description", content: "Create or join a live quiz." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-black shadow-[var(--shadow-pop)]">
            Q!
          </div>
          <span className="font-extrabold text-xl tracking-tight">QuizBlast</span>
        </Link>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="space-y-12 max-w-4xl w-full">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.05]">
              Live Quizzes.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                Real Time.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Create a quiz and challenge your friends, or join a game and compete on the leaderboard.
              Fast answers earn more points.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Create a Game Card */}
            <button
              onClick={() => navigate({ to: "/create" })}
              className="group rounded-3xl p-8 border border-border overflow-hidden transition-all hover:border-primary hover:shadow-xl"
              style={{ backgroundImage: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
            >
              <div className="space-y-4">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white grid place-items-center font-black text-2xl group-hover:scale-110 transition-transform">
                  +
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-left">Create a Game</h2>
                  <p className="text-muted-foreground text-sm mt-2 text-left">
                    Set up your questions, get a PIN, and invite players. You control the pace.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Get started</span>
                  <span>→</span>
                </div>
              </div>
            </button>

            {/* Join a Game Card */}
            <button
              onClick={() => navigate({ to: "/join", search: { pin: "" } })}
              className="group rounded-3xl p-8 border border-border overflow-hidden transition-all hover:border-primary hover:shadow-xl"
              style={{ backgroundImage: "var(--gradient-card)", boxShadow: "var(--shadow-glow)" }}
            >
              <div className="space-y-4">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white grid place-items-center font-black text-2xl group-hover:scale-110 transition-transform">
                  ✓
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-left">Join a Game</h2>
                  <p className="text-muted-foreground text-sm mt-2 text-left">
                    Enter a game PIN, pick your avatar, and compete. Answer fast, earn more points.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Join now</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-center text-sm text-muted-foreground pt-6">
            <div className="rounded-xl p-4 bg-card/60 border border-border">
              <div className="font-semibold text-foreground mb-1">No sign-up</div>
              <div>Just pick a nickname and start playing</div>
            </div>
            <div className="rounded-xl p-4 bg-card/60 border border-border">
              <div className="font-semibold text-foreground mb-1">Real-time leaderboard</div>
              <div>See scores update instantly as players answer</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
