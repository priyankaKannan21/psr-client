import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isSidenavExpanded property', () => {
    expect(component.isSidenavExpanded).toBeFalsy();

    component.toggleSidenavBar();

    expect(component.isSidenavExpanded).toBeTruthy();

    component.toggleSidenavBar();

    expect(component.isSidenavExpanded).toBeFalsy();
  });
});
