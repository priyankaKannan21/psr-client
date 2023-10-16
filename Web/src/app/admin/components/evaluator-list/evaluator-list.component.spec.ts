import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatorListComponent } from './evaluator-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { of, throwError } from 'rxjs';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import {
  EVALUATOR_COLUMN_HEADER,
  EVALUATOR_VIEW_DATA,
} from '../../constants/candidate-allocation.constant';
import { TableComponent } from 'src/app/shared/components/table/table.component';

fdescribe('EvaluatorListComponent', () => {
  let component: EvaluatorListComponent;
  let fixture: ComponentFixture<EvaluatorListComponent>;
  let adminHttpService: jasmine.SpyObj<AdminHttpService>;
  let candidateAllocationService: CandidateAllocationService;

  const proctorData = ['proctor1@exmly.in', 'proctor2@exmly.in'];
  const evaluatorGetData = [
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

  beforeEach(async () => {
    let adminSpy = jasmine.createSpyObj('AdminHttpService', [
      'getProctorData',
      'getEvaluatorData',
      'postEvaluatorAllocationData',
    ]);

    await TestBed.configureTestingModule({
      declarations: [EvaluatorListComponent, TableComponent],
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

    fixture = TestBed.createComponent(EvaluatorListComponent);
    component = fixture.componentInstance;
    adminHttpService.getProctorData.and.returnValue(of(proctorData));
    adminHttpService.getEvaluatorData.and.returnValue(of(evaluatorGetData));
    adminHttpService.postEvaluatorAllocationData.and.returnValue(
      of(evaluatorGetData)
    );
    candidateAllocationService = TestBed.inject(CandidateAllocationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should assign dataSource variable', () => {
      expect(component.dataSource).toEqual(EVALUATOR_VIEW_DATA);
    });

    it('should assign proctorData service variable', () => {
      expect(candidateAllocationService.proctorData).toEqual(proctorData);
    });

    it('should assign evaluatorImportedData service variable', () => {
      expect(candidateAllocationService.evaluatorImportedData).toEqual(
        evaluatorGetData
      );
    });

    it('should handle error for evaluator data retrieval', () => {
      adminHttpService.getEvaluatorData.and.returnValue(of([]));
      component.ngOnInit();
      expect(component.isFileUploadViewDisabled).toBe(true);
      expect(component.isTableViewDisabled).toBe(false);
    });

    it('should handle error for evaluator data retrieval', () => {
      adminHttpService.getEvaluatorData.and.returnValue(
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
        evaluatorName: 'Evaluator_1',
        evaluatorEmail: 'evaluator_1@solitontech.com',
      },
      {
        evaluatorName: 'Evaluator_2',
        evaluatorEmail: 'evaluator_2@solitontech.com',
      },
    ];

    beforeEach(async () => {
      component.fileDataEvent(eventEmittedFileData);
    });

    it('should assign dataSource variable', () => {
      expect(component.dataSource).toEqual(EVALUATOR_VIEW_DATA);
    });

    it('should assign proctorData service variable', () => {
      expect(candidateAllocationService.proctorData).toEqual(proctorData);
    });

    it('should assign evaluatorImportedData service variable', () => {
      expect(candidateAllocationService.evaluatorImportedData).toEqual(
        evaluatorGetData
      );
    });

    it('should handle successful post evaluator allocation data', () => {
      expect(adminHttpService.postEvaluatorAllocationData).toHaveBeenCalledWith(
        evaluatorGetData
      );
    });

    it('should handle error for post evaluator allocation data', () => {
      adminHttpService.postEvaluatorAllocationData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      component.fileDataEvent(eventEmittedFileData);
      expect(component.postError).toBe(true);
    });
  });

  it('should customize column names in dataSource', () => {
    component.dataSource = EVALUATOR_VIEW_DATA;

    component.toCustomizeColumnName();

    expect(component.dataSource.columnDefinitions[1].headerName).toEqual(
      EVALUATOR_COLUMN_HEADER.NAME
    );
    expect(component.dataSource.columnDefinitions[2].headerName).toEqual(
      EVALUATOR_COLUMN_HEADER.EMAIL
    );
  });
});
