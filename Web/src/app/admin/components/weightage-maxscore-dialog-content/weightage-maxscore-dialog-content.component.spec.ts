import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { WeightageMaxscoreDialogContentComponent } from './weightage-maxscore-dialog-content.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { of } from 'rxjs';

fdescribe('WeightageMaxscoreDialogContentComponent', () => {
  let component: WeightageMaxscoreDialogContentComponent;
  let fixture: ComponentFixture<WeightageMaxscoreDialogContentComponent>;

  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const scoreboardServiceStub = {
    postCriteriaDetails: () => {
      return of({});
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeightageMaxscoreDialogContentComponent],
      imports: [MatDialogModule, HttpClientModule, ReactiveFormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: ScoreboardService,
          useValue: scoreboardServiceStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            criteriaWeightage: [
              {
                criteriaName: 'net_score',
                weightage: 0,
                maxScore: 10,
              },
              {
                criteriaName: 'criteria_1',
                weightage: 40,
                maxScore: 5,
              },
              {
                criteriaName: 'criteria_2',
                weightage: 40,
                maxScore: 5,
              },
              {
                criteriaName: 'criteria_3',
                weightage: 20,
                maxScore: 50,
              },
            ],
            criteriaName: {
              criteria1: 'Logical Thinking',
              criteria2: 'Implementation Skills',
              criteria3: 'Examly Score',
            },
            isMaxScoreEditable: true,
          },
        },
        FormBuilder,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WeightageMaxscoreDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.setCriteriaWeightageAndMaxscore();
    expect(component).toBeTruthy();
  });

  it('should initialize form with expected form controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('criteria1MaxScore')).toBeDefined();
    expect(component.form.get('criteria2MaxScore')).toBeDefined();
    expect(component.form.get('criteria3MaxScore')).toBeDefined();
    expect(component.form.get('criteria1Weightage')).toBeDefined();
    expect(component.form.get('criteria2Weightage')).toBeDefined();
    expect(component.form.get('criteria3Weightage')).toBeDefined();
    expect(component.form.get('netScoreWeightage')).toBeDefined();
    expect(component.form.get('netScoreMaxScore')).toBeDefined();
  });

  it('should set criteriaWeightageMaxScore correctly', () => {
    component.criteriaData = TestBed.inject(MAT_DIALOG_DATA);
    component.setCriteriaWeightageAndMaxscore();
    expect(component.criteriaWeightageMaxScore['criteria1'].weightage).toEqual(
      40
    );
    expect(component.criteriaWeightageMaxScore['criteria1'].maxScore).toEqual(
      5
    );
    expect(component.criteriaWeightageMaxScore['criteria2'].weightage).toEqual(
      40
    );
    expect(component.criteriaWeightageMaxScore['criteria2'].maxScore).toEqual(
      5
    );
    expect(component.criteriaWeightageMaxScore['criteria3'].weightage).toEqual(
      20
    );
    expect(component.criteriaWeightageMaxScore['criteria3'].maxScore).toEqual(
      50
    );
    expect(component.criteriaWeightageMaxScore['netScore'].weightage).toEqual(
      0
    );
    expect(component.criteriaWeightageMaxScore['netScore'].maxScore).toEqual(
      10
    );
  });

  it('should close the dialog', () => {
    dialogRefSpy.close.calls.reset();
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

 
});
