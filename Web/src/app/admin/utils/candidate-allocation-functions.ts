import {
  AllocationData,
  CandidateData,
  EvaluatorAllocationData,
  EvaluatorData,
} from '../models/candidate-allocation.model';

export function toMapEvaluatorProctorData(
  evaluatorData: EvaluatorData[],
  PROCTOR_DATA: string[]
): EvaluatorAllocationData[] {
  let evaluatorAllocationData: EvaluatorAllocationData[] = [];

  let proctorIterator: number = 0,
    evaluatorIterator: number = 0;
  evaluatorData.forEach((data) => {
    proctorIterator = proctorIterator % evaluatorData.length;
    evaluatorAllocationData[evaluatorIterator] = {
      ...data,
      proctorEmail: PROCTOR_DATA[proctorIterator],
    };
    proctorIterator += 1;
    evaluatorIterator += 1;
    if (proctorIterator === PROCTOR_DATA.length) {
      proctorIterator = 0;
    }
  });

  return evaluatorAllocationData;
}

export function toMapEvaluatorCandidateData(
  evaluatorData: EvaluatorAllocationData[],
  candidateData: CandidateData[]
): AllocationData[] {
  let allocationData: AllocationData[] = [];
  let evaluatorIterator: number = 0;
  let allocationIterator: number = 0;
  candidateData.forEach((data) => {
    evaluatorIterator = allocationIterator % evaluatorData.length;
    allocationData[allocationIterator] = {
      studentEmail: data.studentEmail,
      evaluatorEmail: evaluatorData[evaluatorIterator].evaluatorEmail,
    };
    allocationIterator += 1;
  });
  return allocationData;
}
