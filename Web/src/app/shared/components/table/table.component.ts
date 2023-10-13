import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ALLOCATION_DETAIL_COLUMN_HEADER,
  ALLOCATION_FILE_NAME,
  COLUMN_FIELDS,
  DEFAULT_COLUMN_DEFINITIONS,
  GRID_OPTIONS,
} from '../../constants/table-column-definitions.constant';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import {
  getColumnKeys,
  setDataValue,
} from '../../utils/column-definition-helpers';
import { REFRESH_TIME } from '../../constants/table.constants';
import { exportColumnData } from '../../models/export-column.model';
import { EvaluationDataService } from '../../services/evaluation-data/evaluation-data.service';
import { EvaluationLiveDataService } from '../../services/evaluation-live-data/evaluation-live-data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi;
  @Input() dataSource: any;
  gridOptions: GridOptions = GRID_OPTIONS;
  columnApi!: ColumnApi;
  defaultColumnDefinitions: ColDef = DEFAULT_COLUMN_DEFINITIONS;
  refreshInterval$ = interval(REFRESH_TIME);
  stopRefreshing$ = new Subject<void>();
  liveDataSubscription!: Subscription;

  constructor(
    private evaluationDataService: EvaluationDataService,
    private unsubscribeLiveDataService: EvaluationLiveDataService
  ) {}

  ngOnInit(): void {
    this.unsubscribeLiveDataService.isEvaluationLive$.subscribe(
      (isLiveDataRequired) => {
        if (isLiveDataRequired) {
          this.getLiveData();
        } else {
          this.unsubscribeLiveUpdates();
        }
      }
    );
  }

  unsubscribeLiveUpdates() {
    this.liveDataSubscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopRefreshing$.next();
    this.stopRefreshing$.complete();
  }

  toDownloadCSV(columnKeys: string[], fileName: string) {
    let params: exportColumnData;
    if (fileName === ALLOCATION_FILE_NAME) {
      const candidateEmailColumn: ColDef<any, any> | undefined = this.columnApi
        .getColumn(COLUMN_FIELDS.EMAIL_ID)
        ?.getColDef();
      const proctorEmailColumn: ColDef<any, any> | undefined = this.columnApi
        .getColumn(COLUMN_FIELDS.PROCTOR)
        ?.getColDef();

      if (candidateEmailColumn && proctorEmailColumn) {
        candidateEmailColumn.headerName =
          ALLOCATION_DETAIL_COLUMN_HEADER.CANDIDATE_EMAIL;
        proctorEmailColumn.headerName = ALLOCATION_DETAIL_COLUMN_HEADER.PROCTOR;
      }
      params = {
        columnDefs: [candidateEmailColumn, proctorEmailColumn],
        columnKeys,
        fileName,
      };
    } else {
      params = {
        columnKeys,
        fileName,
      };
    }
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  getLiveData() {
    this.liveDataSubscription = this.refreshInterval$
      .pipe(takeUntil(this.stopRefreshing$))
      .subscribe({
        next: () => {
          this.evaluationDataService.getLiveEvaluationData().subscribe({
            next: (evaluationData) => {
              let columnDefinitions: ColDef[] = this.gridApi.getColumnDefs()!;
              let columnKeys: string[] = getColumnKeys(columnDefinitions);

              evaluationData.forEach((studentScores, index) => {
                let rowNode = this.gridApi.getDisplayedRowAtIndex(index)!;

                setDataValue(
                  rowNode,
                  COLUMN_FIELDS.CRITERIA_1,
                  columnKeys,
                  evaluationData
                );

                setDataValue(
                  rowNode,
                  COLUMN_FIELDS.CRITERIA_2,
                  columnKeys,
                  evaluationData
                );

                setDataValue(
                  rowNode,
                  COLUMN_FIELDS.CRITERIA_3,
                  columnKeys,
                  evaluationData
                );

                setDataValue(
                  rowNode,
                  COLUMN_FIELDS.COMMENTS,
                  columnKeys,
                  evaluationData
                );
              });
            },
          });
        },
      });
  }
}
