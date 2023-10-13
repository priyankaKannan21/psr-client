import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  DownloadTemplateFileName,
  EvaluatorData,
} from '../../models/candidate-allocation.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import {
  convertToDataObject,
  isCsvFile,
  isEmptyRow,
  isValidHeaders,
} from '../../utils/csv-file-validation';
import {
  BUTTON_NAME,
  CANDIDATE_VIEW_DATA,
  DOWNLOAD_TEMPLATE_FILE_NAME,
  EVALUATOR_VIEW_DATA,
  ICON_TYPE,
  ALLOCATION_MESSAGES,
} from '../../constants/candidate-allocation.constant';
import { timer } from 'rxjs';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
  isColumnHeadersValid: boolean = true;
  isValueMissing: boolean = false;
  uploadFileName: string = '';
  isHavingDuplicateData: boolean = false;
  emailDataArray: string[] = [];
  fileName: string = '';
  primaryDownloadTemplateButton: string = 'download-template-button-primary';
  downloadTemplateFileName: DownloadTemplateFileName =
    DOWNLOAD_TEMPLATE_FILE_NAME;
  fileInput!: HTMLInputElement;
  DIALOG_DISPLAY_TIME: number = 1000;
  parsedFileData: any;

  @Input() dataSource: any;

  @Output() dataEmitterEvent = new EventEmitter<EvaluatorData[]>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.dataSource.headerValue === 'Evaluator')
      this.fileName = this.downloadTemplateFileName.evaluator;
    else this.fileName = this.downloadTemplateFileName.candidate;
  }

  onFileSelected(fileUploadEvent: Event) {
    this.fileInput = fileUploadEvent.target as HTMLInputElement;

    if (!(this.fileInput.files && this.fileInput.files.length > 0)) {
      return;
    }

    let file: File = this.fileInput.files[0];
    this.uploadFileName = file.name;

    const parsingDialogReference = this.dialog.open(DialogWindowComponent, {
      data: {
        headerValue: this.dataSource.headerValue,
        fileName: this.uploadFileName,
        message: ALLOCATION_MESSAGES.PARSING_FILE,
        type: ICON_TYPE.LOADING,
        buttonName: BUTTON_NAME.CANCEL,
      },
    });

    timer(this.DIALOG_DISPLAY_TIME).subscribe(() => {
      parsingDialogReference.close();
    });

    if (isCsvFile(file)) {
      if (file.size === 0) {
        this.toOpenDialogWindow(
          true,
          ALLOCATION_MESSAGES.EMPTY_FILE,
          ICON_TYPE.ERROR,
          BUTTON_NAME.OK
        );
        return;
      } else {
        this.readCsvFile(file);
      }
    } else {
      this.toOpenDialogWindow(
        true,
        ALLOCATION_MESSAGES.INVALID_FILE_FORMAT,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
      return;
    }
  }

  readCsvFile(uploadDataFile: File) {
    let fileReader = new FileReader();

    fileReader.readAsText(uploadDataFile);

    fileReader.onload = () => {
      let content: string = fileReader.result as string;

      this.parsedFileData = this.parseCsvContent(content);

      this.fileInput.value = '';

      if (!this.parsedFileData || this.isValueMissing) return;

      if (
        this.parsedFileData &&
        this.isColumnHeadersValid &&
        !this.isHavingDuplicateData
      ) {
        this.toOpenDialogWindow(
          false,
          ALLOCATION_MESSAGES.SUCCESS_FILE_IMPORT,
          ICON_TYPE.SUCCESS,
          BUTTON_NAME.COMPLETED
        );
      }
    };
  }

  parseCsvContent(content: string) {
    let rows: string[] = content.split('\n');
    let headers = rows[0].split(',');
    headers[headers.length - 1] = headers[headers.length - 1].trim();
    let fileData: any[] = [];
    if (this.dataSource.headerValue === 'Evaluator') {
      this.isColumnHeadersValid = isValidHeaders(
        headers,
        EVALUATOR_VIEW_DATA.UploadFileColumnFormat
      );
    } else {
      this.isColumnHeadersValid = isValidHeaders(
        headers,
        CANDIDATE_VIEW_DATA.UploadFileColumnFormat
      );
    }

    if (!this.isColumnHeadersValid) {
      this.toOpenDialogWindow(
        true,
        ALLOCATION_MESSAGES.INVALID_COLUMN_HEADERS,
        ICON_TYPE.ERROR,
        BUTTON_NAME.CANCEL
      );
      return;
    }

    rows.forEach((row: string, rowIndex: number) => {
      let rowDataObject;
      if (this.isValueMissing || rowIndex === 0) {
        return;
      }

      let rowData: string[] = row.split(',');
      rowData[rowData.length - 1] = rowData[rowData.length - 1].trim();
      if (isEmptyRow(rowData)) {
        return;
      }

      this.emailDataArray.push(rowData[1]);
      this.checkForMissingValues(headers, rowData);

      if (this.isValueMissing) {
        this.toOpenDialogWindow(
          true,
          ALLOCATION_MESSAGES.EMPTY_INPUT_FIELD,
          ICON_TYPE.ERROR,
          BUTTON_NAME.OK
        );
        return;
      }

      rowDataObject = convertToDataObject(rowData, this.dataSource.headerValue);
      fileData.push(rowDataObject);
    });

    if (fileData.length === 0 && !this.isValueMissing) {
      this.toOpenDialogWindow(
        true,
        ALLOCATION_MESSAGES.EMPTY_FILE_DATA,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
      return;
    }
    if (this.checkForDuplicateData(this.emailDataArray) && !this.isValueMissing)
      return;
    return fileData;
  }

  checkForMissingValues(headers: string[], rowData: string[]) {
    headers.forEach((header: string, headerIndex: number) => {
      let rowDataValue = rowData[headerIndex];

      if (!rowDataValue) {
        this.isValueMissing = true;
        return;
      }
    });
  }

  checkForDuplicateData(emailDataArray: string[]) {
    let uniqueEmailDataArray = Array.from(new Set(emailDataArray));
    if (uniqueEmailDataArray.length !== emailDataArray.length) {
      this.isHavingDuplicateData = true;
      this.toOpenDialogWindow(
        true,
        ALLOCATION_MESSAGES.DUPLICATE_EMAIL,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
      return true;
    }
    return;
  }

  toChangeAllValueToDefault() {
    this.isColumnHeadersValid = true;
    this.isValueMissing = false;
    this.uploadFileName = '';
    this.isHavingDuplicateData = false;
    this.emailDataArray = [];
  }

  toOpenDialogWindow(
    isError: boolean,
    dialogMessage: string,
    iconType: string,
    buttonName: string
  ) {
    timer(this.DIALOG_DISPLAY_TIME).subscribe(() => {
      const dialogReference = this.dialog.open(DialogWindowComponent, {
        data: {
          headerValue: this.dataSource.headerValue,
          fileName: this.uploadFileName,
          message: dialogMessage,
          type: iconType,
          buttonName: buttonName,
        },
      });
      dialogReference.afterClosed().subscribe(() => {
        if (isError) {
          this.fileInput.value = '';
          this.toChangeAllValueToDefault();
        } else {
          this.dataEmitterEvent.emit(this.parsedFileData);
        }
      });
    });
  }
}
