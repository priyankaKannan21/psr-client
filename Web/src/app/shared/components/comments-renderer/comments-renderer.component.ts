import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-comments-renderer',
  templateUrl: './comments-renderer.component.html',
  styleUrls: ['./comments-renderer.component.scss'],
})
export class CommentsRendererComponent {
  displayValue = '';

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.displayValue = params.value
      ? params.value.replaceAll('/n', '<br/>')
      : '';
  }
}
