import { TestBed } from '@angular/core/testing';

import { EvaluatorHttpService } from './evaluator-http.service';

describe('EvaluatorHttpService', () => {
  let service: EvaluatorHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluatorHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
