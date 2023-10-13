import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationLiveDataService {
  private isEvaluationLiveSubject: Subject<boolean> = new Subject<boolean>();
  isEvaluationLive$!: Observable<boolean>;

  constructor() {
    this.isEvaluationLive$ = this.isEvaluationLiveSubject.asObservable();
  }

  startLiveData() {
    this.isEvaluationLiveSubject.next(true);
  }

  stopLiveData() {
    this.isEvaluationLiveSubject.next(false);
  }
}
