export type UserRole = 'admin' | 'professor';

export interface FacultyMember {
  id: string;
  name: string;
  title: string; // e.g. "دكتور", "أستاذ مشارك", "محاضر"
  email: string;
  phone: string;
  college: string; // "الكلية التطبيقية"
  department: string; // "علوم الحاسب وتقنية المعلومات", "العلوم الإدارية والمالية", "الهندسة والتقنيات الصناعية"
  campus: string; // "المجمعة", "الزلفي", "رماح", "حوطة سدير"
  employeeId: string;
  isWhitelisted: boolean;
  avatarUrl?: string;
  completedWorkshopsCount?: number;
  totalStudentsReached?: number;
}

export interface FacilitationStep {
  stepNumber: number;
  title: string;
  durationMin: number;
  description: string;
  trainerTip: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pptx' | 'pdf' | 'docx' | 'zip';
  size: string;
  downloadUrl: string;
  description: string;
}

export interface WorkshopCourse {
  id: string;
  code: string;
  title: string;
  category: 'career_readiness' | 'interview_skills' | 'cv_portfolio' | 'soft_skills' | 'digital_tools';
  categoryLabel: string;
  durationMinutes: number;
  recommendedStudentsMin: number;
  recommendedStudentsMax: number;
  shortDescription: string;
  fullOverview: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  targetAudience: string;
  facilitationGuide: FacilitationStep[];
  materials: CourseMaterial[];
  iconName: string;
  badgeColor: string;
  isActive: boolean;
}

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface WorkshopSession {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  professorId: string;
  professorName: string;
  professorTitle: string;
  professorEmail: string;
  professorPhone: string;
  department: string;
  campus: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 ص - 10:30 ص"
  hallName: string; // e.g. "قاعة التدريب الذكي (204)", "مدرج الكلية التطبيقية الرئيسي", "عبر البلاك بورد"
  deliveryMode: 'in_person' | 'remote';
  studentCountTarget: number;
  studentCountActual?: number;
  status: SessionStatus;
  sessionNotes?: string;
  studentFeedbackRating?: number; // 1-5
  certificateIssued: boolean;
  certificateId?: string;
  certificateIssueDate?: string;
  reminderSentWhatsApp: boolean;
  reminderSentEmail: boolean;
  completionConfirmedAt?: string;
  createdAt: string;
}

export interface WhitelistEntry {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  department: string;
  campus: string;
  employeeId: string;
  status: 'active' | 'inactive';
  addedAt: string;
}

export interface DeanOfficialConfig {
  deanName: string;
  deanTitle: string;
  deanCollege: string;
  university: string;
  unitName: string;
  unitHeadName: string;
  unitHeadTitle: string;
  officialSealText: string;
  academicYear: string;
  semester: string;
}

export interface AuthState {
  user: FacultyMember | null;
  role: UserRole;
  isAuthenticated: boolean;
}
