import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriteriaWeightageMaxScore } from '../../models/scoreboard.models';
import { EvaluationData } from '../../models/evaluation-data.model';
import { Observable } from 'rxjs';
import { RoundData } from '../../models/scoreboard.models';
import {
  PROTOCOL,
  HOST_ADDRESS,
  PORT_NUMBER,
  ROUTE_PATHS,
} from '../../../shared/constants/http-path.constants';
import { CriteriaNames } from '../../../shared/models/evaluation-data.model';
@Injectable({
  providedIn: 'root',
})
export class ScoreboardService {
  constructor(private http: HttpClient) {}

  getRoundData() {
    return this.http.get<RoundData>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_DATA}`
    );
  }

  getEvaluatorData() {
    return this.http.get<EvaluationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ROUND_EVALUATION_DETAILS}`
    );
  }

  getMaxScoreForEachCriteria() {
    return this.http.get<CriteriaWeightageMaxScore[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.MAX_SCORE_WEIGHTAGE_CRITERIA}`
    );
  }

  postExamlyAndNetScore(scoreData: any): Observable<any> {
    return this.http.post(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATION_DATA}`,
      scoreData
    );
  }

  postRoundData(roundData: RoundData) {
    return this.http.post<RoundData>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_DATA}`,
      roundData
    );
  }

  getCriteriaNames() {
    return this.http.get<CriteriaNames>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CRITERIA_NAMES}`
    );
  }

  postCriteriaDetails(criteriaData: CriteriaWeightageMaxScore[]) {
    return this.http.post<CriteriaWeightageMaxScore[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CRITERIA_DATA}`,
      criteriaData
    );
  }
}
