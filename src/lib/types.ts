export interface FieldItem {
  id: string;
  text: string;
  weight: 'high' | 'medium' | 'low' | '';
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
