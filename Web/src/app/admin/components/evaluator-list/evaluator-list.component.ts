import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import { getColumnDefinitions } from 'src/app/shared/utils/column-definition-helpers';
import {
  EVALUATOR_COLUMN_HEADER,
  EVALUATOR_VIEW_DATA,
} from '../../constants/candidate-allocation.constant';
import { toMapEvaluatorProctorData } from '../../utils/candidate-allocation-functions';
import { EvaluatorAllocationData } from '../../models/candidate-allocation.model';

@Component({
  selector: 'app-evaluator-list',
  templateUrl: './evaluator-list.component.html',
  styleUrls: ['./evaluator-list.component.scss'],
})
export class EvaluatorListComponent implements OnInit {
  isTableViewDisabled: boolean = false;
  isFileUploadViewDisabled: boolean = false;
  dataSource: any = {};

  @Output() completedEventEmitter = new EventEmitter<string>();
  postError: boolean = false;

  constructor(
    private candidateAllocationService: CandidateAllocationService,
    private adminHttpService: AdminHttpService
  ) {}

  ngOnInit(): void {
    this.dataSource = EVALUATOR_VIEW_DATA;
    this.adminHttpService.getProctorData().subscribe((data: string[]) => {
      this.candidateAllocationService.proctorData = data;
    });
    this.adminHttpService.getEvaluatorData().subscribe({
      next: (evaluatorGetData: EvaluatorAllocationData[]) => {
        if (evaluatorGetData.length > 0) {
          this.candidateAllocationService.evaluatorImportedData =
            evaluatorGetData;
          this.isTableViewDisabled = true;
          this.isFileUploadViewDisabled = false;
          this.dataSource['rowData'] = evaluatorGetData;
          this.dataSource['columnDefinitions'] = getColumnDefinitions(
            this.dataSource.ColumnFieldName
          );
          this.toCustomizeColumnName();
          this.completedEventEmitter.emit('evaluator');
        } else {
          this.isFileUploadViewDisabled = true;
          this.isTableViewDisabled = false;
        }
      },
      error: () => {
        this.postError = true;
      },
    });
  }

  fileDataEvent(eventEmittedFileData: any) {
    this.dataSource = EVALUATOR_VIEW_DATA;
    this.candidateAllocationService.evaluatorImportedData =
      toMapEvaluatorProctorData(
        eventEmittedFileData,
        this.candidateAllocationService.proctorData
      );

    this.dataSource['rowData'] =
      this.candidateAllocationService.evaluatorImportedData;
    this.dataSource['columnDefinitions'] = getColumnDefinitions(
      this.dataSource.ColumnFieldName
    );
    this.toCustomizeColumnName();

    this.isTableViewDisabled = true;
    this.isFileUploadViewDisabled = false;

    this.adminHttpService
      .postEvaluatorAllocationData(
        this.candidateAllocationService.evaluatorImportedData
      )
      .subscribe({
        error: () => {
          this.postError = true;
        },
      });
    this.completedEventEmitter.emit('evaluator');
  }

  toCustomizeColumnName() {
    this.dataSource['columnDefinitions'][1].headerName =
      EVALUATOR_COLUMN_HEADER.NAME;
    this.dataSource['columnDefinitions'][2].headerName =
      EVALUATOR_COLUMN_HEADER.EMAIL;
  }
}
