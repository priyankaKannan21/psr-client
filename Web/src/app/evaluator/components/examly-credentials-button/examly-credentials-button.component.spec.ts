import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamlyCredentialsButtonComponent } from './examly-credentials-button.component';

describe('ExamlyCredentialsButtonComponent', () => {
  let component: ExamlyCredentialsButtonComponent;
  let fixture: ComponentFixture<ExamlyCredentialsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamlyCredentialsButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamlyCredentialsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
