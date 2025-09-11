
import type { RankPassionsOutput } from "@/ai/flows/rank-passions";
import type { Timestamp } from "firebase/firestore";

export interface FieldItem {
  id: string;
  text: string;
  weight: number; // Changed from 'high' | 'medium' | 'low' | '' to number
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
}

export interface UserData {
    id: string;
    name: string;
    whatsapp: string;
    email?: string;
    educationStatus?: 'student' | 'graduate';
    school?: string;
    createdAt: Timestamp;
    lastUpdated: Timestamp;
    currentStation: 'user-data' | 'passions' | 'journey' | 'results';
    journeyData: PassionData[];
    resultsData?: RankPassionsOutput | null;
    shortId?: string;
}
