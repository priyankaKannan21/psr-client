import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import { getColumnDefinitions } from 'src/app/shared/utils/column-definition-helpers';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import {
  ALLOCATION_COLUMN_HEADER,
  ALLOCATION_DATA_VIEW,
} from '../../constants/candidate-allocation.constant';
import {
  ALLOCATION_DOWNLOAD_HEADER,
  ALLOCATION_FILE_NAME,
} from 'src/app/shared/constants/table-column-definitions.constant';
import { ALLOCATION_MESSAGES } from '../../constants/candidate-allocation.constant';
import { tap, timer, combineLatest, catchError, EMPTY } from 'rxjs';
import { MESSAGE_DISPLAY_TIME } from '../../constants/scoreboard.constants';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';

@Component({
  selector: 'app-allocation-list',
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.scss'],
})
export class AllocationListComponent implements OnInit {
  dataSource: any = {};
  @Input() isAllocationDataPosted: any;
  @Output() completedEventEmitter = new EventEmitter<string>();

  @ViewChild(TableComponent)
  private childComponent!: TableComponent;
  postError: boolean = false;
  isAllocationCompleted: boolean = false;
  isSuccessMessageVisible: boolean = false;
  successMessage: string = ALLOCATION_MESSAGES.SUCCESS;
  constructor(
    private candidateAllocationService: CandidateAllocationService,
    private adminHttpService: AdminHttpService,
    private scoreBoardService: ScoreboardService
  ) {}

  ngOnInit(): void {
    this.dataSource = ALLOCATION_DATA_VIEW;
    combineLatest([
      this.adminHttpService.getAllocationData(),
      this.scoreBoardService.getRoundData(),
    ])
      .pipe(
        tap(([allocationData, roundData]) => {
          if (allocationData.length > 0) {
            if (this.isAllocationDataPosted) {
              this.isSuccessMessageVisible = true;
              timer(MESSAGE_DISPLAY_TIME)
                .pipe(
                  tap(() => {
                    this.isSuccessMessageVisible = false;
                    this.isAllocationCompleted = true;
                  })
                )
                .subscribe();
            } else {
              this.isAllocationCompleted = true;
            }
            const isRoundStarted =
              roundData.roundProgress === 'in-progress' ||
              roundData.roundProgress === 'completed';
            this.isAllocationCompleted =
              this.isAllocationCompleted && !isRoundStarted;
            this.candidateAllocationService.allocationData = allocationData;
            this.dataSource['rowData'] = allocationData;
            this.dataSource['columnDefinitions'] = getColumnDefinitions(
              this.dataSource.ColumnFieldName
            );
            this.toCustomizeColumnName();
            this.completedEventEmitter.emit('allocation');
          }
        }),
        catchError(() => {
          this.postError = true;
          return EMPTY;
        })
      )
      .subscribe();
  }

  downloadAllocationData() {
    this.childComponent.toDownloadCSV(
      ALLOCATION_DOWNLOAD_HEADER,
      ALLOCATION_FILE_NAME
    );
  }

  toCustomizeColumnName() {
    this.dataSource['columnDefinitions'][1].headerName =
      ALLOCATION_COLUMN_HEADER.CANDIDATE_NAME;
    this.dataSource['columnDefinitions'][3].headerName =
      ALLOCATION_COLUMN_HEADER.CANDIDATE_EMAIL;
    this.dataSource['columnDefinitions'][4].headerName =
      ALLOCATION_COLUMN_HEADER.EVALUATOR_NAME;
    this.dataSource['columnDefinitions'][5].headerName =
      ALLOCATION_COLUMN_HEADER.EVALUATOR_EMAIL;
  }
}
