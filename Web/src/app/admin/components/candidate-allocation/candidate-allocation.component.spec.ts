import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAllocationComponent } from './candidate-allocation.component';

describe('CandidateAllocationComponent', () => {
  let component: CandidateAllocationComponent;
  let fixture: ComponentFixture<CandidateAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateAllocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
