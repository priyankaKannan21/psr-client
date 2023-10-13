import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamlyCredentialsDialogWindowComponent } from './examly-credentials-dialog-window.component';

describe('ExamlyCredentialsDialogWindowComponent', () => {
  let component: ExamlyCredentialsDialogWindowComponent;
  let fixture: ComponentFixture<ExamlyCredentialsDialogWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamlyCredentialsDialogWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamlyCredentialsDialogWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
