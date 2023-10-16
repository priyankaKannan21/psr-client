import { Component, OnInit } from '@angular/core';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import {
  CriteriaWeightageMaxScore,
  RoundData,
} from '../../models/scoreboard.models';
import { Router, ActivatedRoute } from '@angular/router';
import { MESSAGES, ROUND_DATA } from '../../constants/scoreboard.constants';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { WeightageMaxscoreDialogContentComponent } from '../weightage-maxscore-dialog-content/weightage-maxscore-dialog-content.component';
import { EvaluationData } from '../../models/evaluation-data.model';
import { CriteriaNames } from 'src/app/shared/models/evaluation-data.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  errorMessage: string = '';
  criteriaWeightage: CriteriaWeightageMaxScore[] = [];
  roundCriteriaDetails: CriteriaWeightageMaxScore[] = [];
  isEndEvaluation: boolean = false;
  isEvaluationDataPresent: boolean = false;
  roundDetails: RoundData = {
    roundNumber: 0,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  evaluationDetails: EvaluationData[] = [];
  isNetScoreCalculated: boolean = false;
  criteriaName: CriteriaNames = {
    criteria1: '',
    criteria2: '',
    criteria3: '',
  };
  isRoundProgressUpdated: boolean = false;
  constructor(
    private dialog: MatDialog,
    private scoreboardService: ScoreboardService,
    private adminService: AdminHttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCriteriaWeightageMaxScore();

    this.refreshCriteriaName();

    this.adminService.getAllocationData().subscribe({
      next: (evaluationData) => {
        if (Array.isArray(evaluationData) && evaluationData.length > 0) {
          this.isEvaluationDataPresent = true;
        }
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_LOADING_ALLOCATION_DATA;
      },
    });

    this.scoreboardService.getEvaluatorData().subscribe({
      next: (evaluationData) => {
        this.evaluationDetails = evaluationData;
        this.getRoundData();
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_LOADING_EVALUATION_DATA;
      },
    });
  }

  getRoundData() {
    this.scoreboardService.getRoundData().subscribe({
      next: (roundData: RoundData) => {
        this.roundDetails = roundData;
        this.isRoundProgressUpdated = true;
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_LOADING_ROUND_DATA;
      },
    });
  }

  getCriteriaWeightageMaxScore() {
    this.scoreboardService.getMaxScoreForEachCriteria().subscribe({
      next: (criteriaWeightage) => {
        this.criteriaWeightage = criteriaWeightage;
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_LOADING_CRITERIA_DATA;
      },
    });
  }

  refreshCriteriaName() {
    this.scoreboardService.getCriteriaNames().subscribe({
      next: (criteriaNames) => {
        this.criteriaName = criteriaNames;
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_LOADING_CRITERIA_NAME;
      },
    });
  }

  selectedValue: number = 4;

  radioChange(event: MatRadioChange) {
    this.selectedValue = event.value;
    this.adminService
      .postRoundProgress({
        roundNumber: this.selectedValue,
        roundProgress: ROUND_DATA.NOT_STARTED,
      })
      .subscribe({
        next: () => {
          this.getCriteriaWeightageMaxScore();
          this.refreshCriteriaName();
        },
        error: () => {
          this.errorMessage = MESSAGES.FAILED_LOADING_ROUND_DATA;
        },
      });
  }

  openManageScoreboardDialog() {
    const criteriaData = {
      criteriaWeightage: this.criteriaWeightage,
      criteriaName: this.criteriaName,
      isMaxScoreEditable: true,
    };
    this.dialog.open(WeightageMaxscoreDialogContentComponent, {
      panelClass: 'weightage-maxscore-dialog',
      data: criteriaData,
    });
  }

  changeRoundToInProgress() {
    this.adminService
      .postRoundProgress({
        roundNumber: this.selectedValue,
        roundProgress: ROUND_DATA.IN_PROGRESS,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['scoreboard'], { relativeTo: this.route });
        },
        error: () => {
          this.errorMessage = MESSAGES.FAILED_TO_START_EVALUATION;
        },
      });
  }

  showDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      panelClass: 'delete-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.completeRound();
      }
    });
  }

  completeRound() {
    this.adminService.getCompleteRound().subscribe({
      next: () => {
        this.isEvaluationDataPresent = false;
      },
      error: () => {
        this.errorMessage = MESSAGES.FAILED_TO_COMPLETE_ROUND;
      },
    });
  }

  navigateToScoreboard() {
    this.router.navigate(['scoreboard'], { relativeTo: this.route });
  }

  redirectToCandidate() {
    this.router.navigate(['../candidate-allocation'], {
      relativeTo: this.route,
    });
  }
}
