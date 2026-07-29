import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-overlay" [class.inline]="inline">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; }
    .spinner-overlay:not(.inline) { position: fixed; inset: 0; background: rgba(10, 10, 20, 0.6); backdrop-filter: blur(4px); z-index: 9999; }
    .spinner { position: relative; width: 50px; height: 50px; }
    .spinner-ring { position: absolute; inset: 0; border-radius: 50%; border: 3px solid transparent; }
    .spinner-ring:nth-child(1) { border-top-color: #6366f1; animation: spin 1s ease-in-out infinite; }
    .spinner-ring:nth-child(2) { border-right-color: #8b5cf6; animation: spin 1.2s ease-in-out infinite reverse; }
    .spinner-ring:nth-child(3) { border-bottom-color: #a78bfa; animation: spin 1.5s ease-in-out infinite; }
    .spinner-message { margin-top: 1rem; color: #a5b4fc; font-size: 0.875rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() inline = false;
}
