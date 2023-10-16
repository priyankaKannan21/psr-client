import { TestBed } from '@angular/core/testing';
import { AdminHttpService } from './admin-http.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HOST_ADDRESS,
  PORT_NUMBER,
  PROTOCOL,
  ROUTE_PATHS,
} from 'src/app/shared/constants/http-path.constants';
import { ROUND_DATA } from '../../constants/scoreboard.constants';

fdescribe('AdminHttpService', () => {
  let service: AdminHttpService;
  let httpTestingController: HttpTestingController;
  let request: any;

  const mockProctorData = [
    'soliton.proctor1@examly.in',
    'soliton.proctor2@examly.in',
    'soliton.proctor3@examly.in',
    'soliton.proctor4@examly.in',
    'soliton.proctor5@examly.in',
    'soliton.proctor6@examly.in',
    'soliton.proctor7@examly.in',
    'soliton.proctor8@examly.in',
    'soliton.proctor9@examly.in',
    'soliton.proctor10@examly.in',
  ];

  const mockEvaluatorData = [
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

  const mockCandidateData = [
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
    {
      studentName: 'Student_3',
      studentEmail: 'student_3@gmail.com',
      department: 'EEE',
    },
    {
      studentName: 'Student_4',
      studentEmail: 'student_4@gmail.com',
      department: 'CSE',
    },
    {
      studentName: 'Student_5',
      studentEmail: 'student_5@gmail.com',
      department: 'ECE',
    },
  ];

  const mockAllocationData = [
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
    {
      studentName: 'Student_3',
      studentEmail: 'student_3@gmail.com',
      department: 'EEE',
      evaluatorName: 'Evaluator_1',
      evaluatorEmail: 'evaluator_1@solitontech.com',
      proctorEmail: 'proctor1@exmly.in',
    },
    {
      studentName: 'Student_4',
      studentEmail: 'student_4@gmail.com',
      department: 'CSE',
      evaluatorName: 'Evaluator_2',
      evaluatorEmail: 'evaluator_2@solitontech.com',
      proctorEmail: 'proctor2@exmly.in',
    },
    {
      studentName: 'Student_5',
      studentEmail: 'student_5@gmail.com',
      department: 'ECE',
      evaluatorName: 'Evaluator_1',
      evaluatorEmail: 'evaluator_1@solitontech.com',
      proctorEmail: 'proctor1@exmly.in',
    },
  ];

  const postMockAllocationData = [
    {
      studentEmail: 'student_1@gmail.com',
      evaluatorEmail: 'evaluator_1@solitontech.com',
    },
    {
      studentEmail: 'student_2@gmail.com',
      evaluatorEmail: 'evaluator_2@solitontech.com',
    },
    {
      studentEmail: 'student_3@gmail.com',
      evaluatorEmail: 'evaluator_1@solitontech.com',
    },
    {
      studentEmail: 'student_4@gmail.com',
      evaluatorEmail: 'evaluator_2@solitontech.com',
    },
    {
      studentEmail: 'student_5@gmail.com',
      evaluatorEmail: 'evaluator_1@solitontech.com',
    },
  ];

  const mockRoundData = {
    roundNumber: 4,
    roundProgress: ROUND_DATA.NOT_STARTED,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdminHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP GET requests', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('GET');
    });

    it('should make an HTTP GET request to retrieve proctor data', () => {
      service.getProctorData().subscribe((proctorData) => {
        expect(proctorData).toEqual(mockProctorData);
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_DATA}`
      );

      request.flush(mockProctorData);
    });

    it('should make an HTTP GET request to retrieve evaluator data', () => {
      service.getEvaluatorData().subscribe((evaluatorData) => {
        expect(evaluatorData).toEqual(mockEvaluatorData);
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_EVALUATOR_DETAILS}`
      );

      request.flush(mockEvaluatorData);
    });

    it('should make an HTTP GET request to retrieve candidate data', () => {
      service.getCandidateData().subscribe((candidateData) => {
        expect(candidateData).toEqual(mockCandidateData);
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CANDIDATE_DATA}`
      );

      request.flush(mockCandidateData);
    });

    it('should make an HTTP GET request to retrieve allocation data', () => {
      service.getAllocationData().subscribe((allocationData) => {
        expect(allocationData).toEqual(mockAllocationData);
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ALLOCATION_DATA}`
      );

      request.flush(mockAllocationData);
    });

    it('should make an HTTP GET request to retrieve completed round data', () => {
      service.getCompleteRound().subscribe((completedRoundData) => {
        expect(completedRoundData).toEqual('Ok');
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_COMPLETE_ROUND}`
      );
    });
  });

  describe('HTTP POST requests', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('POST');
    });

    it('should send an HTTP POST request with the evaluator allocation data', () => {
      service.postEvaluatorAllocationData(mockEvaluatorData).subscribe();

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATOR_ALLOCATION_DATA}`
      );

      expect(request.request.body).toEqual(mockEvaluatorData);
    });

    it('should send an HTTP POST request with the candidate data', () => {
      service.postCandidateData(mockCandidateData).subscribe();

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CANDIDATE_DATA}`
      );

      expect(request.request.body).toEqual(mockCandidateData);
    });

    it('should send an HTTP POST request with the allocation data', () => {
      service.postAllocationData(postMockAllocationData).subscribe();

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ALLOCATION_DATA}`
      );

      expect(request.request.body).toEqual(postMockAllocationData);
    });

    it('should send an HTTP POST request with the round data', () => {
      service.postRoundProgress(mockRoundData).subscribe();

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_PROGRESS}`
      );

      expect(request.request.body).toEqual(mockRoundData);
    });
  });

  describe('HTTP GET Errors', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('GET');
    });

    it('should handle an error in the HTTP GET request to retrieve proctor data', () => {
      service.getProctorData().subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_DATA}`
      );
    });

    it('should handle an error in the HTTP GET request to retrieve evaluator data', () => {
      service.getEvaluatorData().subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_EVALUATOR_DETAILS}`
      );
    });

    it('should handle an error in the HTTP GET request to retrieve candidate data', () => {
      service.getCandidateData().subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CANDIDATE_DATA}`
      );
    });

    it('should handle an error in the HTTP GET request to retrieve allocation data', () => {
      service.getAllocationData().subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ALLOCATION_DATA}`
      );
    });

    it('should handle an error in the HTTP GET request to retrieve completed round data', () => {
      service.getCompleteRound().subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_COMPLETE_ROUND}`
      );
    });
  });

  describe('POST HTTP Errors', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('POST');
    });

    it('should handle an error in the HTTP POST request with the evaluator allocation data', () => {
      service.postEvaluatorAllocationData(mockEvaluatorData).subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATOR_ALLOCATION_DATA}`
      );
    });

    it('should handle an error in the HTTP POST request with the candidate data', () => {
      service.postCandidateData(mockCandidateData).subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CANDIDATE_DATA}`
      );
    });

    it('should handle an error in the HTTP POST request with the allocation data', () => {
      service.postAllocationData(postMockAllocationData).subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ALLOCATION_DATA}`
      );
    });

    it('should handle an error in the HTTP POST request with the round data', () => {
      service.postRoundProgress(mockRoundData).subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_PROGRESS}`
      );
    });
  });
});
