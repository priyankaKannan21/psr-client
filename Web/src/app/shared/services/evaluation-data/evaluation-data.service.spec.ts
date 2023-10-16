import { TestBed } from '@angular/core/testing';

import { EvaluationDataService } from './evaluation-data.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  PROTOCOL,
  HOST_ADDRESS,
  PORT_NUMBER,
  ROUTE_PATHS,
} from '../../constants/http-path.constants';
import { LiveEvaluationData } from '../../models/evaluation-data.model';

fdescribe('EvaluationDataService', () => {
  let service: EvaluationDataService;
  let httpTestingController: HttpTestingController;
  let req: any;
  let liveEvaluationData: LiveEvaluationData[] = [
    {
      studentEmail: 'student_1@gmail.com',
      evaluatorName: 'Soliton_1',
      criteria1: 3,
      criteria2: 2,
      comments:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
    },
    {
      studentEmail: 'student_2@gmail.com',
      evaluatorName: 'Soliton_1',
      criteria1: 4,
      criteria2: 1,
      comments:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
    },
  ];
  let errorResponse = { status: 500, statusText: 'Internal Server Error' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EvaluationDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an HTTP GET request to retrieve live evaluation data', () => {
    service.getLiveEvaluationData().subscribe((result) => {
      expect(result).toEqual(liveEvaluationData);
    });

    req = httpTestingController.expectOne(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_LIVE_EVALUATION_DATA}`
    );

    req.flush(liveEvaluationData);
    expect(req.request.method).toEqual('GET');
  });

  it('should handle an error in the HTTP GET request to retrieve live evaluation data', () => {
    service.getLiveEvaluationData().subscribe({
      next: () => {
        fail('Expected an error, but got data:');
      },
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    req = httpTestingController.expectOne(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_LIVE_EVALUATION_DATA}`
    );

    req.flush(null, errorResponse);

    expect(req.request.method).toEqual('GET');
  });
});
