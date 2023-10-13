import { ColDef, IRowNode } from 'ag-grid-community';
import {
  COLUMN_DEFINITIONS,
  COLUMN_FIELDS,
} from '../constants/table-column-definitions.constant';
import {
  CriteriaNames,
  LiveEvaluationData,
} from '../models/evaluation-data.model';

export function getColumnDefinitions(keys: string[]): ColDef[] {
  let columnDefinitions: ColDef[] = [];
  let columnDefinitionKeys = getColumnDefinitionKeys(keys);

  columnDefinitionKeys.forEach((columnDefinitionKey) =>
    columnDefinitions.push(COLUMN_DEFINITIONS[columnDefinitionKey])
  );

  return columnDefinitions;
}

export function setColumnDefinitionHeaders(
  columnDefinitions: ColDef[],
  criteriaNames: CriteriaNames
) {
  columnDefinitions.forEach((column: ColDef) => {
    switch (column.field) {
      case COLUMN_FIELDS.CRITERIA_1:
        column.headerName = criteriaNames.criteria1;
        column.headerTooltip = criteriaNames.criteria1;
        break;
      case COLUMN_FIELDS.CRITERIA_2:
        column.headerName = criteriaNames.criteria2;
        column.headerTooltip = criteriaNames.criteria2;
        break;
      case COLUMN_FIELDS.CRITERIA_3:
        column.headerName = criteriaNames.criteria3;
        column.headerTooltip = criteriaNames.criteria3;
        break;
    }
  });

  return columnDefinitions;
}

export function getColumnKeys(columnDefinitions: ColDef[]): string[] {
  let columnFields: string[] = [];

  columnDefinitions?.forEach((columnDefinition: ColDef) => {
    columnFields.push(columnDefinition.field!);
  });

  return columnFields;
}

export function setDataValue(
  rowNode: IRowNode,
  field: keyof LiveEvaluationData,
  columnKeys: string[],
  evaluationData: LiveEvaluationData[]
) {
  if (!columnKeys.includes(field)) return;

  let studentMail = rowNode.data.studentEmail;

  // Here we are filtering the student using mail Id and getting the data for the field we require. Ex: logicalThinking, comments
  let dataValue = evaluationData.filter(
    (studentData) => studentData.studentEmail === studentMail
  )[0][field];

  rowNode.setDataValue(field, dataValue);
}

function getColumnDefinitionKeys(keys: string[]) {
  let columnDefinitionKeys: string[] = ['snoColumnDefinition'];

  keys.forEach((key) => {
    let columnDefinitionKey = getColumnDefinitionKey(key);
    if (columnDefinitionKey) {
      columnDefinitionKeys.push(columnDefinitionKey);
    }
  });

  return columnDefinitionKeys;
}

function getColumnDefinitionKey(key: string): string {
  switch (key) {
    case COLUMN_FIELDS.CANDIDATE:
      return 'studentNameColumnDefinition';
    case COLUMN_FIELDS.DEPARTMENT:
      return 'studentDepartmentColumnDefinition';
    case COLUMN_FIELDS.EMAIL_ID:
      return 'studentEmailColumnDefinition';
    case COLUMN_FIELDS.EVALUATOR:
      return 'evaluatorNameColumnDefinition';
    case COLUMN_FIELDS.CRITERIA_1:
      return 'criteria1ColumnDefinition';
    case COLUMN_FIELDS.CRITERIA_2:
      return 'criteria2ColumnDefinition';
    case COLUMN_FIELDS.CRITERIA_3:
      return 'criteria3ColumnDefinition';
    case COLUMN_FIELDS.COMMENTS:
      return 'commentsColumnDefinition';
    case COLUMN_FIELDS.NET_SCORE:
      return 'netScoreColumnDefinition';
    case COLUMN_FIELDS.EVALUATOR_EMAIL:
      return 'evaluatorEmailColumnDefinition';
    case COLUMN_FIELDS.PROCTOR:
      return 'proctorEmailColumnDefinition';
    case COLUMN_FIELDS.ACTION:
      return 'actionsColumnDefinition';
    default:
      return '';
  }
}
