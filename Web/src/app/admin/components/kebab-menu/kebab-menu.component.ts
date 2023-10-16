import { Component } from '@angular/core';

@Component({
  selector: 'app-kebab-menu',
  templateUrl: './kebab-menu.component.html',
  styleUrls: [],
})
export class KebabMenuComponent {
  private params: any;

  constructor() {}

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler() {
    this.params.clicked(this.params.value);
  }
}
