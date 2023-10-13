import { ScoreboardService } from './../../services/scoreboard/scoreboard.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { EvaluationData } from '../../models/evaluation-data.model';
import {
  CriteriaWeightageMaxScore,
  ErrorSuccessMessageForExamly,
} from '../../models/scoreboard.models';
import { MESSAGES } from '../../constants/scoreboard.constants';
import { RoundData } from '../../models/scoreboard.models';
import { ROUND_DATA } from '../../constants/scoreboard.constants';
import { validateExamlyScoreFile } from '../../utils/examly-score-validation';

@Component({
  selector: 'app-netscore-calculation',
  templateUrl: './netscore-calculation.component.html',
  styleUrls: ['./netscore-calculation.component.scss'],
})
export class NetscoreCalculationComponent {
  @Output() displayError = new EventEmitter<ErrorSuccessMessageForExamly>();
  @Output() examlyNetScore = new EventEmitter();
  successAndErrorMessages: string = '';
  isExamlyReImportButtonVisible: boolean = false;
  isExamlyDataValid: boolean = true;
  isNetScoreCalculated: boolean = true;
  isExamlyImportButtonVisible: boolean = false;
  seenEmails: Set<string> = new Set();
  currentRound: RoundData = {
    roundNumber: 0,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  studentEmail: string[] = [];
  studentScores: EvaluationData[] = [];
  criteriaWeightage: CriteriaWeightageMaxScore[] = [];
  examlyCsvData: any[] = [];
  criteria1: number[] = [];
  criteria2: number[] = [];
  criteria3: number[] = [];
  nonScaledCriteria3Scores: number[] = [];
  actualExamlyScores: number[] = [];
  scaledExamlyScores: number[] = [];
  netScore: number[] = [];
  scaledNetScore: number[] = [0];
  criteriaWeightageMaxScore: Record<string, CriteriaWeightageMaxScore> = {};
  examlyScoresFile: File | undefined;
  fileInput!: HTMLInputElement;

  constructor(private scoreboardService: ScoreboardService) {}

  public getRoundDetailsAndCalculate(): void {
    this.scoreboardService.getRoundData().subscribe({
      next: (roundData: RoundData) => {
        this.currentRound = roundData;
      },
      error: (error) => {
        this.successAndErrorMessages =
          MESSAGES.FAILED_TO_LOAD_SERVER + error.message;
        this.displayError.emit({
          successStatus: this.isExamlyDataValid,
          errorSuccessMessage: this.successAndErrorMessages,
        });
      },
    });

    this.scoreboardService.getMaxScoreForEachCriteria().subscribe({
      next: (response) => {
        this.criteriaWeightage = response;
      },
      error: (error) => {
        this.successAndErrorMessages =
          MESSAGES.FAILED_TO_LOAD_SERVER + error.message;
        this.displayError.emit({
          successStatus: this.isExamlyDataValid,
          errorSuccessMessage: this.successAndErrorMessages,
        });
      },
    });

    this.scoreboardService.getEvaluatorData().subscribe({
      next: (response) => {
        this.studentScores = response;
        this.studentScores.sort((a: any, b: any) =>
          a.studentEmail.localeCompare(b.studentEmail)
        );

        this.calculateNetscoreBasedOnCurrentRound();
      },
      error: (error) => {
        this.successAndErrorMessages =
          MESSAGES.FAILED_TO_LOAD_SERVER + error.message;
        this.displayError.emit({
          successStatus: this.isExamlyDataValid,
          errorSuccessMessage: this.successAndErrorMessages,
        });
      },
    });
  }

  calculateNetscoreBasedOnCurrentRound() {
    if (
      this.studentScores.length > 0 &&
      this.studentScores[0].netScore == null
    ) {
      this.isNetScoreCalculated = false;
    }
    if (this.isNetScoreCalculated == true) {
      if (
        this.currentRound.roundNumber == 4 &&
        this.currentRound.roundProgress == ROUND_DATA.COMPLETED
      )
        this.enableReImportExamlyButton();
      return;
    }
    this.setCriteriaWeightageAndMaxscore();
    if (
      this.currentRound.roundNumber == 4 &&
      this.currentRound.roundProgress == ROUND_DATA.COMPLETED
    ) {
      this.enableExamlyImportButton();
    } else if (
      this.currentRound.roundNumber == 5 &&
      this.currentRound.roundProgress == ROUND_DATA.COMPLETED
    ) {
      this.calculateNetscore();
    }
  }

  async onFileSelected(fileUploadEvent: Event) {
    this.fileInput = fileUploadEvent.target as HTMLInputElement;
    if (!(this.fileInput.files && this.fileInput.files.length > 0)) {
      return;
    }
    this.examlyScoresFile = this.fileInput.files[0];
    this.examlyScoresFile.type === 'text/csv'
      ? await this.readCSV()
      : ((this.successAndErrorMessages = MESSAGES.INVALID_FILE_FORMAT),
        this.displayError.emit({
          successStatus: this.isExamlyDataValid,
          errorSuccessMessage: this.successAndErrorMessages,
        }));
  }

  async readCSV(): Promise<void> {
    if (this.examlyScoresFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const contents = e.target?.result as string;
        await this.validateExamlyScoresAndEmails(contents);
        if (this.isExamlyDataValid == true) {
          const rows = contents.split('\n');
          const dataRows = rows.slice(1);
          this.examlyCsvData = dataRows.map((row) => row.trim().split(','));
          this.examlyCsvData = this.examlyCsvData.filter((row) =>
            row.some((cell: any) => cell.trim() !== '')
          );
          this.examlyCsvData.sort((studentScore1, studentScore2) =>
            studentScore1[0].localeCompare(studentScore2[0])
          );
          this.calculateNetscore();
        }
      };
      reader.readAsText(this.examlyScoresFile);
    }
  }

