/** Faculty profile with research and publication details */
export interface FacultyProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  specialization: string[];
  bio: string;
  avatarUrl?: string;
  phone?: string;
  officeLocation?: string;
  researchInterests: string[];
  publications: string[];  // Paper IDs
  totalCitations: number;
  hIndex: number;
  googleScholarUrl?: string;
  orcidId?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Faculty profile creation/update payload */
export interface FacultyProfilePayload {
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  specialization: string[];
  bio: string;
  phone?: string;
  officeLocation?: string;
  researchInterests: string[];
  googleScholarUrl?: string;
  orcidId?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}
