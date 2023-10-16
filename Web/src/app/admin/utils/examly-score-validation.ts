import { MESSAGES } from '../constants/scoreboard.constants';

export function validateExamlyScoreFile(
  contents: string,
  criteriaWeightageMaxScore: any,
  seenEmails: Set<string>
): {
  success: boolean;
  errorAndSuccessMessages: string;
} {
  const rows = contents.split('\n');
  const headers = rows[0].split(',').map((header) => header.trim());
  let errorAndSuccessMessages: string = '';
  let success = true;
  function isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  if (headers[0] !== 'Student Email') {
    return {
      errorAndSuccessMessages: MESSAGES.FAILED_TO_MATCH_STUDENT_MAIL_HEADER,
      success: false,
    };
  }
  if (headers[1] !== 'Examly Score') {
    return {
      errorAndSuccessMessages: MESSAGES.FAILED_TO_MATCH_EXAMLY_SCORE_HEADER,
      success: false,
    };
  }
  const dataRows = rows.slice(1);
  for (const row of dataRows) {
    let columns = row.trim().split(',');
    if (columns.length == 0 || columns.every((column) => column === ''))
      continue;
    if (columns.length !== 2) {
      return {
        errorAndSuccessMessages: MESSAGES.INVALID_ROW_FORMAT,
        success: false,
      };
    }
    const email = columns[0];
    const score = parseInt(columns[1], 10);
    if (isNaN(score)) {
      return {
        errorAndSuccessMessages: MESSAGES.INVALID_SCORES,
        success: false,
      };
    }
    if (
      !(score >= 0 && score <= criteriaWeightageMaxScore['criteria3'].maxScore)
    ) {
      return {
        errorAndSuccessMessages: MESSAGES.INCORRECT_SCORES,
        success: false,
      };
    }
    if (email === '' || !isValidEmail(email)) {
      return {
        errorAndSuccessMessages: MESSAGES.INVALID_EMAIL,
        success: false,
      };
    }
    if (!seenEmails.has(email)) {
      seenEmails.add(email);
    } else {
      return {
        errorAndSuccessMessages: MESSAGES.DUPLICATE_EMAIL,
        success: false,
      };
    }
  }
  return {
    success,
    errorAndSuccessMessages,
  };
}
