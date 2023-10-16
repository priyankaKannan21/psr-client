import {
  CandidateData,
  EvaluatorData,
} from '../models/candidate-allocation.model';

export function isCsvFile(file: File): boolean {
  return file.type === 'text/csv';
}

export function isValidHeaders(
  headers: string[],
  requiredFileFormat: string[]
): boolean {
  return isEqual(headers, requiredFileFormat);
}

export function isEmptyRow(rowData: string[]): boolean {
  for (let index = 0; index < rowData.length; index++) {
    if (rowData[index] !== '') return false;
  }

  return true;
}

function isEqual(
  userProvidedHeaders: string[],
  standardHeaders: string[]
): boolean {
  if (userProvidedHeaders.length !== standardHeaders.length) return false;

  for (let index = 0; index < userProvidedHeaders.length; index++) {
    if (userProvidedHeaders[index] !== standardHeaders[index]) {
      return false;
    }
  }
  return true;
}
export function convertToDataObject(
  rowData: string[],
  acceptedFileFormat: string
): CandidateData | EvaluatorData {
  if (acceptedFileFormat === 'Evaluator') {
    return convertToEvaluatorData(rowData);
  }
  return convertToStudentData(rowData);
}
function convertToEvaluatorData(rowData: string[]): EvaluatorData {
  return { evaluatorName: rowData[0], evaluatorEmail: rowData[1] };
}

function convertToStudentData(rowData: string[]): CandidateData {
  return {
    studentName: rowData[0],
    studentEmail: rowData[1],
    department: rowData[2],
  };
}
