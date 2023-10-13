import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetscoreCalculationComponent } from './netscore-calculation.component';

describe('NetscoreCalculationComponent', () => {
  let component: NetscoreCalculationComponent;
  let fixture: ComponentFixture<NetscoreCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetscoreCalculationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetscoreCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
