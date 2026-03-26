// client/src/types/index.ts

export interface MCQ {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'video' | 'mcq';
  text?: string;
  language?: string;
  code?: string;
  query?: string;
  questions?: MCQ[]; // This matches the 'mcq' type block
}

export interface LessonData {
  _id: string;
  title: string;
  objectives: string[];
  content: ContentBlock[];
  isEnriched: boolean;
}