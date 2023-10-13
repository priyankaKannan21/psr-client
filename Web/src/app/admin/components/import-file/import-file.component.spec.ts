import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFileComponent } from './import-file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ALLOCATION_MESSAGES,
  BUTTON_NAME,
  CANDIDATE_VIEW_DATA,
  DOWNLOAD_TEMPLATE_FILE_NAME,
  EVALUATOR_VIEW_DATA,
  ICON_TYPE,
} from '../../constants/candidate-allocation.constant';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { DownloadTemplateButtonComponent } from '../download-template-button/download-template-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { convertToDataObject } from '../../utils/csv-file-validation';

fdescribe('ImportFileComponent', () => {
  let component: ImportFileComponent;
  let fixture: ComponentFixture<ImportFileComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [
        ImportFileComponent,
        DialogWindowComponent,
        DownloadTemplateButtonComponent,
      ],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatButtonModule,
      ],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportFileComponent);
    component = fixture.componentInstance;
    component.dataSource = EVALUATOR_VIEW_DATA;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Initialization', () => {
    it('should set fileName if dataSource.headerValue is Evaluator', () => {
      expect(component.fileName).toEqual(DOWNLOAD_TEMPLATE_FILE_NAME.evaluator);
    });

    it('should set fileName if dataSource.headerValue is Candidate', () => {
      component.dataSource = CANDIDATE_VIEW_DATA;
      component.ngOnInit();
      expect(component.fileName).toEqual(DOWNLOAD_TEMPLATE_FILE_NAME.candidate);
    });
  });

  describe('On onFileSelected function call', () => {
    const mockFile = new File(['file content'], 'evaluatorData.csv', {
      type: 'text/csv',
    });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    beforeEach(async () => {
      component.onFileSelected(mockEvent);
    });

    it('should define fileInput', () => {
      expect(component.fileInput).toBeDefined();
    });

    it('should set uploadFileName', () => {
      expect(component.uploadFileName).toBeDefined();
    });

    it('should open parsing dialog', () => {
      expect(mockDialog.open).toHaveBeenCalledOnceWith(DialogWindowComponent, {
        data: jasmine.objectContaining({
          headerValue: component.dataSource.headerValue,
          fileName: component.uploadFileName,
          message: ALLOCATION_MESSAGES.PARSING_FILE,
          type: ICON_TYPE.LOADING,
          buttonName: BUTTON_NAME.CANCEL,
        }),
      });
    });

    it('should open an error dialog for an empty CSV file', () => {
      const mockFile = new File([''], 'test.txt', {
        type: 'text/csv',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.onFileSelected(mockEvent);

      expect(openDialogSpy).toHaveBeenCalledOnceWith(
        true,
        ALLOCATION_MESSAGES.EMPTY_FILE,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
    });
    it('should open an error dialog for invalid file format', () => {
      const mockFile = new File([''], 'test.txt', {
        type: 'text/plain',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.onFileSelected(mockEvent);

      expect(openDialogSpy).toHaveBeenCalledOnceWith(
        true,
        ALLOCATION_MESSAGES.INVALID_FILE_FORMAT,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
    });
  });

  describe('On parseCsvContent function call', () => {
    const content = `Evaluator Name,Evaluator Email
    Evaluator_1,evaluator_1@solitontech.com
    Evaluator_2,evaluator_2@solitontech.com
    Evaluator_3,evaluator_3@solitontech.com
    Evaluator_4,evaluator_4@solitontech.com
    Evaluator_5,evaluator_5@solitontech.com`;

    beforeEach(async () => {
      component.parseCsvContent(content);
    });

    it('should open an error dialog for invalid evaluator column header', () => {
      const content = `Name,Email
      Evaluator_1,evaluator_1@solitontech.com
      Evaluator_5,evaluator_5@solitontech.com`;

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.parseCsvContent(content);

      expect(openDialogSpy).toHaveBeenCalledWith(
        true,
        ALLOCATION_MESSAGES.INVALID_COLUMN_HEADERS,
        ICON_TYPE.ERROR,
        BUTTON_NAME.CANCEL
      );
    });

    it('should open an error dialog for invalid candidate column header', () => {
      component.dataSource = CANDIDATE_VIEW_DATA;

      const content = `Name,Email
      Student_1,student_1@gmail.com
      Student_2,student_2@gmail.com`;

      component.parseCsvContent(content);

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.parseCsvContent(content);

      expect(openDialogSpy).toHaveBeenCalledWith(
        true,
        ALLOCATION_MESSAGES.INVALID_COLUMN_HEADERS,
        ICON_TYPE.ERROR,
        BUTTON_NAME.CANCEL
      );
    });

    it('should open an error dialog for missing value', () => {
      const content = `Evaluator Name,Evaluator Email
      Evaluator_1,
      Evaluator_5,evaluator_5@solitontech.com`;

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.parseCsvContent(content);

      expect(openDialogSpy).toHaveBeenCalledWith(
        true,
        ALLOCATION_MESSAGES.EMPTY_INPUT_FIELD,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
    });

    it('should open an error dialog for empty file data', () => {
      const content = `Evaluator Name,Evaluator Email`;

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      component.parseCsvContent(content);

      expect(openDialogSpy).toHaveBeenCalledWith(
        true,
        ALLOCATION_MESSAGES.EMPTY_FILE_DATA,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
    });

    it('should convert rowData to a data object using headerValue', () => {
      const rowData = ['Student_1', 'student_1@gmail.com', 'ECE'];
      const headerValue = 'Candidate';

      const rowDataObject = convertToDataObject(rowData, headerValue);

      const expectedDataObject = {
        studentName: 'Student_1',
        department: 'ECE',
        studentEmail: 'student_1@gmail.com',
      };

      expect(rowDataObject).toEqual(expectedDataObject);
    });
  });

  describe('On checkForMissingValues function call', () => {
    it('should set isValueMissing to true when a missing value is found', () => {
      const headers = ['Evaluator Name', 'Evaluator Email'];
      const rowDataWithMissingValue = ['Evaluator_1', ''];

      component.checkForMissingValues(headers, rowDataWithMissingValue);

      expect(component.isValueMissing).toBe(true);
    });

    it('should not set isValueMissing to true when all values are present', () => {
      const headers = ['Evaluator Name', 'Evaluator Email'];
      const rowDataWithoutMissingValue = [
        'Evaluator_1',
        'evaluator1_1@solitontech.com',
      ];

      component.checkForMissingValues(headers, rowDataWithoutMissingValue);

      expect(component.isValueMissing).toBe(false);
    });
  });

  describe('On checkingForDuplicateData function call', () => {
    it('should set isHavingDuplicateData to true and open dialog if duplicate data exists', () => {
      const emailDataArrayWithDuplicates = [
        'evaluator_1@solitontech.com',
        'evaluator_2@solitontech.com',
        'evaluator_1@solitontech.com',
        'evaluator_3@solitontech.com',
      ];

      const openDialogSpy = spyOn(component, 'toOpenDialogWindow');

      const hasDuplicate = component.checkForDuplicateData(
        emailDataArrayWithDuplicates
      );

      expect(hasDuplicate).toBe(true);
      expect(component.isHavingDuplicateData).toBe(true);

      expect(openDialogSpy).toHaveBeenCalledWith(
        true,
        ALLOCATION_MESSAGES.DUPLICATE_EMAIL,
        ICON_TYPE.ERROR,
        BUTTON_NAME.OK
      );
    });

    it('should not set isHavingDuplicateData to true if no duplicate data exists', () => {
      const emailDataArrayWithoutDuplicates = [
        'evaluator_1@solitontech.com',
        'evaluator_2@solitontech.com',
        'evaluator_3@solitontech.com',
      ];

      const hasDuplicate = component.checkForDuplicateData(
        emailDataArrayWithoutDuplicates
      );

      expect(hasDuplicate).toBeUndefined();
      expect(component.isHavingDuplicateData).toBe(false);
    });
  });

  it('should reset all values to default', () => {
    component.isColumnHeadersValid = false;
    component.isValueMissing = true;
    component.uploadFileName = 'evaluatorData.csv';
    component.isHavingDuplicateData = true;
    component.emailDataArray = [
      'evaluator_1@solitontech.com',
      'evaluator_2@solitontech.com',
    ];

    component.toChangeAllValueToDefault();

    expect(component.isColumnHeadersValid).toBe(true);
    expect(component.isValueMissing).toBe(false);
    expect(component.uploadFileName).toBe('');
    expect(component.isHavingDuplicateData).toBe(false);
    expect(component.emailDataArray).toEqual([]);
  });
});
