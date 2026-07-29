import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../core/services/faculty.service';

@Component({
  standalone: false,
  selector: 'app-faculty-form',
  templateUrl: './faculty-form.component.html',
  styleUrls: ['./faculty-form.component.scss']
})
export class FacultyFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  profileId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private facultyService: FacultyService) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(20)]],
      phone: [''],
      officeLocation: [''],
      specialization: this.fb.array([this.fb.control('', Validators.required)]),
      researchInterests: this.fb.array([this.fb.control('', Validators.required)]),
      googleScholarUrl: [''],
      orcidId: [''],
      linkedinUrl: [''],
      websiteUrl: ['']
    });
  }

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id');
    if (this.profileId) {
      this.isEditing = true; this.isLoading = true;
      this.facultyService.getById(this.profileId).subscribe(p => {
        if (p) {
          this.form.patchValue(p);
          this.specialization.clear(); p.specialization.forEach(s => this.specialization.push(this.fb.control(s, Validators.required)));
          this.researchInterests.clear(); p.researchInterests.forEach(r => this.researchInterests.push(this.fb.control(r, Validators.required)));
        }
        this.isLoading = false;
      });
    }
  }

  get specialization(): FormArray { return this.form.get('specialization') as FormArray; }
  get researchInterests(): FormArray { return this.form.get('researchInterests') as FormArray; }
  get f() { return this.form.controls; }

  addSpec(): void { if (this.specialization.length < 10) this.specialization.push(this.fb.control('', Validators.required)); }
  removeSpec(i: number): void { if (this.specialization.length > 1) this.specialization.removeAt(i); }
  addInterest(): void { if (this.researchInterests.length < 10) this.researchInterests.push(this.fb.control('', Validators.required)); }
  removeInterest(i: number): void { if (this.researchInterests.length > 1) this.researchInterests.removeAt(i); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    const val = this.form.value;
    val.specialization = val.specialization.filter((s: string) => s.trim());
    val.researchInterests = val.researchInterests.filter((r: string) => r.trim());
    const obs$ = this.isEditing && this.profileId ? this.facultyService.update(this.profileId, val) : this.facultyService.create(val);
    obs$.subscribe({ next: () => this.router.navigate(['/faculty']), error: () => this.isSaving = false });
  }
}
