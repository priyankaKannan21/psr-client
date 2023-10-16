import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsRendererComponent } from './comments-renderer.component';
import { ICellRendererParams } from 'ag-grid-community';

fdescribe('CommentsRendererComponent', () => {
  let component: CommentsRendererComponent;
  let fixture: ComponentFixture<CommentsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set displayValue to an empty string when params.value is falsy', () => {
    const params: ICellRendererParams = {
      value: null,
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.displayValue).toBeFalsy();
  });

  it('should set displayValue by replace "/n" with "<br/>" in params.value', () => {
    const params: ICellRendererParams = {
      value: 'Line 1/nLine 2/nLine 3',
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.displayValue).toEqual(`Line 1<br/>Line 2<br/>Line 3`);
  });

  it('should set displayValue to an empty string for empty params.value', () => {
    const params: ICellRendererParams = {
      value: '',
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.displayValue).toEqual('');
  });

  it('should handle params.value with no "/n" characters', () => {
    const params: ICellRendererParams = {
      value: 'No newlines here',
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.displayValue).toEqual('No newlines here');
  });
});
