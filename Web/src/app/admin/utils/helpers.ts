import { ColDef } from 'ag-grid-community';
import { EvaluationData } from '../models/evaluation-data.model';
import {
  CriteriaWeightageMaxScore,
  RoundData,
} from '../models/scoreboard.models';
import {
  COLUMN_KEYS_ROUND_COMPLETED,
  COLUMN_KEYS_ROUND_4_IN_PROGRESS,
  COLUMN_KEYS_ROUND_5_IN_PROGRESS,
  ROUND_DATA,
} from '../constants/scoreboard.constants';
import { COLUMN_FIELDS } from 'src/app/shared/constants/table-column-definitions.constant';

export function removeExamlyNetFeedbackScoreIfNotRequired(
  evaluationData: EvaluationData[],
  roundData: RoundData
): EvaluationData[] {
  if (evaluationData[0].criteria3 === null)
    removeData(evaluationData, 'criteria3');

  if (roundData.roundNumber === 4) removeData(evaluationData, 'feedbackScore');

  if (evaluationData[0].netScore === null)
    removeData(evaluationData, 'netScore');

  return evaluationData;
}

export function modifyColumnDefinitionsHeaders(
  evaluationDataColumnDefs: ColDef[],
  criteriaWeightage: CriteriaWeightageMaxScore[]
): ColDef[] {
  criteriaWeightage.forEach((criteria) => {
    evaluationDataColumnDefs.forEach((colDef) => {
      let field = colDef.field;

      if (
        field &&
        criteria.criteriaName.startsWith(field.substring(0, 3)) &&
        criteria.criteriaName.slice(-1) === field.slice(-1) &&
        !colDef.headerName?.endsWith(')')
      ) {
        colDef.headerName += ` ( ${criteria.maxScore} )`;
        colDef.headerTooltip = colDef.headerName;
      }
    });
  });
  return evaluationDataColumnDefs;
}

function removeData(
  evaluationData: EvaluationData[],
  key: string
): EvaluationData[] {
  evaluationData.forEach((candidateData) => {
    delete candidateData[key as keyof EvaluationData];
  });

  return evaluationData;
}

export function mapEvaluationDataWithNetExamlyScore(
  result: any,
  evaluationData: EvaluationData[]
) {
  evaluationData.forEach((student) => {
    student.netScore = result.filter(
      (studentResult: any) =>
        student.studentEmail === studentResult.studentEmail
    )[0].netScore;
    student.criteria3 = result.filter(
      (studentResult: any) =>
        student.studentEmail === studentResult.studentEmail
    )[0].criteria3;
  });

  return evaluationData;
}

export function getColumnKeys(
  roundData: RoundData,
  isExamlyScoreImported: boolean
): COLUMN_FIELDS[] {
  switch (roundData.roundNumber) {
    case 4:
      switch (isExamlyScoreImported) {
        case true:
          return COLUMN_KEYS_ROUND_COMPLETED;
        case false:
          return COLUMN_KEYS_ROUND_4_IN_PROGRESS;
      }

    case 5:
      switch (roundData.roundProgress) {
        case ROUND_DATA.IN_PROGRESS:
          return COLUMN_KEYS_ROUND_5_IN_PROGRESS;
        case ROUND_DATA.COMPLETED:
          return COLUMN_KEYS_ROUND_COMPLETED;
      }
  }
  return [];
}
