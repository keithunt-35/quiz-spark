// Tiny in-memory game store + tab-scoped session via sessionStorage.
import { findQuizByPin, BOT_NAMES, type Quiz, storeCustomQuiz } from "./quiz-data";
import { randomAvatarId } from "./avatars";

export type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isYou?: boolean;
  lastDelta?: number;
  lastCorrect?: boolean;
};

export type GameSession = {
  pin: string;
  nickname: string;
  avatar: string;
  quizTitle: string;
  questionIndex: number;
  players: Player[];
  isHost?: boolean;
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

/** Join an existing game with PIN */
export function joinGame(pin: string, nickname: string, avatar: string): { quiz: Quiz; session: GameSession } | { error: string } {
  const quiz = findQuizByPin(pin);
  if (!quiz) return { error: "No game found with that PIN. Try 123456 or 654321." };
  if (!nickname.trim()) return { error: "Please enter a nickname." };

  const used: string[] = [avatar];
  const bots = BOT_NAMES.slice(0, 5).map((n, i) => {
    const a = randomAvatarId(used);
    used.push(a);
    return { id: `bot-${i}`, name: n, avatar: a, score: 0 };
  });
  const session: GameSession = {
    pin: quiz.pin,
    nickname: nickname.trim(),
    avatar,
    quizTitle: quiz.title,
    questionIndex: 0,
    players: [
      { id: "you", name: nickname.trim(), avatar, score: 0, isYou: true },
      ...bots,
    ],
    isHost: false,
  };
  saveSession(session);
  return { quiz, session };
}

/** Create a custom game */
export function createCustomGame(
  title: string,
  questions: Array<{ prompt: string; options: [string, string, string, string]; correctIndex: number; timeLimit: number }>
): { quiz: Quiz; session: GameSession } | { error: string } {
  if (!title.trim()) return { error: "Game title is required." };
  if (questions.length === 0) return { error: "At least one question is required." };

  // Generate a unique PIN (6 digits for now)
  const pin = Math.random().toString().slice(2, 8).padStart(6, "0");

  const quiz: Quiz = {
    pin,
    title: title.trim(),
    questions: questions.map((q, i) => ({
      id: `q${i + 1}`,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      timeLimit: q.timeLimit,
    })),
  };

  // Store the custom quiz so it can be joined
  storeCustomQuiz(quiz);

  // Create a host session
  const session: GameSession = {
    pin: quiz.pin,
    nickname: "Host",
    avatar: "🎯",
    quizTitle: quiz.title,
    questionIndex: 0,
    players: [],
    isHost: true,
  };
  saveSession(session);
  return { quiz, session };
}

/** Original function name for backward compatibility */
export function createSession(pin: string, nickname: string, avatar: string): { quiz: Quiz; session: GameSession } | { error: string } {
  return joinGame(pin, nickname, avatar);
}

export function scoreAnswer(timeLeft: number, totalTime: number): number {
  // Kahoot-like: faster = more points, max 1000.
  const ratio = Math.max(0, Math.min(1, timeLeft / totalTime));
  return Math.round(500 + 500 * ratio);
}
