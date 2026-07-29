import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent, StatusBadgeComponent, SearchBarComponent,
    PaginationComponent, ConfirmDialogComponent, TruncatePipe, TimeAgoPipe
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    LoadingSpinnerComponent, StatusBadgeComponent, SearchBarComponent,
    PaginationComponent, ConfirmDialogComponent, TruncatePipe, TimeAgoPipe
  ]
})
export class SharedModule {}
