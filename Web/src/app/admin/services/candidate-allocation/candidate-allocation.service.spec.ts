import { TestBed } from '@angular/core/testing';

import { CandidateAllocationService } from './candidate-allocation.service';

describe('CandidateAllocationService', () => {
  let service: CandidateAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
