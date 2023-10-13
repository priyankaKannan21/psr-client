import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CandidateAllocationComponent } from './components/candidate-allocation/candidate-allocation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { NetscoreCalculationComponent } from './components/netscore-calculation/netscore-calculation.component';
import { HttpClientModule } from '@angular/common/http';
import { ScoreboardService } from './services/scoreboard/scoreboard.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DownloadTemplateButtonComponent } from './components/download-template-button/download-template-button.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImportFileComponent } from './components/import-file/import-file.component';
import { AdminHttpService } from './services/admin-http/admin-http.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogWindowComponent } from './components/dialog-window/dialog-window.component';
import { MatMenuModule } from '@angular/material/menu';
import { KebabMenuComponent } from './components/kebab-menu/kebab-menu.component';
import { EvaluatorListComponent } from './components/evaluator-list/evaluator-list.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { AllocationListComponent } from './components/allocation-list/allocation-list.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WeightageMaxscoreDialogContentComponent } from './components/weightage-maxscore-dialog-content/weightage-maxscore-dialog-content.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CurrentRecruitmentComponent } from './components/current-recruitment/current-recruitment.component';

@NgModule({
  declarations: [
    HomeComponent,
    CandidateAllocationComponent,
    DashboardComponent,
    HeaderComponent,
    CurrentRecruitmentComponent,
    NetscoreCalculationComponent,
    DownloadTemplateButtonComponent,
    ImportFileComponent,
    DialogWindowComponent,
    KebabMenuComponent,
    EvaluatorListComponent,
    CandidateListComponent,
    AllocationListComponent,
    ScoreboardComponent,
    WeightageMaxscoreDialogContentComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatStepperModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [AdminHttpService, ScoreboardService],
})
export class AdminModule {}
