import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateListComponent } from './candidate-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { of, throwError } from 'rxjs';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import {
  CANDIDATE_COLUMN_HEADER,
  CANDIDATE_VIEW_DATA,
} from '../../constants/candidate-allocation.constant';
import { TableComponent } from 'src/app/shared/components/table/table.component';

fdescribe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;
  let adminHttpService: jasmine.SpyObj<AdminHttpService>;
  let candidateAllocationService: CandidateAllocationService;

  const candidateGetData = [
    {
      studentName: 'Student_1',
      studentEmail: 'student_1@gmail.com',
      department: 'ECE',
    },
    {
      studentName: 'Student_2',
      studentEmail: 'student_2@gmail.com',
      department: 'IT',
    },
  ];
  const allocationData = [
    {
      studentEmail: 'student_1@gmail.com',
      evaluatorEmail: 'evaluator_1@solitontech.com',
    },
    {
      studentEmail: 'student_2@gmail.com',
      evaluatorEmail: 'evaluator_2@solitontech.com',
    },
  ];

  beforeEach(async () => {
    let adminSpy = jasmine.createSpyObj('AdminHttpService', [
      'getCandidateData',
      'postCandidateData',
      'postAllocationData',
    ]);
    await TestBed.configureTestingModule({
      declarations: [CandidateListComponent, TableComponent],
      imports: [
        HttpClientTestingModule,
        AgGridModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AdminHttpService, useValue: adminSpy },
        CandidateAllocationService,
      ],
    }).compileComponents();

    adminHttpService = TestBed.inject(
      AdminHttpService
    ) as jasmine.SpyObj<AdminHttpService>;

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
    adminHttpService.getCandidateData.and.returnValue(of(candidateGetData));
    adminHttpService.postCandidateData.and.returnValue(of(candidateGetData));
    adminHttpService.postAllocationData.and.returnValue(of(allocationData));
    candidateAllocationService = TestBed.inject(CandidateAllocationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should assign dataSource variable', () => {
      expect(component.dataSource).toEqual(CANDIDATE_VIEW_DATA);
    });

    it('should assign candidateImportedData service variable', () => {
      expect(candidateAllocationService.candidateImportedData).toEqual(
        candidateGetData
      );
    });

    it('should handle error for candidate data retrieval', () => {
      adminHttpService.getCandidateData.and.returnValue(of([]));
      component.ngOnInit();
      expect(component.isFileUploadViewDisabled).toBe(true);
      expect(component.isTableViewDisabled).toBe(false);
    });

    it('should handle error for candidate data retrieval', () => {
      adminHttpService.getCandidateData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      component.ngOnInit();
      expect(component.postError).toBe(true);
    });
  });

  describe('should handle file data event', () => {
    const eventEmittedFileData = [
      {
        studentName: 'Student_1',
        studentEmail: 'student_1@gmail.com',
        department: 'ECE',
      },
      {
        studentName: 'Student_2',
        studentEmail: 'student_2@gmail.com',
        department: 'IT',
      },
    ];

    beforeEach(async () => {
      candidateAllocationService.evaluatorImportedData = [
        {
          evaluatorName: 'Evaluator_1',
          evaluatorEmail: 'evaluator_1@solitontech.com',
          proctorEmail: 'proctor1@exmly.in',
        },
        {
          evaluatorName: 'Evaluator_2',
          evaluatorEmail: 'evaluator_2@solitontech.com',
          proctorEmail: 'proctor2@exmly.in',
        },
      ];
      component.fileDataEvent(eventEmittedFileData);
    });

    it('should assign dataSource variable', () => {
      expect(component.dataSource).toEqual(CANDIDATE_VIEW_DATA);
    });

    it('should assign candidateImportedData service variable', () => {
      expect(candidateAllocationService.candidateImportedData).toEqual(
        candidateGetData
      );
    });

    it('should handle successful post candidate allocation data', () => {
      expect(adminHttpService.postCandidateData).toHaveBeenCalledWith(
        candidateGetData
      );
    });

    it('should handle error for post candidate data', () => {
      adminHttpService.postCandidateData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      component.fileDataEvent(eventEmittedFileData);
      expect(component.postError).toBe(true);
    });
  });
  it('should customize column names in dataSource', () => {
    component.dataSource = CANDIDATE_VIEW_DATA;

    component.toCustomizeColumnName();

    expect(component.dataSource.columnDefinitions[1].headerName).toEqual(
      CANDIDATE_COLUMN_HEADER.NAME
    );
    expect(component.dataSource.columnDefinitions[3].headerName).toEqual(
      CANDIDATE_COLUMN_HEADER.EMAIL
    );
  });
});
