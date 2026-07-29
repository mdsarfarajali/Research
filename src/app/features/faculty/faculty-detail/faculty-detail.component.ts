import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../core/services/faculty.service';
import { FacultyProfile } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-faculty-detail',
  templateUrl: './faculty-detail.component.html',
  styleUrls: ['./faculty-detail.component.scss']
})
export class FacultyDetailComponent implements OnInit {
  profile: FacultyProfile | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private facultyService: FacultyService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.facultyService.getById(id).subscribe(p => { this.profile = p || null; this.isLoading = false; }); }
  }

  goBack(): void { this.router.navigate(['/faculty']); }
}
