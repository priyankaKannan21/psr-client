import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamlyCredentialsButtonComponent } from './components/examly-credentials-button/examly-credentials-button.component';
import { MatButtonModule } from '@angular/material/button';
import { ExamlyCredentialsDialogWindowComponent } from './components/examly-credentials-dialog-window/examly-credentials-dialog-window.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ExamlyCredentialsButtonComponent,
    ExamlyCredentialsDialogWindowComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule,
  ],
})
export class EvaluatorModule {}
