
import type { Timestamp } from "firebase/firestore";

// Define a simplified RankPassionsOutput locally since the flow is removed
export interface RankPassionsOutput {
    rankedPassions: {
        passion: string;
        score: number;
        reasoning: string;
    }[];
}

export interface FieldItem {
  id: string;
  text: string;
  weight: number; 
}

export interface SolutionAttempt {
    attempt: number;
    solutions: string[];
}

export interface PassionData {
  id: string;
  name: string;
  purpose: FieldItem[];
  power: FieldItem[];
  proof: FieldItem[];
  problems: FieldItem[];
  possibilities: FieldItem[];
  suggestedSolutions?: SolutionAttempt[];
  solutionGenerationAttempts?: number;
}

export interface UserData {
    id: string;
    name: string;
    whatsapp: string;
    email?: string;
    educationStatus?: string;
    school?: string;
    job?: string;
    createdAt: Timestamp;
    lastUpdated: Timestamp;
    currentStation: 'user-data' | 'passions' | 'journey' | 'results';
    journeyData: PassionData[];
    resultsData?: RankPassionsOutput | null;
    shortId?: string;
}
