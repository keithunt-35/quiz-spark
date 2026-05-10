import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import type { Question } from "./quiz-data";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";

export type QuizGenerationRequest = {
  transcript: string;
  numberOfQuestions: number;
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

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert blob to base64 or send directly to ElevenLabs
    // This is a placeholder - implement actual transcription
    return "Meeting transcript will appear here after ElevenLabs processes the audio.";
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio.");
  }
}

export async function generateQuizFromTranscript(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
  try {
    // For now, use mock data based on transcript keywords
    const mockResponse = generateMockQuestionsFromTranscript(request);
    return mockResponse;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
}

function generateMockQuestionsFromTranscript(request: QuizGenerationRequest): QuizGenerationResponse {
  const questions: Question[] = [
    {
      id: "q1",
      prompt: "What was the main topic discussed in the meeting?",
      options: ["Project timeline", "Budget allocation", "Team structure", "Marketing strategy"],
      correctIndex: 0,
      timeLimit: 15,
    },
    {
      id: "q2",
      prompt: "Who was assigned as the project lead?",
      options: ["John Smith", "Sarah Johnson", "Mike Davis", "Emily Brown"],
      correctIndex: 1,
      timeLimit: 15,
    },
    {
      id: "q3",
      prompt: "What is the project deadline?",
      options: ["End of Q1", "End of Q2", "End of Q3", "End of Q4"],
      correctIndex: 2,
      timeLimit: 15,
    },
    {
      id: "q4",
      prompt: "What was the approved budget?",
      options: ["$50,000", "$100,000", "$150,000", "$200,000"],
      correctIndex: 1,
      timeLimit: 15,
    },
    {
      id: "q5",
      prompt: "Which department will provide support?",
      options: ["IT", "HR", "Finance", "Operations"],
      correctIndex: 0,
      timeLimit: 15,
    },
  ];

  return { questions: questions.slice(0, request.numberOfQuestions) };
}

export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY;
}
