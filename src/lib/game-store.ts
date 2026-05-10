// Shared room state via localStorage + per-tab viewer session via sessionStorage.
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

type ViewerSession = {
  pin: string;
  nickname: string;
  avatar: string;
  isHost: boolean;
  playerId: string;
};

type RoomState = {
  pin: string;
  quizTitle: string;
  questionIndex: number;
  players: Player[];
};

const VIEWER_KEY = "kahootlike:viewer-session";
const ROOM_PREFIX = "kahootlike:room:";
const MAX_PLAYERS = 10;

export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;

  const viewerRaw = sessionStorage.getItem(VIEWER_KEY);
  if (!viewerRaw) return null;

  const viewer = JSON.parse(viewerRaw) as ViewerSession;
  const room = loadRoom(viewer.pin);
  if (!room) return null;

  return {
    pin: room.pin,
    nickname: viewer.nickname,
    avatar: viewer.avatar,
    quizTitle: room.quizTitle,
    questionIndex: room.questionIndex,
    players: room.players,
    isHost: viewer.isHost,
  };
}

export function saveSession(s: GameSession) {
  if (typeof window === "undefined") return;

  const room: RoomState = {
    pin: s.pin,
    quizTitle: s.quizTitle,
    questionIndex: s.questionIndex,
    players: s.players,
  };
  localStorage.setItem(roomKey(s.pin), JSON.stringify(room));
  sessionStorage.setItem(
    VIEWER_KEY,
    JSON.stringify({
      pin: s.pin,
      nickname: s.nickname,
      avatar: s.avatar,
      isHost: s.isHost === true,
      playerId: loadViewerSession()?.playerId ?? (s.isHost ? "host" : `player-${Date.now()}`),
    } satisfies ViewerSession)
  );
}

export function clearSession() {
  sessionStorage.removeItem(VIEWER_KEY);
}

function roomKey(pin: string) {
  return `${ROOM_PREFIX}${pin.trim()}`;
}

function loadRoom(pin: string): RoomState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(roomKey(pin));
  return raw ? (JSON.parse(raw) as RoomState) : null;
}

function saveRoom(room: RoomState) {
  localStorage.setItem(roomKey(room.pin), JSON.stringify(room));
}

function loadViewerSession(): ViewerSession | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(VIEWER_KEY);
  return raw ? (JSON.parse(raw) as ViewerSession) : null;
}

function saveViewerSession(viewer: ViewerSession) {
  sessionStorage.setItem(VIEWER_KEY, JSON.stringify(viewer));
}

/** Join an existing game with PIN */
export function joinGame(pin: string, nickname: string, avatar: string): { quiz: Quiz; session: GameSession } | { error: string } {
  const quiz = findQuizByPin(pin);
  if (!quiz) return { error: "No game found with that PIN. Try 123456 or 654321." };
  if (!nickname.trim()) return { error: "Please enter a nickname." };

  const room = loadRoom(quiz.pin) ?? {
    pin: quiz.pin,
    quizTitle: quiz.title,
    questionIndex: 0,
    players: [],
  };

  const viewer = loadViewerSession();
  const playerId = viewer?.pin === quiz.pin ? viewer.playerId : `player-${Date.now()}`;
  const isRejoining = room.players.some((player) => player.id === playerId);

  // Check player limit (allow rejoining)
  if (!isRejoining && room.players.length >= MAX_PLAYERS) {
    return { error: `Game is full. Maximum ${MAX_PLAYERS} players allowed.` };
  }
  const sessionPlayer: Player = {
    id: playerId,
    name: nickname.trim(),
    avatar,
    score: 0,
    isYou: true,
  };

  const nextPlayers = room.players.some((player) => player.id === playerId)
    ? room.players.map((player) => (player.id === playerId ? sessionPlayer : player))
    : [...room.players, sessionPlayer];

  const session: GameSession = {
    pin: quiz.pin,
    nickname: nickname.trim(),
    avatar,
    quizTitle: quiz.title,
    questionIndex: room.questionIndex,
    players: nextPlayers,
    isHost: false,
  };

  saveRoom({
    ...room,
    players: session.players,
  });
  saveViewerSession({
    pin: quiz.pin,
    nickname: nickname.trim(),
    avatar,
    isHost: false,
    playerId,
  });
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
    players: [{ id: "host", name: "Host", avatar: "🎯", score: 0, isYou: true }],
    isHost: true,
  };
  saveRoom({
    pin: quiz.pin,
    quizTitle: quiz.title,
    questionIndex: 0,
    players: session.players,
  });
  saveViewerSession({
    pin: quiz.pin,
    nickname: "Host",
    avatar: "🎯",
    isHost: true,
    playerId: "host",
  });
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
