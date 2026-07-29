import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperService } from '../../../core/services/paper.service';
import { AuthService } from '../../../core/services/auth.service';
import { Paper, PaperStatus, UserRole } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | null = null;
  isLoading = true;
  showDeleteDialog = false;
  isAdmin = false;
  statuses = Object.values(PaperStatus);

  constructor(private route: ActivatedRoute, private router: Router, private paperService: PaperService, private authService: AuthService) {
    this.isAdmin = this.authService.hasRole(UserRole.Admin);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.paperService.getPaperById(id).subscribe(p => { this.paper = p || null; this.isLoading = false; }); }
  }

  updateStatus(status: string): void {
    if (this.paper) { this.paperService.updatePaperStatus(this.paper.id, status as PaperStatus).subscribe(p => { if (p) this.paper = p; }); }
  }

  deletePaper(): void {
    if (this.paper) { this.paperService.deletePaper(this.paper.id).subscribe(() => this.router.navigate(['/papers'])); }
  }

  formatCategory(cat: string): string { return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }
  goBack(): void { this.router.navigate(['/papers']); }
}
