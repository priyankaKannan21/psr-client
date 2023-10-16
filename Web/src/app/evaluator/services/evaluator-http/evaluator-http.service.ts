import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HOST_ADDRESS,
  PORT_NUMBER,
  PROTOCOL,
  ROUTE_PATHS,
} from 'src/app/shared/constants/http-path.constants';
import {
  EvaluatorEmailData,
  ExamlyCredentialData,
} from '../../models/evaluator-view.models';

@Injectable({
  providedIn: 'root',
})
export class EvaluatorHttpService {
  constructor(private http: HttpClient) {}

  examlyCredentialsData(evaluatorEmailData: EvaluatorEmailData) {
    return this.http.post<ExamlyCredentialData>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_EMAIL}`,
      evaluatorEmailData
    );
  }
}
