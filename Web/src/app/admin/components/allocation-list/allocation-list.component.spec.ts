import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationListComponent } from './allocation-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { of, throwError } from 'rxjs';
import { ROUND_DATA } from '../../constants/scoreboard.constants';
import {
  ALLOCATION_COLUMN_HEADER,
  ALLOCATION_DATA_VIEW,
} from '../../constants/candidate-allocation.constant';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import { By } from '@angular/platform-browser';

fdescribe('AllocationListComponent', () => {
  let component: AllocationListComponent;
  let fixture: ComponentFixture<AllocationListComponent>;
  let adminHttpService: jasmine.SpyObj<AdminHttpService>;
  let scoreBoardService: jasmine.SpyObj<ScoreboardService>;
  let candidateAllocationService: CandidateAllocationService;
  let childComponent: TableComponent;

  const allocationData = [
    {
      studentName: 'Student_1',
      studentEmail: 'student_1@gmail.com',
      department: 'ECE',
      evaluatorName: 'Evaluator_1',
      evaluatorEmail: 'evaluator_1@solitontech.com',
      proctorEmail: 'proctor1@exmly.in',
    },
    {
      studentName: 'Student_2',
      studentEmail: 'student_2@gmail.com',
      department: 'IT',
      evaluatorName: 'Evaluator_2',
      evaluatorEmail: 'evaluator_2@solitontech.com',
      proctorEmail: 'proctor2@exmly.in',
    },
  ];
  const RoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };

  beforeEach(async () => {
    let adminSpy = jasmine.createSpyObj('AdminHttpService', [
      'getAllocationData',
    ]);

    let scoreBoardSpy = jasmine.createSpyObj('ScoreboardService', [
      'getRoundData',
    ]);
    await TestBed.configureTestingModule({
      declarations: [AllocationListComponent, TableComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AdminHttpService, useValue: adminSpy },
        { provide: ScoreboardService, useValue: scoreBoardSpy },
        CandidateAllocationService,
      ],
    }).compileComponents();

    adminHttpService = TestBed.inject(
      AdminHttpService
    ) as jasmine.SpyObj<AdminHttpService>;

    scoreBoardService = TestBed.inject(
      ScoreboardService
    ) as jasmine.SpyObj<ScoreboardService>;

    fixture = TestBed.createComponent(AllocationListComponent);
    component = fixture.componentInstance;
    adminHttpService.getAllocationData.and.returnValue(of(allocationData));
    scoreBoardService.getRoundData.and.returnValue(of(RoundData));
    candidateAllocationService = TestBed.inject(CandidateAllocationService);
    childComponent = fixture.debugElement.query(
      By.directive(TableComponent)
    ).componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should assign dataSource variable', () => {
      expect(component.dataSource).toEqual(ALLOCATION_DATA_VIEW);
    });

    it('should assign allocationData service variable', () => {
      expect(candidateAllocationService.allocationData).toEqual(allocationData);
    });

    it('should handle error for allocation data retrieval', () => {
      adminHttpService.getAllocationData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      component.ngOnInit();
      expect(component.postError).toBe(true);
    });

    it('should handle empty allocation data retrieval', () => {
      adminHttpService.getAllocationData.and.returnValue(of([]));
      component.ngOnInit();
      expect(component.isAllocationCompleted).toBe(true);
    });
  });

  it('should call toDownloadCSV method with correct parameters', () => {
    const ALLOCATION_DOWNLOAD_HEADER = ['proctorEmail', 'studentEmail'];
    const ALLOCATION_FILE_NAME = 'allocation-detail.csv';

    spyOn(childComponent, 'toDownloadCSV');

    component.downloadAllocationData();

    expect(childComponent.toDownloadCSV).toHaveBeenCalledWith(
      ALLOCATION_DOWNLOAD_HEADER,
      ALLOCATION_FILE_NAME
    );
  });

    it('should customize column names in dataSource', () => {
      component.dataSource = ALLOCATION_DATA_VIEW;

      component.toCustomizeColumnName();

      expect(component.dataSource.columnDefinitions[1].headerName).toEqual(
        ALLOCATION_COLUMN_HEADER.CANDIDATE_NAME
      );
      expect(component.dataSource.columnDefinitions[3].headerName).toEqual(
        ALLOCATION_COLUMN_HEADER.CANDIDATE_EMAIL
      );
      expect(component.dataSource.columnDefinitions[4].headerName).toEqual(
        ALLOCATION_COLUMN_HEADER.EVALUATOR_NAME
      );
      expect(component.dataSource.columnDefinitions[5].headerName).toEqual(
        ALLOCATION_COLUMN_HEADER.EVALUATOR_EMAIL
      );
    });
});
