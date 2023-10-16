import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamlyCredentialsButtonComponent } from './examly-credentials-button.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExamlyCredentialsDialogWindowComponent } from '../examly-credentials-dialog-window/examly-credentials-dialog-window.component';

fdescribe('ExamlyCredentialsButtonComponent', () => {
  let component: ExamlyCredentialsButtonComponent;
  let fixture: ComponentFixture<ExamlyCredentialsButtonComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [
        ExamlyCredentialsButtonComponent,
        ExamlyCredentialsDialogWindowComponent,
      ],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamlyCredentialsButtonComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open ExamlyCredentialsDialogWindowComponent when displayExamlyCredentials is called', () => {
    component.displayExamlyCredentials();
    expect(mockDialog.open).toHaveBeenCalledWith(
      ExamlyCredentialsDialogWindowComponent
    );
  });
});
