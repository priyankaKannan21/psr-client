import { ColDef, GridOptions } from 'ag-grid-community';
import { KebabMenuComponent } from 'src/app/admin/components/kebab-menu/kebab-menu.component';
import { CommentsRendererComponent } from '../components/comments-renderer/comments-renderer.component';

export const DEFAULT_COLUMN_DEFINITIONS: ColDef = {
  sortable: true,
  resizable: true,
};

export const GRID_OPTIONS: GridOptions = {
  suppressCsvExport: false,
  suppressMovableColumns: true,
};

export const COLUMN_DEFINITIONS: Record<string, ColDef> = {
  snoColumnDefinition: {
    headerName: COLUMN_HEADERS.SNO,
    headerTooltip: COLUMN_HEADERS.SNO,
    field: COLUMN_FIELDS.SNO,
    valueGetter: (params: any) => params.node.rowIndex + 1,
    flex: 1,
    minWidth: 70,
  },
  studentNameColumnDefinition: {
    headerName: COLUMN_HEADERS.CANDIDATE,
    headerTooltip: COLUMN_HEADERS.CANDIDATE,
    field: COLUMN_FIELDS.CANDIDATE,
    flex: 2.5,
    minWidth: 140,
  },
  studentDepartmentColumnDefinition: {
    headerName: COLUMN_HEADERS.DEPARTMENT,
    headerTooltip: COLUMN_HEADERS.DEPARTMENT,
    field: COLUMN_FIELDS.DEPARTMENT,
    flex: 2,
    minWidth: 120,
  },
  studentEmailColumnDefinition: {
    headerName: COLUMN_HEADERS.EMAIL_ID,
    headerTooltip: COLUMN_HEADERS.EMAIL_ID,
    field: COLUMN_FIELDS.EMAIL_ID,
    flex: 3.5,
    minWidth: 180,
  },
  evaluatorNameColumnDefinition: {
    headerName: COLUMN_HEADERS.EVALUATOR,
    headerTooltip: COLUMN_HEADERS.EVALUATOR,
    field: COLUMN_FIELDS.EVALUATOR,
    flex: 2.5,
    minWidth: 140,
  },
  criteria1ColumnDefinition: {
    field: COLUMN_FIELDS.CRITERIA_1,
    flex: 2.25,
    minWidth: 160,
  },
  criteria2ColumnDefinition: {
    field: COLUMN_FIELDS.CRITERIA_2,
    flex: 2.5,
    minWidth: 180,
  },
  commentsColumnDefinition: {
    headerName: COLUMN_HEADERS.COMMENTS,
    headerTooltip: COLUMN_HEADERS.COMMENTS,
    field: COLUMN_FIELDS.COMMENTS,
    flex: 5,
    minWidth: 350,
    wrapText: true,
    autoHeight: true,
    cellRenderer: CommentsRendererComponent,
    cellStyle: { padding: '10px', 'line-height': '20px !important' },
    sortable: false,
  },
  netScoreColumnDefinition: {
    headerName: COLUMN_HEADERS.NET_SCORE,
    headerTooltip: COLUMN_HEADERS.NET_SCORE,
    field: COLUMN_FIELDS.NET_SCORE,
    flex: 2,
    minWidth: 150,
  },
  criteria3ColumnDefinition: {
    field: COLUMN_FIELDS.CRITERIA_3,
    wrapHeaderText: true,
    flex: 2,
    minWidth: 170,
  },
  evaluatorEmailColumnDefinition: {
    headerName: COLUMN_HEADERS.EVALUATOR_EMAIL,
    headerTooltip: COLUMN_HEADERS.EVALUATOR_EMAIL,
    field: COLUMN_FIELDS.EVALUATOR_EMAIL,
    flex: 4,
    minWidth: 120,
  },
  proctorEmailColumnDefinition: {
    headerName: COLUMN_HEADERS.PROCTOR,
    headerTooltip: COLUMN_HEADERS.PROCTOR,
    field: COLUMN_FIELDS.PROCTOR,
    flex: 3.5,
    minWidth: 120,
  },
  actionsColumnDefinition: {
    headerName: COLUMN_HEADERS.ACTION,
    headerTooltip: COLUMN_HEADERS.ACTION,
    field: COLUMN_FIELDS.ACTION,
    flex: 0.5,
    minWidth: 120,
    cellRenderer: KebabMenuComponent,
    sortable: false,
  },
};

const enum COLUMN_HEADERS {
  SNO = 'S No',
  CANDIDATE = 'Candidate Name',
  DEPARTMENT = 'Department',
  EMAIL_ID = 'Candidate Email',
  EVALUATOR = 'Evaluator Name',
  NET_SCORE = 'Net Score',
  COMMENTS = 'Comments',
  EVALUATOR_EMAIL = 'Evaluator Email',
  PROCTOR = 'Proctor ID',
  ACTION = 'Actions',
}

export const enum COLUMN_FIELDS {
  SNO = 'sno',
  CANDIDATE = 'studentName',
  DEPARTMENT = 'department',
  EMAIL_ID = 'studentEmail',
  EVALUATOR = 'evaluatorName',
  CRITERIA_1 = 'criteria1',
  CRITERIA_2 = 'criteria2',
  CRITERIA_3 = 'criteria3',
  NET_SCORE = 'netScore',
  COMMENTS = 'comments',
  EVALUATOR_EMAIL = 'evaluatorEmail',
  PROCTOR = 'proctorEmail',
  ACTION = 'actions',
}

export const ALLOCATION_DOWNLOAD_HEADER: string[] = [
  'proctorEmail',
  'studentEmail',
];

export const ALLOCATION_FILE_NAME: string = 'allocation-detail.csv';

export const enum ALLOCATION_DETAIL_COLUMN_HEADER {
  CANDIDATE_EMAIL = 'Student',
  PROCTOR = 'Email_id',
}
