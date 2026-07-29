import { TestBed } from '@angular/core/testing';
import { PaperService } from './paper.service';
import { PaperCategory, PaperStatus } from '../models';

describe('PaperService', () => {
  let service: PaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return paginated papers', (done) => {
    service.getPapers({}, 1, 5).subscribe(res => {
      expect(res.data.length).toBeLessThanOrEqual(5);
      expect(res.total).toBeGreaterThan(0);
      expect(res.page).toBe(1);
      expect(res.totalPages).toBeGreaterThan(0);
      done();
    });
  });

  it('should filter papers by category', (done) => {
    service.getPapers({ category: PaperCategory.ComputerScience }, 1, 10).subscribe(res => {
      res.data.forEach(p => expect(p.category).toBe(PaperCategory.ComputerScience));
      done();
    });
  });

  it('should filter papers by status', (done) => {
    service.getPapers({ status: PaperStatus.Published }, 1, 20).subscribe(res => {
      res.data.forEach(p => expect(p.status).toBe(PaperStatus.Published));
      done();
    });
  });

  it('should search papers by title', (done) => {
    service.getPapers({ search: 'deep learning' }, 1, 10).subscribe(res => {
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0].title.toLowerCase()).toContain('deep learning');
      done();
    });
  });

  it('should get paper by id', (done) => {
    service.getPaperById('1').subscribe(paper => {
      expect(paper).toBeTruthy();
      expect(paper!.id).toBe('1');
      done();
    });
  });

  it('should return undefined for non-existent paper', (done) => {
    service.getPaperById('9999').subscribe(paper => {
      expect(paper).toBeUndefined();
      done();
    });
  });

  it('should submit a new paper', (done) => {
    service.submitPaper({
      title: 'Test Paper Title for Submission',
      abstract: 'This is a test abstract for unit testing.',
      authors: ['Test Author'],
      category: PaperCategory.ComputerScience,
      keywords: ['testing']
    }).subscribe(paper => {
      expect(paper.title).toBe('Test Paper Title for Submission');
      expect(paper.status).toBe(PaperStatus.Submitted);
      expect(paper.citations).toBe(0);
      done();
    });
  });

  it('should update paper status', (done) => {
    service.updatePaperStatus('1', PaperStatus.UnderReview).subscribe(paper => {
      expect(paper).toBeTruthy();
      expect(paper!.status).toBe(PaperStatus.UnderReview);
      done();
    });
  });

  it('should delete a paper', (done) => {
    service.deletePaper('1').subscribe(result => {
      expect(result).toBeTrue();
      service.getPaperById('1').subscribe(p => {
        expect(p).toBeUndefined();
        done();
      });
    });
  });

  it('should sort papers by citations descending', (done) => {
    service.getPapers({ sortBy: 'citations', sortOrder: 'desc' }, 1, 20).subscribe(res => {
      for (let i = 1; i < res.data.length; i++) {
        expect(res.data[i - 1].citations).toBeGreaterThanOrEqual(res.data[i].citations);
      }
      done();
    });
  });
});
