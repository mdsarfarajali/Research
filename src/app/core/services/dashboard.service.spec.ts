import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dashboard stats', (done) => {
    service.getStats().subscribe(stats => {
      expect(stats.totalPapers).toBeGreaterThan(0);
      expect(stats.totalFaculty).toBeGreaterThan(0);
      expect(stats.totalStudents).toBeGreaterThan(0);
      expect(stats.totalCitations).toBeGreaterThan(0);
      expect(stats.acceptanceRate).toBeGreaterThan(0);
      done();
    });
  });

  it('should return monthly submissions data', (done) => {
    service.getStats().subscribe(stats => {
      expect(stats.monthlySubmissions.length).toBe(12);
      stats.monthlySubmissions.forEach(m => {
        expect(m.month).toBeTruthy();
        expect(m.submissions).toBeGreaterThanOrEqual(0);
      });
      done();
    });
  });

  it('should return papers by status', (done) => {
    service.getStats().subscribe(stats => {
      expect(stats.papersByStatus.length).toBeGreaterThan(0);
      stats.papersByStatus.forEach(s => {
        expect(s.status).toBeTruthy();
        expect(s.count).toBeGreaterThanOrEqual(0);
        expect(s.color).toMatch(/^#/);
      });
      done();
    });
  });

  it('should return top departments', (done) => {
    service.getStats().subscribe(stats => {
      expect(stats.topDepartments.length).toBeGreaterThan(0);
      expect(stats.topDepartments[0].papers).toBeGreaterThanOrEqual(stats.topDepartments[stats.topDepartments.length - 1].papers);
      done();
    });
  });

  it('should return recent papers', (done) => {
    service.getStats().subscribe(stats => {
      expect(stats.recentPapers.length).toBeGreaterThan(0);
      stats.recentPapers.forEach(p => {
        expect(p.id).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.status).toBeTruthy();
      });
      done();
    });
  });
});
