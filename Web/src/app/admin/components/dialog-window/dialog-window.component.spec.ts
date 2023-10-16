import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWindowComponent } from './dialog-window.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

fdescribe('DialogWindowComponent', () => {
  let component: DialogWindowComponent;
  let fixture: ComponentFixture<DialogWindowComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<DialogWindowComponent>>;
  const mockData = {
    headerValue: 'Evaluator',
    fileName: 'evaluatorData.csv',
    message: 'Parsing...',
    type: 'loading',
    buttonName: 'Cancel',
  };

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialog', ['close']);
    await TestBed.configureTestingModule({
      declarations: [DialogWindowComponent],
      imports: [MatDialogModule, MatProgressSpinnerModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should set fileName for headerValue Evaluator', () => {
      component.data.headerValue = 'Evaluator';
      component.ngOnInit();
      expect(component.fileName).toEqual('evaluatorHeadersTemplate.csv'); // Replace with the expected file name
    });
    it('should set fileName for headerValue Candidate', () => {
      component.data.headerValue = 'Candidate';
      component.ngOnInit();
      expect(component.fileName).toEqual('candidateHeadersTemplate.csv'); // Replace with the expected file name
    });
  });

  it('should close the dialog when close function is called', () => {
    component.close();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});
