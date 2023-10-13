export interface EvaluationData {
  studentName: string;
  studentDepartment: string;
  studentEmail: string;
  evaluatorName: string;
  criteria1: number;
  criteria2: number;
  criteria3?: number;
  netScore?: number;
  comments: string;
}
