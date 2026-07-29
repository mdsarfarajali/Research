import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { FacultyProfile, FacultyProfilePayload } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private readonly base = `${environment.apiUrl}/faculty`;

  private mockProfiles: FacultyProfile[] = [
    { id: 'f1', userId: '1', firstName: 'Dr. Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@research.edu', department: 'Computer Science', designation: 'Associate Professor', specialization: ['Artificial Intelligence', 'Machine Learning', 'NLP'], bio: 'Dr. Mitchell is a leading researcher in AI/ML with over 15 years of experience in deep learning and natural language processing.', phone: '+1-555-0101', officeLocation: 'CS Building, Room 305', researchInterests: ['Deep Learning', 'Computer Vision', 'Adversarial ML'], publications: ['1', '8', '11', '13', '21'], totalCitations: 340, hIndex: 14, googleScholarUrl: 'https://scholar.google.com/sarah-mitchell', orcidId: '0000-0001-2345-6789', linkedinUrl: 'https://linkedin.com/in/sarah-mitchell', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'f2', userId: '2', firstName: 'Prof. James', lastName: 'Anderson', email: 'james.anderson@research.edu', department: 'Mathematics', designation: 'Full Professor', specialization: ['Applied Mathematics', 'Statistics', 'Quantum Computing'], bio: 'Prof. Anderson specializes in applied mathematics with a focus on statistical methods and quantum computing algorithms.', phone: '+1-555-0102', officeLocation: 'Math Building, Room 210', researchInterests: ['Statistical Methods', 'Quantum Algorithms', 'Graph Theory'], publications: ['2', '5', '12', '16'], totalCitations: 412, hIndex: 19, googleScholarUrl: 'https://scholar.google.com/james-anderson', orcidId: '0000-0002-3456-7890', createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'f3', userId: '4', firstName: 'Dr. Emily', lastName: 'Watson', email: 'emily.watson@research.edu', department: 'Biology', designation: 'Assistant Professor', specialization: ['Genetics', 'CRISPR', 'Molecular Biology'], bio: 'Dr. Watson is a pioneer in CRISPR gene editing technology with applications in agriculture and bio-medicine.', phone: '+1-555-0103', officeLocation: 'Bio Building, Room 412', researchInterests: ['Gene Editing', 'Agricultural Biotech', 'Genomics'], publications: ['3', '14', '19'], totalCitations: 185, hIndex: 9, orcidId: '0000-0003-4567-8901', createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'f4', userId: '5', firstName: 'Dr. Thomas', lastName: 'Wright', email: 'thomas.wright@research.edu', department: 'Engineering', designation: 'Associate Professor', specialization: ['Renewable Energy', 'Sustainable Systems', 'Materials Science'], bio: 'Dr. Wright focuses on sustainable energy systems and advanced materials for clean energy harvesting.', phone: '+1-555-0104', officeLocation: 'Eng Building, Room 118', researchInterests: ['Solar Energy', 'Hydrogen Fuel Cells', 'Wind Energy'], publications: ['7', '18', '24'], totalCitations: 210, hIndex: 11, createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'f5', userId: '6', firstName: 'Prof. Karen', lastName: 'Davis', email: 'karen.davis@research.edu', department: 'Social Sciences', designation: 'Full Professor', specialization: ['Political Science', 'Network Analysis', 'Digital Sociology'], bio: 'Prof. Davis studies the impact of digital technologies on society with focus on political polarization and social network dynamics.', phone: '+1-555-0105', officeLocation: 'SS Building, Room 220', researchInterests: ['Social Media Analysis', 'Political Networks', 'Data Ethics'], publications: ['9', '15'], totalCitations: 142, hIndex: 8, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'f6', userId: '7', firstName: 'Dr. Marcus', lastName: 'Vance', email: 'marcus.vance@research.edu', department: 'Physics', designation: 'Associate Professor', specialization: ['Astrophysics', 'Gravitational Waves', 'Cosmology'], bio: 'Dr. Vance researches black hole thermodynamics, dark energy dynamics, and gravitational wave detection technology.', phone: '+1-555-0106', officeLocation: 'Physics Hall, Room 502', researchInterests: ['Compact Objects', 'Laser Interferometry', 'Cosmic Inflation'], publications: ['17', '22'], totalCitations: 295, hIndex: 13, googleScholarUrl: 'https://scholar.google.com/marcus-vance', orcidId: '0000-0004-5678-9012', createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-06-10T00:00:00Z' },
    { id: 'f7', userId: '8', firstName: 'Dr. Sophia', lastName: 'Alvarez', email: 'sophia.alvarez@research.edu', department: 'Chemistry', designation: 'Assistant Professor', specialization: ['Organic Synthesis', 'Catalysis', 'Green Chemistry'], bio: 'Dr. Alvarez develops environmentally friendly catalytic workflows for synthesizing novel medicinal compounds.', phone: '+1-555-0107', officeLocation: 'Chem Annex, Room 104', researchInterests: ['Photocatalysis', 'Biomimetic Synthesis', 'Enzyme Inhibitors'], publications: ['20'], totalCitations: 98, hIndex: 7, orcidId: '0000-0005-6789-0123', createdAt: '2024-04-12T00:00:00Z', updatedAt: '2024-06-12T00:00:00Z' },
    { id: 'f8', userId: '9', firstName: 'Prof. David', lastName: 'O\'Connor', email: 'david.oconnor@research.edu', department: 'Medicine', designation: 'Full Professor', specialization: ['Oncology', 'Immunotherapy', 'Nanomedicine'], bio: 'Prof. O\'Connor leads clinical trials evaluating targeted nanoparticle drug delivery systems for aggressive cancer therapies.', phone: '+1-555-0108', officeLocation: 'Med Center, Suite 300', researchInterests: ['CAR-T Cell Therapy', 'Tumor Microenvironment', 'Precision Medicine'], publications: ['23'], totalCitations: 530, hIndex: 22, googleScholarUrl: 'https://scholar.google.com/david-oconnor', linkedinUrl: 'https://linkedin.com/in/david-oconnor-med', createdAt: '2023-11-20T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z' },
    { id: 'f9', userId: '10', firstName: 'Dr. Elena', lastName: 'Rostova', email: 'elena.rostova@research.edu', department: 'Computer Science', designation: 'Assistant Professor', specialization: ['Cybersecurity', 'Zero-Trust Networks', 'Cryptography'], bio: 'Dr. Rostova researches post-quantum cryptographic primitives, zero-knowledge proofs, and secure cloud enclave execution.', phone: '+1-555-0109', officeLocation: 'CS Building, Room 410', researchInterests: ['Post-Quantum Crypto', 'ZK-SNARKs', 'Privacy-Preserving Computation'], publications: ['13', '21'], totalCitations: 165, hIndex: 9, orcidId: '0000-0006-7890-1234', createdAt: '2024-02-28T00:00:00Z', updatedAt: '2024-06-18T00:00:00Z' },
    { id: 'f10', userId: '11', firstName: 'Dr. Aris', lastName: 'Thorn', email: 'aris.thorn@research.edu', department: 'Humanities', designation: 'Associate Professor', specialization: ['Computational Linguistics', 'Philosophy of Mind', 'Digital Ethics'], bio: 'Dr. Thorn studies algorithmic agency, machine consciousness arguments, and natural language semantics in historical literature.', phone: '+1-555-0110', officeLocation: 'Humanities Center, Room 102', researchInterests: ['AI Ethics', 'Hermeneutics', 'Cognitive Science'], publications: ['10', '15'], totalCitations: 88, hIndex: 6, createdAt: '2024-03-15T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
    { id: 'f11', userId: '12', firstName: 'Prof. Nathan', lastName: 'Gupta', email: 'nathan.gupta@research.edu', department: 'Engineering', designation: 'Full Professor', specialization: ['Robotics', 'Autonomous Navigation', 'Control Systems'], bio: 'Prof. Gupta directs the Autonomous Systems Lab, pioneering swarm robotics, SLAM algorithms, and aerial vehicle control.', phone: '+1-555-0111', officeLocation: 'Robotics Lab, Bay B', researchInterests: ['Swarm Intelligence', 'Visual SLAM', 'Reinforcement Learning in Control'], publications: ['18', '24'], totalCitations: 620, hIndex: 25, googleScholarUrl: 'https://scholar.google.com/nathan-gupta', createdAt: '2023-10-10T00:00:00Z', updatedAt: '2024-06-22T00:00:00Z' },
    { id: '12', userId: '13', firstName: 'Dr. Chloe', lastName: 'Dubois', email: 'chloe.dubois@research.edu', department: 'Biology', designation: 'Associate Professor', specialization: ['Neurobiology', 'Synaptic Plasticity', 'Alzheimer\'s Research'], bio: 'Dr. Dubois conducts research into neurodegenerative disease biomarkers and synaptic transmission mechanisms.', phone: '+1-555-0112', officeLocation: 'Bio Annex, Room 205', researchInterests: ['Amyloid Beta Dynamics', 'Neuroinflammation', 'Electrophysiology'], publications: ['6', '19'], totalCitations: 245, hIndex: 12, orcidId: '0000-0007-8901-2345', createdAt: '2024-01-25T00:00:00Z', updatedAt: '2024-06-25T00:00:00Z' }
  ];

  constructor(private http: HttpClient) {}

  /** GET /faculty — falls back to mock data if API unavailable */
  getAll(): Observable<FacultyProfile[]> {
    const params = new HttpParams().set('_t', Date.now().toString());
    return this.http.get<FacultyProfile[]>(this.base, { params }).pipe(
      timeout(90000),
      catchError(() => of([...this.mockProfiles]))
    );
  }

  /** GET /faculty/:id */
  getById(id: string): Observable<FacultyProfile | undefined> {
    return this.http.get<FacultyProfile>(`${this.base}/${id}`).pipe(
      timeout(90000),
      catchError(() => of(this.mockProfiles.find(f => f.id === id)))
    );
  }

  /** GET /faculty?userId=:userId */
  getByUserId(userId: string): Observable<FacultyProfile | undefined> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<FacultyProfile[]>(this.base, { params }).pipe(
      timeout(90000),
      map(list => list[0]),
      catchError(() => of(this.mockProfiles.find(f => f.userId === userId)))
    );
  }

  /** POST /faculty */
  create(payload: FacultyProfilePayload): Observable<FacultyProfile> {
    return this.http.post<FacultyProfile>(this.base, payload).pipe(
      catchError(() => {
        const profile: FacultyProfile = {
          id: 'f' + (this.mockProfiles.length + 1),
          userId: String(this.mockProfiles.length + 10),
          email: `${payload.firstName.toLowerCase()}.${payload.lastName.toLowerCase()}@research.edu`,
          ...payload, publications: [], totalCitations: 0, hIndex: 0,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        };
        this.mockProfiles.push(profile);
        return of(profile);
      })
    );
  }

  /** PUT /faculty/:id */
  update(id: string, payload: FacultyProfilePayload): Observable<FacultyProfile> {
    return this.http.put<FacultyProfile>(`${this.base}/${id}`, payload).pipe(
      catchError(() => {
        const idx = this.mockProfiles.findIndex(f => f.id === id);
        if (idx === -1) return throwError(() => new Error('Profile not found'));
        this.mockProfiles[idx] = { ...this.mockProfiles[idx], ...payload, updatedAt: new Date().toISOString() };
        return of(this.mockProfiles[idx]);
      })
    );
  }

  /** DELETE /faculty/:id */
  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.base}/${id}`).pipe(
      catchError(() => {
        const idx = this.mockProfiles.findIndex(f => f.id === id);
        if (idx > -1) this.mockProfiles.splice(idx, 1);
        return of(true);
      })
    );
  }

  /** GET /faculty/search?q=:query */
  search(query: string): Observable<FacultyProfile[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<FacultyProfile[]>(`${this.base}/search`, { params }).pipe(
      timeout(1500),
      catchError(() => {
        const q = query.toLowerCase();
        return of(this.mockProfiles.filter(f =>
          f.firstName.toLowerCase().includes(q) || f.lastName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) || f.specialization.some(s => s.toLowerCase().includes(q))
        ));
      })
    );
  }
}
