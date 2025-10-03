
import type { Timestamp } from "firebase/firestore";

// This type is manually recreated because the flow file was removed.
// In a real scenario, you would import it from the flow file.
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
