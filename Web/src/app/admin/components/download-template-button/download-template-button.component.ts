import { Component, Input, OnInit } from '@angular/core';
import { DOWNLOAD_TEMPLATE_FILE_PATH } from '../../constants/file-path.constant';

@Component({
  selector: 'app-download-template-button',
  templateUrl: './download-template-button.component.html',
  styleUrls: ['./download-template-button.component.scss'],
})
export class DownloadTemplateButtonComponent implements OnInit {
  @Input() styleClassName: string = '';
  @Input() fileName: string = '';
  buttonTooltip: string = '';

  constructor() {}

  ngOnInit(): void {
    this.buttonTooltip =
      this.fileName === 'evaluatorHeadersTemplate.csv'
        ? 'Download Evaluator Template'
        : 'Download Candidate Template';
  }

  downloadCsvFile() {
    const link = document.createElement('a');
    link.href = DOWNLOAD_TEMPLATE_FILE_PATH + this.fileName;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
