import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CriteriaWeightageMaxScore } from '../../models/scoreboard.models';
import { ScoreboardService } from '../../services/scoreboard/scoreboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ERROR_MESSAGE } from '../../constants/dashboard.constants';
@Component({
  selector: 'app-weightage-maxscore-dialog-content',
  templateUrl: './weightage-maxscore-dialog-content.component.html',
  styleUrls: ['./weightage-maxscore-dialog-content.component.scss'],
})
export class WeightageMaxscoreDialogContentComponent implements OnInit {
  form!: FormGroup;
  criteriaWeightageMaxScore: Record<string, CriteriaWeightageMaxScore> = {};
  thirdCriteriaName: any = [];
  isCurrentRoundHasExamlyScore: boolean = false;
  numberIsRequired: string = ERROR_MESSAGE.NUMBER_IS_REQUIRED;
  numberShouldBeGreaterThanOne: string = ERROR_MESSAGE.NUMBER_GREATER_THAN_ONE;
  numberShouldNotBeDecimal: string = ERROR_MESSAGE.NUMBER_SHOULD_NOT_BE_DECIMAL;
  WeightageSumNot100: string = ERROR_MESSAGE.WEIGHTAGE_SUM_NOT_100;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public criteriaData: any,
    private dialogRef: MatDialogRef<WeightageMaxscoreDialogContentComponent>,
    private criteriaService: ScoreboardService,
    private formBuilder: FormBuilder
  ) {
    this.setCriteriaWeightageAndMaxscore();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        criteria1MaxScore: [
          this.criteriaWeightageMaxScore['criteria1'].maxScore,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        criteria2MaxScore: [
          this.criteriaWeightageMaxScore['criteria2'].maxScore,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        criteria3MaxScore: [
          this.criteriaWeightageMaxScore['criteria3'].maxScore,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        netScoreMaxScore: [
          this.criteriaWeightageMaxScore['netScore'].maxScore,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        criteria1Weightage: [
          this.criteriaWeightageMaxScore['criteria1'].weightage,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        criteria2Weightage: [
          this.criteriaWeightageMaxScore['criteria2'].weightage,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
        criteria3Weightage: [
          this.criteriaWeightageMaxScore['criteria3'].weightage,
          [Validators.required, Validators.min(1), this.decimalValidator],
        ],
      },
      { validators: this.totalSumValidator }
    );
  }

  setCriteriaWeightageAndMaxscore() {
    for (const criteria of this.criteriaData.criteriaWeightage) {
      switch (criteria.criteriaName) {
        case 'criteria_1':
          this.criteriaWeightageMaxScore['criteria1'] = criteria;
          break;
        case 'criteria_2':
          this.criteriaWeightageMaxScore['criteria2'] = criteria;
          break;
        case 'net_score':
          this.criteriaWeightageMaxScore['netScore'] = criteria;
          break;
        case 'criteria_3':
          this.criteriaWeightageMaxScore['criteria3'] = criteria;
          break;
        default:
          break;
      }
    }
    if (this.criteriaData.criteriaName.criteria3 === 'Examly Score') {
      this.isCurrentRoundHasExamlyScore = true;
    }
  }

  totalSumValidator(control: AbstractControl): ValidationErrors | null {
    const criteria1Score = control.get('criteria1Weightage')?.value || 0;
    const criteria2Score = control.get('criteria2Weightage')?.value || 0;
    const criteria3Score = control.get('criteria3Weightage')?.value || 0;
    const totalScore = criteria1Score + criteria2Score + criteria3Score;
    if (totalScore !== 100) {
      return { sumError: true };
    }
    return null;
  }
  decimalValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (
      value !== null &&
      value !== '' &&
      value >= 1 &&
      /^\d+\.\d+$/.test(value)
    ) {
      return { decimalError: true };
    } else {
      return null;
    }
  }
  editWeightageMaxScore() {
    if (this.form.valid) {
      this.criteriaWeightageMaxScore['criteria1'].maxScore =
        this.form.get('criteria1MaxScore')?.value;
      this.criteriaWeightageMaxScore['criteria2'].maxScore =
        this.form.get('criteria2MaxScore')?.value;
      this.criteriaWeightageMaxScore['netScore'].maxScore =
        this.form.get('netScoreMaxScore')?.value;
      this.criteriaWeightageMaxScore['criteria1'].weightage =
        this.form.get('criteria1Weightage')?.value;
      this.criteriaWeightageMaxScore['criteria2'].weightage =
        this.form.get('criteria2Weightage')?.value;
      this.criteriaWeightageMaxScore['criteria3'].maxScore =
        this.form.get('criteria3MaxScore')?.value;
      this.criteriaWeightageMaxScore['criteria3'].weightage =
        this.form.get('criteria3Weightage')?.value;
    }
    const resultArray = Object.values(this.criteriaWeightageMaxScore).map(
      (item) => ({
        criteriaName: item.criteriaName,
        weightage: item.weightage,
        maxScore: item.maxScore,
      })
    );
    this.criteriaService.postCriteriaDetails(resultArray).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
