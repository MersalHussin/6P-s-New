export interface FieldItem {
  id: string;
  text: string;
}

export interface Purpose extends FieldItem {
  weight: 'high' | 'medium' | 'low' | '';
}

export interface PassionData {
  id: string;
  name: string;
  purpose: Purpose[];
  power: FieldItem[];
  proof: FieldItem[];
  problems: FieldItem[];
  possibilities: FieldItem[];
  suggestedSolutions?: string[];
}
