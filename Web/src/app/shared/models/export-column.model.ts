import { ColDef } from 'ag-grid-community';

export interface exportColumnData {
  columnDefs?: (ColDef<any, any> | undefined)[];
  columnKeys: string[];
  fileName: string;
}
