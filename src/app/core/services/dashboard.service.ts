import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { DashboardStats } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly base = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  /** GET /dashboard/stats — falls back to mock data if API unavailable */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/stats`).pipe(
      timeout(90000),
      catchError(() => of(this.mockStats()))
    );
  }

  private mockStats(): DashboardStats {
    return {
      totalPapers: 156, totalFaculty: 42, totalStudents: 385, totalCitations: 4280,
      papersThisMonth: 12, acceptanceRate: 68.5, avgReviewTime: 14.3,
      topDepartments: [
        { department: 'Computer Science', papers: 45, citations: 1250 },
        { department: 'Mathematics', papers: 32, citations: 890 },
        { department: 'Biology', papers: 28, citations: 720 },
        { department: 'Physics', papers: 24, citations: 680 },
        { department: 'Engineering', papers: 18, citations: 450 }
      ],
      papersByStatus: [
        { status: 'Published', count: 78, color: '#10b981' },
        { status: 'Accepted', count: 15, color: '#6366f1' },
        { status: 'Under Review', count: 23, color: '#f59e0b' },
        { status: 'Submitted', count: 18, color: '#3b82f6' },
        { status: 'Revision', count: 12, color: '#ef4444' },
        { status: 'Draft', count: 10, color: '#8b5cf6' }
      ],
      papersByCategory: [
        { category: 'Computer Science', count: 45 },
        { category: 'Mathematics', count: 32 },
        { category: 'Biology', count: 28 },
        { category: 'Physics', count: 24 },
        { category: 'Engineering', count: 18 },
        { category: 'Chemistry', count: 15 },
        { category: 'Medicine', count: 12 },
        { category: 'Social Sciences', count: 8 },
        { category: 'Humanities', count: 5 }
      ],
      monthlySubmissions: [
        { month: 'Jan', submissions: 15, accepted: 10, rejected: 3 },
        { month: 'Feb', submissions: 18, accepted: 12, rejected: 4 },
        { month: 'Mar', submissions: 22, accepted: 15, rejected: 5 },
        { month: 'Apr', submissions: 14, accepted: 9, rejected: 3 },
        { month: 'May', submissions: 20, accepted: 14, rejected: 4 },
        { month: 'Jun', submissions: 25, accepted: 17, rejected: 6 },
        { month: 'Jul', submissions: 19, accepted: 13, rejected: 4 },
        { month: 'Aug', submissions: 16, accepted: 11, rejected: 3 },
        { month: 'Sep', submissions: 21, accepted: 14, rejected: 5 },
        { month: 'Oct', submissions: 23, accepted: 16, rejected: 5 },
        { month: 'Nov', submissions: 17, accepted: 12, rejected: 3 },
        { month: 'Dec', submissions: 12, accepted: 8, rejected: 2 }
      ],
      recentPapers: [
        { id: '23', title: 'Nanoparticle-Targeted Immunotherapy in Triple-Negative Breast Cancer', author: 'Prof. David O\'Connor', status: 'Published', date: '2024-04-05', category: 'Medicine' },
        { id: '1', title: 'Deep Learning Approaches for Natural Language Processing', author: 'Dr. Sarah Mitchell', status: 'Published', date: '2024-03-15', category: 'Computer Science' },
        { id: '13', title: 'Zero-Knowledge Cryptographic Schemes for Multi-Party Enclaves', author: 'Dr. Elena Rostova', status: 'Published', date: '2024-05-18', category: 'Computer Science' },
        { id: '18', title: 'Swarm Robotics for Disaster Response and Navigation', author: 'Prof. Nathan Gupta', status: 'Accepted', date: '2024-06-18', category: 'Engineering' },
        { id: '21', title: 'Real-Time Edge Neural Network Quantization for IoT Sensors', author: 'Dr. Elena Rostova', status: 'Submitted', date: '2024-06-10', category: 'Computer Science' }
      ]
    };
  }
}
