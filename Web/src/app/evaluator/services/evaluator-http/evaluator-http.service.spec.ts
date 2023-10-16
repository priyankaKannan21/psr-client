import { TestBed } from '@angular/core/testing';

import { EvaluatorHttpService } from './evaluator-http.service';
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

fdescribe('EvaluatorHttpService', () => {
  let service: EvaluatorHttpService;
  let httpTestingController: HttpTestingController;
  let request: any;

  const mockEvaluatorData = { evaluatorEmail: 'evaluator_1@solitontech.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EvaluatorHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP GET request', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('POST');
    });

    it('should send an HTTP POST request with the allocation data', () => {
      service.examlyCredentialsData(mockEvaluatorData).subscribe();

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_EMAIL}`
      );

      expect(request.request.body).toEqual(mockEvaluatorData);
    });
  });

  describe('POST HTTP Errors', () => {
    afterEach(() => {
      expect(request.request.method).toEqual('POST');
    });

    it('should handle an error in the HTTP POST request to retrieve proctor data', () => {
      service.examlyCredentialsData(mockEvaluatorData).subscribe({
        next: () => {
          fail('Expected an error, but got data:');
        },
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      request = httpTestingController.expectOne(
        `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_EMAIL}`
      );
    });
  });
});
