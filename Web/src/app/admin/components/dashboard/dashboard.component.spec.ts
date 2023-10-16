import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { AdminHttpService } from '../../services/admin-http/admin-http.service';
import { MESSAGES, ROUND_DATA } from '../../constants/scoreboard.constants';
import { MatRadioChange } from '@angular/material/radio';
import { RoundData } from '../../models/scoreboard.models';
import { WeightageMaxscoreDialogContentComponent } from '../weightage-maxscore-dialog-content/weightage-maxscore-dialog-content.component';
import { MatDialog } from '@angular/material/dialog';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let scoreboardService: ScoreboardService;
  let adminService: AdminHttpService;
  let router: Router;
  let route: ActivatedRoute;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        ScoreboardService,
        AdminHttpService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            paramMap: {
              get: () => 'scoreboard',
            },
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of(true),
            }),
          },
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
      imports: [MatDialogModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    scoreboardService = TestBed.inject(ScoreboardService);
    adminService = TestBed.inject(AdminHttpService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle successful data retrieval', () => {
    const mockData = [
      {
        studentName: 'Student_1',
        studentDepartment: 'ECE',
        studentEmail: 'student_1@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 3,
        criteria2: 2,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
      {
        studentName: 'Student_2',
        studentDepartment: 'ECE',
        studentEmail: 'student_2@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 4,
        criteria2: 1,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];
    spyOn(scoreboardService, 'getEvaluatorData').and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.evaluationDetails).toEqual(mockData);
  });

  it('should handle error', () => {
    spyOn(scoreboardService, 'getEvaluatorData').and.returnValue(
      throwError('Error')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(
      MESSAGES.FAILED_LOADING_EVALUATION_DATA
    );
  });

  it('should handle successful criteria data retrieval', () => {
    const mockCriteriaData = [
      {
        criteriaName: 'net_score',
        weightage: 0,
        maxScore: 10,
      },
      {
        criteriaName: 'criteria_1',
        weightage: 40,
        maxScore: 5,
      },
      {
        criteriaName: 'criteria_2',
        weightage: 40,
        maxScore: 5,
      },
      {
        criteriaName: 'criteria_3',
        weightage: 20,
        maxScore: 50,
      },
    ];
    spyOn(scoreboardService, 'getMaxScoreForEachCriteria').and.returnValue(
      of(mockCriteriaData)
    );
    component.ngOnInit();
    expect(component.criteriaWeightage).toEqual(mockCriteriaData);
  });

  it('should handle error for criteria data retrieval', () => {
    spyOn(scoreboardService, 'getMaxScoreForEachCriteria').and.returnValue(
      throwError('Error')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(MESSAGES.FAILED_LOADING_CRITERIA_DATA);
  });

  it('should handle successful criteria name retrieval', () => {
    const mockCriteriaNames = {
      criteria1: 'Logical Thinking',
      criteria2: 'Implementation Skills',
      criteria3: 'Examly Score',
    };
    spyOn(scoreboardService, 'getCriteriaNames').and.returnValue(
      of(mockCriteriaNames)
    );
    component.ngOnInit();
    expect(component.criteriaName).toEqual(mockCriteriaNames);
  });

  it('should handle error for criteria name retrieval', () => {
    spyOn(scoreboardService, 'getCriteriaNames').and.returnValue(
      throwError('Error')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(MESSAGES.FAILED_LOADING_CRITERIA_NAME);
  });

  it('should handle successful round data retrieval', () => {
    const mockRoundData = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.NOT_STARTED,
    };
    spyOn(scoreboardService, 'getRoundData').and.returnValue(of(mockRoundData));
    component.getRoundData();
    expect(component.roundDetails).toEqual(mockRoundData);
  });

  it('should handle error for round data retrieval', () => {
    spyOn(scoreboardService, 'getRoundData').and.returnValue(
      throwError('Error')
    );
    component.getRoundData();
    expect(component.errorMessage).toBe(MESSAGES.FAILED_LOADING_ROUND_DATA);
  });

  it('should handle successful allocation data retrieval with data', () => {
    const mockData = [
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_1@solitontech.com',
        evaluatorName: 'Evaluator_1',
        proctorEmail: 'soliton.proctor1@examly.in',
        studentEmail: 'student_1@gmail.com',
        studentName: 'Student_1',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_2@solitontech.com',
        evaluatorName: 'Evaluator_2',
        proctorEmail: 'soliton.proctor2@examly.in',
        studentEmail: 'student_2@gmail.com',
        studentName: 'Student_2',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_3@solitontech.com',
        evaluatorName: 'Evaluator_3',
        proctorEmail: 'soliton.proctor3@examly.in',
        studentEmail: 'student_3@gmail.com',
        studentName: 'Student_3',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_4@solitontech.com',
        evaluatorName: 'Evaluator_4',
        proctorEmail: 'soliton.proctor4@examly.in',
        studentEmail: 'student_4@gmail.com',
        studentName: 'Student_4',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_5@solitontech.com',
        evaluatorName: 'Evaluator_5',
        proctorEmail: 'soliton.proctor5@examly.in',
        studentEmail: 'student_5@gmail.com',
        studentName: 'Student_5',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_1@solitontech.com',
        evaluatorName: 'Evaluator_1',
        proctorEmail: 'soliton.proctor1@examly.in',
        studentEmail: 'student_6@gmail.com',
        studentName: 'Student_6',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_2@solitontech.com',
        evaluatorName: 'Evaluator_2',
        proctorEmail: 'soliton.proctor2@examly.in',
        studentEmail: 'student_7@gmail.com',
        studentName: 'Student_7',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_3@solitontech.com',
        evaluatorName: 'Evaluator_3',
        proctorEmail: 'soliton.proctor3@examly.in',
        studentEmail: 'student_8@gmail.com',
        studentName: 'Student_8',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_4@solitontech.com',
        evaluatorName: 'Evaluator_4',
        proctorEmail: 'soliton.proctor4@examly.in',
        studentEmail: 'student_9@gmail.com',
        studentName: 'Student_9',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_5@solitontech.com',
        evaluatorName: 'Evaluator_5',
        proctorEmail: 'soliton.proctor5@examly.in',
        studentEmail: 'student_10@gmail.com',
        studentName: 'Student_10',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_1@solitontech.com',
        evaluatorName: 'Evaluator_1',
        proctorEmail: 'soliton.proctor1@examly.in',
        studentEmail: 'student_11@gmail.com',
        studentName: 'Student_11',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_2@solitontech.com',
        evaluatorName: 'Evaluator_2',
        proctorEmail: 'soliton.proctor2@examly.in',
        studentEmail: 'student_12@gmail.com',
        studentName: 'Student_12',
      },
      {
        department: 'ECE',
        evaluatorEmail: 'evaluator_3@solitontech.com',
        evaluatorName: 'Evaluator_3',
        proctorEmail: 'soliton.proctor3@examly.in',
        studentEmail: 'student_13@gmail.com',
        studentName: 'Student_13',
      },
    ];
    spyOn(adminService, 'getAllocationData').and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.isEvaluationDataPresent).toBe(true);
  });

  it('should handle successful allocation data retrieval with empty data', () => {
    const mockData: any[] = [];
    spyOn(adminService, 'getAllocationData').and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.isEvaluationDataPresent).toBe(false);
  });

  it('should handle error for allocation data retrieval', () => {
    spyOn(adminService, 'getAllocationData').and.returnValue(
      throwError('Error')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(
      MESSAGES.FAILED_LOADING_ALLOCATION_DATA
    );
  });

  it('should handle successful radio change', () => {
    const mockSelectedValue = 4;
    const mockRoundData: RoundData = {
      roundNumber: mockSelectedValue,
      roundProgress: ROUND_DATA.NOT_STARTED,
    };
    spyOn(adminService, 'postRoundProgress').and.returnValue(of(mockRoundData));

    const matRadioChange: MatRadioChange = {
      value: mockSelectedValue,
    } as MatRadioChange;
    component.radioChange(matRadioChange);

    expect(adminService.postRoundProgress).toHaveBeenCalledWith({
      roundNumber: mockSelectedValue,
      roundProgress: ROUND_DATA.NOT_STARTED,
    });
  });

  it('should handle error for radio change', () => {
    spyOn(adminService, 'postRoundProgress').and.returnValue(
      throwError('Error')
    );
    const matRadioChange: MatRadioChange = { value: 4 } as MatRadioChange;
    component.radioChange(matRadioChange);
    expect(component.errorMessage).toEqual(MESSAGES.FAILED_LOADING_ROUND_DATA);
  });

  it('should handle successful round change to in-progress', () => {
    const mockSelectedValue = 4;
    const mockRoundData: RoundData = {
      roundNumber: mockSelectedValue,
      roundProgress: ROUND_DATA.NOT_STARTED,
    };
    spyOn(adminService, 'postRoundProgress').and.returnValue(of(mockRoundData));
    component.selectedValue = mockSelectedValue;
    component.changeRoundToInProgress();
    expect(adminService.postRoundProgress).toHaveBeenCalledWith({
      roundNumber: mockSelectedValue,
      roundProgress: ROUND_DATA.IN_PROGRESS,
    });
    expect(router.navigate).toHaveBeenCalledWith(['scoreboard'], {
      relativeTo: route,
    });
  });

  it('should handle error for changeRoundToInProgress', () => {
    spyOn(adminService, 'postRoundProgress').and.returnValue(
      throwError('Error')
    );
    component.changeRoundToInProgress();
    expect(component.errorMessage).toEqual(MESSAGES.FAILED_TO_START_EVALUATION);
  });

  it('should handle successful round completion', () => {
    spyOn(adminService, 'getCompleteRound').and.returnValue(of(''));
    component.completeRound();
    expect(adminService.getCompleteRound).toHaveBeenCalled();
    expect(component.isEvaluationDataPresent).toBe(false);
  });

  it('should handle error for completeRound', () => {
    spyOn(adminService, 'getCompleteRound').and.returnValue(
      throwError('Error')
    );
    component.completeRound();
    expect(component.errorMessage).toEqual(MESSAGES.FAILED_TO_COMPLETE_ROUND);
  });

  it('should navigate to the scoreboard route', () => {
    component.navigateToScoreboard();
    expect(router.navigate).toHaveBeenCalledWith(['scoreboard'], {
      relativeTo: route,
    });
  });

  it('should navigate to the candidate-allocation route', () => {
    component.redirectToCandidate();
    expect(router.navigate).toHaveBeenCalledWith(['../candidate-allocation'], {
      relativeTo: route,
    });
  });

  it('should call completeRound when dialog result is true', () => {
    spyOn(component, 'completeRound');
    component.showDeleteDialog();
    expect(component.completeRound).toHaveBeenCalled();
  });

  it('should open manage scoreboard dialog', () => {
    spyOn(dialog, 'open');
    component.openManageScoreboardDialog();
    expect(dialog.open).toHaveBeenCalledWith(
      WeightageMaxscoreDialogContentComponent,
      {
        panelClass: 'weightage-maxscore-dialog',
        data: {
          criteriaWeightage: component.criteriaWeightage,
          criteriaName: component.criteriaName,
          isMaxScoreEditable: true,
        },
      }
    );
  });
});
