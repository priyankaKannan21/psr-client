import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExamlyCredentialsDialogWindowComponent } from '../examly-credentials-dialog-window/examly-credentials-dialog-window.component';

@Component({
  selector: 'app-examly-credentials-button',
  templateUrl: './examly-credentials-button.component.html',
  styleUrls: ['./examly-credentials-button.component.scss'],
})
export class ExamlyCredentialsButtonComponent {
  constructor(private dialog: MatDialog) {}

  displayExamlyCredentials() {
    this.dialog.open(ExamlyCredentialsDialogWindowComponent);
  }
}
