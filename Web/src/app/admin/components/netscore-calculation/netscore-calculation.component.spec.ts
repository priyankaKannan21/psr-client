import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NetscoreCalculationComponent } from './netscore-calculation.component';
import { RoundData } from '../../models/scoreboard.models';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { MESSAGES, ROUND_DATA } from '../../constants/scoreboard.constants';
import { of, throwError } from 'rxjs';
import { validateExamlyScoreFile } from '../../utils/examly-score-validation';

fdescribe('NetscoreCalculationComponent', () => {
  let component: NetscoreCalculationComponent;
  let fixture: ComponentFixture<NetscoreCalculationComponent>;
  let scoreboardService: ScoreboardService;

  const mockRoundData: RoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  const mockCriteriaWeightage = [
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
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [NetscoreCalculationComponent],
      providers: [ScoreboardService],
    }).compileComponents();
    fixture = TestBed.createComponent(NetscoreCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    scoreboardService = TestBed.inject(ScoreboardService);
  });
  it('should call handleInvalidData with the correct arguments when provided with correct data', () => {
    const contents = `Student Email,Examly Score
    student_2@gmail.com,45
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: '',
      success: true,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });
  it('should call handleInvalidData with the correct arguments when given wrong header for student email', () => {
    const contents = `Student Emails,Examly Score
    student_2@gmail.com,45
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Invalid File Student Mail Header!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given wrong header for examly score', () => {
    const contents = `Student Email,Examly Scores
    student_2@gmail.com,45
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Invalid File Examly Score Header!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given wrong email id is given', () => {
    const contents = `Student Email,Examly Score
    student_2gmail.com,45
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Invalid Email!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given wrong scores datatype is given', () => {
    const contents = `Student Email,Examly Score
    student_2@gmail.com,'45'
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Invalid Scores!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given scores greater than max score is given', () => {
    const contents = `Student Email,Examly Score
    student_2@gmail.com,55
    student_1@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Incorrect Scores!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given duplicate email is given', () => {
    const contents = `Student Email,Examly Score
    student_2@gmail.com,45
    student_2@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Duplicate Email!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given wrong scores datatype is given', () => {
    const contents = `Student Email,Examly Score
    student_1@gmail.com,45,43
    student_2@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Invalid Row Format!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });

  it('should call handleInvalidData with the correct arguments when given negative scores is given', () => {
    const contents = `Student Email,Examly Score
    student_1@gmail.com,-5
    student_2@gmail.com,35
    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: 'Incorrect Scores!',
      success: false,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });
  it('should call handleInvalidData with the correct arguments when given empty lines', () => {
    const contents = `Student Email,Examly Score
    student_1@gmail.com,45
    student_2@gmail.com,35

    student_3@gmail.com,25
    student_4@gmail.com,30
    student_5@gmail.com,20
    student_6@gmail.com,15
    student_7@gmail.com,10
    student_8@gmail.com,50
    student_9@gmail.com,0
    student_10@gmail.com,37
    student_11@gmail.com,13
    student_12@gmail.com,16
    student_13@gmail.com,40`;
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      criteria2: { criteriaName: 'criteria_2', maxScore: 10, weightage: 40 },
      criteria3: { criteriaName: 'criteria_3', maxScore: 50, weightage: 20 },
      netScore: { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    };
    component.seenEmails = new Set();
    let validationFunction = validateExamlyScoreFile(
      contents,
      component.criteriaWeightageMaxScore,
      component.seenEmails
    );
    let successAndFailureStatus = {
      errorAndSuccessMessages: '',
      success: true,
    };
    spyOn(component, 'handleInvalidData');
    component.validateExamlyScoresAndEmails(contents);
    expect(validationFunction).toEqual(successAndFailureStatus);
    expect(component.handleInvalidData).toHaveBeenCalled();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve round data successfully', () => {
    const getRoundDataSpy = spyOn(
      scoreboardService,
      'getRoundData'
    ).and.returnValue(of(mockRoundData));
    component.getRoundDetailsAndCalculate();
    expect(getRoundDataSpy).toHaveBeenCalled();
    expect(component.currentRound).toEqual(mockRoundData);
  });

  it('should handle error when retrieving round data', () => {
    const errorResponse = new Error('Mock error message');
    spyOn(scoreboardService, 'getRoundData').and.returnValue(
      throwError(errorResponse)
    );
    component.getRoundDetailsAndCalculate();
    expect(component.successAndErrorMessages).toContain(
      MESSAGES.FAILED_TO_LOAD_SERVER + 'Mock error message'
    );
  });

  it('should retrieve criteria weightage successfully', () => {
    const getMaxScoreSpy = spyOn(
      scoreboardService,
      'getMaxScoreForEachCriteria'
    ).and.returnValue(of(mockCriteriaWeightage));
    component.getRoundDetailsAndCalculate();

    expect(getMaxScoreSpy).toHaveBeenCalled();
    expect(component.criteriaWeightage).toEqual(mockCriteriaWeightage);
  });

  it('should load evaluator data successfully', () => {
    const mockResponse = [
      {
        studentName: 'Student_1',
        studentDepartment: 'ECE',
        studentEmail: 'student_1@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 3,
        criteria2: 2,
        criteria3: 5,
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
        criteria3: 5,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];
    spyOn(scoreboardService, 'getEvaluatorData').and.returnValue(
      of(mockResponse)
    );
    component.getRoundDetailsAndCalculate();
    expect(component.studentScores).toEqual(mockResponse);
  });

  it('should handle error when loading evaluator data', () => {
    const errorResponse = new Error('Mock error message');
    spyOn(scoreboardService, 'getEvaluatorData').and.returnValue(
      throwError(errorResponse)
    );
    component.getRoundDetailsAndCalculate();
    expect(component.successAndErrorMessages).toContain(
      MESSAGES.FAILED_TO_LOAD_SERVER + 'Mock error message'
    );
  });

  it('should handle error when retrieving criteria weightage', () => {
    const errorResponse = new Error('Mock error message');
    spyOn(scoreboardService, 'getMaxScoreForEachCriteria').and.returnValue(
      throwError(errorResponse)
    );
    component.getRoundDetailsAndCalculate();
    expect(component.successAndErrorMessages).toContain(
      MESSAGES.FAILED_TO_LOAD_SERVER + 'Mock error message'
    );
  });

  it('should set isNetScoreCalculated to false when netScore is null', () => {
    component.studentScores = [
      {
        studentName: 'Student_2',
        studentDepartment: 'ECE',
        studentEmail: 'student_2@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 4,
        criteria2: 1,
        criteria3: 5,
        netScore: undefined,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];
    component.calculateNetscoreBasedOnCurrentRound();
    expect(component.isNetScoreCalculated).toBeFalse();
  });

  it('should enable re-import button when round 4 is completed', () => {
    component.isNetScoreCalculated = true;
    component.currentRound = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    spyOn(component, 'enableReImportExamlyButton');
    component.calculateNetscoreBasedOnCurrentRound();
    expect(component.enableReImportExamlyButton).toHaveBeenCalled();
  });

  it('should enable examly import button when round 4 is not completed', () => {
    component.isNetScoreCalculated = false;
    component.currentRound = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    spyOn(component, 'enableExamlyImportButton');
    component.calculateNetscoreBasedOnCurrentRound();
    expect(component.enableExamlyImportButton).toHaveBeenCalled();
  });

  it('should calculate net score when round 5 is completed', () => {
    component.isNetScoreCalculated = false;
    component.currentRound = {
      roundNumber: 5,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    spyOn(component, 'calculateNetscore');
    component.calculateNetscoreBasedOnCurrentRound();
    expect(component.calculateNetscore).toHaveBeenCalled();
  });

  it('should not calculate net score when round 5 is not completed', () => {
    component.currentRound = {
      roundNumber: 5,
      roundProgress: ROUND_DATA.IN_PROGRESS,
    };
    spyOn(component, 'calculateNetscore');
    component.calculateNetscoreBasedOnCurrentRound();
    expect(component.calculateNetscore).not.toHaveBeenCalled();
  });

  it('should set properties and emit an event when handling invalid data', () => {
    const emitSpy = spyOn(component.displayError, 'emit');
    const errorMessage = 'Invalid data';
    const isValid = false;
    component.seenEmails = new Set<string>();
    component.fileInput = { value: '' } as HTMLInputElement;
    component.handleInvalidData(errorMessage, isValid);

    // Expectations
    expect(component.isExamlyDataValid).toBe(isValid);
    expect(component.successAndErrorMessages).toBe(errorMessage);
    expect(emitSpy).toHaveBeenCalledWith({
      successStatus: isValid,
      errorSuccessMessage: errorMessage,
    });
    expect(component.fileInput.value).toBe('');
    expect(component.seenEmails).toEqual(new Set());
  });

  it('should set criteriaWeightageMaxScore based on criteriaWeightage', () => {
    component.criteriaWeightage = [
      { criteriaName: 'criteria_1', maxScore: 10, weightage: 40 },
      { criteriaName: 'criteria_2', maxScore: 20, weightage: 30 },
      { criteriaName: 'criteria_3', maxScore: 20, weightage: 30 },
      { criteriaName: 'net_score', maxScore: 10, weightage: 0 },
    ];

    component.setCriteriaWeightageAndMaxscore();

    expect(component.criteriaWeightageMaxScore['criteria1']).toEqual({
      criteriaName: 'criteria_1',
      maxScore: 10,
      weightage: 40,
    });
    expect(component.criteriaWeightageMaxScore['criteria2']).toEqual({
      criteriaName: 'criteria_2',
      maxScore: 20,
      weightage: 30,
    });
    expect(component.criteriaWeightageMaxScore['criteria3']).toEqual({
      criteriaName: 'criteria_3',
      maxScore: 20,
      weightage: 30,
    });
    expect(component.criteriaWeightageMaxScore['netScore']).toEqual({
      criteriaName: 'net_score',
      maxScore: 10,
      weightage: 0,
    });
  });

  it('should calculate criteria weightage for round 4', () => {
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria1', weightage: 40, maxScore: 100 },
      criteria2: { criteriaName: 'criteria2', weightage: 30, maxScore: 200 },
      criteria3: { criteriaName: 'criteria3', weightage: 20, maxScore: 50 },
    };

    component.studentScores = [
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
    component.examlyCsvData = [
      ['student_1@gmail.com', 35],
      ['student_2@gmail.com', 40],
    ];
    component.currentRound = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    component.calculateCriteriaWeightage();
    expect(component.criteria1).toEqual([0.012, 0.016]);
    expect(component.criteria2).toEqual([0.003, 0.0015]);
    expect(component.studentEmail).toEqual([
      'student_1@gmail.com',
      'student_2@gmail.com',
    ]);
    expect(component.actualExamlyScores).toEqual([35, 40]);
    expect(component.scaledExamlyScores).toEqual([
      0.13999999999999999, 0.16000000000000003,
    ]);
  });

  it('should calculate criteria weightage for round 5', () => {
    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria1', weightage: 40, maxScore: 100 },
      criteria2: { criteriaName: 'criteria2', weightage: 30, maxScore: 200 },
      criteria3: { criteriaName: 'criteria3', weightage: 20, maxScore: 50 },
    };

    component.studentScores = [
      {
        studentName: 'Student_1',
        studentDepartment: 'ECE',
        studentEmail: 'student_1@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 3,
        criteria2: 2,
        criteria3: 35,
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
        criteria3: 40,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];

    component.currentRound = {
      roundNumber: 5,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    component.calculateCriteriaWeightage();
    expect(component.criteria1).toEqual([0.012, 0.016]);
    expect(component.criteria2).toEqual([0.003, 0.0015]);
    expect(component.criteria3).toEqual([
      0.13999999999999999, 0.16000000000000003,
    ]);
  });

  it('should calculate the sum of criteria for round 4', () => {
    component.criteria1 = [20, 24];
    component.criteria2 = [30, 45];
    component.currentRound = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    component.scaledExamlyScores = [14, 16];
    component.criteria3 = [10, 15];
    component.sumOfCriteriaForEachRound();
    expect(component.netScore).toEqual([64, 85]);
  });
  it('should calculate the sum of criteria for round 5', () => {
    component.criteria1 = [20, 24];
    component.criteria2 = [30, 45];

    component.currentRound = {
      roundNumber: 5,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    component.criteria3 = [10, 15];
    component.sumOfCriteriaForEachRound();
    expect(component.netScore).toEqual([60, 84]);
  });

  it('should calculate the final score according to net max score', () => {
    component.netScore = [0.6, 0.8];

    component.criteriaWeightageMaxScore = {
      criteria1: { criteriaName: 'criteria1', weightage: 40, maxScore: 100 },
      criteria2: { criteriaName: 'criteria2', weightage: 30, maxScore: 200 },
      criteria3: { criteriaName: 'criteria3', weightage: 20, maxScore: 50 },
      netScore: { criteriaName: 'netScore', maxScore: 10, weightage: 0 },
    };
    component.calculateFinalScoreAccordingToNetMaxScore();
    expect(component.scaledNetScore).toEqual([6, 8]);
  });

  it('should disable the examly import button', () => {
    component.isExamlyImportButtonVisible = true;
    component.disableExamlyImportButton();
    expect(component.isExamlyImportButtonVisible).toBe(false);
  });

  it('should enable the examly import button', () => {
    component.isExamlyImportButtonVisible = false;
    component.enableExamlyImportButton();
    expect(component.isExamlyImportButtonVisible).toBe(true);
  });

  it('should enable the re-import examly button and disable the import button', () => {
    component.isExamlyReImportButtonVisible = false;
    component.isExamlyImportButtonVisible = true;
    component.enableReImportExamlyButton();
    expect(component.isExamlyReImportButtonVisible).toBe(true);
    expect(component.isExamlyImportButtonVisible).toBe(false);
  });

  it('should post examly and net score data successfully', () => {
    const enableReImportSpy = spyOn(component, 'enableReImportExamlyButton');
    const handleInvalidDataSpy = spyOn(component, 'handleInvalidData');
    const emitSpy = spyOn(component.examlyNetScore, 'emit');
    component.studentScores = [
      {
        studentName: 'Student_1',
        studentDepartment: 'ECE',
        studentEmail: 'student1@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 3,
        criteria2: 2,
        criteria3: 35,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
      {
        studentName: 'Student_2',
        studentDepartment: 'ECE',
        studentEmail: 'student2@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 4,
        criteria2: 1,
        criteria3: 40,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];
    component.netScore = [6, 5];
    component.scaledNetScore = [6, 5];
    component.actualExamlyScores = [35, 40];
    component.nonScaledCriteria3Scores = [35, 40];
    component.currentRound = {
      roundNumber: 4,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    const result = [
      { studentEmail: 'student1@gmail.com', criteria3: 35, netScore: '6.0' },
      { studentEmail: 'student2@gmail.com', criteria3: 40, netScore: '5.0' },
    ];

    let postExamlyAndNetScoreSpy = spyOn(
      scoreboardService,
      'postExamlyAndNetScore'
    ).and.returnValue(of({}));

    component.postExamlyNetScoreData();
    expect(postExamlyAndNetScoreSpy).toHaveBeenCalledOnceWith(result);
    expect(enableReImportSpy).toHaveBeenCalled();
    expect(handleInvalidDataSpy).toHaveBeenCalledWith(
      MESSAGES.SUCCESS_EXAMLY_IMPORT,
      true
    );
    expect(emitSpy).toHaveBeenCalledWith(result);
  });

  it('should post examly and net score data successfully', () => {
    const disableImportSpy = spyOn(component, 'disableExamlyImportButton');
    const handleInvalidDataSpy = spyOn(component, 'handleInvalidData');
    const emitSpy = spyOn(component.examlyNetScore, 'emit');
    component.studentScores = [
      {
        studentName: 'Student_1',
        studentDepartment: 'ECE',
        studentEmail: 'student1@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 3,
        criteria2: 2,
        criteria3: 35,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
      {
        studentName: 'Student_2',
        studentDepartment: 'ECE',
        studentEmail: 'student2@gmail.com',
        evaluatorName: 'Soliton_1',
        criteria1: 4,
        criteria2: 1,
        criteria3: 40,
        comments:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
      },
    ];
    component.netScore = [6, 5];
    component.scaledNetScore = [6, 5];
    component.actualExamlyScores = [35, 40];
    component.nonScaledCriteria3Scores = [35, 40];
    component.currentRound = {
      roundNumber: 5,
      roundProgress: ROUND_DATA.COMPLETED,
    };
    const result = [
      { studentEmail: 'student1@gmail.com', criteria3: 35, netScore: '6.0' },
      { studentEmail: 'student2@gmail.com', criteria3: 40, netScore: '5.0' },
    ];

    let postExamlyAndNetScoreSpy = spyOn(
      scoreboardService,
      'postExamlyAndNetScore'
    ).and.returnValue(of({}));

    component.postExamlyNetScoreData();
    expect(postExamlyAndNetScoreSpy).toHaveBeenCalledOnceWith(result);
    expect(disableImportSpy).toHaveBeenCalled();
    expect(handleInvalidDataSpy).toHaveBeenCalledWith(
      MESSAGES.SUCCESS_EXAMLY_IMPORT,
      true
    );
    expect(emitSpy).toHaveBeenCalledWith(result);
  });
});
