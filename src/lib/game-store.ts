// Tiny in-memory game store + tab-scoped session via sessionStorage.
import { findQuizByPin, BOT_NAMES, type Quiz } from "./quiz-data";

export type Player = {
  id: string;
  name: string;
  score: number;
  isYou?: boolean;
  lastDelta?: number;
};

export type GameSession = {
  pin: string;
  nickname: string;
  quizTitle: string;
  questionIndex: number;
  players: Player[];
};

const KEY = "kahootlike:session";

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as GameSession) : null;
}

export function saveSession(s: GameSession) {
  sessionStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}

export function createSession(pin: string, nickname: string): { quiz: Quiz; session: GameSession } | { error: string } {
  const quiz = findQuizByPin(pin);
  if (!quiz) return { error: "No game found with that PIN. Try 123456 or 654321." };
  if (!nickname.trim()) return { error: "Please enter a nickname." };

  const bots = BOT_NAMES.slice(0, 5).map((n, i) => ({
    id: `bot-${i}`,
    name: n,
    score: 0,
  }));
  const session: GameSession = {
    pin: quiz.pin,
    nickname: nickname.trim(),
    quizTitle: quiz.title,
    questionIndex: 0,
    players: [
      { id: "you", name: nickname.trim(), score: 0, isYou: true },
      ...bots,
    ],
  };
  saveSession(session);
  return { quiz, session };
}

export function scoreAnswer(timeLeft: number, totalTime: number): number {
  // Kahoot-like: faster = more points, max 1000.
  const ratio = Math.max(0, Math.min(1, timeLeft / totalTime));
  return Math.round(500 + 500 * ratio);
}
