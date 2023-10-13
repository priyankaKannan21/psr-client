import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import {
  CANDIDATE_COLUMN_HEADER,
  CANDIDATE_VIEW_DATA,
} from '../../constants/candidate-allocation.constant';
import { toMapEvaluatorCandidateData } from '../../utils/candidate-allocation-functions';
import { getColumnDefinitions } from 'src/app/shared/utils/column-definition-helpers';
import {
  AllocationData,
  CandidateData,
} from '../../models/candidate-allocation.model';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
  isTableViewDisabled: boolean = false;
  isFileUploadViewDisabled: boolean = false;
  postError: boolean = false;
  dataSource: any = {};

  @Output() completedEventEmitter = new EventEmitter<string>();
  @Output() isAllocated = new EventEmitter<boolean>();
  constructor(
    private candidateAllocationService: CandidateAllocationService,
    private adminHttpService: AdminHttpService
  ) {}

  ngOnInit(): void {
    this.dataSource = CANDIDATE_VIEW_DATA;
    this.adminHttpService.getCandidateData().subscribe({
      next: (candidateGetdata: CandidateData[]) => {
        if (candidateGetdata.length > 0) {
          this.candidateAllocationService.candidateImportedData =
            candidateGetdata;
          this.isTableViewDisabled = true;
          this.isFileUploadViewDisabled = false;
          this.dataSource['rowData'] = candidateGetdata;
          this.dataSource['columnDefinitions'] = getColumnDefinitions(
            this.dataSource.ColumnFieldName
          );
          this.toCustomizeColumnName();
          this.completedEventEmitter.emit('candidate');
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
    let allocationData: AllocationData[];
    this.dataSource = CANDIDATE_VIEW_DATA;
    this.candidateAllocationService.candidateImportedData =
      eventEmittedFileData;
    this.dataSource['rowData'] =
      this.candidateAllocationService.candidateImportedData;
    this.dataSource['columnDefinitions'] = getColumnDefinitions(
      this.dataSource.ColumnFieldName
    );
    this.toCustomizeColumnName();
    this.isTableViewDisabled = true;
    this.isFileUploadViewDisabled = false;

    this.adminHttpService
      .postCandidateData(this.candidateAllocationService.candidateImportedData)
      .subscribe({
        complete: () => {
          allocationData = toMapEvaluatorCandidateData(
            this.candidateAllocationService.evaluatorImportedData,
            this.candidateAllocationService.candidateImportedData
          );
          this.adminHttpService.postAllocationData(allocationData).subscribe({
            complete: () => {
              this.completedEventEmitter.emit('candidate');
              this.isAllocated.emit(true);
            },
            error: () => {
              this.postError = true;
            },
          });
        },
        error: () => {
          this.postError = true;
        },
      });
  }

  toCustomizeColumnName() {
    this.dataSource['columnDefinitions'][1].headerName =
      CANDIDATE_COLUMN_HEADER.NAME;
    this.dataSource['columnDefinitions'][3].headerName =
      CANDIDATE_COLUMN_HEADER.EMAIL;
  }
}
