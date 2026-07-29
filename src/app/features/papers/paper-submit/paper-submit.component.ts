import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaperService } from '../../../core/services/paper.service';
import { PaperCategory } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-paper-submit',
  templateUrl: './paper-submit.component.html',
  styleUrls: ['./paper-submit.component.scss']
})
export class PaperSubmitComponent {
  submitForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  categories = Object.entries(PaperCategory).map(([key, value]) => ({ label: key.replace(/([A-Z])/g, ' $1').trim(), value }));

  constructor(private fb: FormBuilder, private paperService: PaperService, private router: Router) {
    this.submitForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      category: ['', Validators.required],
      authors: this.fb.array([this.fb.control('', Validators.required)]),
      keywords: this.fb.array([this.fb.control('', Validators.required)]),
      doi: [''],
      journal: ['']
    });
  }

  get authors(): FormArray { return this.submitForm.get('authors') as FormArray; }
  get keywords(): FormArray { return this.submitForm.get('keywords') as FormArray; }
  get f() { return this.submitForm.controls; }

  addAuthor(): void { if (this.authors.length < 10) this.authors.push(this.fb.control('', Validators.required)); }
  removeAuthor(i: number): void { if (this.authors.length > 1) this.authors.removeAt(i); }
  addKeyword(): void { if (this.keywords.length < 10) this.keywords.push(this.fb.control('', Validators.required)); }
  removeKeyword(i: number): void { if (this.keywords.length > 1) this.keywords.removeAt(i); }

  onSubmit(): void {
    if (this.submitForm.invalid) { this.submitForm.markAllAsTouched(); return; }
    this.isLoading = true;
    const val = this.submitForm.value;
    this.paperService.submitPaper({ ...val, authors: val.authors.filter((a: string) => a.trim()), keywords: val.keywords.filter((k: string) => k.trim()) }).subscribe({
      next: () => { this.isSuccess = true; this.isLoading = false; setTimeout(() => this.router.navigate(['/papers']), 2000); },
      error: () => { this.isLoading = false; }
    });
  }

  get abstractLength(): number { return (this.submitForm.get('abstract')?.value || '').length; }
}
