/** Research paper submission status lifecycle */
export enum PaperStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  UnderReview = 'under_review',
  Revision = 'revision',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Published = 'published'
}

/** Paper category/domain classification */
export enum PaperCategory {
  ComputerScience = 'computer_science',
  Mathematics = 'mathematics',
  Physics = 'physics',
  Biology = 'biology',
  Chemistry = 'chemistry',
  Engineering = 'engineering',
  Medicine = 'medicine',
  SocialSciences = 'social_sciences',
  Humanities = 'humanities',
  Other = 'other'
}

/** Research paper entity */
export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: PaperCategory;
  keywords: string[];
  status: PaperStatus;
  submittedBy: string;
  submittedByName: string;
  fileUrl?: string;
  doi?: string;
  journal?: string;
  publicationDate?: string;
  citations: number;
  views: number;
  downloads: number;
  reviewComments?: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

/** Reviewer comment on a paper */
export interface ReviewComment {
  id: string;
  paperId: string;
  reviewerId: string;
  reviewerName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

/** Paper submission form data */
export interface PaperSubmission {
  title: string;
  abstract: string;
  authors: string[];
  category: PaperCategory;
  keywords: string[];
  file?: File;
  doi?: string;
  journal?: string;
}

/** Paper search/filter parameters */
export interface PaperFilter {
  search?: string;
  category?: PaperCategory;
  status?: PaperStatus;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'title' | 'date' | 'citations' | 'views';
  sortOrder?: 'asc' | 'desc';
}
