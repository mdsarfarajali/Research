/** Dashboard overview statistics */
export interface DashboardStats {
  totalPapers: number;
  totalFaculty: number;
  totalStudents: number;
  totalCitations: number;
  papersThisMonth: number;
  acceptanceRate: number;
  avgReviewTime: number;
  topDepartments: DepartmentStat[];
  papersByStatus: StatusStat[];
  papersByCategory: CategoryStat[];
  monthlySubmissions: MonthlyStat[];
  recentPapers: RecentPaper[];
}

/** Department statistics */
export interface DepartmentStat {
  department: string;
  papers: number;
  citations: number;
}

/** Paper status statistics */
export interface StatusStat {
  status: string;
  count: number;
  color: string;
}

/** Category statistics */
export interface CategoryStat {
  category: string;
  count: number;
}

/** Monthly submission statistics */
export interface MonthlyStat {
  month: string;
  submissions: number;
  accepted: number;
  rejected: number;
}

/** Recent paper summary */
export interface RecentPaper {
  id: string;
  title: string;
  author: string;
  status: string;
  date: string;
  category: string;
}
