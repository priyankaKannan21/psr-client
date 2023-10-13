export interface importDataHeader {
  headerValue: string;
  headerValueInfo: string;
}

export interface EvaluatorData {
  evaluatorName: string;
  evaluatorEmail: string;
}

export interface CandidateData {
  studentName: string;
  studentEmail: string;
  department: string;
}

export interface EvaluatorAllocationData {
  evaluatorName: string;
  evaluatorEmail: string;
  proctorEmail: string;
}

export interface EvaluatorCandidateDataSource {
  headerValue: string;
  headerValueInfo: string;
  UploadFileColumnFormat: string[];
  ColumnFieldName: string[];
  dataTableHeight: string;
}

export interface AllocationData {
  studentEmail: string;
  evaluatorEmail: string;
}

export interface CandidateAllocationData {
  studentName: string;
  studentEmail: string;
  department: string;
  evaluatorName: string;
  evaluatorEmail: string;
  proctorEmail: string;
}

export interface AllocationDataSource {
  headerValue: string;
  headerValueInfo: string;
  ColumnFieldName: string[];
  dataTableHeight: string;
}

export interface DownloadTemplateFileName {
  candidate: string;
  evaluator: string;
}

export interface DialogData {
  headerValue: string;
  fileName: string;
  message: string;
  type: string;
  buttonName: string;
}
