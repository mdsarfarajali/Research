import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-status-badge',
  template: `<span class="badge" [ngClass]="'badge--' + normalizedStatus">{{ status }}</span>`,
  styles: [`
    .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; letter-spacing: 0.025em; }
    .badge--published { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge--accepted { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
    .badge--under_review, .badge--under-review { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge--submitted { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .badge--revision { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge--draft { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }
    .badge--rejected { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';
  get normalizedStatus(): string { return this.status.toLowerCase().replace(/\s+/g, '_'); }
}
