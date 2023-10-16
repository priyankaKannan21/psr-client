import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LiveEvaluationData } from '../../models/evaluation-data.model';
import {
  PROTOCOL,
  HOST_ADDRESS,
  PORT_NUMBER,
  ROUTE_PATHS,
} from '../../constants/http-path.constants';

@Injectable({
  providedIn: 'root',
})
export class EvaluationDataService {
  constructor(private http: HttpClient) {}

  getLiveEvaluationData() {
    return this.http.get<LiveEvaluationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_LIVE_EVALUATION_DATA}`
    );
  }
}
