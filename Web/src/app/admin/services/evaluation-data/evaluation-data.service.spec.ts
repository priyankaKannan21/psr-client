import { TestBed } from '@angular/core/testing';

import { EvaluationDataService } from './evaluation-data.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { EvaluationData } from '../../models/evaluation-data.model';
import { of } from 'rxjs';
import { ROUND_DATA } from '../../constants/scoreboard.constants';
import { RoundData } from '../../models/scoreboard.models';

fdescribe('EvaluationDataService', () => {
  let service: EvaluationDataService;
  let scoreboardServiceSpy: jasmine.SpyObj<ScoreboardService>;
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
  let roundData: RoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };

  beforeEach(() => {
    const scoreboardSpyObject = jasmine.createSpyObj('ScoreboardService', [
      'getEvaluatorData',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: ScoreboardService, useValue: scoreboardSpyObject },
      ],
    });
    service = TestBed.inject(EvaluationDataService);
    scoreboardServiceSpy = TestBed.inject(
      ScoreboardService
    ) as jasmine.SpyObj<ScoreboardService>;

    scoreboardServiceSpy.getEvaluatorData.and.returnValue(of(evaluationData));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getEvaluatorData from ScoreboardService and apply data transformation', () => {
    service.getEvaluationData(roundData).subscribe((result) => {
      expect(result).toEqual(evaluationData);
    });
  });
});
