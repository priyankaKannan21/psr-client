export interface CriteriaNames {
  criteria1: string;
  criteria2: string;
  criteria3: string;
}

export interface LiveEvaluationData {
  studentEmail: string;
  evaluatorName: string;
  criteria1: number;
  criteria2: number;
  criteria3?: number;
  comments: string;
}
