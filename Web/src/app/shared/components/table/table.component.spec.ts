import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { TableComponent } from './table.component';
import { EvaluationDataService } from '../../services/evaluation-data/evaluation-data.service';
import { LiveEvaluationData } from '../../models/evaluation-data.model';
import { Subject, Subscription, interval, of } from 'rxjs';
import { EvaluationLiveDataService } from '../../services/evaluation-live-data/evaluation-live-data.service';
import { GridApi, ColumnApi, Column, IRowNode } from 'ag-grid-community';
import { exportColumnData } from '../../models/export-column.model';
import {
  ALLOCATION_DETAIL_COLUMN_HEADER,
  ALLOCATION_DOWNLOAD_HEADER,
  ALLOCATION_FILE_NAME,
  COLUMN_FIELDS,
} from '../../constants/table-column-definitions.constant';
import {
  COLUMN_KEYS_FOR_DOWNLOAD_SCOREBOARD,
  SCOREBOARD_FILE_NAME,
} from 'src/app/admin/constants/scoreboard.constants';
import { REFRESH_TIME } from '../../constants/table.constants';

fdescribe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let evaluationDataServiceSpy: jasmine.SpyObj<EvaluationDataService>;
  let evaluationLiveDataServiceSpy: jasmine.SpyObj<EvaluationLiveDataService>;
  let gridApiMock: jasmine.SpyObj<GridApi>;
  let columnApiMock: jasmine.SpyObj<ColumnApi>;
  let evaluationData: LiveEvaluationData[] = [
    {
      studentEmail: 'student_1@gmail.com',
      evaluatorName: 'Soliton_1',
      criteria1: 3,
      criteria2: 2,
      comments:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
    },
    {
      studentEmail: 'student_2@gmail.com',
      evaluatorName: 'Soliton_1',
      criteria1: 4,
      criteria2: 1,
      comments:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate quis quo aperiam neque beatae, modi nobis error culpa autem exercitationem reiciendis nam voluptates consequatur perferendis assumenda cumque soluta quasi consequuntur?',
    },
  ];

  beforeEach(async () => {
    const evaluationDataServiceSpyObject = jasmine.createSpyObj(
      'ScoreboardService',
      ['getLiveEvaluationData']
    );
    const evaluationLiveDataServiceSpyObject = jasmine.createSpyObj(
      'EvaluationLiveDataService',
      {
        isEvaluationLive$: '',
      }
    );
    const gridApiMockObject = jasmine.createSpyObj('GridApi', [
      'exportDataAsCsv',
      'getColumnDefs',
      'getDisplayedRowAtIndex',
    ]);
    const columnApiMockObject = jasmine.createSpyObj('ColumnApi', [
      'getColumn',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [
        {
          provide: EvaluationDataService,
          useValue: evaluationDataServiceSpyObject,
        },
        {
          provide: EvaluationLiveDataService,
          useValue: evaluationLiveDataServiceSpyObject,
        },
        { provide: GridApi, useValue: gridApiMockObject },
        { provide: ColumnApi, useValue: columnApiMockObject },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    evaluationDataServiceSpy = TestBed.inject(
      EvaluationDataService
    ) as jasmine.SpyObj<EvaluationDataService>;
    evaluationLiveDataServiceSpy = TestBed.inject(
      EvaluationLiveDataService
    ) as jasmine.SpyObj<EvaluationLiveDataService>;
    gridApiMock = TestBed.inject(GridApi) as jasmine.SpyObj<GridApi>;
    columnApiMock = TestBed.inject(ColumnApi) as jasmine.SpyObj<ColumnApi>;

    evaluationDataServiceSpy.getLiveEvaluationData.and.returnValue(
      of(evaluationData)
    );
    evaluationLiveDataServiceSpy.isEvaluationLive$ = of(true);

    component.dataSource = {
      dataTableHeight: '65vh',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLiveData if isLiveDataRequired is true', () => {
    spyOn(component, 'getLiveData');

    component.ngOnInit();

    expect(component.getLiveData).toHaveBeenCalled();
  });

  it('should call unsubscribeLiveUpdates if isLiveDataRequired is false', () => {
    evaluationLiveDataServiceSpy.isEvaluationLive$ = of(false);
    spyOn(component, 'unsubscribeLiveUpdates');

    component.ngOnInit();

    expect(component.unsubscribeLiveUpdates).toHaveBeenCalled();
  });

  it('should unsubscribe liveDataSubscription', () => {
    const mockSubscription = new Subscription();
    component.liveDataSubscription = mockSubscription;
    spyOn(component.liveDataSubscription, 'unsubscribe');

    component.unsubscribeLiveUpdates();

    expect(component.liveDataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should assign gridApi and columnApi when onGridReady is called', () => {
    const mockGridReadyEvent: any = {
      api: {} as GridApi,
      columnApi: {} as ColumnApi,
    };

    component.onGridReady(mockGridReadyEvent);

    expect(component['gridApi']).toBe(mockGridReadyEvent.api);
    expect(component.columnApi).toBe(mockGridReadyEvent.columnApi);
  });

  it('should call exportDataAsCsv with correct parameters for ALLOCATION_FILE_NAME', () => {
    const columnKeys = ALLOCATION_DOWNLOAD_HEADER;
    const fileName = ALLOCATION_FILE_NAME;
    let params: exportColumnData = {
      columnDefs: [{ headerName: 'Student' }, { headerName: 'Email_id' }],
      columnKeys,
      fileName,
    };
    component.columnApi = columnApiMock;
    component['gridApi'] = gridApiMock;
    columnApiMock.getColumn.and.callFake((field: any) => {
      if (field === COLUMN_FIELDS.EMAIL_ID) {
        const dummyColumn: Column = {
          getColDef: () => ({
            headerName: ALLOCATION_DETAIL_COLUMN_HEADER.CANDIDATE_EMAIL,
          }),
        } as any;
        return dummyColumn;
      } else if (field === COLUMN_FIELDS.PROCTOR) {
        const dummyColumn: Column = {
          getColDef: () => ({
            headerName: ALLOCATION_DETAIL_COLUMN_HEADER.PROCTOR,
          }),
        } as any;
        return dummyColumn;
      }
      return null;
    });

    component.toDownloadCSV(columnKeys, fileName);

    expect(gridApiMock.exportDataAsCsv).toHaveBeenCalledWith(params);
  });

  it('should call exportDataAsCsv with correct parameters for other file names', () => {
    const columnKeys = COLUMN_KEYS_FOR_DOWNLOAD_SCOREBOARD;
    const fileName = SCOREBOARD_FILE_NAME;
    component['gridApi'] = gridApiMock;

    component.toDownloadCSV(columnKeys, fileName);

    expect(gridApiMock.exportDataAsCsv).toHaveBeenCalledWith({
      columnKeys,
      fileName,
    });
  });

  it('should call getLiveEvaluationData and update row data', fakeAsync(() => {
    component.refreshInterval$ = of(0);
    component.stopRefreshing$ = new Subject<void>();
    const columnDefinitions: any[] = [
      { field: COLUMN_FIELDS.CRITERIA_1 },
      { field: COLUMN_FIELDS.CRITERIA_2 },
      { field: COLUMN_FIELDS.CRITERIA_3 },
      { field: COLUMN_FIELDS.COMMENTS },
    ];

    gridApiMock.getColumnDefs.and.returnValue(columnDefinitions);
    gridApiMock.getDisplayedRowAtIndex.and.callFake((index: number) => {
      let rowNode: IRowNode<any> = {
        data: evaluationData[index],
        setDataValue: jasmine.createSpy(),
      } as unknown as IRowNode;

      return rowNode;
    });

    component['gridApi'] = gridApiMock;

    component.getLiveData();

    tick(6000);

    expect(evaluationDataServiceSpy.getLiveEvaluationData).toHaveBeenCalled();
    expect(component['gridApi'].getColumnDefs).toHaveBeenCalled();
    expect(component['gridApi'].getDisplayedRowAtIndex).toHaveBeenCalledTimes(
      evaluationData.length
    );
    evaluationData.forEach((studentScores, index) => {
      expect(component['gridApi'].getDisplayedRowAtIndex).toHaveBeenCalledWith(
        index
      );
    });
  }));

  it('should call getLiveEvaluationData for every REFRESH_TIME seconds', fakeAsync(() => {
    component.refreshInterval$ = interval(REFRESH_TIME);
    component.stopRefreshing$ = new Subject<void>();
    const columnDefinitions: any[] = [
      { field: COLUMN_FIELDS.CRITERIA_1 },
      { field: COLUMN_FIELDS.CRITERIA_2 },
      { field: COLUMN_FIELDS.CRITERIA_3 },
      { field: COLUMN_FIELDS.COMMENTS },
    ];

    gridApiMock.getColumnDefs.and.returnValue(columnDefinitions);
    gridApiMock.getDisplayedRowAtIndex.and.callFake((index: number) => {
      let rowNode: IRowNode<any> = {
        data: evaluationData[index],
        setDataValue: jasmine.createSpy(),
      } as unknown as IRowNode;

      return rowNode;
    });

    component['gridApi'] = gridApiMock;

    component.getLiveData();

    tick(REFRESH_TIME);

    expect(evaluationDataServiceSpy.getLiveEvaluationData).toHaveBeenCalled();

    tick(REFRESH_TIME);

    expect(evaluationDataServiceSpy.getLiveEvaluationData).toHaveBeenCalled();

    tick(REFRESH_TIME);

    expect(evaluationDataServiceSpy.getLiveEvaluationData).toHaveBeenCalled();

    tick(REFRESH_TIME);

    expect(evaluationDataServiceSpy.getLiveEvaluationData).toHaveBeenCalled();

    component.unsubscribeLiveUpdates();
  }));
});
