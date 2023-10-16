import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRecruitmentComponent } from './current-recruitment.component';

describe('CurrentRecruitmentComponent', () => {
  let component: CurrentRecruitmentComponent;
  let fixture: ComponentFixture<CurrentRecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentRecruitmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
