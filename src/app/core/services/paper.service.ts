import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Paper, PaperStatus, PaperCategory, PaperFilter, PaperSubmission } from '../models';
import { PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaperService {
  private readonly base = `${environment.apiUrl}/papers`;

  // Mock data used as fallback when API is unavailable
  private mockPapers: Paper[] = [
    { id: '1', title: 'Deep Learning Approaches for Natural Language Processing', abstract: 'This paper explores modern deep learning architectures for NLP tasks including transformer models, attention mechanisms, and their applications in text classification, machine translation, and sentiment analysis.', authors: ['Dr. Sarah Mitchell', 'Alex Chen'], category: PaperCategory.ComputerScience, keywords: ['deep learning', 'NLP', 'transformers'], status: PaperStatus.Published, submittedBy: '1', submittedByName: 'Dr. Sarah Mitchell', doi: '10.1234/cs.2024.001', journal: 'Journal of AI Research', publicationDate: '2024-03-15', citations: 145, views: 2430, downloads: 640, createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-03-15T00:00:00Z' },
    { id: '2', title: 'Quantum Computing Algorithms for Optimization Problems', abstract: 'We present novel quantum algorithms designed to solve complex optimization problems, demonstrating significant speedup over classical approaches in combinatorial optimization.', authors: ['Prof. James Anderson', 'Dr. Maria Lopez'], category: PaperCategory.Physics, keywords: ['quantum computing', 'optimization', 'algorithms'], status: PaperStatus.Published, submittedBy: '2', submittedByName: 'Prof. James Anderson', doi: '10.1234/ph.2024.002', journal: 'Physical Review Letters', publicationDate: '2024-02-20', citations: 89, views: 1890, downloads: 410, createdAt: '2023-11-05T00:00:00Z', updatedAt: '2024-02-20T00:00:00Z' },
    { id: '3', title: 'CRISPR-Cas9 Gene Editing in Agricultural Applications', abstract: 'A comprehensive review of CRISPR-Cas9 technology applications in crop improvement, disease resistance, and sustainable agriculture practices.', authors: ['Dr. Emily Watson', 'Prof. Robert Kim'], category: PaperCategory.Biology, keywords: ['CRISPR', 'gene editing', 'agriculture'], status: PaperStatus.Accepted, submittedBy: '4', submittedByName: 'Dr. Emily Watson', citations: 48, views: 1167, downloads: 345, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-05-10T00:00:00Z' },
    { id: '4', title: 'Blockchain-Based Decentralized Identity Management', abstract: 'This paper proposes a novel blockchain-based framework for decentralized identity management that ensures privacy, security, and user sovereignty over personal data.', authors: ['Alex Chen', 'Dr. Sarah Mitchell'], category: PaperCategory.ComputerScience, keywords: ['blockchain', 'identity management', 'decentralization'], status: PaperStatus.UnderReview, submittedBy: '3', submittedByName: 'Alex Chen', citations: 15, views: 820, downloads: 189, createdAt: '2024-04-15T00:00:00Z', updatedAt: '2024-05-20T00:00:00Z' },
    { id: '5', title: 'Statistical Methods for Climate Change Prediction Models', abstract: 'We develop advanced statistical methodologies for improving climate change prediction accuracy, incorporating machine learning with traditional statistical frameworks.', authors: ['Prof. James Anderson'], category: PaperCategory.Mathematics, keywords: ['statistics', 'climate change', 'prediction'], status: PaperStatus.Published, submittedBy: '2', submittedByName: 'Prof. James Anderson', doi: '10.1234/ma.2024.005', journal: 'Journal of Applied Statistics', publicationDate: '2024-01-30', citations: 167, views: 2850, downloads: 920, createdAt: '2023-09-15T00:00:00Z', updatedAt: '2024-01-30T00:00:00Z' },
    { id: '6', title: 'Neuroplasticity and Cognitive Enhancement Techniques', abstract: 'An interdisciplinary study examining neuroplasticity mechanisms and their implications for cognitive enhancement through targeted training protocols.', authors: ['Dr. Chloe Dubois', 'Prof. Mark Stevens'], category: PaperCategory.Medicine, keywords: ['neuroplasticity', 'cognition', 'neuroscience'], status: PaperStatus.Revision, submittedBy: '13', submittedByName: 'Dr. Chloe Dubois', citations: 32, views: 945, downloads: 220, createdAt: '2024-03-20T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: '7', title: 'Sustainable Energy Systems: A Comparative Analysis', abstract: 'Comparative analysis of renewable energy systems including solar, wind, and hydrogen fuel cells with focus on efficiency, cost, and environmental impact.', authors: ['Dr. Thomas Wright'], category: PaperCategory.Engineering, keywords: ['renewable energy', 'sustainability', 'solar'], status: PaperStatus.Published, submittedBy: '5', submittedByName: 'Dr. Thomas Wright', doi: '10.1234/en.2024.007', journal: 'Energy & Environment', publicationDate: '2024-04-10', citations: 78, views: 1580, downloads: 530, createdAt: '2023-12-01T00:00:00Z', updatedAt: '2024-04-10T00:00:00Z' },
    { id: '8', title: 'Machine Learning for Drug Discovery Pipeline', abstract: 'Novel ML approaches accelerating the drug discovery pipeline from target identification through lead optimization, reducing time-to-market for pharmaceutical compounds.', authors: ['Dr. Sarah Mitchell', 'Dr. Emily Watson'], category: PaperCategory.Chemistry, keywords: ['machine learning', 'drug discovery', 'pharmaceuticals'], status: PaperStatus.Submitted, submittedBy: '1', submittedByName: 'Dr. Sarah Mitchell', citations: 4, views: 356, downloads: 84, createdAt: '2024-05-15T00:00:00Z', updatedAt: '2024-05-15T00:00:00Z' },
    { id: '9', title: 'Social Media Impact on Political Polarization', abstract: 'Quantitative analysis of social media algorithms contribution to political polarization using large-scale data analysis and network theory.', authors: ['Prof. Karen Davis'], category: PaperCategory.SocialSciences, keywords: ['social media', 'polarization', 'network analysis'], status: PaperStatus.Published, submittedBy: '6', submittedByName: 'Prof. Karen Davis', doi: '10.1234/ss.2024.009', journal: 'Social Science Quarterly', publicationDate: '2024-05-01', citations: 95, views: 1920, downloads: 478, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-05-01T00:00:00Z' },
    { id: '10', title: 'Digital Humanities: Computational Text Analysis', abstract: 'Application of computational methods to literary analysis, exploring patterns in historical texts through topic modeling and sentiment analysis.', authors: ['Dr. Aris Thorn', 'Alex Chen'], category: PaperCategory.Humanities, keywords: ['digital humanities', 'text analysis', 'topic modeling'], status: PaperStatus.Draft, submittedBy: '11', submittedByName: 'Dr. Aris Thorn', citations: 0, views: 189, downloads: 32, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: '11', title: 'Adversarial Robustness in Computer Vision Models', abstract: 'Investigation of adversarial attacks on CNN-based image classifiers and development of robust defense mechanisms using adversarial training.', authors: ['Dr. Sarah Mitchell'], category: PaperCategory.ComputerScience, keywords: ['adversarial attacks', 'computer vision', 'robustness'], status: PaperStatus.Published, submittedBy: '1', submittedByName: 'Dr. Sarah Mitchell', doi: '10.1234/cs.2024.011', journal: 'IEEE CVPR', publicationDate: '2024-06-15', citations: 122, views: 2150, downloads: 680, createdAt: '2024-02-28T00:00:00Z', updatedAt: '2024-06-15T00:00:00Z' },
    { id: '12', title: 'Graph Neural Networks for Molecular Property Prediction', abstract: 'Leveraging graph neural networks to predict molecular properties for material science applications with state-of-the-art accuracy.', authors: ['Prof. James Anderson', 'Dr. Thomas Wright'], category: PaperCategory.Chemistry, keywords: ['GNN', 'molecular prediction', 'materials'], status: PaperStatus.Accepted, submittedBy: '2', submittedByName: 'Prof. James Anderson', citations: 38, views: 840, downloads: 295, createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
    { id: '13', title: 'Zero-Knowledge Cryptographic Schemes for Multi-Party Enclaves', abstract: 'Designing non-interactive zero-knowledge proofs (NIZK) for confidential multi-party computing in distrusted cloud enclaves with minimal execution overhead.', authors: ['Dr. Elena Rostova', 'Dr. Sarah Mitchell'], category: PaperCategory.ComputerScience, keywords: ['ZK-SNARKs', 'cryptography', 'confidential computing'], status: PaperStatus.Published, submittedBy: '10', submittedByName: 'Dr. Elena Rostova', doi: '10.1234/cs.2024.013', journal: 'ACM Transactions on Information Security', publicationDate: '2024-05-18', citations: 64, views: 1340, downloads: 412, createdAt: '2024-02-14T00:00:00Z', updatedAt: '2024-05-18T00:00:00Z' },
    { id: '14', title: 'Single-Cell Transcriptomics in Tumor Microenvironment Dynamics', abstract: 'Uncovering cellular heterogeneity and immunological escape pathways in pancreatic adenocarcinoma through high-throughput single-cell RNA sequencing.', authors: ['Dr. Emily Watson', 'Prof. David O\'Connor'], category: PaperCategory.Medicine, keywords: ['RNA sequencing', 'transcriptomics', 'immunology'], status: PaperStatus.Published, submittedBy: '4', submittedByName: 'Dr. Emily Watson', doi: '10.1234/med.2024.014', journal: 'Nature Medicine', publicationDate: '2024-04-22', citations: 110, views: 2980, downloads: 850, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-04-22T00:00:00Z' },
    { id: '15', title: 'Ethical Frameworks for Autonomous Algorithmic Decision Systems', abstract: 'Proposing verifiable fairness audit metrics and explainability pipelines for automated credit scoring, hiring algorithms, and parole prediction systems.', authors: ['Prof. Karen Davis', 'Dr. Aris Thorn'], category: PaperCategory.SocialSciences, keywords: ['AI ethics', 'algorithmic fairness', 'explainable AI'], status: PaperStatus.UnderReview, submittedBy: '6', submittedByName: 'Prof. Karen Davis', citations: 19, views: 650, downloads: 140, createdAt: '2024-05-02T00:00:00Z', updatedAt: '2024-06-05T00:00:00Z' },
    { id: '16', title: 'High-Dimensional Topology and Topological Data Analysis', abstract: 'Developing persistent homology algorithms to detect non-linear geometric structures in ultra-high-dimensional biological and financial datasets.', authors: ['Prof. James Anderson'], category: PaperCategory.Mathematics, keywords: ['TDA', 'persistent homology', 'algebraic topology'], status: PaperStatus.Published, submittedBy: '2', submittedByName: 'Prof. James Anderson', doi: '10.1234/math.2024.016', journal: 'Annals of Mathematics', publicationDate: '2024-03-08', citations: 92, views: 1730, downloads: 490, createdAt: '2023-10-25T00:00:00Z', updatedAt: '2024-03-08T00:00:00Z' },
    { id: '17', title: 'Gravitational Wave Interferometry with Next-Gen Laser Cavities', abstract: 'Sensitivity enhancement techniques for ground-based interferometric detectors using squeezed states of light and cryogenic crystalline optics.', authors: ['Dr. Marcus Vance'], category: PaperCategory.Physics, keywords: ['gravitational waves', 'LIGO', 'interferometry'], status: PaperStatus.Published, submittedBy: '7', submittedByName: 'Dr. Marcus Vance', doi: '10.1234/phys.2024.017', journal: 'Physical Review D', publicationDate: '2024-02-14', citations: 155, views: 2450, downloads: 710, createdAt: '2023-11-12T00:00:00Z', updatedAt: '2024-02-14T00:00:00Z' },
    { id: '18', title: 'Swarm Robotics for Disaster Response and Navigation', abstract: 'De-centralized flocking consensus and topological SLAM algorithms enabling autonomous drone swarms to locate survivors in GPS-denied collapsed structures.', authors: ['Prof. Nathan Gupta', 'Dr. Thomas Wright'], category: PaperCategory.Engineering, keywords: ['swarm robotics', 'autonomous drones', 'SLAM'], status: PaperStatus.Accepted, submittedBy: '12', submittedByName: 'Prof. Nathan Gupta', citations: 53, views: 1420, downloads: 430, createdAt: '2024-03-12T00:00:00Z', updatedAt: '2024-06-18T00:00:00Z' },
    { id: '19', title: 'Synaptic Degradation and Biomarker Profiling in Early Alzheimer\'s', abstract: 'Mapping plasma tau phosphorylation dynamics to early cognitive decline using ultrasensitive single-molecule array (Simoa) immunoassay platforms.', authors: ['Dr. Chloe Dubois', 'Dr. Emily Watson'], category: PaperCategory.Biology, keywords: ['Alzheimers', 'biomarkers', 'immunoassays'], status: PaperStatus.Published, submittedBy: '13', submittedByName: 'Dr. Chloe Dubois', doi: '10.1234/bio.2024.019', journal: 'Neuron', publicationDate: '2024-05-30', citations: 41, views: 1690, downloads: 512, createdAt: '2024-02-05T00:00:00Z', updatedAt: '2024-05-30T00:00:00Z' },
    { id: '20', title: 'Green Catalytic Photoredox Transformations of Bio-Feedstock', abstract: 'Direct C-H functionalization of lignin derivatives utilizing visible-light earth-abundant iron catalyst complexes in aqueous micro-emulsions.', authors: ['Dr. Sophia Alvarez'], category: PaperCategory.Chemistry, keywords: ['green chemistry', 'photoredox catalysis', 'biomass'], status: PaperStatus.Revision, submittedBy: '8', submittedByName: 'Dr. Sophia Alvarez', citations: 27, views: 760, downloads: 198, createdAt: '2024-04-10T00:00:00Z', updatedAt: '2024-06-14T00:00:00Z' },
    { id: '21', title: 'Real-Time Edge Neural Network Quantization for IoT Sensors', abstract: 'Ultra-low-power 4-bit integer neural network inference architectures achieving 98.4% accuracy on embedded microcontroller clusters.', authors: ['Dr. Elena Rostova', 'Dr. Sarah Mitchell'], category: PaperCategory.ComputerScience, keywords: ['edge computing', 'quantization', 'embedded AI'], status: PaperStatus.Submitted, submittedBy: '10', submittedByName: 'Dr. Elena Rostova', citations: 2, views: 240, downloads: 65, createdAt: '2024-06-10T00:00:00Z', updatedAt: '2024-06-10T00:00:00Z' },
    { id: '22', title: 'Dark Matter Candidates in Extended Supersymmetric Models', abstract: 'Evaluating relic abundance constraints and direct detection cross-sections for neutralino dark matter candidates in GUT-scale supersymmetric extensions.', authors: ['Dr. Marcus Vance'], category: PaperCategory.Physics, keywords: ['dark matter', 'supersymmetry', 'particle physics'], status: PaperStatus.Published, submittedBy: '7', submittedByName: 'Dr. Marcus Vance', doi: '10.1234/phys.2024.022', journal: 'Journal of High Energy Physics', publicationDate: '2024-01-18', citations: 118, views: 2110, downloads: 630, createdAt: '2023-09-30T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
    { id: '23', title: 'Nanoparticle-Targeted Immunotherapy in Triple-Negative Breast Cancer', abstract: 'Liposomal encapsulation of dual immune checkpoint inhibitors demonstrating complete tumor regression in xenograft preclinical mouse models.', authors: ['Prof. David O\'Connor'], category: PaperCategory.Medicine, keywords: ['immunotherapy', 'nanoparticles', 'oncology'], status: PaperStatus.Published, submittedBy: '9', submittedByName: 'Prof. David O\'Connor', doi: '10.1234/med.2024.023', journal: 'The Lancet Oncology', publicationDate: '2024-04-05', citations: 205, views: 4210, downloads: 1140, createdAt: '2023-12-15T00:00:00Z', updatedAt: '2024-04-05T00:00:00Z' },
    { id: '24', title: 'Solid-State Electrolyte Interphases for Lithium-Metal Batteries', abstract: 'Atomic layer deposition of ultra-thin ceramic interlayers suppressing lithium dendrite growth across high-rate charge cycling.', authors: ['Dr. Thomas Wright', 'Prof. Nathan Gupta'], category: PaperCategory.Engineering, keywords: ['batteries', 'energy storage', 'materials'], status: PaperStatus.Published, submittedBy: '5', submittedByName: 'Dr. Thomas Wright', doi: '10.1234/en.2024.024', journal: 'Nature Energy', publicationDate: '2024-05-12', citations: 134, views: 2780, downloads: 890, createdAt: '2024-01-08T00:00:00Z', updatedAt: '2024-05-12T00:00:00Z' }
  ];

  constructor(private http: HttpClient) {}

  /** GET /papers — tries real API, falls back to mock data */
  getPapers(filter: PaperFilter, page: number = 1, pageSize: number = environment.defaultPageSize): Observable<PaginatedResponse<Paper>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('_t', Date.now().toString());

    if (filter.search)    params = params.set('search', filter.search);
    if (filter.category)  params = params.set('category', filter.category);
    if (filter.status)    params = params.set('status', filter.status);
    if (filter.author)    params = params.set('author', filter.author);
    if (filter.sortBy)    params = params.set('sortBy', filter.sortBy);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);

    return this.http.get<PaginatedResponse<Paper>>(this.base, { params }).pipe(
      timeout(90000),
      catchError(() => of(this.filterMock(filter, page, pageSize)))
    );
  }

  /** GET /papers/:id */
  getPaperById(id: string): Observable<Paper | undefined> {
    return this.http.get<Paper>(`${this.base}/${id}`).pipe(
      timeout(90000),
      catchError(() => of(this.mockPapers.find(p => p.id === id)))
    );
  }

  /** POST /papers */
  submitPaper(submission: PaperSubmission): Observable<Paper> {
    return this.http.post<Paper>(this.base, submission).pipe(
      catchError(() => {
        const newPaper: Paper = {
          id: String(this.mockPapers.length + 1), ...submission,
          status: PaperStatus.Submitted, submittedBy: '1', submittedByName: 'Current User',
          citations: 0, views: 0, downloads: 0,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        };
        this.mockPapers.unshift(newPaper);
        return of(newPaper);
      })
    );
  }

  /** PATCH /papers/:id/status */
  updatePaperStatus(id: string, status: PaperStatus): Observable<Paper | undefined> {
    return this.http.patch<Paper>(`${this.base}/${id}/status`, { status }).pipe(
      timeout(90000),
      catchError(() => {
        const paper = this.mockPapers.find(p => p.id === id);
        if (paper) { paper.status = status; paper.updatedAt = new Date().toISOString(); }
        return of(paper);
      })
    );
  }

  /** DELETE /papers/:id */
  deletePaper(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      timeout(90000),
      map(() => true),
      catchError(() => {
        const idx = this.mockPapers.findIndex(p => p.id === id);
        if (idx > -1) this.mockPapers.splice(idx, 1);
        return of(true);
      })
    );
  }

  /** GET /papers?submittedBy= */
  getMyPapers(userId: string): Observable<Paper[]> {
    const params = new HttpParams().set('submittedBy', userId);
    return this.http.get<Paper[]>(this.base, { params }).pipe(
      timeout(90000),
      catchError(() => of(this.mockPapers.filter(p => p.submittedBy === userId)))
    );
  }

  /** Applies filters & pagination to mock data */
  private filterMock(filter: PaperFilter, page: number, pageSize: number): PaginatedResponse<Paper> {
    let list = [...this.mockPapers];
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.abstract.toLowerCase().includes(s) || p.authors.some(a => a.toLowerCase().includes(s)));
    }
    if (filter.category) list = list.filter(p => p.category === filter.category);
    if (filter.status)   list = list.filter(p => p.status === filter.status);
    if (filter.sortBy) {
      list.sort((a, b) => {
        let cmp = 0;
        if (filter.sortBy === 'title')     cmp = a.title.localeCompare(b.title);
        if (filter.sortBy === 'citations') cmp = a.citations - b.citations;
        if (filter.sortBy === 'views')     cmp = a.views - b.views;
        if (filter.sortBy === 'date')      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return filter.sortOrder === 'desc' ? -cmp : cmp;
      });
    }
    const total = list.length;
    const start = (page - 1) * pageSize;
    const data  = list.slice(start, start + pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize), hasNext: start + pageSize < total, hasPrevious: page > 1 };
  }
}
