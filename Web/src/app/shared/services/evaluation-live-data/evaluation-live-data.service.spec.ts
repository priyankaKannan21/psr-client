import { TestBed } from '@angular/core/testing';

import { EvaluationLiveDataService } from './evaluation-live-data.service';

fdescribe('EvaluationLiveDataService', () => {
  let service: EvaluationLiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationLiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start live data', () => {
    spyOn(service['isEvaluationLiveSubject'], 'next');

    service.startLiveData();

    expect(service['isEvaluationLiveSubject'].next).toHaveBeenCalledWith(true);
  });

  it('should stop live data', () => {
    spyOn(service['isEvaluationLiveSubject'], 'next');

    service.stopLiveData();

    expect(service['isEvaluationLiveSubject'].next).toHaveBeenCalledWith(false);
  });
});
