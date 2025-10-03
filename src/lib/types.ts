
import type { Timestamp } from "firebase/firestore";
import type { RankPassionsOutput } from "@/ai/flows/rank-passions";

export type { RankPassionsOutput };

export interface FieldItem {
  id: string;
  text: string;
  weight: number; 
}

export interface PassionData {
  id: string;
  name: string;
  purpose: FieldItem[];
  power: FieldItem[];
  proof: FieldItem[];
  problems: FieldItem[];
  possibilities: FieldItem[];
  suggestedSolutions?: string[];
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