  async validateExamlyScoresAndEmails(contents: string): Promise<void> {
    const successAndFailureStatus = validateExamlyScoreFile(
      contents,
      this.criteriaWeightageMaxScore,
      this.seenEmails
    );
    this.handleInvalidData(
      successAndFailureStatus.errorAndSuccessMessages,
      successAndFailureStatus.success
    );
  }

  handleInvalidData(errorMessage: string, isValid: boolean) {
    this.isExamlyDataValid = isValid;
    this.successAndErrorMessages = errorMessage;
    this.displayError.emit({
      successStatus: this.isExamlyDataValid,
      errorSuccessMessage: this.successAndErrorMessages,
    });
    this.fileInput.value = '';
    this.seenEmails = new Set();
  }

  calculateNetscore() {
    if (
      this.examlyCsvData.length === this.studentScores.length ||
      this.currentRound.roundNumber == 5
    ) {
      const emailArray = this.examlyCsvData.map((item) => item[0]);
      const allEmailsMatch = emailArray.every((email) =>
        this.studentScores.some((student) => student.studentEmail === email)
      );
      if (allEmailsMatch) {
        this.calculateCriteriaWeightage();
        this.sumOfCriteriaForEachRound();
        this.calculateFinalScoreAccordingToNetMaxScore();
        this.postExamlyNetScoreData();
      } else {
        this.handleInvalidData(MESSAGES.FAILED_TO_MATCH_EMAIL, false);
      }
    } else {
      this.handleInvalidData(MESSAGES.FAILED_TO_MATCH_DATA, false);
    }
  }

  setCriteriaWeightageAndMaxscore() {
    for (const criteria of this.criteriaWeightage) {
      switch (criteria.criteriaName) {
        case 'criteria_1':
          this.criteriaWeightageMaxScore['criteria1'] = criteria;
          break;
        case 'criteria_2':
          this.criteriaWeightageMaxScore['criteria2'] = criteria;
          break;
        case 'criteria_3':
          this.criteriaWeightageMaxScore['criteria3'] = criteria;
          break;
        case 'net_score':
          this.criteriaWeightageMaxScore['netScore'] = criteria;
          break;
      }
    }
  }

  calculateCriteriaWeightage() {
    this.studentScores.forEach((studentDetail: any) => {
      this.criteria1.push(
        (this.criteriaWeightageMaxScore['criteria1'].weightage / 100) *
          (studentDetail.criteria1 /
            this.criteriaWeightageMaxScore['criteria1'].maxScore)
      );
      this.criteria2.push(
        (this.criteriaWeightageMaxScore['criteria2'].weightage / 100) *
          (studentDetail.criteria2 /
            this.criteriaWeightageMaxScore['criteria2'].maxScore)
      );
      this.studentEmail.push(studentDetail.studentEmail);
    });

    if (this.currentRound.roundNumber == 4) {
      this.actualExamlyScores = this.examlyCsvData.map((subArray) =>
        Number(subArray[1])
      );
      this.scaledExamlyScores = this.examlyCsvData.map(
        (subArray) =>
          (this.criteriaWeightageMaxScore['criteria3'].weightage / 100) *
          (Number(subArray[1]) /
            this.criteriaWeightageMaxScore['criteria3'].maxScore)
      );
    } else {
      this.studentScores.forEach((studentDetail: any) => {
        this.nonScaledCriteria3Scores.push(studentDetail.criteria3);
        this.criteria3.push(
          (this.criteriaWeightageMaxScore['criteria3'].weightage / 100) *
            (studentDetail.criteria3 /
              this.criteriaWeightageMaxScore['criteria3'].maxScore)
        );
      });
    }
  }

  sumOfCriteriaForEachRound() {
    this.criteria1.forEach((item, index) => {
      const third_criteria =
        this.currentRound.roundNumber == 4
          ? this.scaledExamlyScores
          : this.criteria3;
      this.netScore[index] =
        this.criteria1[index] + this.criteria2[index] + third_criteria[index];
    });
  }

  calculateFinalScoreAccordingToNetMaxScore() {
    this.netScore.forEach((item, index) => {
      this.scaledNetScore[index] =
        this.netScore[index] *
        this.criteriaWeightageMaxScore['netScore'].maxScore;
    });
  }

  disableExamlyImportButton() {
    this.isExamlyImportButtonVisible = false;
  }

  enableExamlyImportButton() {
    this.isExamlyImportButtonVisible = true;
  }

  enableReImportExamlyButton() {
    this.isExamlyReImportButtonVisible = true;
    this.isExamlyImportButtonVisible = false;
  }

  postExamlyNetScoreData() {
    let result: any = [];
    this.studentScores.forEach((studentDetail: any) => {
      this.studentEmail.push(studentDetail.studentEmail);
    });
    this.netScore.forEach((item, index) => {
      let examlyScore =
        this.currentRound.roundNumber == 5
          ? this.nonScaledCriteria3Scores[index]
          : this.actualExamlyScores[index];
      result.push({
        studentEmail: this.studentEmail[index],
        criteria3: examlyScore,
        netScore: this.scaledNetScore[index].toFixed(1),
      });
    });
    this.scoreboardService.postExamlyAndNetScore(result).subscribe({
      next: () => {
        this.currentRound.roundNumber == 4
          ? this.enableReImportExamlyButton()
          : this.disableExamlyImportButton();
        this.examlyNetScore.emit(result);
        this.handleInvalidData(MESSAGES.SUCCESS_EXAMLY_IMPORT, true);
      },
      error: () => {
        this.handleInvalidData(MESSAGES.FAILED_TO_LOAD_SERVER, false);
      },
    });
  }
}
