import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightageMaxscoreDialogContentComponent } from './weightage-maxscore-dialog-content.component';

describe('WeightageMaxscoreDialogContentComponent', () => {
  let component: WeightageMaxscoreDialogContentComponent;
  let fixture: ComponentFixture<WeightageMaxscoreDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightageMaxscoreDialogContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightageMaxscoreDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
