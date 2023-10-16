import { Component } from '@angular/core';
import { MENU_ITEMS } from '../../constants/menu-items.constant';
import { MenuItem } from '../../models/menu-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isSidenavExpanded: boolean = false;
  menuItems: MenuItem[] = MENU_ITEMS;

  constructor(private router: Router) {}

  toggleSidenavBar() {
    this.isSidenavExpanded = !this.isSidenavExpanded;
  }
}
