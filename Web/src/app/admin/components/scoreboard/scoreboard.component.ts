import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EvaluationDataService } from '../../services/evaluation-data/evaluation-data.service';
import { EvaluationData } from '../../models/evaluation-data.model';
import {
  CriteriaWeightageMaxScore,
  ErrorSuccessMessageForExamly,
  RoundData,
} from '../../models/scoreboard.models';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import {
  getColumnDefinitions,
  setColumnDefinitionHeaders,
} from 'src/app/shared/utils/column-definition-helpers';
import {
  getColumnKeys,
  mapEvaluationDataWithNetExamlyScore,
  modifyColumnDefinitionsHeaders,
} from '../../utils/helpers';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MESSAGES,
  MESSAGE_DISPLAY_TIME,
  COLUMN_KEYS_FOR_DOWNLOAD_SCOREBOARD,
  ROUND_DATA,
  SCOREBOARD_FILE_NAME,
} from '../../constants/scoreboard.constants';
import { Subscription, tap, timer } from 'rxjs';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { NetscoreCalculationComponent } from '../../components/netscore-calculation/netscore-calculation.component';
import { CriteriaNames } from '../../../shared/models/evaluation-data.model';
import { EvaluationLiveDataService } from 'src/app/shared/services/evaluation-live-data/evaluation-live-data.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('netScoreCalculation')
  netScoreCalculation!: NetscoreCalculationComponent;
  isExamlyScoreImported: boolean = false;
  errorMessage: string = '';
  loadingMessage: string = '';
  successMessage: string = '';
  dataSource: any = {
    dataTableHeight: '65vh',
  };
  roundData: RoundData = {
    roundNumber: 0,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  displayExamlyErrorSuccessMessage: ErrorSuccessMessageForExamly = {
    successStatus: false,
    errorSuccessMessage: '',
  };
  criteriaWeightage: CriteriaWeightageMaxScore[] = [];
  subscriptions$: Subscription[] = [];
  showCompleteRound: boolean = false;
  criteriaNames: CriteriaNames = {
    criteria1: '',
    criteria2: '',
    criteria3: '',
  };

  @ViewChild(TableComponent, { static: true }) table!: TableComponent;

  constructor(
    private evaluationDataService: EvaluationDataService,
    private scoreboardService: ScoreboardService,
    private evaluationLiveDataService: EvaluationLiveDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let subscription;
    this.dataSource.isTableViewDisabled = false;

    subscription = this.scoreboardService.getCriteriaNames().subscribe({
      next: (criteriaNames: CriteriaNames) => {
        this.criteriaNames = criteriaNames;
      },
      error: () => {
        this.showErrorMessage(MESSAGES.FAILED_LOADING_CRITERIA_NAME);
      },
    });

    this.subscriptions$.push(subscription);

    subscription = this.scoreboardService.getRoundData().subscribe({
      next: (roundData: RoundData) => {
        if (roundData.roundProgress === ROUND_DATA.NOT_STARTED) {
          this.router.navigate(['../../dashboard'], { relativeTo: this.route });
        } else if (roundData.roundProgress === ROUND_DATA.IN_PROGRESS) {
          this.evaluationLiveDataService.startLiveData();
        }
        this.roundData = roundData;
        this.getEvaluationData();
      },
      error: () => {
        this.showErrorMessage(MESSAGES.FAILED_LOADING_ROUND_DATA);
      },
    });

    this.subscriptions$.push(subscription);

    subscription = this.scoreboardService
      .getMaxScoreForEachCriteria()
      .subscribe({
        next: (criteriaWeightage: CriteriaWeightageMaxScore[]) => {
          this.criteriaWeightage = criteriaWeightage;
        },
        error: () => {
          this.showErrorMessage(MESSAGES.FAILED_LOADING_CRITERIA_DATA);
        },
      });
    this.subscriptions$.push(subscription);
  }

  ngAfterViewInit(): void {
    this.netScoreCalculation.getRoundDetailsAndCalculate();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((subscription) => subscription.unsubscribe());
  }

  displayErrorAndSuccessMessages(
    errorAndSuccessMessage: ErrorSuccessMessageForExamly
  ) {
    if (errorAndSuccessMessage.successStatus) {
      this.showSuccessMessage(errorAndSuccessMessage.errorSuccessMessage);
      this.displayExamlyErrorSuccessMessage.errorSuccessMessage = '';
      return;
    }
    this.displayExamlyErrorSuccessMessage = errorAndSuccessMessage;
  }

  setColumnDefinitions() {
    this.isExamlyScoreImported =
      this.dataSource.rowData[0].criteria3 !== undefined;
    let evaluationDataKeys = getColumnKeys(
      this.roundData,
      this.isExamlyScoreImported
    );

    this.dataSource.columnDefinitions =
      getColumnDefinitions(evaluationDataKeys);

    this.dataSource.columnDefinitions = setColumnDefinitionHeaders(
      this.dataSource.columnDefinitions,
      this.criteriaNames
    );

    this.dataSource.columnDefinitions = modifyColumnDefinitionsHeaders(
      this.dataSource.columnDefinitions,
      this.criteriaWeightage
    );
  }

  displayExamlyNetScoreColumns(result: any) {
    this.dataSource.rowData = mapEvaluationDataWithNetExamlyScore(
      result,
      this.dataSource.rowData
    );

    this.setColumnDefinitions();
  }

  getEvaluationData() {
    let subscription = this.evaluationDataService
      .getEvaluationData(this.roundData)
      .subscribe({
        next: (evaluationData: EvaluationData[]) => {
          this.dataSource.rowData = evaluationData;

          this.setColumnDefinitions();
        },
        error: () => {
          this.showErrorMessage(MESSAGES.FAILED_LOADING_EVALUATION_DATA);
        },
      });

    this.subscriptions$.push(subscription);
  }

  endEvaluation() {
    this.loadingMessage = MESSAGES.FREEZING_EVALUATOR_SCORES;
    this.errorMessage = '';
    this.dataSource.isTableViewDisabled = true;
    this.roundData.roundProgress = ROUND_DATA.COMPLETED;

    let subscription = this.scoreboardService
      .postRoundData(this.roundData)
      .subscribe({
        next: () => {
          this.evaluationLiveDataService.stopLiveData();
          this.loadingMessage = '';
          this.dataSource.isTableViewDisabled = false;
          this.showSuccessMessage(MESSAGES.FROZEN_EVALUATOR_SCORES);
          this.netScoreCalculation.getRoundDetailsAndCalculate();
        },
        error: () => {
          this.loadingMessage = '';
          this.dataSource.isTableViewDisabled = false;
          this.showErrorMessage(MESSAGES.REQUEST_FAILED);
          this.roundData.roundProgress = ROUND_DATA.IN_PROGRESS;
        },
      });

    this.subscriptions$.push(subscription);
  }

  downloadScoreboard() {
    this.table['toDownloadCSV'](
      COLUMN_KEYS_FOR_DOWNLOAD_SCOREBOARD,
      SCOREBOARD_FILE_NAME
    );
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    let subscription = timer(MESSAGE_DISPLAY_TIME)
      .pipe(
        tap(() => {
          this.errorMessage = '';
        })
      )
      .subscribe();
    this.subscriptions$.push(subscription);
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    let subscription = timer(MESSAGE_DISPLAY_TIME)
      .pipe(
        tap(() => {
          this.successMessage = '';
          this.showCompleteRound = message == MESSAGES.SUCCESS_EXAMLY_IMPORT;
        })
      )
      .subscribe();
    this.subscriptions$.push(subscription);
  }
}
