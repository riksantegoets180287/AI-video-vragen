
export type RouteType = "route1" | "route2" | "route3" | "entree";

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  type: "mcq";
  prompt: string;
  options: MCQOption[];
  correctOptionId: string;
  points: number;
}

export interface OpenQuestion {
  id: string;
  type: "open";
  prompt: string;
  modelAnswer: string;
  points: number;
  grading: {
    method: "similarity";
    thresholdGood: number;
    thresholdOk: number;
  };
}

export type Question = MCQQuestion | OpenQuestion;

export interface QuizForm {
  id: string;
  videoId: number; // 1 to 5
  route: RouteType;
  title: string;
  description?: string;
  videoEmbed: string;
  questions: Question[];
  isEnabled: boolean;
}

export interface UserSession {
  name: string;
  class: string;
  selectedVideo?: number;
  selectedRoute?: RouteType;
  startTime: number;
}

export interface QuestionResult {
  questionId: string;
  answer: string;
  score: number;
  maxPoints: number;
  similarityScore?: number;
  matchedWords?: string[];
  aiWarning?: boolean;
  isCorrect?: boolean;
}

export interface QuizResult {
  id: string;
  sessionId: string;
  userName: string;
  userClass: string;
  route: RouteType;
  videoId: number;
  formTitle: string;
  videoEmbed: string;
  date: string;
  results: QuestionResult[];
  totalScore: number;
  maxTotalPoints: number;
}

export interface AppStats {
  visits: number;
  routesChosen: Record<RouteType, number>;
  formsStarted: number;
  formsFinished: number;
}
