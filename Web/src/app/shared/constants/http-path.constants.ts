export const PROTOCOL = 'http';

export const HOST_ADDRESS = 'localhost';

export const PORT_NUMBER = '5071';

export const enum ROUTE_PATHS {
  GET_EVALUATOR_DETAILS = 'evaluator/get-evaluator-details',
  GET_PROCTOR_DATA = 'evaluator/get-proctor-id',
  POST_EVALUATOR_ALLOCATION_DATA = 'evaluator/post-evaluator-details',

  GET_CANDIDATE_DATA = 'student/get-student-details',
  POST_CANDIDATE_DATA = 'student/post-student-details',

  GET_ALLOCATION_DATA = 'student-allocation/get-allocation-details',
  POST_ALLOCATION_DATA = 'student-allocation/post-allocation-details',

  GET_LIVE_EVALUATION_DATA = 'scoreboard/get-live-update',
  GET_ROUND_EVALUATION_DETAILS = 'scoreboard/get-round-evaluation-details',
  GET_ROUND_DATA = 'scoreboard/get-round-data',
  MAX_SCORE_WEIGHTAGE_CRITERIA = 'scoreboard/criteria-weightage-max-score',
  POST_EVALUATION_DATA = 'scoreboard/post-round-evaluation-details',
  POST_CRITERIA_DATA = 'scoreBoard/post-criteria-details',
  POST_ROUND_DATA = 'scoreboard/post-round-data',

  GET_CRITERIA_NAMES = 'evaluator-view/get-criteria-names',
  GET_PROCTOR_EMAIL = 'evaluator-view/proctor-detail-from-evaluator',

  GET_COMPLETE_ROUND = 'dashboard-view/reset-round-details',
  POST_ROUND_PROGRESS = 'dashboard-view/change-round-status-progress',
}
