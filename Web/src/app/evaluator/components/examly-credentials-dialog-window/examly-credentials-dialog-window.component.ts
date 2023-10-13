import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EvaluatorHttpService } from '../../services/evaluator-http/evaluator-http.service';
import {
  EVALUATOR_MAIL,
  EXAMLY_PORTAL_LINK,
} from '../../constants/evaluator-view.constants';
import { EvaluatorEmailData } from '../../models/evaluator-view.models';

@Component({
  selector: 'app-examly-credentials-dialog-window',
  templateUrl: './examly-credentials-dialog-window.component.html',
  styleUrls: ['./examly-credentials-dialog-window.component.scss'],
})
export class ExamlyCredentialsDialogWindowComponent implements OnInit {
  loginEmail: string = '';
  loginPassword: string = '';
  apiError: boolean = false;
  examlyPortalLink: string = EXAMLY_PORTAL_LINK;

  constructor(
    private dialogRef: MatDialogRef<ExamlyCredentialsDialogWindowComponent>,
    private evaluatorService: EvaluatorHttpService
  ) {}

  ngOnInit(): void {
    let evaluatorEmailData: EvaluatorEmailData = {
      evaluatorEmail: EVALUATOR_MAIL,
    };
    this.evaluatorService.examlyCredentialsData(evaluatorEmailData).subscribe({
      next: (examlyCredentialData) => {
        this.loginEmail = examlyCredentialData.proctorEmail;
        this.loginPassword = examlyCredentialData.proctorEmail.split('@')[0];
      },
      error: () => {
        this.apiError = true;
      },
    });
  }

  copyToClipboard(contentToBeCopied: HTMLDivElement) {
    const textContent = contentToBeCopied.textContent || '';
    navigator.clipboard.writeText(textContent);
  }

  close() {
    this.dialogRef.close();
  }
}
