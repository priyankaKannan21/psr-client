import { TestBed } from '@angular/core/testing';

import { EvaluationLiveDataService } from './evaluation-live-data.service';

describe('UnsubscribeLiveDataService', () => {
  let service: EvaluationLiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationLiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
