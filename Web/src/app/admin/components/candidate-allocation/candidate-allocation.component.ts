import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CandidateAllocationService } from '../../services/candidate-allocation/candidate-allocation.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  QUERY_PARAMS_LIST,
  STEPPER_FORM_CONTROL_VALUES,
} from '../../constants/candidate-allocation.constant';

@Component({
  selector: 'app-candidate-allocation',
  templateUrl: './candidate-allocation.component.html',
  styleUrls: ['./candidate-allocation.component.scss'],
})
export class CandidateAllocationComponent implements OnInit {
  completedEvaluatorImport: boolean = false;
  completedCandidateImport: boolean = false;
  isStepperVisible: boolean = false;
  pageView: string = '';
  dataSource: any = {};
  queryParamsList: string[] = QUERY_PARAMS_LIST;
  isAllocationDone: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private candidateAllocationService: CandidateAllocationService
  ) {}

  ngOnInit(): void {
    this.router.navigate(['admin/candidate-allocation'], {
      queryParams: { page: this.queryParamsList[0] },
    });
    this.route.queryParams.subscribe((params) => {
      this.pageView = params['page'];
    });
  }

  //this form group is only for stepper validation
  evaluatorStepperValidationFormGroup = this._formBuilder.group({
    formStatus: ['', Validators.required],
  });

  candidateStepperValidationFormGroup = this._formBuilder.group({
    formStatus: ['', Validators.required],
  });

  toNavigate(stepperEvent: StepperSelectionEvent) {
    this.router.navigate(['admin/candidate-allocation'], {
      queryParams: {
        page: this.queryParamsList[stepperEvent.selectedIndex],
      },
    });
  }

  completedEvent(completedEventHeader: string) {
    if (completedEventHeader === 'evaluator') {
      this.completedEvaluatorImport = true;
      this.evaluatorStepperValidationFormGroup.setValue({
        formStatus: STEPPER_FORM_CONTROL_VALUES.SUBMITTED,
      });
    } else if (completedEventHeader === 'candidate') {
      this.completedCandidateImport = true;
      this.isStepperVisible = true;
      this.candidateStepperValidationFormGroup.setValue({
        formStatus: STEPPER_FORM_CONTROL_VALUES.SUBMITTED,
      });
    } else {
      this.isStepperVisible = true;
    }
  }

  handleAllocation(allocatedEvent: boolean) {
    this.isAllocationDone = allocatedEvent;
  }
}
