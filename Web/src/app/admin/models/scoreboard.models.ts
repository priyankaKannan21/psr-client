import { ROUND_DATA } from '../constants/scoreboard.constants';

export interface RoundData {
  roundNumber: number;
  roundProgress: ROUND_DATA;
}

export interface CriteriaWeightageMaxScore {
  criteriaName: string;
  weightage: number;
  maxScore: number;
}

export interface ErrorSuccessMessageForExamly{
  successStatus:boolean,
  errorSuccessMessage:string
}