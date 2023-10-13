import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KebabMenuComponent } from './kebab-menu.component';
import { MatMenuModule } from '@angular/material/menu';

fdescribe('KebabMenuComponent', () => {
  let component: KebabMenuComponent;
  let fixture: ComponentFixture<KebabMenuComponent>;
  const params = {
    value: 'someValue',
    clicked: jasmine.createSpy('clicked'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KebabMenuComponent],
      imports: [MatMenuModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KebabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    component.agInit(params);
  });

  it('should set the params property when agInit is called', () => {
    expect(component['params']).toEqual(params);
  });

  it('should call params.clicked with the correct value when btnClickedHandler is called', () => {
    component.btnClickedHandler();

    expect(params.clicked).toHaveBeenCalledWith(params.value);
  });
});
