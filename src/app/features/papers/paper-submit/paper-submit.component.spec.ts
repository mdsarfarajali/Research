import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PaperSubmitComponent } from './paper-submit.component';
import { SharedModule } from '../../../shared/shared.module';

describe('PaperSubmitComponent', () => {
  let component: PaperSubmitComponent;
  let fixture: ComponentFixture<PaperSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperSubmitComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, SharedModule]
    }).compileComponents();
    fixture = TestBed.createComponent(PaperSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should initialize with one author and one keyword', () => {
    expect(component.authors.length).toBe(1);
    expect(component.keywords.length).toBe(1);
  });

  it('should add authors', () => {
    component.addAuthor();
    expect(component.authors.length).toBe(2);
  });

  it('should remove authors but keep at least one', () => {
    component.addAuthor();
    component.removeAuthor(1);
    expect(component.authors.length).toBe(1);
    component.removeAuthor(0);
    expect(component.authors.length).toBe(1);
  });

  it('should add keywords', () => {
    component.addKeyword();
    expect(component.keywords.length).toBe(2);
  });

  it('should validate required fields', () => {
    expect(component.submitForm.valid).toBeFalse();
    component.submitForm.patchValue({
      title: 'A sufficiently long test paper title',
      abstract: 'A'.repeat(50),
      category: 'computer_science'
    });
    component.authors.at(0).setValue('Test Author');
    component.keywords.at(0).setValue('testing');
    expect(component.submitForm.valid).toBeTrue();
  });

  it('should not allow more than 10 authors', () => {
    for (let i = 0; i < 12; i++) component.addAuthor();
    expect(component.authors.length).toBe(10);
  });

  it('should track abstract length', () => {
    component.submitForm.patchValue({ abstract: 'Hello world' });
    expect(component.abstractLength).toBe(11);
  });
});
