import { Component, Inject, OnInit } from '@angular/core';
import { DialogData } from '../../models/dialog-data.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DownloadTemplateFileName } from '../../models/candidate-allocation.model';
import { DOWNLOAD_TEMPLATE_FILE_NAME } from '../../constants/candidate-allocation.constant';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss'],
})
export class DialogWindowComponent implements OnInit {
  secondaryDownloadTemplateButton: string =
    'download-template-button-secondary';
  fileName: string = '';
  downloadTemplateFileName: DownloadTemplateFileName =
    DOWNLOAD_TEMPLATE_FILE_NAME;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DialogWindowComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.headerValue === 'Evaluator')
      this.fileName = this.downloadTemplateFileName.evaluator;
    else this.fileName = this.downloadTemplateFileName.candidate;
  }
  close() {
    this.dialogRef.close();
  }
}
