import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AllocationData,
  CandidateAllocationData,
  CandidateData,
  EvaluatorAllocationData,
} from '../../models/candidate-allocation.model';
import {
  PROTOCOL,
  HOST_ADDRESS,
  PORT_NUMBER,
  ROUTE_PATHS,
} from '../../../shared/constants/http-path.constants';
import { RoundData } from '../../models/scoreboard.models';

@Injectable({
  providedIn: 'root',
})
export class AdminHttpService {
  constructor(private http: HttpClient) {}

  getProctorData() {
    return this.http.get<string[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_PROCTOR_DATA}`
    );
  }
  getEvaluatorData() {
    return this.http.get<EvaluatorAllocationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_EVALUATOR_DETAILS}`
    );
  }

  getCandidateData() {
    return this.http.get<CandidateData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_CANDIDATE_DATA}`
    );
  }

  getAllocationData() {
    return this.http.get<CandidateAllocationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_ALLOCATION_DATA}`
    );
  }

  postEvaluatorAllocationData(data: EvaluatorAllocationData[]) {
    return this.http.post<EvaluatorAllocationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_EVALUATOR_ALLOCATION_DATA}`,
      data
    );
  }

  postCandidateData(data: CandidateData[]) {
    return this.http.post<CandidateData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_CANDIDATE_DATA}`,
      data
    );
  }

  postAllocationData(data: AllocationData[]) {
    return this.http.post<AllocationData[]>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ALLOCATION_DATA}`,
      data
    );
  }

  postRoundProgress(data: RoundData) {
    return this.http.post<RoundData>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.POST_ROUND_PROGRESS}`,
      data
    );
  }

  getCompleteRound() {
    return this.http.get<string>(
      `${PROTOCOL}://${HOST_ADDRESS}:${PORT_NUMBER}/${ROUTE_PATHS.GET_COMPLETE_ROUND}`
    );
  }
}
