import { MenuItem } from '../models/menu-item.model';

export const MENU_ITEMS: MenuItem[] = [
  { iconName: 'dashboard', title: 'Dashboard', routerLink: 'dashboard' },
  {
    iconName: 'assignment_ind',
    title: 'Candidate Allocation',
    routerLink: 'candidate-allocation',
    queryParams: 'evaluator-detail',
  },
];
