import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationListComponent } from './allocation-list.component';

describe('AllocationListComponent', () => {
  let component: AllocationListComponent;
  let fixture: ComponentFixture<AllocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
