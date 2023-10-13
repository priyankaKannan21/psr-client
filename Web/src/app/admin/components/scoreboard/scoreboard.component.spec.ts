import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ScoreboardComponent } from './scoreboard.component';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { CriteriaNames } from 'src/app/shared/models/evaluation-data.model';
import { of, throwError } from 'rxjs';
import {
  CriteriaWeightageMaxScore,
  ErrorSuccessMessageForExamly,
  RoundData,
} from '../../models/scoreboard.models';
import {
  MESSAGES,
  MESSAGE_DISPLAY_TIME,
  ROUND_DATA,
} from '../../constants/scoreboard.constants';
import { EvaluationData } from '../../models/evaluation-data.model';

@Component({
  selector: 'app-netscore-calculation',
  template: '',
})
class MockNetscoreCalculationComponent {
  getRoundDetailsAndCalculate() {}
}

fdescribe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;
  let scoreboardServiceSpy: jasmine.SpyObj<ScoreboardService>;
  let criteriaNames: CriteriaNames = {
    criteria1: 'Logical Thinking',
    criteria2: 'Implementation Skills',
    criteria3: 'Examly Score',
  };
  let roundData: RoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  let evaluationData: EvaluationData[] = [
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
  let criteriaWeightageMacScore: CriteriaWeightageMaxScore[] = [
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

  beforeEach(async () => {
    const scoreboardSpyObject = jasmine.createSpyObj('ScoreboardService', [
      'getRoundData',
      'getEvaluatorData',
      'getMaxScoreForEachCriteria',
      'postRoundData',
      'getCriteriaNames',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ScoreboardComponent, MockNetscoreCalculationComponent],
      providers: [
        { provide: ScoreboardService, useValue: scoreboardSpyObject },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreboardComponent);
    scoreboardServiceSpy = TestBed.inject(
      ScoreboardService
    ) as jasmine.SpyObj<ScoreboardService>;
    component = fixture.componentInstance;

    scoreboardServiceSpy.getCriteriaNames.and.returnValue(of(criteriaNames));
    scoreboardServiceSpy.getEvaluatorData.and.returnValue(of(evaluationData));
    scoreboardServiceSpy.getMaxScoreForEachCriteria.and.returnValue(
      of(criteriaWeightageMacScore)
    );
    scoreboardServiceSpy.getRoundData.and.returnValue(of(roundData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set criteriaNames', () => {
      expect(component.criteriaNames).toEqual(criteriaNames);
    });

    it('should set roundData', () => {
      expect(component.roundData).toEqual(roundData);
    });

    it('should set criteriaWeightage', () => {
      expect(component.criteriaWeightage).toEqual(criteriaWeightageMacScore);
    });

    it('should set dataSource.rowData', () => {
      expect(component.dataSource.rowData).toEqual(evaluationData);
    });

    it('should set dataSource.columnDefinitions', () => {
      expect(component.dataSource.columnDefinitions).toBeTruthy();
    });

    describe('startLiveData function', () => {
      let startLiveDataSpy: jasmine.Spy<jasmine.Func>;

      beforeEach(() => {
        startLiveDataSpy = jasmine.createSpy('startLiveData');
        component['evaluationLiveDataService'].startLiveData = startLiveDataSpy;
      });

      it('should not call when the round is not started', () => {
        roundData.roundProgress = ROUND_DATA.NOT_STARTED;
        scoreboardServiceSpy.getRoundData.and.returnValue(of(roundData));
        component.ngOnInit();

        expect(startLiveDataSpy).not.toHaveBeenCalled();
      });

      it('should call when the round is in progress', () => {
        roundData.roundProgress = ROUND_DATA.IN_PROGRESS;
        scoreboardServiceSpy.getRoundData.and.returnValue(of(roundData));

        component.ngOnInit();

        expect(startLiveDataSpy).toHaveBeenCalled();
      });

      it('should not call when the round is completed', () => {
        roundData.roundProgress = ROUND_DATA.COMPLETED;
        scoreboardServiceSpy.getRoundData.and.returnValue(of(roundData));

        component.ngOnInit();

        expect(startLiveDataSpy).not.toHaveBeenCalled();
      });
    });

    it('should handle error for criteriaNames retrieval', () => {
      scoreboardServiceSpy.getCriteriaNames.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      spyOn(component, 'showErrorMessage');

      component.ngOnInit();

      expect(component.showErrorMessage).toHaveBeenCalledWith(
        MESSAGES.FAILED_LOADING_CRITERIA_NAME
      );
    });

    it('should handle error for roundData retrieval', () => {
      scoreboardServiceSpy.getRoundData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      spyOn(component, 'showErrorMessage');

      component.ngOnInit();

      expect(component.showErrorMessage).toHaveBeenCalledWith(
        MESSAGES.FAILED_LOADING_ROUND_DATA
      );
    });

    it('should handle error for criteriaWeightage retrieval', () => {
      scoreboardServiceSpy.getMaxScoreForEachCriteria.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      spyOn(component, 'showErrorMessage');

      component.ngOnInit();

      expect(component.showErrorMessage).toHaveBeenCalledWith(
        MESSAGES.FAILED_LOADING_CRITERIA_DATA
      );
    });

    it('should handle error for evaluationData retrieval', () => {
      scoreboardServiceSpy.getEvaluatorData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      spyOn(component, 'showErrorMessage');

      component.ngOnInit();

      expect(component.showErrorMessage).toHaveBeenCalledWith(
        MESSAGES.FAILED_LOADING_EVALUATION_DATA
      );
    });
  });

  it('should call netScoreCalculation.getRoundDetailsAndCalculate on ngAfterViewInit', () => {
    const getRoundDetailsAndCalculateSpy = jasmine.createSpy(
      'getRoundDetailsAndCalculate'
    );
    component['netScoreCalculation'].getRoundDetailsAndCalculate =
      getRoundDetailsAndCalculateSpy;

    component.ngAfterViewInit();

    expect(getRoundDetailsAndCalculateSpy).toHaveBeenCalled();
  });

  describe('displayErrorAndSuccessMessages function', () => {
    let errorAndSuccessMessage: ErrorSuccessMessageForExamly;

    it('should call showSuccessMessage on successStatus is true', () => {
      errorAndSuccessMessage = {
        successStatus: true,
        errorSuccessMessage: 'Success',
      };
      spyOn(component, 'showSuccessMessage');

      component.displayErrorAndSuccessMessages(errorAndSuccessMessage);

      expect(component.showSuccessMessage).toHaveBeenCalledWith(
        errorAndSuccessMessage.errorSuccessMessage
      );
    });

    it('should clear displayExamlyErrorSuccessMessage.errorSuccessMessage on successStatus is true', () => {
      component.displayExamlyErrorSuccessMessage = {
        successStatus: false,
        errorSuccessMessage: 'This is a error Statement',
      };
      errorAndSuccessMessage = {
        successStatus: true,
        errorSuccessMessage: 'Success',
      };

      component.displayErrorAndSuccessMessages(errorAndSuccessMessage);

      expect(
        component.displayExamlyErrorSuccessMessage.errorSuccessMessage
      ).toBeFalsy();
    });

    it('should set displayExamlyErrorSuccessMessage on successStatus is false', () => {
      errorAndSuccessMessage = {
        successStatus: false,
        errorSuccessMessage: 'This is a error Statement',
      };

      component.displayErrorAndSuccessMessages(errorAndSuccessMessage);

      expect(component.displayExamlyErrorSuccessMessage).toEqual(
        errorAndSuccessMessage
      );
    });
  });

  describe('endEvaluation function', () => {
    it('should call postRoundData', () => {
      roundData.roundProgress = ROUND_DATA.COMPLETED;
      scoreboardServiceSpy.postRoundData.and.returnValue(of(roundData));

      component.endEvaluation();
      expect(scoreboardServiceSpy.postRoundData).toHaveBeenCalledWith(
        roundData
      );
    });

    describe('On successful postRoundData', () => {
      beforeEach(() => {
        roundData.roundProgress = ROUND_DATA.COMPLETED;
        scoreboardServiceSpy.postRoundData.and.returnValue(of(roundData));
      });

      it('should call stopLiveData function', () => {
        let stopLiveDataSpy = jasmine.createSpy('stopLiveData');
        component['evaluationLiveDataService'].stopLiveData = stopLiveDataSpy;

        component.endEvaluation();

        expect(stopLiveDataSpy).toHaveBeenCalled();
      });

      it('should call the showSuccessMessage function', () => {
        spyOn(component, 'showSuccessMessage');

        component.endEvaluation();

        expect(component.showSuccessMessage).toHaveBeenCalledWith(
          MESSAGES.FROZEN_EVALUATOR_SCORES
        );
      });

      it('should call getRoundDetailsAndCalculate function', () => {
        spyOn(component.netScoreCalculation, 'getRoundDetailsAndCalculate');

        component.endEvaluation();

        expect(
          component.netScoreCalculation.getRoundDetailsAndCalculate
        ).toHaveBeenCalled();
      });
    });

    it('should handle error during evaluation end', () => {
      roundData.roundProgress = ROUND_DATA.COMPLETED;
      scoreboardServiceSpy.postRoundData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      spyOn(component, 'showErrorMessage');

      component.endEvaluation();

      expect(component.showErrorMessage).toHaveBeenCalledWith(
        MESSAGES.REQUEST_FAILED
      );
      expect(component.roundData.roundProgress).toEqual(ROUND_DATA.IN_PROGRESS);
    });
  });

  it('should show error message and hide it after a delay', fakeAsync(() => {
    const errorMessage = 'An error occurred';

    component.showErrorMessage(errorMessage);

    expect(component.errorMessage).toBe(errorMessage);

    tick(MESSAGE_DISPLAY_TIME);

    expect(component.errorMessage).toBeFalsy();
  }));

  it('should show success message and hide it after a delay for SUCCESS_EXAMLY_IMPORT message', fakeAsync(() => {
    const successMessage = MESSAGES.SUCCESS_EXAMLY_IMPORT;

    component.showSuccessMessage(successMessage);

    expect(component.successMessage).toBe(successMessage);
    expect(component.showCompleteRound).toBeFalse();

    tick(MESSAGE_DISPLAY_TIME);

    expect(component.successMessage).toBeFalsy();
    expect(component.showCompleteRound).toBeTrue();
  }));

  it('should not set showCompleteRound to true for non SUCCESS_EXAMLY_IMPORT message', fakeAsync(() => {
    const successMessage = 'success message';

    component.showSuccessMessage(successMessage);

    expect(component.successMessage).toBe(successMessage);

    tick(MESSAGE_DISPLAY_TIME);

    expect(component.successMessage).toBeFalsy();
    expect(component.showCompleteRound).toBeFalse();
  }));

  describe('displayExamlyNetScoreColumns function', () => {
    it('should update dataSource.rowData and set column definitions', () => {
      const mockResult: any = [
        { studentEmail: 'student_1@gmail.com', criteria3: 4, netScore: 5 },
        { studentEmail: 'student_2@gmail.com', criteria3: 3, netScore: 4 },
      ];
      let updatedEvaluationData = [
        {
          studentName: 'Student_1',
          studentDepartment: 'ECE',
          studentEmail: 'student_1@gmail.com',
          evaluatorName: 'Soliton_1',
          criteria1: 3,
          criteria2: 2,
          criteria3: 4,
          netScore: 5,
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
          criteria3: 3,
          netScore: 4,
          comments:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
        },
      ];
      const setColumnDefinitionsSpy = spyOn(component, 'setColumnDefinitions');
      component.dataSource.rowData = evaluationData;

      component.displayExamlyNetScoreColumns(mockResult);

      expect(component.dataSource.rowData).toEqual(updatedEvaluationData);
      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });
});
