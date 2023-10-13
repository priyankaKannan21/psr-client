import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog.component';

fdescribe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<DeleteDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ DeleteDialogComponent ],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],

    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when closeDialog is called', () => {
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with true when closeDialogWithTrue is called', () => {
    component.closeDialogWithTrue();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
