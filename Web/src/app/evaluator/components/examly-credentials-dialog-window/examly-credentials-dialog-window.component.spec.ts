import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamlyCredentialsDialogWindowComponent } from './examly-credentials-dialog-window.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EvaluatorHttpService } from '../../services/evaluator-http/evaluator-http.service';
import { of, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

fdescribe('ExamlyCredentialsDialogWindowComponent', () => {
  let component: ExamlyCredentialsDialogWindowComponent;
  let fixture: ComponentFixture<ExamlyCredentialsDialogWindowComponent>;
  let mockMatDialogRef: jasmine.SpyObj<
    MatDialogRef<ExamlyCredentialsDialogWindowComponent>
  >;
  let evaluatorHttpService: jasmine.SpyObj<EvaluatorHttpService>;

  const proctorCredentialData = {
    proctorEmail: 'proctor1@examly.in',
  };

  beforeEach(async () => {
    let evaluatorSpy = jasmine.createSpyObj('EvaluatorHttpService', [
      'examlyCredentialsData',
    ]);
    mockMatDialogRef = jasmine.createSpyObj('MatDialog', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ExamlyCredentialsDialogWindowComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: EvaluatorHttpService, useValue: evaluatorSpy },
      ],
    }).compileComponents();

    evaluatorHttpService = TestBed.inject(
      EvaluatorHttpService
    ) as jasmine.SpyObj<EvaluatorHttpService>;

    fixture = TestBed.createComponent(ExamlyCredentialsDialogWindowComponent);
    component = fixture.componentInstance;
    evaluatorHttpService.examlyCredentialsData.and.returnValue(
      of(proctorCredentialData)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should handle error for examlyCredentialsData retrieval', () => {
      evaluatorHttpService.examlyCredentialsData.and.returnValue(
        of(proctorCredentialData)
      );
      component.ngOnInit();
      expect(component.loginEmail).toBe(proctorCredentialData.proctorEmail);
      expect(component.loginPassword).toBe(
        proctorCredentialData.proctorEmail.split('@')[0]
      );
    });

    it('should handle error for candidate data retrieval', () => {
      evaluatorHttpService.examlyCredentialsData.and.returnValue(
        throwError(() => {
          return '';
        })
      );
      component.ngOnInit();
      expect(component.apiError).toBe(true);
    });
  });

  it('should copy textContent to the clipboard', async () => {
    const contentToBeCopied = document.createElement('div');
    contentToBeCopied.textContent = 'proctor1@examly.in';

    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.copyToClipboard(contentToBeCopied);

    await fixture.whenStable();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'proctor1@examly.in'
    );
  });

  it('should close the dialog when close function is called', () => {
    component.close();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});
