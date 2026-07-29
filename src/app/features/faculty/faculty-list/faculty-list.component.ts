import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FacultyService } from '../../../core/services/faculty.service';
import { FacultyProfile } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.scss']
})
export class FacultyListComponent implements OnInit, OnDestroy {
  faculty: FacultyProfile[] = [];
  isLoading = true;
  showDeleteDialog = false;
  deleteTarget: FacultyProfile | null = null;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadFaculty();
    this.searchSubject.pipe(
      debounceTime(300), distinctUntilChanged(),
      switchMap(query => query ? this.facultyService.search(query) : this.facultyService.getAll()),
      takeUntil(this.destroy$)
    ).subscribe(results => { this.faculty = results; this.isLoading = false; });
  }

  loadFaculty(): void {
    this.isLoading = true;
    this.facultyService.getAll().pipe(takeUntil(this.destroy$)).subscribe(f => { this.faculty = f; this.isLoading = false; });
  }

  onSearch(query: string): void { this.searchSubject.next(query); }

  confirmDelete(profile: FacultyProfile): void { this.deleteTarget = profile; this.showDeleteDialog = true; }

  deleteFaculty(): void {
    if (this.deleteTarget) {
      this.facultyService.delete(this.deleteTarget.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.showDeleteDialog = false; this.deleteTarget = null; this.loadFaculty();
      });
    }
  }

  cancelDelete(): void { this.showDeleteDialog = false; this.deleteTarget = null; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
