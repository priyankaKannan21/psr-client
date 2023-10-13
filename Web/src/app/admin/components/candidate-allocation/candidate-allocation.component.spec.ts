import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAllocationComponent } from './candidate-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EvaluatorListComponent } from '../evaluator-list/evaluator-list.component';
import { CandidateListComponent } from '../candidate-list/candidate-list.component';
import { AllocationListComponent } from '../allocation-list/allocation-list.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_FORM_CONTROL_VALUES } from '../../constants/candidate-allocation.constant';

fdescribe('CandidateAllocationComponent', () => {
  let component: CandidateAllocationComponent;
  let fixture: ComponentFixture<CandidateAllocationComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [
        CandidateAllocationComponent,
        EvaluatorListComponent,
        CandidateListComponent,
        AllocationListComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatStepperModule,
        BrowserAnimationsModule,
        MatIconModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ page: 'evaluator-detail' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "admin/candidate-allocation" with the correct queryParams', () => {
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['admin/candidate-allocation'],
      {
        queryParams: { page: 'evaluator-detail' },
      }
    );
  });

  it('should set "pageView" property based on queryParams', () => {
    fixture.detectChanges();

    expect(component.pageView).toEqual('evaluator-detail');
  });

  it('should navigate correctly using stepper to "admin/candidate-allocation" with the respective queryParams', () => {
    const stepperEvent: StepperSelectionEvent = {
      selectedIndex: 2,
      previouslySelectedIndex: 1,
      selectedStep: null as any,
      previouslySelectedStep: null as any,
    };

    component.toNavigate(stepperEvent);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['admin/candidate-allocation'],
      {
        queryParams: {
          page: component.queryParamsList[stepperEvent.selectedIndex],
        },
      }
    );
  });

  it('should set completedEvaluatorImport and evaluatorStepperValidationFormGroup when completedEventHeader is "evaluator"', () => {
    const completedEventHeader = 'evaluator';

    component.completedEvent(completedEventHeader);

    expect(component.completedEvaluatorImport).toBeTrue();
    expect(
      component.evaluatorStepperValidationFormGroup?.get('formStatus')?.value
    ).toBe(STEPPER_FORM_CONTROL_VALUES.SUBMITTED);
  });

  it('should set completedCandidateImport, isStepperVisible, and candidateStepperValidationFormGroup when completedEventHeader is "candidate"', () => {
    const completedEventHeader = 'candidate';

    component.completedEvent(completedEventHeader);

    expect(component.completedCandidateImport).toBeTrue();
    expect(component.isStepperVisible).toBeTrue();
    expect(
      component.candidateStepperValidationFormGroup?.get('formStatus')?.value
    ).toBe(STEPPER_FORM_CONTROL_VALUES.SUBMITTED);
  });

  it('should set isStepperVisible when completedEventHeader is neither "evaluator" nor "candidate"', () => {
    const completedEventHeader = 'allocation';

    component.completedEvent(completedEventHeader);

    expect(component.isStepperVisible).toBeTrue();
  });

  it('should set isAllocationDone to true when allocatedEvent is true', () => {
    const allocatedEvent = true;

    component.handleAllocation(allocatedEvent);

    expect(component.isAllocationDone).toBeTrue();
  });

  it('should set isAllocationDone to false when allocatedEvent is false', () => {
    const allocatedEvent = false;

    component.handleAllocation(allocatedEvent);

    expect(component.isAllocationDone).toBeFalse();
  });
});
