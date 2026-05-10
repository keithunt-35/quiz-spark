import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { startMeetingRecording, stopMeetingRecording, isRecording } from "@/lib/meeting-recorder";
import { transcribeAudio, generateQuizFromTranscript } from "@/lib/elevenlabs-agent";
import { createCustomGame } from "@/lib/game-store";
import { createPrizePool } from "@/lib/solana-staking";

export const Route = createFileRoute("/record-meeting")({
  component: RecordMeeting,
});

function RecordMeeting() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [hostStake, setHostStake] = useState(0.5);
  const [questionCount, setQuestionCount] = useState(5);

  async function handleStartRecording() {
    setError(null);
    const result = await startMeetingRecording();
    if (result.success) {
      setRecording(true);
    } else {
      setError(result.error || "Failed to start recording");
    }
  }

  async function handleStopAndGenerate() {
    setProcessing(true);
    setRecording(false);
    
    try {
      const audioBlob = await stopMeetingRecording();
      if (!audioBlob) {
        setError("No audio recorded");
        setProcessing(false);
        return;
      }

      // Transcribe audio
      const transcript = await transcribeAudio(audioBlob);
      
      // Generate questions from transcript
      const response = await generateQuizFromTranscript({
        transcript,
        numberOfQuestions: questionCount,
      });

      // Create game with generated questions
      const result = createCustomGame(gameTitle || "Meeting Quiz", response.questions);
      if ("error" in result) {
        setError(result.error);
        setProcessing(false);
        return;
      }

      // Create prize pool
      createPrizePool(result.quiz.pin, hostStake);

      // Navigate to lobby
      navigate({ to: "/lobby" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process meeting");
      setProcessing(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">🎙️ Record Meeting</h1>
          <p className="text-muted-foreground">
            Record your meeting and AI will generate quiz questions from the discussion
          </p>
        </div>

        <div className="rounded-3xl border border-border p-8 space-y-6" style={{ backgroundImage: "var(--gradient-card)" }}>
          {!recording && !processing && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-semibold">Game Title</label>
                <input
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="e.g. Team Meeting Quiz"
                  className="w-full bg-input text-foreground rounded-xl py-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold">Host Stake (SOL)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={hostStake}
                  onChange={(e) => setHostStake(parseFloat(e.target.value))}
                  className="w-full bg-input text-foreground rounded-xl py-3 px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold">Number of Questions: {questionCount}</label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleStartRecording}
                className="w-full py-4 px-6 rounded-xl bg-red-500 text-white font-extrabold text-lg hover:brightness-110 transition-all"
              >
                🎙️ Start Recording Meeting
              </button>
            </>
          )}

          {recording && (
            <div className="text-center space-y-6">
              <div className="size-32 mx-auto rounded-full bg-red-500 animate-pulse grid place-items-center">
                <div className="text-6xl">🎙️</div>
              </div>
              <div className="text-2xl font-black">Recording in progress...</div>
              <p className="text-muted-foreground">Speak clearly about the meeting topics</p>
              <button
                onClick={handleStopAndGenerate}
                className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-extrabold text-lg hover:brightness-110 transition-all"
              >
                ⏹️ Stop & Generate Quiz
              </button>
            </div>
          )}

          {processing && (
            <div className="text-center space-y-6">
              <div className="size-32 mx-auto rounded-full bg-primary/20 animate-spin grid place-items-center">
                <div className="text-6xl">🤖</div>
              </div>
              <div className="text-2xl font-black">Processing meeting...</div>
              <p className="text-muted-foreground">AI is generating quiz questions</p>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive font-medium text-center">{error}</div>
          )}
        </div>
      </div>
    </main>
  );
}
