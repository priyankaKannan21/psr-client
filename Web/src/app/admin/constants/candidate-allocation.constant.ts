import {
  AllocationDataSource,
  DownloadTemplateFileName,
  EvaluatorCandidateDataSource,
} from '../models/candidate-allocation.model';

export const EVALUATOR_VIEW_DATA: EvaluatorCandidateDataSource = {
  headerValue: 'Evaluator',
  headerValueInfo: 'evaluator',
  UploadFileColumnFormat: ['Evaluator Name', 'Evaluator Email'],
  ColumnFieldName: [
    'evaluatorName',
    'evaluatorEmail',
    'proctorEmail',
    'actions',
  ],
  dataTableHeight: '48vh',
};

export const CANDIDATE_VIEW_DATA: EvaluatorCandidateDataSource = {
  headerValue: 'Candidate',
  headerValueInfo: 'candidate',
  UploadFileColumnFormat: ['Student Name', 'Student Email', 'Department'],
  ColumnFieldName: ['studentName', 'department', 'studentEmail'],
  dataTableHeight: '48vh',
};

export const ALLOCATION_DATA_VIEW: AllocationDataSource = {
  headerValue: 'Allocation',
  headerValueInfo: 'allocation',
  ColumnFieldName: [
    'studentName',
    'department',
    'studentEmail',
    'evaluatorName',
    'evaluatorEmail',
    'proctorEmail',
  ],
  dataTableHeight: '48vh',
};

export const DOWNLOAD_TEMPLATE_FILE_NAME: DownloadTemplateFileName = {
  candidate: 'candidateHeadersTemplate.csv',
  evaluator: 'evaluatorHeadersTemplate.csv',
};

export const enum EVALUATOR_COLUMN_HEADER {
  NAME = 'Evaluator Name *',
  EMAIL = 'Evaluator Email *',
}

export const enum CANDIDATE_COLUMN_HEADER {
  NAME = 'Candidate Name *',
  EMAIL = 'Candidate Email *',
}

export const enum ALLOCATION_COLUMN_HEADER {
  CANDIDATE_NAME = 'Candidate Name',
  CANDIDATE_EMAIL = 'Candidate Email',
  EVALUATOR_NAME = 'Evaluator Name',
  EVALUATOR_EMAIL = 'Evaluator Email',
}

export const QUERY_PARAMS_LIST: string[] = [
  'evaluator-detail',
  'candidate-detail',
  'allocation-detail',
];

export const enum ALLOCATION_MESSAGES {
  SUCCESS = 'Successfully allocated students with evaluators!',
  SUCCESS_FILE_IMPORT = 'File uploaded & parsed successfully.',
  PARSING_FILE = 'Parsing...',
  INVALID_FILE_FORMAT = 'Invalid file format. Only CSV files are supported.',
  EMPTY_FILE = 'File is empty.',
  EMPTY_INPUT_FIELD = 'Some input fields are empty.',
  EMPTY_FILE_DATA = 'Data not found.',
  DUPLICATE_EMAIL = 'Email column has duplicate data.',
  INVALID_COLUMN_HEADERS = 'Mismatched headers. Download template for reference.',
}

export const enum ICON_TYPE {
  ERROR = 'error',
  SUCCESS = 'done',
  LOADING = 'loading',
}

export const enum BUTTON_NAME {
  COMPLETED = 'Done',
  OK = 'Ok',
  CANCEL = 'Cancel',
}

export const enum STEPPER_FORM_CONTROL_VALUES {
  SUBMITTED = 'SUBMITTED',
}
