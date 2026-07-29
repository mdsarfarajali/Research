import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, User } from '../../core/models';

Chart.register(...registerables);

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('submissionsChart') submissionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  currentUser: User | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();
  private charts: Chart[] = [];
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$))
      .subscribe(u => this.currentUser = u);

    this.dashboardService.getStats().pipe(takeUntil(this.destroy$))
      .subscribe(s => {
        this.stats = s;
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.initCharts(), 50);
      });
  }

  ngAfterViewInit(): void {}

  private initCharts(): void {
    if (!this.stats) return;
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    // Monthly Submissions Line Chart
    if (this.submissionsChartRef?.nativeElement) {
      const ctx = this.submissionsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 280);
        gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient1.addColorStop(1, 'rgba(99, 102, 241, 0)');
        const gradient2 = ctx.createLinearGradient(0, 0, 0, 280);
        gradient2.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        gradient2.addColorStop(1, 'rgba(16, 185, 129, 0)');
        this.charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.stats.monthlySubmissions.map(m => m.month),
            datasets: [
              { label: 'Submissions', data: this.stats.monthlySubmissions.map(m => m.submissions), borderColor: '#6366f1', backgroundColor: gradient1, fill: true, tension: 0.4, pointBackgroundColor: '#6366f1', pointBorderColor: '#141432', pointBorderWidth: 2, pointRadius: 4 },
              { label: 'Accepted', data: this.stats.monthlySubmissions.map(m => m.accepted), borderColor: '#10b981', backgroundColor: gradient2, fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointBorderColor: '#141432', pointBorderWidth: 2, pointRadius: 4 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
            scales: {
              x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(99,102,241,0.08)' } },
              y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(99,102,241,0.08)' } }
            }
          }
        }));
      }
    }

    // Status Doughnut Chart
    if (this.statusChartRef?.nativeElement) {
      const ctx2 = this.statusChartRef.nativeElement.getContext('2d');
      if (ctx2) {
        this.charts.push(new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: this.stats.papersByStatus.map(s => s.status),
            datasets: [{ data: this.stats.papersByStatus.map(s => s.count), backgroundColor: this.stats.papersByStatus.map(s => s.color), borderColor: '#141432', borderWidth: 3 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 15, usePointStyle: true } } }
          }
        }));
      }
    }

    // Category Bar Chart
    if (this.categoryChartRef?.nativeElement) {
      const ctx3 = this.categoryChartRef.nativeElement.getContext('2d');
      if (ctx3) {
        this.charts.push(new Chart(ctx3, {
          type: 'bar',
          data: {
            labels: this.stats.papersByCategory.map(c => c.category),
            datasets: [{ label: 'Papers', data: this.stats.papersByCategory.map(c => c.count), backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#34d399', '#f59e0b', '#3b82f6', '#ef4444'], borderRadius: 6, borderSkipped: false }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#64748b', maxRotation: 45 }, grid: { display: false } },
              y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(99,102,241,0.08)' } }
            }
          }
        }));
      }
    }
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
