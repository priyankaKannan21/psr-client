import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EvaluationData } from '../../models/evaluation-data.model';
import { removeExamlyNetFeedbackScoreIfNotRequired } from '../../utils/helpers';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { RoundData } from '../../models/scoreboard.models';

@Injectable({
  providedIn: 'root',
})
export class EvaluationDataService {
  constructor(private scoreboardService: ScoreboardService) {}

  getEvaluationData(roundData: RoundData): Observable<EvaluationData[]> {
    return this.scoreboardService.getEvaluatorData().pipe(
      map((evaluationData: EvaluationData[]) => {
        return removeExamlyNetFeedbackScoreIfNotRequired(
          evaluationData,
          roundData
        );
      })
    );
  }
}
