import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-search-bar',
  template: `
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" [placeholder]="placeholder" (input)="onSearch($event)" [value]="value" class="search-input" id="search-input" />
      <button *ngIf="value" class="clear-btn" (click)="clear()" aria-label="Clear search">✕</button>
    </div>
  `,
  styles: [`
    .search-bar { position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 1rem; width: 1.25rem; height: 1.25rem; color: #64748b; pointer-events: none; }
    .search-input { width: 100%; padding: 0.75rem 2.5rem 0.75rem 3rem; background: rgba(30, 30, 60, 0.5); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 0.75rem; color: #e2e8f0; font-size: 0.875rem; transition: all 0.3s ease; outline: none; }
    .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    .search-input::placeholder { color: #64748b; }
    .clear-btn { position: absolute; right: 0.75rem; background: none; border: none; color: #64748b; cursor: pointer; font-size: 0.875rem; padding: 0.25rem; }
    .clear-btn:hover { color: #e2e8f0; }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Search...';
  @Input() debounce = 300;
  @Output() searchChange = new EventEmitter<string>();
  value = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(this.debounce), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(val => this.searchChange.emit(val));
  }
  onSearch(event: Event): void { this.value = (event.target as HTMLInputElement).value; this.searchSubject.next(this.value); }
  clear(): void { this.value = ''; this.searchSubject.next(''); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
