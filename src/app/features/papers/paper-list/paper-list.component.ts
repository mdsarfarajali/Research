import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaperService } from '../../../core/services/paper.service';
import { Paper, PaperFilter, PaperCategory, PaperStatus } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit, OnDestroy {
  papers: Paper[] = [];
  allLoadedPapers: Paper[] = [];
  currentPage = 1;
  totalPages = 1;
  total = 0;
  isLoading = true;
  isLoadingMore = false;
  useInfiniteScroll = false;
  filter: PaperFilter = { sortBy: 'date', sortOrder: 'desc' };
  categories = Object.values(PaperCategory);
  statuses = Object.values(PaperStatus);
  private destroy$ = new Subject<void>();

  constructor(private paperService: PaperService) {}

  ngOnInit(): void { this.loadPapers(); }

  loadPapers(page: number = 1): void {
    this.isLoading = page === 1;
    this.currentPage = page;
    this.paperService.getPapers(this.filter, page, 6).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (this.useInfiniteScroll && page > 1) { this.allLoadedPapers = [...this.allLoadedPapers, ...res.data]; }
      else { this.allLoadedPapers = res.data; }
      this.papers = this.allLoadedPapers;
      this.totalPages = res.totalPages;
      this.total = res.total;
      this.isLoading = false;
      this.isLoadingMore = false;
    });
  }

  onSearchChange(query: string): void { this.filter.search = query; this.loadPapers(1); }

  onCategoryChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.filter.category = val ? val as PaperCategory : undefined;
    this.loadPapers(1);
  }

  onStatusChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.filter.status = val ? val as PaperStatus : undefined;
    this.loadPapers(1);
  }

  onSortChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val) { const [sortBy, sortOrder] = val.split('-'); this.filter.sortBy = sortBy as any; this.filter.sortOrder = sortOrder as any; }
    this.loadPapers(1);
  }

  onPageChange(page: number): void { this.loadPapers(page); }

  onScroll(): void {
    if (this.isLoadingMore || this.currentPage >= this.totalPages) return;
    this.isLoadingMore = true;
    this.loadPapers(this.currentPage + 1);
  }

  toggleScrollMode(): void { this.useInfiniteScroll = !this.useInfiniteScroll; this.loadPapers(1); }

  formatCategory(cat: string): string { return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
