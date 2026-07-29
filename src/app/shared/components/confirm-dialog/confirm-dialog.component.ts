import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="onCancel()" id="dialog-cancel">Cancel</button>
          <button class="btn btn-danger" (click)="onConfirm()" id="dialog-confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
    .dialog { background: #1e1e3e; border: 1px solid rgba(99,102,241,0.2); border-radius: 1rem; padding: 2rem; max-width: 420px; width: 90%; }
    .dialog-title { color: #e2e8f0; font-size: 1.25rem; margin-bottom: 0.75rem; }
    .dialog-message { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.6; }
    .dialog-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
    .btn { padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-secondary { background: rgba(100,116,139,0.2); color: #94a3b8; border: 1px solid rgba(100,116,139,0.3); }
    .btn-secondary:hover { background: rgba(100,116,139,0.3); }
    .btn-danger { background: #ef4444; color: white; }
    .btn-danger:hover { background: #dc2626; }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  onConfirm(): void { this.confirmed.emit(); }
  onCancel(): void { this.cancelled.emit(); }
}
