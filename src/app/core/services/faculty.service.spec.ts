import { TestBed } from '@angular/core/testing';
import { FacultyService } from './faculty.service';

describe('FacultyService', () => {
  let service: FacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all faculty profiles', (done) => {
    service.getAll().subscribe(profiles => {
      expect(profiles.length).toBeGreaterThan(0);
      expect(profiles[0].firstName).toBeTruthy();
      expect(profiles[0].department).toBeTruthy();
      done();
    });
  });

  it('should get faculty by id', (done) => {
    service.getById('f1').subscribe(profile => {
      expect(profile).toBeTruthy();
      expect(profile!.id).toBe('f1');
      expect(profile!.email).toContain('@research.edu');
      done();
    });
  });

  it('should search faculty by name', (done) => {
    service.search('Sarah').subscribe(results => {
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].firstName).toContain('Sarah');
      done();
    });
  });

  it('should search faculty by department', (done) => {
    service.search('Mathematics').subscribe(results => {
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].department).toBe('Mathematics');
      done();
    });
  });

  it('should create a new faculty profile', (done) => {
    service.create({
      firstName: 'Dr. Test', lastName: 'Faculty', department: 'Testing',
      designation: 'Professor', specialization: ['Testing'], bio: 'Test bio for unit test',
      researchInterests: ['Unit Testing']
    }).subscribe(profile => {
      expect(profile.firstName).toBe('Dr. Test');
      expect(profile.totalCitations).toBe(0);
      done();
    });
  });

  it('should update a faculty profile', (done) => {
    service.update('f1', {
      firstName: 'Dr. Updated', lastName: 'Mitchell', department: 'Computer Science',
      designation: 'Full Professor', specialization: ['AI'], bio: 'Updated bio',
      researchInterests: ['Deep Learning']
    }).subscribe(profile => {
      expect(profile.firstName).toBe('Dr. Updated');
      expect(profile.designation).toBe('Full Professor');
      done();
    });
  });

  it('should delete a faculty profile', (done) => {
    service.delete('f1').subscribe(result => {
      expect(result).toBeTrue();
      service.getById('f1').subscribe(p => {
        expect(p).toBeUndefined();
        done();
      });
    });
  });
});
