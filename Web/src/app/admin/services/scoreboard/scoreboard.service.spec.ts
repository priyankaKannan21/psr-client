import { TestBed } from '@angular/core/testing';

import { ScoreboardService } from './scoreboard.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  PROTOCOL,
  HOST_ADDRESS,
  PORT_NUMBER,
  ROUTE_PATHS,
} from 'src/app/shared/constants/http-path.constants';
import { ROUND_DATA } from '../../constants/scoreboard.constants';

fdescribe('ScoreboardService', () => {
  let service: ScoreboardService;
  let httpTestingController: HttpTestingController;
  let req: any;
  const mockRoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };
  const mockEvaluationData = [
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
  const mockCriteriaWeightageMacScore = [
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
  const mockCriteriaNames = {
    criteria1: 'Logical Thinking',
    criteria2: 'Implementation Skills',
    criteria3: 'Examly Score',
  };
  const mockScoreData = [
    { studentEmail: 'student_1@gmail.com', criteria3: 4, netScore: 5 },
    { studentEmail: 'student_2@gmail.com', criteria3: 3, netScore: 4 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ScoreboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP Responses', () => {
    describe('GET', () => {
      afterEach(() => {
        expect(req.request.method).toEqual('GET');
      });

      it('should make an HTTP GET request to retrieve round data', () => {
        service.getRoundData().subscribe((roundData) => {
          expect(roundData).toEqual(mockRoundData);
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_DATA}`
        );

        req.flush(mockRoundData);
      });

      it('should make an HTTP GET request to retrieve evaluation data', () => {
        service.getEvaluatorData().subscribe((evaluationData) => {
          expect(evaluationData).toEqual(mockEvaluationData);
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_EVALUATION_DETAILS}`
        );

        req.flush(mockEvaluationData);
      });

      it('should make an HTTP GET request to retrieve criteria weightage, max score data', () => {
        service
          .getMaxScoreForEachCriteria()
          .subscribe((criteriaWeightageMacScore) => {
            expect(criteriaWeightageMacScore).toEqual(
              mockCriteriaWeightageMacScore
            );
          });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.MAX_SCORE_WEIGHTAGE_CRITERIA}`
        );

        req.flush(mockCriteriaWeightageMacScore);
      });

      it('should make an HTTP GET request to retrieve criteria names data', () => {
        service.getCriteriaNames().subscribe((criteriaNames) => {
          expect(criteriaNames).toEqual(mockCriteriaNames);
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CRITERIA_NAMES}`
        );

        req.flush(mockCriteriaNames);
      });
    });

    describe('POST', () => {
      afterEach(() => {
        expect(req.request.method).toEqual('POST');
      });

      it('should send an HTTP POST request with the round data', () => {
        service.postRoundData(mockRoundData).subscribe();

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_DATA}`
        );

        expect(req.request.body).toEqual(mockRoundData);
      });

      it('should send an HTTP POST request with the Criteria Weightage, Max score data', () => {
        service.postCriteriaDetails(mockCriteriaWeightageMacScore).subscribe();

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CRITERIA_DATA}`
        );

        expect(req.request.body).toEqual(mockCriteriaWeightageMacScore);
      });

      it('should send an HTTP POST request with the Examly and Net score data', () => {
        service.postExamlyAndNetScore(mockScoreData).subscribe();

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATION_DATA}`
        );

        expect(req.request.body).toEqual(mockScoreData);
      });
    });
  });

  describe('HTTP Errors', () => {
    let errorResponse: any;

    beforeEach(() => {
      errorResponse = { status: 500, statusText: 'Internal Server Error' };
    });

    afterEach(() => {
      req.flush(null, errorResponse);
    });

    describe('GET', () => {
      afterEach(() => {
        expect(req.request.method).toEqual('GET');
      });

      it('should handle an error in the HTTP GET request to retrieve round data', () => {
        service.getRoundData().subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_DATA}`
        );
      });

      it('should handle an error in the HTTP GET request to retrieve evaluation data', () => {
        service.getEvaluatorData().subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_EVALUATION_DETAILS}`
        );
      });

      it('should handle an error in the HTTP GET request to retrieve criteria weightage, max score data', () => {
        service.getMaxScoreForEachCriteria().subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.MAX_SCORE_WEIGHTAGE_CRITERIA}`
        );
      });

      it('should handle an error in the HTTP GET request to retrieve criteria names data', () => {
        service.getCriteriaNames().subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CRITERIA_NAMES}`
        );
      });
    });

    describe('POST', () => {
      afterEach(() => {
        expect(req.request.method).toEqual('POST');
      });

      it('should handle an error in the HTTP POST request with the round data', () => {
        service.postRoundData(mockRoundData).subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_DATA}`
        );
      });

      it('should handle an error in the HTTP POST request with the Criteria Weightage, Max score data', () => {
        service.postCriteriaDetails(mockCriteriaWeightageMacScore).subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CRITERIA_DATA}`
        );
      });

      it('should handle an error in the HTTP POST request with the  Examly and Net score data', () => {
        service.postExamlyAndNetScore(mockScoreData).subscribe({
          next: () => {
            fail('Expected an error, but got data:');
          },
          error: (error) => {
            expect(error).toBeTruthy();
          },
        });

        req = httpTestingController.expectOne(
          `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATION_DATA}`
        );
      });
    });
  });
});
