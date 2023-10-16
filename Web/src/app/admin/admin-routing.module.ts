import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CandidateAllocationComponent } from './components/candidate-allocation/candidate-allocation.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

const routes: Routes = [
  {
    path: 'admin',
    component: HomeComponent,
    title: 'Home',
    children: [
      {
        path: 'dashboard',
        data: {
          breadcrumb: 'Dashboard',
        },
        children: [
          {
            path: '',
            component: DashboardComponent,
            title: 'Dashboard',
          },
          {
            path: 'scoreboard',
            component: ScoreboardComponent,
            title: 'Scoreboard',
            data: {
              breadcrumb: 'Scoreboard',
            },
          },
          {
            path: '**',
            redirectTo: 'dashboard',
          },
        ],
      },
      {
        path: 'candidate-allocation',
        component: CandidateAllocationComponent,
        title: 'Candidate Allocation',
        data: {
          breadcrumb: 'Candidate Allocation',
        },
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'admin' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
