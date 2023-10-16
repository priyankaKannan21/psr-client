import { Injectable } from '@angular/core';
import {
  CandidateAllocationData,
  CandidateData,
  EvaluatorAllocationData,
} from '../../models/candidate-allocation.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateAllocationService {
  evaluatorImportedData: EvaluatorAllocationData[] = [];
  candidateImportedData: CandidateData[] = [];
  allocationData: CandidateAllocationData[] = [];
  proctorData: string[] = [];
  constructor() {}
}
