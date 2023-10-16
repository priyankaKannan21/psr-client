import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { CommentsRendererComponent } from './components/comments-renderer/comments-renderer.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [TableComponent, CommentsRendererComponent],
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
  ],
  exports: [TableComponent],
})
export class SharedModule {}
