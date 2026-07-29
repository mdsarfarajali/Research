import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-pagination',
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button class="page-btn" (click)="changePage(currentPage - 1)" [disabled]="currentPage <= 1" id="prev-page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button *ngFor="let p of visiblePages" class="page-btn" [class.active]="p === currentPage" (click)="changePage(p)" [id]="'page-' + p">{{ p }}</button>
      <button class="page-btn" (click)="changePage(currentPage + 1)" [disabled]="currentPage >= totalPages" id="next-page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  `,
  styles: [`
    .pagination { display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin-top: 2rem; }
    .page-btn { display: flex; align-items: center; justify-content: center; min-width: 2.5rem; height: 2.5rem; padding: 0.5rem; background: rgba(30, 30, 60, 0.5); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 0.5rem; color: #a5b4fc; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease; }
    .page-btn:hover:not(:disabled) { background: rgba(99, 102, 241, 0.2); border-color: #6366f1; color: #e2e8f0; }
    .page-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) this.pageChange.emit(page);
  }
}
