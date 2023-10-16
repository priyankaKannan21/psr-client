import { COLUMN_FIELDS } from 'src/app/shared/constants/table-column-definitions.constant';

export const enum ROUND_DATA {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export const enum MESSAGES {
  FAILED_LOADING_ROUND_DATA = 'Failed to Load Data.',
  FAILED_LOADING_ALLOCATION_DATA = 'Failed to Load Allocation Data.',
  FAILED_LOADING_CRITERIA_DATA = 'Failed to load weightage for displaying max score in table column headers.',
  FAILED_LOADING_EVALUATION_DATA = 'Failed to load evaluation data.',
  FREEZING_EVALUATOR_SCORES = `Freezing Evaluator's Scores...`,
  FROZEN_EVALUATOR_SCORES = `Successfully frozen Evaluator's Scores`,
  REQUEST_FAILED = 'Request Failed',
  FAILED_TO_LOAD_SERVER = 'Not connected to the server.',
  FAILED_TO_MATCH_DATA = 'Import Details Does not Match the Displayed Data!',
  FAILED_TO_MATCH_EMAIL = 'Email values do not match!',
  FAILED_TO_MATCH_STUDENT_MAIL_HEADER = 'Invalid File Student Mail Header!',
  FAILED_TO_MATCH_EXAMLY_SCORE_HEADER = 'Invalid File Examly Score Header!',
  SUCCESS_EXAMLY_IMPORT = 'Successfully updated Scoreboard',
  INVALID_ROW_FORMAT = 'Invalid Row Format!',
  INVALID_SCORES = 'Invalid Scores!',
  INCORRECT_SCORES = 'Incorrect Scores!',
  DUPLICATE_EMAIL = 'Duplicate Email!',
  INVALID_EMAIL = 'Invalid Email!',
  INVALID_FILE_FORMAT = 'Invalid file format!',
  FAILED_LOADING_CRITERIA_NAME = 'Failed to load Criteria Names',
  FAILED_TO_START_EVALUATION = 'Failed to Start Evaluation!',
  FAILED_TO_COMPLETE_ROUND = 'Failed to Complete Round!',
}

export const MESSAGE_DISPLAY_TIME = 8000;

export const SCOREBOARD_FILE_NAME = 'scoreboard.csv';

export const COLUMN_KEYS_FOR_DOWNLOAD_SCOREBOARD = [
  COLUMN_FIELDS.CANDIDATE,
  COLUMN_FIELDS.EMAIL_ID,
  COLUMN_FIELDS.CRITERIA_1,
  COLUMN_FIELDS.CRITERIA_2,
  COLUMN_FIELDS.CRITERIA_3,
  COLUMN_FIELDS.NET_SCORE,
  COLUMN_FIELDS.COMMENTS,
];

export const COLUMN_KEYS_ROUND_4_IN_PROGRESS = [
  COLUMN_FIELDS.CANDIDATE,
  COLUMN_FIELDS.EMAIL_ID,
  COLUMN_FIELDS.EVALUATOR,
  COLUMN_FIELDS.CRITERIA_1,
  COLUMN_FIELDS.CRITERIA_2,
  COLUMN_FIELDS.COMMENTS,
];

export const COLUMN_KEYS_ROUND_5_IN_PROGRESS = [
  COLUMN_FIELDS.CANDIDATE,
  COLUMN_FIELDS.EMAIL_ID,
  COLUMN_FIELDS.EVALUATOR,
  COLUMN_FIELDS.CRITERIA_1,
  COLUMN_FIELDS.CRITERIA_2,
  COLUMN_FIELDS.CRITERIA_3,
  COLUMN_FIELDS.COMMENTS,
];

export const COLUMN_KEYS_ROUND_COMPLETED = [
  COLUMN_FIELDS.CANDIDATE,
  COLUMN_FIELDS.EMAIL_ID,
  COLUMN_FIELDS.EVALUATOR,
  COLUMN_FIELDS.CRITERIA_1,
  COLUMN_FIELDS.CRITERIA_2,
  COLUMN_FIELDS.CRITERIA_3,
  COLUMN_FIELDS.NET_SCORE,
  COLUMN_FIELDS.COMMENTS,
];
