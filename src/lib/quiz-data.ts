export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  timeLimit: number; // seconds
};

export type Quiz = {
  pin: string;
  title: string;
  questions: Question[];
};

export const DEMO_QUIZZES: Quiz[] = [
  {
    pin: "123456",
    title: "General Knowledge",
    questions: [
      {
        id: "q1",
        prompt: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctIndex: 1,
        timeLimit: 15,
      },
      {
        id: "q2",
        prompt: "Who painted the Mona Lisa?",
        options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
        correctIndex: 2,
        timeLimit: 15,
      },
      {
        id: "q3",
        prompt: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctIndex: 3,
        timeLimit: 15,
      },
      {
        id: "q4",
        prompt: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctIndex: 3,
        timeLimit: 15,
      },
      {
        id: "q5",
        prompt: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctIndex: 2,
        timeLimit: 10,
      },
    ],
  },
  {
    pin: "654321",
    title: "Tech Trivia",
    questions: [
      {
        id: "t1",
        prompt: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System",
          "Colorful Styled Syntax",
        ],
        correctIndex: 1,
        timeLimit: 15,
      },
      {
        id: "t2",
        prompt: "Who founded Microsoft?",
        options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
        correctIndex: 1,
        timeLimit: 15,
      },
      {
        id: "t3",
        prompt: "Which company makes the iPhone?",
        options: ["Samsung", "Google", "Apple", "Sony"],
        correctIndex: 2,
        timeLimit: 10,
      },
      {
        id: "t4",
        prompt: "What year was TypeScript first released?",
        options: ["2010", "2012", "2014", "2016"],
        correctIndex: 1,
        timeLimit: 15,
      },
    ],
  },
];

export function findQuizByPin(pin: string): Quiz | undefined {
  return DEMO_QUIZZES.find((q) => q.pin === pin.trim());
}

export const BOT_NAMES = [
  "PixelFox",
  "QuizWizard",
  "NovaCat",
  "MegaByte",
  "TurboTaco",
  "CaptainQuiz",
  "LunaBee",
];
