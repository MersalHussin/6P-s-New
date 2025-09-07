export interface Purpose {
  id: string;
  text: string;
  weight: 'high' | 'medium' | 'low' | '';
}

export interface PassionData {
  id: string;
  name: string;
  purpose: Purpose[];
  power: string;
  proof: string;
  problems: string;
  possibilities: string;
  suggestedSolutions?: string[];
}
