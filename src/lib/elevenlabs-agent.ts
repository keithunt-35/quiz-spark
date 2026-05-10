import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import type { Question } from "./quiz-data";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";

export type QuizGenerationRequest = {
  topic: string;
  numberOfQuestions: number;
  difficulty?: "easy" | "medium" | "hard";
};

export type QuizGenerationResponse = {
  questions: Question[];
};

let client: ElevenLabsClient | null = null;

function getClient(): ElevenLabsClient {
  if (!client) {
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ElevenLabs API key not configured. Please set VITE_ELEVENLABS_API_KEY in your environment.");
    }
    client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
  }
  return client;
}

export async function generateQuizQuestions(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
  try {
    // For now, we'll use a mock response since we need the conversational AI agent
    // In production, you'd use the conversational AI endpoint
    const mockResponse = generateMockQuestions(request);
    
    return mockResponse;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
}

// Mock function for testing - replace with actual API call when agent is configured
function generateMockQuestions(request: QuizGenerationRequest): QuizGenerationResponse {
  const topics: Record<string, Array<Omit<Question, 'id'>>> = {
    science: [
      {
        prompt: "What is the chemical symbol for gold?",
        options: ["Go", "Au", "Gd", "Ag"],
        correctIndex: 1,
        timeLimit: 15,
      },
      {
        prompt: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Mars", "Earth"],
        correctIndex: 1,
        timeLimit: 15,
      },
    ],
    history: [
      {
        prompt: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctIndex: 2,
        timeLimit: 15,
      },
      {
        prompt: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
        correctIndex: 1,
        timeLimit: 15,
      },
    ],
    technology: [
      {
        prompt: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Utility"],
        correctIndex: 0,
        timeLimit: 15,
      },
      {
        prompt: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctIndex: 2,
        timeLimit: 15,
      },
    ],
  };

  const topicKey = request.topic.toLowerCase();
  const baseQuestions = topics[topicKey] || topics.science;
  
  // Return requested number of questions
  const questions: Question[] = baseQuestions.slice(0, request.numberOfQuestions).map((q, i) => ({
    ...q,
    id: `q${i + 1}`,
  }));

  // If we need more questions than available, duplicate and modify
  while (questions.length < request.numberOfQuestions) {
    const template = baseQuestions[questions.length % baseQuestions.length];
    questions.push({
      ...template,
      id: `q${questions.length + 1}`,
    });
  }

  return { questions };
}

export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY;
}
