export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
  easy: Question[];
  medium: Question[];
  hard: Question[];
};

export type QuizData = {
  "Communication Skills": Quiz;
  "Aptitude & Logical Reasoning": Quiz;
  "Technical Knowledge": Quiz;
};

export type Category = keyof QuizData;
export type Difficulty = keyof Quiz;

export type QuestionResult = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
};

export type QuizResult = {
  category: Category;
  difficulty: Difficulty;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalTimeSpent: number;
  questionWiseAnalysis: QuestionResult[];
  totalQuestions: number;
};
