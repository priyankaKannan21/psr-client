import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  closeDialogWithTrue() {
    this.dialogRef.close(true);
  }
}
