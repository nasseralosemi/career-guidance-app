import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar as CalendarIcon, 
  Award, 
  CheckCircle, 
  CheckCircle2,
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText,
  ShieldCheck, 
  Send, 
  Trash2, 
  BookOpen, 
  Settings, 
  LogOut, 
  AlertCircle, 
  Sparkles, 
  Printer, 
  ExternalLink,
  MapPin,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Edit,
  MessageSquare,
  KeyRound,
  Eye,
  Layers,
  X,
  Target,
  RotateCcw,
  Sliders,
  HelpCircle,
  QrCode,
  Share2,
  Palette,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { WorkshopSession, WorkshopCourse, WhitelistEntry, DeanOfficialConfig, FacultyMember } from '../../types';
import { LogoBranding } from '../common/LogoBranding';
import { CAMPUS_OPTIONS, DEPARTMENT_OPTIONS } from '../../data/mockData';

interface AdminDashboardProps {
  sessions: WorkshopSession[];
  courses: WorkshopCourse[];
  whitelist: WhitelistEntry[];
  deanConfig: DeanOfficialConfig;
  onUpdateDeanConfig: (newConfig: DeanOfficialConfig) => void;
  onAddWhitelistEntry: (entry: Omit<WhitelistEntry, 'id' | 'addedAt'>) => void;
  onUpdateWhitelistEntry?: (entry: WhitelistEntry) => void;
  onToggleWhitelistStatus: (id: string) => void;
  onDeleteWhitelistEntry: (id: string) => void;
  onAddNewCourse: (course: WorkshopCourse) => void;
  onUpdateCourse?: (course: WorkshopCourse) => void;
  onDeleteCourse?: (course: string) => void;
  onUpdateSessionStatus: (sessionId: string, status: WorkshopSession['status']) => void;
  onApproveSession?: (sessionId: string, supervisorNotes?: string, adjustedStudentCount?: number) => void;
  onRejectSession?: (sessionId: string, reason: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onEditSession?: (session: WorkshopSession) => void;
  onOpenCertificateModal: (session: WorkshopSession) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sessions,
  courses,
  whitelist,
  deanConfig,
  onUpdateDeanConfig,
  onAddWhitelistEntry,
  onUpdateWhitelistEntry,
  onToggleWhitelistStatus,
  onDeleteWhitelistEntry,
  onAddNewCourse,
  onUpdateCourse,
  onDeleteCourse,
  onUpdateSessionStatus,
  onApproveSession,
  onRejectSession,
  onDeleteSession,
  onEditSession,
  onOpenCertificateModal,
  onLogout,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'approvals' | 'sessions' | 'whitelist' | 'courses' | 'settings' | 'annual_report'>('analytics');
  
  // Mobile Tab Scroll Indicator State & Ref
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState<boolean>(false);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);

  const checkTabsScroll = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setCanScrollTabsLeft(false);
      return;
    }
    const currentScrollAbs = Math.abs(el.scrollLeft);
    const remainingScroll = maxScroll - currentScrollAbs;
    setCanScrollTabsLeft(remainingScroll > 10);
  };

  const scrollTabsLeft = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollTabsRight = () => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkTabsScroll();
    const timer = setTimeout(checkTabsScroll, 300);
    const handleResize = () => checkTabsScroll();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Whitelist modal states
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('');
  const [facultyTitle, setFacultyTitle] = useState('أستاذ مساعد');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyPasscode, setFacultyPasscode] = useState('MU@2026');
  const [facultyDept, setFacultyDept] = useState(DEPARTMENT_OPTIONS[0]);
  const [facultyCampus, setFacultyCampus] = useState(CAMPUS_OPTIONS[0]);
  const [facultyEmpId, setFacultyEmpId] = useState('');

  // Whitelist Edit Modal States
  const [facultyToEdit, setFacultyToEdit] = useState<WhitelistEntry | null>(null);
  const [isEditFacultyModalOpen, setIsEditFacultyModalOpen] = useState(false);
  const [editFacultyName, setEditFacultyName] = useState('');
  const [editFacultyTitle, setEditFacultyTitle] = useState('أستاذ مساعد');
  const [editFacultyEmail, setEditFacultyEmail] = useState('');
  const [editFacultyPhone, setEditFacultyPhone] = useState('');
  const [editFacultyPasscode, setEditFacultyPasscode] = useState('');
  const [editFacultyDept, setEditFacultyDept] = useState(DEPARTMENT_OPTIONS[0]);
  const [editFacultyCampus, setEditFacultyCampus] = useState(CAMPUS_OPTIONS[0]);
  const [editFacultyEmpId, setEditFacultyEmpId] = useState('');
  const [editFacultyStatus, setEditFacultyStatus] = useState<'active' | 'inactive'>('active');

  const handleOpenEditFacultyModal = (entry: WhitelistEntry) => {
    setFacultyToEdit(entry);
    setEditFacultyName(entry.name);
    setEditFacultyTitle(entry.title);
    setEditFacultyEmail(entry.email);
    setEditFacultyPhone(entry.phone);
    setEditFacultyPasscode(entry.passcode || 'MU@2026');
    setEditFacultyDept(entry.department);
    setEditFacultyCampus(entry.campus);
    setEditFacultyEmpId(entry.employeeId);
    setEditFacultyStatus(entry.status);
    setIsEditFacultyModalOpen(true);
  };

  const handleSaveEditedFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyToEdit || !onUpdateWhitelistEntry) return;

    const updated: WhitelistEntry = {
      ...facultyToEdit,
      name: editFacultyName,
      title: editFacultyTitle,
      email: editFacultyEmail.toLowerCase().trim(),
      phone: editFacultyPhone.trim() || '0500000000',
      passcode: editFacultyPasscode.trim() || 'MU@2026',
      department: editFacultyDept,
      campus: editFacultyCampus,
      employeeId: editFacultyEmpId.trim() || facultyToEdit.employeeId,
      status: editFacultyStatus,
    };

    onUpdateWhitelistEntry(updated);
    setIsEditFacultyModalOpen(false);
    setFacultyToEdit(null);
  };

  // Supervisor Approval & Rejection Modal States
  const [sessionToApprove, setSessionToApprove] = useState<WorkshopSession | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveStudentCount, setApproveStudentCount] = useState<number>(30);
  const [approveSupervisorNotes, setApproveSupervisorNotes] = useState('');

  const [sessionToReject, setSessionToReject] = useState<WorkshopSession | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const handleOpenApproveModal = (session: WorkshopSession) => {
    setSessionToApprove(session);
    setApproveStudentCount(session.studentCountActual || session.studentCountTarget || 30);
    setApproveSupervisorNotes('');
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToApprove) return;
    if (onApproveSession) {
      onApproveSession(sessionToApprove.id, approveSupervisorNotes, Number(approveStudentCount));
    } else {
      onUpdateSessionStatus(sessionToApprove.id, 'completed');
    }
    setIsApproveModalOpen(false);
    setSessionToApprove(null);
  };

  const handleOpenRejectModal = (session: WorkshopSession) => {
    setSessionToReject(session);
    setRejectionReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToReject) return;
    if (onRejectSession) {
      onRejectSession(sessionToReject.id, rejectionReasonInput || 'يرجى مراجعة وتعديل بيانات الحضور وتوثيق التنفيذ وإعادة الإرسال.');
    } else {
      onUpdateSessionStatus(sessionToReject.id, 'rejected');
    }
    setIsRejectModalOpen(false);
    setSessionToReject(null);
  };

  // Course modal states
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState(`CGU-${100 + courses.length + 1}`);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<WorkshopCourse['category']>('career_readiness');
  const [courseDuration, setCourseDuration] = useState(60);
  const [courseOverview, setCourseOverview] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState('');

  // Course Edit Modal States
  const [courseToEdit, setCourseToEdit] = useState<WorkshopCourse | null>(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState<WorkshopCourse['category']>('career_readiness');
  const [editCourseDuration, setEditCourseDuration] = useState(60);
  const [editCourseOverview, setEditCourseOverview] = useState('');
  const [editCourseOutcomes, setEditCourseOutcomes] = useState('');
  const [editCourseTargetAudience, setEditCourseTargetAudience] = useState('');
  const [editCoursePptxName, setEditCoursePptxName] = useState('');
  const [editCoursePptxSize, setEditCoursePptxSize] = useState('');
  const [editCourseDocxName, setEditCourseDocxName] = useState('');
  const [editCourseDocxSize, setEditCourseDocxSize] = useState('');
  const [editCourseIsActive, setEditCourseIsActive] = useState(true);

  // Course Delete Modal States
  const [courseToDelete, setCourseToDelete] = useState<WorkshopCourse | null>(null);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);

  // Course Preview Modal States (Faculty Preview Mode)
  const [courseToPreview, setCourseToPreview] = useState<WorkshopCourse | null>(null);
  const [isCoursePreviewModalOpen, setIsCoursePreviewModalOpen] = useState(false);

  const handleOpenCoursePreview = (course: WorkshopCourse) => {
    setCourseToPreview(course);
    setIsCoursePreviewModalOpen(true);
  };

  const handleToggleCourseActive = (course: WorkshopCourse) => {
    if (onUpdateCourse) {
      onUpdateCourse({
        ...course,
        isActive: course.isActive === false ? true : false,
      });
    }
  };

  const handleOpenEditCourseModal = (course: WorkshopCourse) => {
    setCourseToEdit(course);
    setEditCourseTitle(course.title);
    setEditCourseCategory(course.category);
    setEditCourseDuration(course.durationMinutes || 60);
    setEditCourseOverview(course.fullOverview || course.shortDescription || '');
    setEditCourseOutcomes(course.learningOutcomes ? course.learningOutcomes.join('\n') : '');
    setEditCourseTargetAudience(course.targetAudience || '');
    setEditCourseIsActive(course.isActive !== false);
    
    const pptx = course.materials.find(m => m.type === 'pptx');
    const docx = course.materials.find(m => m.type === 'docx' || m.type === 'pdf');
    setEditCoursePptxName(pptx ? pptx.title : 'عرض البوربوينت التقديمي المعتمد (PPTX)');
    setEditCoursePptxSize(pptx ? pptx.size : '14.5 MB');
    setEditCourseDocxName(docx ? docx.title : 'دليل وتطبيقات الأنشطة العملية (Word/PDF)');
    setEditCourseDocxSize(docx ? docx.size : '2.1 MB');

    setIsEditCourseModalOpen(true);
  };

  const handleSaveEditedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToEdit || !onUpdateCourse) return;

    const outcomesArray = editCourseOutcomes
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const categoryLabels: Record<WorkshopCourse['category'], string> = {
      career_readiness: 'التدريب والجاهزية لسوق العمل',
      cv_portfolio: 'السيرة الذاتية والهوية المهنية',
      interview_skills: 'المقابلات الوظيفية وتقنية STAR',
      soft_skills: 'المهارات الناعمة والذكاء العاطفي',
      digital_tools: 'الأدوات الرقمية ولينكد إن',
    };

    const updatedMaterials = [
      {
        id: courseToEdit.materials[0]?.id || `mat-${Date.now()}-1`,
        title: editCoursePptxName || 'عرض البوربوينت التقديمي المعتمد (PPTX)',
        type: 'pptx' as const,
        size: editCoursePptxSize || '14.5 MB',
        downloadUrl: '#',
        description: 'شرائح تفاعلية مجهزة بالكامل للأستاذ الجامعي مع ملاحظات المدرب.',
      },
      {
        id: courseToEdit.materials[1]?.id || `mat-${Date.now()}-2`,
        title: editCourseDocxName || 'دليل وتطبيقات الأنشطة العملية (Word/PDF)',
        type: 'docx' as const,
        size: editCourseDocxSize || '2.1 MB',
        downloadUrl: '#',
        description: 'قوالب ونماذج تطبيقية جاهزة للتوزيع على الطلاب أثناء الورشة.',
      },
    ];

    const updated: WorkshopCourse = {
      ...courseToEdit,
      title: editCourseTitle,
      category: editCourseCategory,
      categoryLabel: categoryLabels[editCourseCategory] || courseToEdit.categoryLabel,
      durationMinutes: Number(editCourseDuration) || 60,
      shortDescription: editCourseOverview.slice(0, 140) + (editCourseOverview.length > 140 ? '...' : ''),
      fullOverview: editCourseOverview,
      learningOutcomes: outcomesArray.length > 0 ? outcomesArray : courseToEdit.learningOutcomes,
      targetAudience: editCourseTargetAudience || courseToEdit.targetAudience,
      materials: updatedMaterials,
      isActive: editCourseIsActive,
    };

    onUpdateCourse(updated);
    setIsEditCourseModalOpen(false);
    setCourseToEdit(null);
  };

  const handleOpenDeleteCourseModal = (course: WorkshopCourse) => {
    setCourseToDelete(course);
    setIsDeleteCourseModalOpen(true);
  };

  const handleConfirmDeleteCourse = () => {
    if (courseToDelete && onDeleteCourse) {
      onDeleteCourse(courseToDelete.id);
    }
    setIsDeleteCourseModalOpen(false);
    setCourseToDelete(null);
  };

  // Session Delete & Edit Modal States
  const [sessionToDelete, setSessionToDelete] = useState<WorkshopSession | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [sessionToEdit, setSessionToEdit] = useState<WorkshopSession | null>(null);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editHallName, setEditHallName] = useState('');
  const [editStudentCountTarget, setEditStudentCountTarget] = useState(30);
  const [editStudentCountActual, setEditStudentCountActual] = useState(30);
  const [editStatus, setEditStatus] = useState<WorkshopSession['status']>('scheduled');
  const [editDeliveryMode, setEditDeliveryMode] = useState<'in_person' | 'remote'>('in_person');
  const [editSessionNotes, setEditSessionNotes] = useState('');

  const handleOpenDeleteModal = (session: WorkshopSession) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteSession = () => {
    if (sessionToDelete && onDeleteSession) {
      onDeleteSession(sessionToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleOpenEditModal = (session: WorkshopSession) => {
    setSessionToEdit(session);
    setEditDate(session.date);
    setEditTimeSlot(session.timeSlot);
    setEditHallName(session.hallName);
    setEditStudentCountTarget(session.studentCountTarget);
    setEditStudentCountActual(session.studentCountActual || session.studentCountTarget);
    setEditStatus(session.status);
    setEditDeliveryMode(session.deliveryMode);
    setEditSessionNotes(session.sessionNotes || '');
    setIsEditSessionModalOpen(true);
  };

  const handleSaveEditedSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToEdit || !onEditSession) return;

    const isNowCompleted = editStatus === 'completed';
    const updated: WorkshopSession = {
      ...sessionToEdit,
      date: editDate,
      timeSlot: editTimeSlot,
      hallName: editHallName,
      status: editStatus,
      studentCountTarget: Number(editStudentCountTarget) || 30,
      studentCountActual: isNowCompleted ? Number(editStudentCountActual) || Number(editStudentCountTarget) : undefined,
      certificateIssued: isNowCompleted ? true : sessionToEdit.certificateIssued,
      deliveryMode: editDeliveryMode,
      sessionNotes: editSessionNotes,
    };

    onEditSession(updated);
    setIsEditSessionModalOpen(false);
    setSessionToEdit(null);
  };

  // Filter states
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('all');
  const [sessionDeptFilter, setSessionDeptFilter] = useState('all');
  const [whitelistSearch, setWhitelistSearch] = useState('');

  // Analytics Target Customization State (persisted in localStorage)
  const [customTargetStudents, setCustomTargetStudents] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('admin_target_students');
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  const [customPlannedWorkshops, setCustomPlannedWorkshops] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('admin_planned_workshops');
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditTargetsModalOpen, setIsEditTargetsModalOpen] = useState(false);
  const [tempTargetStudents, setTempTargetStudents] = useState<number>(320);
  const [tempPlannedWorkshops, setTempPlannedWorkshops] = useState<number>(15);

  // Analytics Computations
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const pendingApprovalSessions = sessions.filter((s) => s.status === 'pending_approval');
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled');
  const rejectedSessions = sessions.filter((s) => s.status === 'rejected');
  const activeFacultyCount = new Set(sessions.map((s) => s.professorEmail)).size;
  const totalStudentsReached = completedSessions.reduce((sum, s) => sum + (s.studentCountActual || s.studentCountTarget), 0);
  
  // Computed & Effective Targets
  const systemCalculatedTargetStudents = sessions.reduce((sum, s) => sum + s.studentCountTarget, 0) || 320;
  const effectiveTargetStudents = customTargetStudents !== null ? customTargetStudents : systemCalculatedTargetStudents;

  const systemCalculatedPlannedWorkshops = totalSessions || 15;
  const effectivePlannedWorkshops = customPlannedWorkshops !== null ? customPlannedWorkshops : systemCalculatedPlannedWorkshops;

  const totalCertificatesIssued = completedSessions.filter((s) => s.certificateIssued).length;

  const handleOpenEditTargets = () => {
    setTempTargetStudents(effectiveTargetStudents);
    setTempPlannedWorkshops(effectivePlannedWorkshops);
    setIsEditTargetsModalOpen(true);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const studentsVal = Math.max(1, Number(tempTargetStudents) || 320);
    const workshopsVal = Math.max(1, Number(tempPlannedWorkshops) || 15);
    
    setCustomTargetStudents(studentsVal);
    setCustomPlannedWorkshops(workshopsVal);
    try {
      localStorage.setItem('admin_target_students', studentsVal.toString());
      localStorage.setItem('admin_planned_workshops', workshopsVal.toString());
    } catch {}
    setIsEditTargetsModalOpen(false);
  };

  const handleResetTargets = () => {
    setCustomTargetStudents(null);
    setCustomPlannedWorkshops(null);
    try {
      localStorage.removeItem('admin_target_students');
      localStorage.removeItem('admin_planned_workshops');
    } catch {}
    setIsEditTargetsModalOpen(false);
  };

  // Department distribution
  const deptStats = DEPARTMENT_OPTIONS.map((dept) => {
    const deptSessions = sessions.filter((s) => s.department.includes(dept));
    const completed = deptSessions.filter((s) => s.status === 'completed').length;
    const students = deptSessions.reduce((sum, s) => sum + (s.studentCountActual || s.studentCountTarget), 0);
    return { dept, total: deptSessions.length, completed, students };
  });

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['رقم الجلسة', 'اسم الورشة', 'عضو هيئة التدريس', 'البريد الجامعي', 'القسم', 'المقر', 'التاريخ', 'الوقت', 'الحالة', 'الطلاب المستهدفين', 'الطلاب الفعليين', 'رقم الشهادة'];
    const rows = sessions.map((s) => [
      s.id,
      `"${s.courseTitle}"`,
      `"${s.professorTitle} ${s.professorName}"`,
      s.professorEmail,
      `"${s.department}"`,
      `"${s.campus}"`,
      s.date,
      `"${s.timeSlot}"`,
      s.status === 'completed' ? 'منفذة' : 'مجدولة',
      s.studentCountTarget,
      s.studentCountActual || '-',
      s.certificateId || '-',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_الشراكة_الأكاديمية_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Accreditation & Certificate Live Preview States
  const [certTheme, setCertTheme] = useState<'gold' | 'emerald' | 'navy'>('gold');
  const [certSealMode, setCertSealMode] = useState<'circular_digital' | 'honor_badge' | 'custom_image'>('circular_digital');
  const [customSealImage, setCustomSealImage] = useState<string | null>(null);
  const [certSampleFacultyName, setCertSampleFacultyName] = useState('د. عبد الرحمن بن فهد السويكت');
  const [certSampleFacultyTitle, setCertSampleFacultyTitle] = useState('أستاذ مشارك');
  const [certSampleDept, setCertSampleDept] = useState('علوم الحاسب وتقنية المعلومات');
  const [certSampleCampus, setCertSampleCampus] = useState('المجمعة (المقر الرئيسي)');
  const [certSampleWorkshop, setCertSampleWorkshop] = useState('بناء السيرة الذاتية الاحترافية المتوافقة مع أنظمة الفرز الذكي (ATS)');
  const [certSampleStudents, setCertSampleStudents] = useState(38);
  const [certSaveToast, setCertSaveToast] = useState(false);
  const [copiedCertTextToast, setCopiedCertTextToast] = useState(false);

  const certPreviewRef = useRef<HTMLDivElement>(null);

  const handleSealImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomSealImage(reader.result);
          setCertSealMode('custom_image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintCertPreview = () => {
    window.print();
  };

  const handleSaveDeanConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateDeanConfig) {
      onUpdateDeanConfig(deanConfig);
    }
    setCertSaveToast(true);
    setTimeout(() => {
      setCertSaveToast(false);
    }, 4000);
  };

  // Submit new faculty member
  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyEmail || !facultyName) return;

    onAddWhitelistEntry({
      name: facultyName,
      title: facultyTitle,
      email: facultyEmail.toLowerCase().trim(),
      phone: facultyPhone.trim() || '0500000000',
      department: facultyDept,
      campus: facultyCampus,
      employeeId: facultyEmpId || `MU-${Math.floor(10000 + Math.random() * 90000)}`,
      passcode: facultyPasscode.trim() || 'MU@2026',
      status: 'active',
    });

    setIsAddFacultyModalOpen(false);
    setFacultyName('');
    setFacultyEmail('');
    setFacultyPhone('');
    setFacultyPasscode('MU@2026');
    setFacultyEmpId('');
  };

  // Submit new course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;

    const newCourse: WorkshopCourse = {
      id: `course-${Date.now()}`,
      code: courseCode,
      title: courseTitle,
      category: courseCategory,
      categoryLabel: courseCategory === 'cv_portfolio' ? 'السيرة الذاتية' : courseCategory === 'interview_skills' ? 'المقابلات' : 'التدريب والجاهزية',
      durationMinutes: Number(courseDuration) || 60,
      recommendedStudentsMin: 20,
      recommendedStudentsMax: 45,
      shortDescription: courseOverview.slice(0, 120) || 'ورشة تدريبية تخصصية لتنمية مهارات خريجي الكلية التطبيقية.',
      fullOverview: courseOverview || 'حقيبة تدريبية معتمدة تم إعدادها بواسطة وحدة الإرشاد والتطوير المهني.',
      learningOutcomes: courseOutcomes ? courseOutcomes.split('\n').filter(Boolean) : ['إتقان المهارات المهنية المستهدفة.'],
      targetAudience: 'طلبة البرامج التطبيقية بالكلية.',
      facilitationGuide: [
        { stepNumber: 1, title: 'التهيئة والمقدمة', durationMin: 10, description: 'استعراض الأهداف وأهمية الموضوع لسوق العمل.', trainerTip: 'طرح سؤال تفاعلي.' },
        { stepNumber: 2, title: 'المحتوى الرئيسي والتطبيق', durationMin: 35, description: 'شرح المفاهيم والأدوات العملية.', trainerTip: 'توزيع أوراق العمل.' },
        { stepNumber: 3, title: 'الختام وتوزيع الاستبيان', durationMin: 15, description: 'مراجعة المخرجات وتأكيد حضور الطلاب.', trainerTip: 'تذكير الطلاب برابط الوحدة.' }
      ],
      materials: [
        { id: `mat-new-1`, title: `عرض ${courseTitle} (PPTX)`, type: 'pptx', size: '10.5 MB', downloadUrl: '#', description: 'العرض التقديمي المعتمد للأستاذ' },
        { id: `mat-new-2`, title: `دليل الميسر وأوراق العمل (PDF)`, type: 'pdf', size: '2.4 MB', downloadUrl: '#', description: 'دليل المدرب التوجيهي' }
      ],
      iconName: 'BookOpen',
      badgeColor: 'emerald',
      isActive: true,
    };

    onAddNewCourse(newCourse);
    setIsAddCourseModalOpen(false);
    setCourseTitle('');
    setCourseOverview('');
    setCourseOutcomes('');
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchSearch = s.courseTitle.includes(sessionSearch) || s.professorName.includes(sessionSearch) || s.department.includes(sessionSearch);
    const matchStatus = sessionStatusFilter === 'all' || s.status === sessionStatusFilter;
    const matchDept = sessionDeptFilter === 'all' || s.department.includes(sessionDeptFilter);
    return matchSearch && matchStatus && matchDept;
  });

  // Filter whitelist
  const filteredWhitelist = whitelist.filter((w) => {
    return w.name.includes(whitelistSearch) || w.email.toLowerCase().includes(whitelistSearch.toLowerCase()) || w.department.includes(whitelistSearch) || w.employeeId.includes(whitelistSearch);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-kufi" id="admin-portal">
      
      {/* Top Admin Header with Gold Academic Theme */}
      <header className="bg-[#faf6ee]/95 backdrop-blur-md border-b border-[#a4874b]/30 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <LogoBranding size="md" />
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30 text-xs font-bold font-cairo">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8f743c]" />
              <span>لوحة القيادة الإدارية والتحليلية</span>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>مشرف النظام / {deanConfig.unitHeadName || 'د. إبراهيم الحسين'}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                وحدة الإرشاد المهني والتوظيف • الكلية التطبيقية
              </div>
            </div>

            <button
              onClick={onLogout}
              title="تسجيل الخروج من لوحة الإدارة"
              className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner - Geometric Balance */}
      <section className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white py-5 sm:py-6 relative z-30 overflow-visible w-full">
        <div className="absolute inset-0 opacity-10 bg-geometric-grid pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 overflow-visible">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5">
            <div className="min-w-0 max-w-full">
              <div className="inline-flex items-center gap-2 bg-[#a4874b]/20 text-[#e5d4a6] text-xs px-3.5 sm:px-4 py-1.5 rounded-full border border-[#a4874b]/40 mb-2 sm:mb-2.5 shadow-2xs max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-[#e5d4a6] shrink-0" />
                <span className="font-bold font-cairo overflow-hidden text-ellipsis whitespace-nowrap">
                  منظومة الشراكة الأكاديمية بالكلية التطبيقية — لوحة القيادة الإدارية والتحليلية
                </span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-kufi text-white">
                أهلاً بك، مشرف وحدة الإرشاد المهني والتوظيف
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl font-cairo leading-relaxed">
                لوحة التحكم والمتابعة الشاملة للورش التدريبية، اعتماد طلبات الإنجاز، متابعة أداء الأقسام الأكاديمية، وإصدار شهادات الشكر والتقدير الرسمية لأعضاء هيئة التدريس.
              </p>
            </div>

            {/* Quick Stats Grid with 4 Evenly Distributed Metric Cards (2 cols on mobile, 4 on md) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 shrink-0 w-full xl:w-auto mt-1 xl:mt-0">
              
              {/* Card 1: الورش المنفذة */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#a4874b] min-w-0 flex flex-col justify-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {completedSessions.length}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">ورش معتمدة</div>
              </div>

              {/* Card 2: طالباً مستفيداً */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-emerald-400 min-w-0 flex flex-col justify-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-white">
                  {totalStudentsReached}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">طالباً مستفيداً</div>
              </div>

              {/* Card 3: أعضاء هيئة التدريس الفاعلين مع علامة الاستفهام التفاعلية في الزاوية */}
              <div className="group/stat relative bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#c8aa62] min-w-0 flex flex-col justify-center">
                
                {/* Tooltip Question Mark in Corner (Top-Left in RTL) */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    type="button"
                    aria-label="معلومات تفصيلية عن دكاترة الورش"
                    className="text-[#e5d4a6]/80 hover:text-[#f3e5b8] p-0.5 rounded-full hover:bg-white/15 transition-all cursor-help flex items-center justify-center"
                  >
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                  </button>

                  {/* Tooltip Dropdown Card */}
                  <div className="invisible opacity-0 group-hover/stat:visible group-hover/stat:opacity-100 transition-all duration-200 absolute bottom-full mb-2.5 left-0 z-50 w-56 sm:w-64 p-2.5 bg-slate-900/95 text-white text-xs rounded-xl shadow-xl border border-amber-400/30 backdrop-blur-md pointer-events-none text-right font-cairo">
                    <div className="font-bold text-[#e5d4a6] mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#e5d4a6]" />
                      <span>مؤشر مشاركة أعضاء هيئة التدريس</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      تم تنفيذ الورش من قِبل <span className="font-bold text-[#e5d4a6]">{activeFacultyCount}</span> دكاترة من أصل <span className="font-bold text-emerald-400">{whitelist.length}</span> دكتور معتمد بالقائمة البيضاء.
                    </p>
                    <div className="absolute top-full left-3.5 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
                  </div>
                </div>

                {/* Big Number Centered */}
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {activeFacultyCount}
                </div>

                {/* Main Label Centered */}
                <div className="text-[10px] sm:text-xs text-emerald-100 font-bold mt-0.5">
                  دكتور منفذ دورة
                </div>
              </div>

              {/* Card 4: شهادات الشكر */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#f3e5b8] min-w-0 flex flex-col justify-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-[#f3e5b8]">
                  {totalCertificatesIssued}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">شهادات شكر</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar with Single Row Flex Layout, Side Navigation Arrows, and Visible Scrollbar */}
      <div className="bg-white/95 border-b border-amber-200/70 sticky top-18 z-20 shadow-2xs relative w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 relative">
          
          <div className="flex items-center gap-1.5 sm:gap-2 w-full">
            {/* Right Scroll Arrow Button (السهم الأيمن للتنقل السريع) */}
            <button
              type="button"
              onClick={scrollTabsRight}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200/80 shadow-2xs transition-all flex items-center justify-center cursor-pointer"
              title="التمرير لليمين"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Single Row Flex Tabs Container (Visible Styled Scrollbar, No Shrinking) */}
            <div 
              ref={tabsScrollRef}
              onScroll={checkTabsScroll}
              className="w-full flex flex-row items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-100 touch-pan-x"
            >
              <button
                onClick={() => setAdminTab('analytics')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer ${
                  adminTab === 'analytics'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>المؤشرات والتحليلات</span>
              </button>

              <button
                onClick={() => setAdminTab('approvals')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer relative ${
                  adminTab === 'approvals'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 shrink-0 text-[#e5d4a6]" />
                <span>طلبات الاعتماد</span>
                {pendingApprovalSessions.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 font-mono animate-pulse">
                    {pendingApprovalSessions.length}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-500 font-mono">
                    0
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('sessions')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer relative ${
                  adminTab === 'sessions'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4 shrink-0" />
                <span>متابعة الورش ({sessions.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('whitelist')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer ${
                  adminTab === 'whitelist'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>القائمة البيضاء ({whitelist.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('courses')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer ${
                  adminTab === 'courses'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>الحقائب ({courses.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer ${
                  adminTab === 'settings'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>الاعتماد والشهادات</span>
              </button>

              <button
                onClick={() => setAdminTab('annual_report')}
                className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer ${
                  adminTab === 'annual_report'
                    ? 'bg-[#1b4332] text-white shadow-xs border-b-2 border-[#a4874b]'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-500" />
                <span>التقرير السنوي العام للوحدة</span>
              </button>
            </div>

            {/* Left Scroll Arrow Button (السهم الأيسر للتنقل السريع) */}
            <button
              type="button"
              onClick={scrollTabsLeft}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200/80 shadow-2xs transition-all flex items-center justify-center cursor-pointer"
              title="التمرير لليسار"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* TAB 1: EXECUTIVE ANALYTICS & KPIS */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Supervisor Pending Approvals Alert Banner */}
            {pendingApprovalSessions.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-50 to-emerald-50/40 border-2 border-amber-400 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-scaleUp">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 font-kufi flex items-center gap-2">
                      <span>تنبيه المشرف: يوجد ({pendingApprovalSessions.length}) طلب اعتماد لورش عمل بانتظار تدقيقك</span>
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                    </h4>
                    <p className="text-xs text-amber-900/80 font-cairo mt-0.5">
                      قام أعضاء هيئة التدريس بتأكيد تنفيذ الورش ورفع أعداد الطلاب الفعليين. يرجى التدقيق والمراجعة لإصدار شهادات الشكر الرسمية واحتساب النقاط.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAdminTab('approvals')}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 font-kufi"
                >
                  <Award className="w-4 h-4 text-[#e5d4a6]" />
                  <span>مراجعة واعتماد الطلبات الآن ({pendingApprovalSessions.length})</span>
                </button>
              </div>
            )}

            {/* Top KPI Cards - Enhanced Uniform Grid with Editable Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Card 1: Completed Workshops (with editable planned count) */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">الورش المنفذة فعلياً</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleOpenEditTargets}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        title="تعديل إجمالي الورش المخطط لها"
                      >
                        <Edit className="w-3 h-3 text-emerald-700" />
                        <span>تعديل</span>
                      </button>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
                        <CheckCircle className="w-4.5 h-4.5" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-kufi text-emerald-950 tracking-tight">
                      {completedSessions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-cairo flex items-center gap-1">
                      <span>من إجمالي {effectivePlannedWorkshops} ورشة</span>
                      {customPlannedWorkshops !== null && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-mono border border-amber-200/60">
                          مُخصّص
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-cairo mb-1.5">
                    <span>نسبة إنجاز الخطة</span>
                    <span className="font-bold text-emerald-800">
                      {Math.round((completedSessions.length / (effectivePlannedWorkshops || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((completedSessions.length / (effectivePlannedWorkshops || 1)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card 2: Students Reached (with editable target count) */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#1b4329] to-[#2d6a4f]"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">إجمالي الطلاب المستفيدين</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleOpenEditTargets}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b4329] bg-[#f0f7f2] hover:bg-[#e2f0e7] px-2 py-0.5 rounded-lg border border-[#c8e2d1] transition-colors cursor-pointer"
                        title="تعديل إجمالي المستهدف من الطلاب"
                      >
                        <Edit className="w-3 h-3 text-[#1b4329]" />
                        <span>تعديل</span>
                      </button>
                      <div className="w-9 h-9 rounded-xl bg-[#f0f7f2] text-[#1b4329] flex items-center justify-center border border-[#c8e2d1] shadow-2xs">
                        <Users className="w-4.5 h-4.5" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-kufi text-[#143520] tracking-tight">
                      {totalStudentsReached}
                    </span>
                    <span className="text-xs font-bold text-[#1b4329] font-cairo">
                      طالباً وطالبة
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-cairo mb-1.5">
                    <div className="flex items-center gap-1">
                      <span>المستهدف: <strong>{effectiveTargetStudents}</strong> طالب</span>
                      {customTargetStudents !== null && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-mono border border-amber-200/60">
                          مُخصّص
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-[#1b4329]">
                      {Math.round((totalStudentsReached / (effectiveTargetStudents || 1)) * 100)}% من المستهدف
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1b4329] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((totalStudentsReached / (effectiveTargetStudents || 1)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Active Faculty */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-700 to-indigo-600"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">أعضاء هيئة التدريس الفاعلون</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200 shadow-2xs">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-kufi text-slate-900 tracking-tight">
                      {activeFacultyCount}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-cairo">
                      دكتور منفذ دورة (من أصل {whitelist.length} بالقائمة)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-cairo">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>معدل النشاط الأكاديمي</span>
                  </div>
                  <span className="font-bold text-blue-900">
                    {Math.round((activeFacultyCount / (whitelist.length || 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Card 4: Official Certificates */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#a4874b] to-[#cbb279]"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">شهادات الشكر الصادرة</span>
                    <div className="w-10 h-10 rounded-xl bg-[#faf6ee] text-[#785e2b] flex items-center justify-center border border-[#a4874b]/30 shadow-2xs">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-kufi text-[#785e2b] tracking-tight">
                      {totalCertificatesIssued}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-cairo">
                      شهادة معتمدة
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-cairo">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1b4329]" />
                    <span>اعتماد رسمي رقمي</span>
                  </div>
                  <span className="font-bold text-[#785e2b]">
                    100% موثقة
                  </span>
                </div>
              </div>

            </div>

            {/* Expanded Full-Width Department Progress Breakdown */}
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs bg-white space-y-6">
              
              {/* Header with Title & Quick Overview Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5 font-kufi">
                    <div className="p-2 rounded-xl bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span>معدلات إنجاز الورش حسب الأقسام الأكاديمية بالكلية التطبيقية</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-cairo mr-10">
                    متابعة شاملة لتغطية الأقسام العلمية، عدد الورش المنجزة، وإجمالي المستفيدين من الطلبة
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold font-cairo border border-slate-200">
                    إجمالي الأقسام: {deptStats.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#f0f7f2] text-[#1b4329] text-xs font-bold font-cairo border border-[#c8e2d1]">
                    {completedSessions.length} ورشة منفذة
                  </span>
                </div>
              </div>

              {/* Department Full-Width Progress List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deptStats.map((item, idx) => {
                  const maxStudents = Math.max(...deptStats.map(d => d.students), 100);
                  const progressPercentage = Math.round((item.students / maxStudents) * 100);
                  
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#1b4329]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="font-bold text-sm text-slate-900 font-kufi flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1b4329]"></span>
                            <span>{item.dept}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1] whitespace-nowrap">
                            {item.completed} ورش منفذة
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 font-cairo mt-3 mb-1.5">
                          <span>الطلاب المستفيدين:</span>
                          <span className="font-bold text-[#143520] font-kufi text-sm">
                            {item.students} <span className="text-xs font-normal text-slate-500 font-cairo">طالب وطالبة</span>
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx % 3 === 0 
                              ? 'bg-gradient-to-r from-[#143520] to-[#1b4329]' 
                              : idx % 3 === 1 
                              ? 'bg-gradient-to-r from-[#a4874b] to-[#cbb279]' 
                              : 'bg-gradient-to-r from-[#2d6a4f] to-[#40916c]'
                          }`}
                          style={{ width: `${Math.max(8, progressPercentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* TAB: SUPERVISOR APPROVALS & VERIFICATION */}
        {adminTab === 'approvals' && (
          <div className="space-y-6">
            
            {/* Header Description */}
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-r-4 border-r-[#a4874b]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#785e2b] bg-[#faf6ee] px-2.5 py-1 rounded-full border border-[#a4874b]/30 mb-1.5 font-cairo">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8f743c]" />
                  <span>نظام التدقيق والاعتماد الأكاديمي الرسمي</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-kufi">
                  طلبات اعتماد تنفيذ ورش العمل وإصدار الشهادات
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-cairo max-w-2xl">
                  مراجعة تقارير التنفيذ وأعداد الطلاب الفعليين المرفوعة من أعضاء هيئة التدريس، وتدقيق التوثيق لاعتماد احتساب النقاط وإصدار شهادات الشكر والتقدير الرقمية الرسمية.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>بانتظار الاعتماد: {pendingApprovalSessions.length}</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-[#f0f7f2] border border-[#c8e2d1] text-xs text-[#1b4329] font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#1b4329]" />
                  <span>معتمدة ومنفذة: {completedSessions.length}</span>
                </div>
              </div>
            </div>

            {/* Pending Approvals List */}
            {pendingApprovalSessions.length === 0 ? (
              <div className="glass-card rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f0f7f2] text-[#1b4329] flex items-center justify-center mx-auto mb-3 border border-[#c8e2d1] shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-kufi">
                  لا توجد طلبات اعتماد معلقة حالياً
                </h3>
                <p className="text-xs text-slate-500 font-cairo mt-1 max-w-md mx-auto">
                  تم تدقيق واعتماد كافة الورش المنفذة بنجاح وإصدار شهادات الشكر لأعضاء هيئة التدريس تلقائياً.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovalSessions.map((session) => (
                  <div
                    key={session.id}
                    className="glass-card rounded-2xl border-2 border-amber-300 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden border-r-4 border-r-amber-500"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      
                      {/* Session Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse font-cairo flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>بانتظار مراجعة واعتماد المشرف</span>
                          </span>

                          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {session.courseCode}
                          </span>

                          <span className="text-xs font-bold text-[#785e2b] bg-[#faf6ee] px-2.5 py-0.5 rounded-full border border-[#a4874b]/30 font-cairo">
                            {session.category === 'cv_portfolio' ? 'السيرة الذاتية' : session.category === 'interview_skills' ? 'المقابلات' : 'التدريب والجاهزية'}
                          </span>

                          <span className="text-xs text-slate-500 font-cairo">
                            المقر: <strong>{session.campus}</strong> • القسم: <strong>{session.department}</strong>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-kufi">{session.courseTitle}</h3>
                          
                          {/* Professor Details */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-cairo mt-1">
                            <span>المحاضر: <strong className="text-slate-900 font-bold">{session.professorTitle} {session.professorName}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-slate-500" dir="ltr">{session.professorEmail}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-slate-500" dir="ltr">{session.professorPhone}</span>
                          </div>
                        </div>

                        {/* Timing and Attendance Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-cairo text-xs">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-[#1b4329]" />
                            <div>
                              <div className="text-slate-500 text-[11px]">موعد الانعقاد:</div>
                              <div className="font-bold text-slate-800">{session.date} ({session.timeSlot})</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#8f743c]" />
                            <div>
                              <div className="text-slate-500 text-[11px]">القاعة التدريبية:</div>
                              <div className="font-bold text-slate-800">{session.hallName}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-700" />
                            <div>
                              <div className="text-slate-500 text-[11px]">الطلاب المستهدف / الفعلي:</div>
                              <div className="font-bold text-slate-800">
                                <span>{session.studentCountTarget} مستهدف</span> ← <strong className="text-emerald-800 font-kufi text-sm">{session.studentCountActual} حاضر فعلياً</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Professor Notes */}
                        {session.sessionNotes && (
                          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-slate-700 font-cairo">
                            <strong className="text-amber-900 font-bold font-kufi">ملاحظات المحاضر المرفوعة:</strong>
                            <p className="mt-0.5 text-slate-800">{session.sessionNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Supervisor Review Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                        <button
                          onClick={() => handleOpenApproveModal(session)}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-kufi"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                          <span>اعتماد وإصدار الشهادة الرسمية</span>
                        </button>

                        <button
                          onClick={() => handleOpenRejectModal(session)}
                          className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-kufi shadow-2xs"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>طلب تعديل / رفض الطلب</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: LIVE SESSIONS TRACKING */}
        {adminTab === 'sessions' && (
          <div className="space-y-5">
            
            {/* Filter Bar */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 font-cairo">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <input
                    type="text"
                    placeholder="ابحث بالورشة، المحاضر، أو القسم..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="w-full py-2.5 px-3 pr-9 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1b4329] focus:border-[#1b4329] bg-slate-50/70"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3 my-auto" />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sessionStatusFilter}
                    onChange={(e) => setSessionStatusFilter(e.target.value)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4329] font-medium text-slate-700"
                  >
                    <option value="all">كافة الحالات</option>
                    <option value="pending_approval">بانتظار الاعتماد ({pendingApprovalSessions.length})</option>
                    <option value="completed">منفذة ومعتمدة ({completedSessions.length})</option>
                    <option value="scheduled">مجدولة ({scheduledSessions.length})</option>
                    <option value="rejected">معادة للتعديل ({rejectedSessions.length})</option>
                  </select>

                  <select
                    value={sessionDeptFilter}
                    onChange={(e) => setSessionDeptFilter(e.target.value)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4329] font-medium text-slate-700 hidden sm:block"
                  >
                    <option value="all">كافة الأقسام الأكاديمية</option>
                    {DEPARTMENT_OPTIONS.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium self-end md:self-center">
                <span className="px-3 py-1.5 rounded-xl bg-[#f0f7f2] text-[#1b4329] font-bold border border-[#c8e2d1] font-cairo">
                  إجمالي النتائج: {filteredSessions.length} ورشة
                </span>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="glass-card rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f8faf9] text-slate-700 font-bold border-b border-slate-200/80 font-kufi">
                    <tr>
                      <th className="py-4 px-4 min-w-[220px]">الورشة التدريبية</th>
                      <th className="py-4 px-4 min-w-[150px]">عضو هيئة التدريس</th>
                      <th className="py-4 px-4">القسم</th>
                      <th className="py-4 px-4 whitespace-nowrap">التاريخ</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">الشهود/الحضور</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">الحالة</th>
                      <th className="py-4 px-3 text-center w-24 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-cairo">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 px-4 text-center text-slate-400 font-medium font-cairo">
                          لا توجد ورش عمل مطابقة لمعايير البحث الحالية
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((session) => {
                        const isCompleted = session.status === 'completed';
                        const isPendingApproval = session.status === 'pending_approval';
                        const isRejected = session.status === 'rejected';

                        return (
                          <tr key={session.id} className="hover:bg-[#f0f7f2]/40 transition-colors">
                            {/* Course Title & Code - Wrapped nicely without truncation */}
                            <td className="py-4 px-4 font-bold text-slate-900 min-w-[220px] max-w-md">
                              <div className="font-kufi text-slate-900 text-xs sm:text-[13px] leading-relaxed break-words whitespace-normal">
                                {session.courseTitle}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono font-normal block mt-0.5">{session.courseCode}</span>
                            </td>
                            
                            {/* Professor Name */}
                            <td className="py-4 px-4 min-w-[150px]">
                              <div className="font-bold text-slate-800 font-kufi text-xs">{session.professorTitle} {session.professorName}</div>
                            </td>

                            {/* Department */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="text-slate-700 font-medium">{session.department}</div>
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-bold text-slate-800 font-mono text-xs">{session.date}</div>
                            </td>

                            {/* Attendance / Students */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <div className="font-bold font-kufi">
                                {isCompleted ? (
                                  <span className="text-emerald-700 text-sm">{session.studentCountActual}</span>
                                ) : isPendingApproval ? (
                                  <span className="text-amber-700 text-sm">{session.studentCountActual}</span>
                                ) : (
                                  <span className="text-slate-600 text-xs">{session.studentCountTarget}</span>
                                )}
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-kufi border ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isPendingApproval
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : isRejected
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-500' : isPendingApproval ? 'bg-amber-500' : isRejected ? 'bg-rose-500' : 'bg-slate-400'
                                }`} />
                                {isCompleted 
                                  ? 'منفذة' 
                                  : isPendingApproval 
                                  ? 'قيد التدقيق' 
                                  : isRejected 
                                  ? 'معادة للتعديل' 
                                  : 'مجدولة'}
                              </span>
                            </td>

                            {/* Stacked 2-Column Action Grid for maximum horizontal space efficiency */}
                            <td className="py-3 px-3 text-center">
                              <div className="inline-grid grid-cols-2 gap-1.5 justify-center items-center p-1 bg-slate-50/80 rounded-xl border border-slate-200/60 shadow-2xs">
                                {/* Certificate Preview Icon Button for Completed Sessions */}
                                {session.certificateIssued && (
                                  <button
                                    onClick={() => onOpenCertificateModal(session)}
                                    className="p-1.5 bg-[#faf6ee] text-[#785e2b] hover:bg-[#f3e9d2] hover:text-[#5a441e] border border-[#a4874b]/30 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                                    title="معاينة وتحميل شهادة الشكر والتقدير"
                                    aria-label="معاينة الشهادة"
                                  >
                                    <Award className="w-3.5 h-3.5 text-[#a4874b]" />
                                  </button>
                                )}

                                {/* Approval/Reject Quick Actions */}
                                {isPendingApproval ? (
                                  <>
                                    <button
                                      onClick={() => handleOpenApproveModal(session)}
                                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                                      title="اعتماد التنفيذ الفوري وإصدار الشهادة"
                                      aria-label="اعتماد الورشة"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenRejectModal(session)}
                                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                      title="طلب تعديل أو إعادة مراجعة"
                                      aria-label="طلب تعديل"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                    </button>
                                  </>
                                ) : !isCompleted ? (
                                  <button
                                    onClick={() => handleOpenApproveModal(session)}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                                    title="تأكيد واعتماد تنفيذ الورشة"
                                    aria-label="تأكيد الاعتماد"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : null}

                                {/* Edit Button */}
                                <button
                                  onClick={() => handleOpenEditModal(session)}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-[#785e2b] border border-[#a4874b]/30 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title="تعديل تفاصيل ورشة العمل"
                                  aria-label="تعديل الورشة"
                                >
                                  <Edit className="w-3.5 h-3.5 text-[#a4874b]" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={() => handleOpenDeleteModal(session)}
                                  className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title="حذف ورشة العمل"
                                  aria-label="حذف الورشة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Reminder Button */}
                                <button
                                  onClick={() => {
                                    alert(`تم إرسال إشعار تذكيري للبريد الجامعي للأستاذ: ${session.professorName}`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-[#1b4329] hover:bg-[#f0f7f2] border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title="إرسال إشعار تذكيري للبريد الجامعي"
                                  aria-label="إشعار تذكيري"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: WHITELIST MANAGEMENT */}
        {adminTab === 'whitelist' && (
          <div className="space-y-5">
            
            <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، البريد، الرقم الوظيفي..."
                    value={whitelistSearch}
                    onChange={(e) => setWhitelistSearch(e.target.value)}
                    className="w-full py-2 px-3 pr-9 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-2.5 my-auto" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-admin-add-faculty"
                  onClick={() => setIsAddFacultyModalOpen(true)}
                  className="px-4 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all border border-[#a4874b]/40 font-kufi"
                >
                  <Plus className="w-4 h-4 text-[#e5d4a6]" />
                  <span>إضافة عضو هيئة تدريس للقائمة البيضاء</span>
                </button>
              </div>
            </div>

            {/* Whitelist Grid / Table */}
            <div className="glass-card rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f8faf9] text-slate-700 font-bold border-b border-slate-200/80 font-kufi">
                    <tr>
                      <th className="py-4 px-4 min-w-[200px]">عضو هيئة التدريس</th>
                      <th className="py-4 px-4 min-w-[180px]">البريد المعتمد والرمز</th>
                      <th className="py-4 px-4">القسم والمقر</th>
                      <th className="py-4 px-4 whitespace-nowrap">الرقم الوظيفي</th>
                      <th className="py-4 px-4 text-center whitespace-nowrap">حالة الوصول</th>
                      <th className="py-4 px-3 text-center w-24 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-cairo">
                    {filteredWhitelist.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 px-4 text-center text-slate-400 font-medium font-cairo">
                          لا يوجد أعضاء هيئة تدريس مطابقين لمعايير البحث الحالية
                        </td>
                      </tr>
                    ) : (
                      filteredWhitelist.map((entry) => {
                        const isActive = entry.status === 'active';

                        return (
                          <tr key={entry.id} className="hover:bg-[#f0f7f2]/40 transition-colors">
                            {/* Faculty Name & Academic Title */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 font-kufi text-xs sm:text-[13px] leading-relaxed">
                                {entry.title} / {entry.name}
                              </div>
                              <span className="text-[10px] text-slate-400 font-cairo block mt-0.5">
                                أضيف بتاريخ: {entry.addedAt}
                              </span>
                            </td>

                            {/* Email & Passcode */}
                            <td className="py-4 px-4 min-w-[180px]">
                              <div className="font-mono text-slate-700 font-medium text-xs mb-1" dir="ltr">
                                {entry.email}
                              </div>
                              <div className="flex items-center gap-1.5" dir="ltr">
                                <span className="text-[10px] text-slate-400 font-kufi">الرمز:</span>
                                <span className="font-mono font-bold text-[#1b4329] bg-[#f0f7f2] px-2 py-0.5 rounded-md border border-[#c8e2d1] text-[11px]">
                                  {entry.passcode || 'MU@2026'}
                                </span>
                              </div>
                            </td>

                            {/* Department & Campus */}
                            <td className="py-4 px-4">
                              <div className="text-slate-800 font-medium text-xs">{entry.department}</div>
                              <div className="text-slate-500 text-[11px] mt-0.5 font-cairo">{entry.campus}</div>
                            </td>

                            {/* Employee ID */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-mono font-bold text-slate-700 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                {entry.employeeId}
                              </span>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => onToggleWhitelistStatus(entry.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-kufi border cursor-pointer transition-all hover:scale-105 ${
                                  isActive
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                }`}
                                title="انقر لتغيير حالة التفعيل"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {isActive ? 'مصرح ونشط' : 'معطل'}
                              </button>
                            </td>

                            {/* Stacked 2-Column Action Grid */}
                            <td className="py-3 px-3 text-center">
                              <div className="inline-grid grid-cols-2 gap-1.5 justify-center items-center p-1 bg-slate-50/80 rounded-xl border border-slate-200/60 shadow-2xs">
                                {/* Edit Faculty Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditFacultyModal(entry)}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-[#785e2b] border border-[#a4874b]/30 rounded-lg transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                                  title="تعديل بيانات عضو هيئة التدريس"
                                  aria-label="تعديل"
                                >
                                  <Edit className="w-3.5 h-3.5 text-[#a4874b]" />
                                </button>

                                {/* Copy Passcode Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText?.(`البريد: ${entry.email}\nالرمز السري: ${entry.passcode || 'MU@2026'}`);
                                    alert(`تم نسخ بيانات الدخول للأستاذ: ${entry.name}`);
                                  }}
                                  className="p-1.5 text-[#1b4329] hover:bg-[#f0f7f2] border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title="نسخ بيانات الدخول والرمز السري"
                                  aria-label="نسخ الرمز السري"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>

                                {/* Toggle Status Action Button */}
                                <button
                                  type="button"
                                  onClick={() => onToggleWhitelistStatus(entry.id)}
                                  className={`p-1.5 border rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                                    isActive
                                      ? 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                                      : 'text-slate-400 hover:bg-slate-100 border-slate-200'
                                  }`}
                                  title={isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                  aria-label="تبديل الحالة"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من حذف الأستاذ ${entry.name} من القائمة البيضاء؟`)) {
                                      onDeleteWhitelistEntry(entry.id);
                                    }
                                  }}
                                  className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  title="حذف من القائمة البيضاء"
                                  aria-label="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: COURSES & CURRICULUM MANAGEMENT */}
        {adminTab === 'courses' && (
          <div className="space-y-5">
            
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-cairo">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-kufi flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1b4329]" />
                  <span>الحقائب التدريبية المعتمدة</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-cairo">إضافة حقائب جديدة، تعديل المحتوى التعليمي والأدلة، وتحديث ملفات البوربوينت</p>
              </div>

              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="px-4 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-kufi transition-colors"
              >
                <Plus className="w-4 h-4 text-[#e5d4a6]" />
                <span>إضافة حقيبة تدريبية جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-cairo">
              {courses.map((course) => {
                const courseSessions = sessions.filter(s => s.courseId === course.id || s.courseCode === course.code);
                const totalTimesRequested = courseSessions.length;
                const completedSessionsCount = courseSessions.filter(s => s.status === 'completed').length;
                const totalStudentsReached = courseSessions.reduce((acc, s) => acc + (s.studentCountActual || s.studentCountTarget || 0), 0);
                const isCourseActive = course.isActive !== false;

                return (
                  <div 
                    key={course.id} 
                    className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs bg-white flex flex-col justify-between border-r-4 border-r-[#1b4329] hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Top Badges & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-[#fcf9f2] text-[#785e2b] px-2.5 py-0.5 rounded-md border border-[#e5d4a6]">
                            {course.code}
                          </span>
                          <span className="text-[11px] font-semibold text-[#1b4329] bg-[#f0f7f2] px-2.5 py-0.5 rounded-full border border-[#c8e2d1] font-kufi">
                            {course.categoryLabel || 'جاهزية سوق العمل'}
                          </span>
                        </div>

                        {/* Status Badge with Quick Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleCourseActive(course)}
                          title="انقر لتغيير حالة الحقيبة بين نشطة ومسودة"
                          className={`text-[11px] font-bold font-kufi px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                            isCourseActive
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isCourseActive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
                          <span>{isCourseActive ? 'نشطة ومتاحة للحجز' : 'مسودة / تحت التعديل'}</span>
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-kufi leading-snug">{course.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 font-cairo leading-relaxed">{course.fullOverview || course.shortDescription}</p>

                      {/* Quick Usage Statistics Strip */}
                      <div className="mt-3.5 p-2.5 bg-gradient-to-r from-slate-50 via-[#fcf9f2] to-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-cairo">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-[#a4874b] shrink-0" />
                          <span className="text-slate-600 text-[11px]">معدل الطلب:</span>
                          <span className="font-bold text-[#1b4329] font-kufi text-[11px]">
                            {totalTimesRequested > 0 
                              ? `تم استخدامها في ${totalTimesRequested} ورش (${completedSessionsCount} منفذة)`
                              : 'حقيبة جديدة (لم تُطلب بعد)'}
                          </span>
                        </div>
                        {totalStudentsReached > 0 && (
                          <span className="text-[11px] font-bold text-[#785e2b] bg-white px-2 py-0.5 rounded-md border border-[#e5d4a6] shadow-2xs">
                            👥 {totalStudentsReached} طالب مستفيد
                          </span>
                        )}
                      </div>

                      {/* Course Meta Info */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between font-cairo bg-slate-50/70 p-2.5 rounded-xl">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#a4874b]" />
                          <span>المواد: <strong>{course.materials.length} ملفات</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1b4329]" />
                          <span>خطوات التيسير: <strong>{course.facilitationGuide.length} خطوات</strong></span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{course.durationMinutes} دقيقة</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCoursePreview(course)}
                        className="px-3 py-1.5 bg-[#f0f7f2] hover:bg-[#e2f0e6] text-[#1b4329] border border-[#c8e2d1] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors font-kufi shadow-2xs"
                        title="معاينة الحقيبة كما تظهر لعضو هيئة التدريس"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1b4329]" />
                        <span>معاينة كـ عضو هيئة تدريس</span>
                      </button>

                      <div className="flex items-center gap-1.5 mr-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCourseModal(course)}
                          className="px-3 py-1.5 bg-[#fcf9f2] hover:bg-[#f7f1e1] text-[#785e2b] border border-[#e5d4a6] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors font-kufi"
                          title="تعديل محتوى وبيانات الحقيبة التدريبية"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#a4874b]" />
                          <span>تعديل المحتوى</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteCourseModal(course)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                          title="حذف الحقيبة التدريبية"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 5: OFFICIAL DEAN CREDENTIALS CONFIG & LIVE CERTIFICATE PREVIEW */}
        {adminTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn pb-12 font-cairo">
            
            {/* Top Overview Banner */}
            <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4329] to-[#2d6a4f] text-[#faf6ee] flex items-center justify-center shadow-sm shrink-0">
                  <Award className="w-6 h-6 text-[#e5d4a6]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-kufi">
                      منظومة الاعتماد الرسمي وإصدار الشهادات الأكاديمية
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-kufi">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>معاينة حية ومباشرة</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    تعديل بيانات القيادات الأكاديمية والموقعين والختم الرقمي مع انعكاس فوري ومباشر على الشهادات المعتمدة الصادرة لأعضاء هيئة التدريس.
                  </p>
                </div>
              </div>

              {/* Quick Actions in Top Banner */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrintCertPreview}
                  className="px-3.5 py-2 rounded-xl bg-[#faf6ee] hover:bg-[#f5ecdc] text-[#785e2b] border border-[#a4874b]/30 text-xs font-bold font-kufi transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="طباعة نموذج المعاينة الحالية"
                >
                  <Printer className="w-4 h-4 text-[#8f743c]" />
                  <span>طباعة نموذج المعاينة</span>
                </button>
              </div>
            </div>

            {/* TWO-COLUMN DUAL LAYOUT: 5 COLS FOR FORM (RIGHT IN RTL), 7 COLS FOR LIVE PREVIEW (LEFT IN RTL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* RIGHT SIDE (5 COLUMNS): ACCREDITATION & SIGNATORIES SETTINGS FORM */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5 border-r-4 border-r-[#1b4329]">
                  
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#1b4329]" />
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-kufi">
                        بيانات الاعتماد والموقعين
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#785e2b] font-bold bg-[#faf6ee] px-2.5 py-0.5 rounded-lg border border-[#a4874b]/30 font-mono">
                      Real-time Sync
                    </span>
                  </div>

                  <form onSubmit={handleSaveDeanConfig} className="space-y-4 text-xs font-cairo">
                    
                    {/* SECTION 1: DEAN CREDENTIALS (رئيس الكلية التطبيقية) */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4329] font-kufi">
                        <ShieldCheck className="w-4 h-4 text-[#a4874b]" />
                        <span>أولاً: المعتمد الرسمي (رئيس الكلية)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            اسم رئيس الكلية:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.deanName}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, deanName: e.target.value })}
                            placeholder="د. شادي بن صالح الشويعر"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            الصفة الرسمية:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.deanTitle}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, deanTitle: e.target.value })}
                            placeholder="رئيس الكلية التطبيقية"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: CAREER UNIT HEAD (مشرف وحدة الإرشاد والتطوير المهني) */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4329] font-kufi">
                        <UserCheck className="w-4 h-4 text-[#a4874b]" />
                        <span>ثانياً: مشرف وحدة الإرشاد والتوظيف</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            اسم مشرف الوحدة:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.unitHeadName}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, unitHeadName: e.target.value })}
                            placeholder="أ. ناصر العصيمي"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            الصفة الإدارية:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.unitHeadTitle}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, unitHeadTitle: e.target.value })}
                            placeholder="مشرف وحدة الإرشاد المهني والتوظيف"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: ACADEMIC TIMELINE (العام الأكاديمي والفصل) */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4329] font-kufi">
                        <CalendarIcon className="w-4 h-4 text-[#a4874b]" />
                        <span>ثالثاً: العام الأكاديمي والفصل الدراسي</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            العام الأكاديمي:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.academicYear}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, academicYear: e.target.value })}
                            placeholder="1447 / 1448 هـ"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            الفصل الدراسي:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.semester || 'الفصل الدراسي الأول'}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, semester: e.target.value })}
                            placeholder="الفصل الدراسي الأول"
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: INSTITUTIONAL HIERARCHY & SEAL (الهوية المؤسسية والختم) */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b4329] font-kufi">
                        <Sparkles className="w-4 h-4 text-[#a4874b]" />
                        <span>رابعاً: الهوية المؤسسية والختم الرقمي</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            الجامعة:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.university || 'جامعة المجمعة'}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, university: e.target.value })}
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                            الكلية:
                          </label>
                          <input
                            type="text"
                            value={deanConfig.deanCollege || 'الكلية التطبيقية'}
                            onChange={(e) => onUpdateDeanConfig({ ...deanConfig, deanCollege: e.target.value })}
                            className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 font-kufi text-[11px]">
                          نص الختم الرقمي الدائري المعتمد:
                        </label>
                        <textarea
                          rows={2}
                          value={deanConfig.officialSealText}
                          onChange={(e) => onUpdateDeanConfig({ ...deanConfig, officialSealText: e.target.value })}
                          placeholder="المملكة العربية السعودية - الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف"
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#1b4329] focus:ring-1 focus:ring-[#1b4329] outline-none leading-relaxed resize-none font-cairo"
                        />
                      </div>
                    </div>

                    {/* SAVE BUTTON FULL WIDTH */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1b4329] via-[#235334] to-[#143520] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-2xl text-xs sm:text-sm font-bold font-kufi shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                        <span>حفظ وتحديث بيانات الاعتماد الرسمي</span>
                      </button>
                    </div>

                    {/* Toast Notification */}
                    {certSaveToast && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 font-kufi animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>تم حفظ وتحديث إعدادات الاعتماد الرسمي بنجاح وتطبيقها على الشهادات!</span>
                      </div>
                    )}

                  </form>
                </div>
              </div>

              {/* LEFT SIDE (7 COLUMNS): LIVE INTERACTIVE PREVIEW CANVAS */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
                  
                  {/* Live Preview Controls Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-kufi">
                        المعاينة الحية للشهادة المعتمدة
                      </h3>
                    </div>

                    {/* Theme & Seal Selectors */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Theme Picker */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-kufi">
                        <Palette className="w-3.5 h-3.5 text-slate-500 mx-1" />
                        <button
                          type="button"
                          onClick={() => setCertTheme('gold')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            certTheme === 'gold'
                              ? 'bg-[#a4874b] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ذهبي ملكي
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertTheme('emerald')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            certTheme === 'emerald'
                              ? 'bg-[#1b4329] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          زمردي أكاديمي
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertTheme('navy')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            certTheme === 'navy'
                              ? 'bg-[#0f2444] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          كحلي فاخر
                        </button>
                      </div>

                      {/* Seal Type Picker */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-kufi">
                        <button
                          type="button"
                          onClick={() => setCertSealMode('circular_digital')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            certSealMode === 'circular_digital'
                              ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="ختم رقمي دائري تفاعلي"
                        >
                          ختم دائري
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertSealMode('honor_badge')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            certSealMode === 'honor_badge'
                              ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="شارة شرفية مذهبة"
                        >
                          شارة شرفية
                        </button>
                        <label
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            certSealMode === 'custom_image'
                              ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="رفع صورة مخصصة للختم"
                        >
                          <Upload className="w-3 h-3 text-[#1b4329]" />
                          <span>رفع ختم</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSealImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                    </div>
                  </div>

                  {/* Sample Professor Switcher Bar */}
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-cairo">
                      <span className="font-bold text-[11px] font-kufi text-slate-700">نموذج العضو للتجربة:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCertSampleFacultyName('د. عبد الرحمن بن فهد السويكت');
                            setCertSampleFacultyTitle('أستاذ مشارك');
                            setCertSampleDept('علوم الحاسب وتقنية المعلومات');
                            setCertSampleCampus('المجمعة (المقر الرئيسي)');
                            setCertSampleWorkshop('بناء السيرة الذاتية الاحترافية المتوافقة مع أنظمة الفرز الذكي (ATS)');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-kufi font-bold transition-all cursor-pointer ${
                            certSampleFacultyName.includes('السويكت')
                              ? 'bg-[#1b4329] text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          د. السويكت
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCertSampleFacultyName('د. نورة بنت سليمان الدخيل');
                            setCertSampleFacultyTitle('أستاذ مساعد');
                            setCertSampleDept('العلوم الإدارية والمالية');
                            setCertSampleCampus('المجمعة (شطر الطالبات)');
                            setCertSampleWorkshop('استراتيجيات اجتياز المقابلات الوظيفية وتقنية (STAR)');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-kufi font-bold transition-all cursor-pointer ${
                            certSampleFacultyName.includes('الدخيل')
                              ? 'bg-[#1b4329] text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          د. الدخيل
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCertSampleFacultyName('د. خالد بن منصور العتيبي');
                            setCertSampleFacultyTitle('أستاذ مشارك');
                            setCertSampleDept('الهندسة والتقنيات الصناعية');
                            setCertSampleCampus('الزلفي');
                            setCertSampleWorkshop('بناء الهوية المهنية الرقمية واستثمار شبكة LinkedIn');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-kufi font-bold transition-all cursor-pointer ${
                            certSampleFacultyName.includes('العتيبي')
                              ? 'bg-[#1b4329] text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          د. العتيبي
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mr-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const text = `شهادة شكر وتقدير معتمدة لسعادة ${certSampleFacultyTitle} / ${certSampleFacultyName} لتقديم ورشة ${certSampleWorkshop}. معتمد من رئيس الكلية التطبيقية ${deanConfig.deanName}.`;
                          navigator.clipboard?.writeText?.(text);
                          setCopiedCertTextToast(true);
                          setTimeout(() => setCopiedCertTextToast(false), 3000);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold font-kufi flex items-center gap-1 cursor-pointer"
                        title="نسخ نص بيانات الشهادة"
                      >
                        <Share2 className="w-3 h-3 text-slate-500" />
                        <span>{copiedCertTextToast ? 'تم النسخ!' : 'نسخ النص'}</span>
                      </button>
                    </div>
                  </div>

                  {/* THE ACTUAL CERTIFICATE CANVAS CONTAINER */}
                  <div className="overflow-x-auto bg-slate-100/80 p-3 sm:p-4 rounded-2xl border border-slate-200/90 flex justify-center shadow-inner">
                    <div
                      ref={certPreviewRef}
                      className={`printable-certificate relative w-full max-w-[760px] min-h-[520px] bg-[#fdfbf7] text-slate-800 p-6 sm:p-8 rounded-sm shadow-md flex flex-col justify-between select-none overflow-hidden transition-all duration-300 ${
                        certTheme === 'gold'
                          ? 'border-[10px] border-[#a4874b]'
                          : certTheme === 'emerald'
                          ? 'border-[10px] border-[#1b4329]'
                          : 'border-[10px] border-[#0f2444]'
                      }`}
                      style={{
                        boxShadow: certTheme === 'gold'
                          ? 'inset 0 0 0 3px #1b4329, inset 0 0 0 6px #d4af37, inset 0 0 0 8px #faf6ee'
                          : certTheme === 'emerald'
                          ? 'inset 0 0 0 3px #a4874b, inset 0 0 0 6px #143520, inset 0 0 0 8px #f0f7f2'
                          : 'inset 0 0 0 3px #c8aa62, inset 0 0 0 6px #1e3a8a, inset 0 0 0 8px #f8fafc',
                      }}
                    >
                      
                      {/* Arabesque Vector Corner Ornaments */}
                      <div className="absolute top-2 right-2 w-14 h-14 pointer-events-none opacity-40">
                        <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${certTheme === 'emerald' ? 'stroke-[#1b4329]' : certTheme === 'navy' ? 'stroke-[#0f2444]' : 'stroke-[#8f743c]'}`}>
                          <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.25" />
                          <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                          <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div className="absolute top-2 left-2 w-14 h-14 pointer-events-none opacity-40 transform -scale-x-100">
                        <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${certTheme === 'emerald' ? 'stroke-[#1b4329]' : certTheme === 'navy' ? 'stroke-[#0f2444]' : 'stroke-[#8f743c]'}`}>
                          <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.25" />
                          <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                          <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div className="absolute bottom-2 right-2 w-14 h-14 pointer-events-none opacity-40 transform -scale-y-100">
                        <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${certTheme === 'emerald' ? 'stroke-[#1b4329]' : certTheme === 'navy' ? 'stroke-[#0f2444]' : 'stroke-[#8f743c]'}`}>
                          <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.25" />
                          <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                          <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div className="absolute bottom-2 left-2 w-14 h-14 pointer-events-none opacity-40 transform scale-[-1]">
                        <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${certTheme === 'emerald' ? 'stroke-[#1b4329]' : certTheme === 'navy' ? 'stroke-[#0f2444]' : 'stroke-[#8f743c]'}`}>
                          <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.25" />
                          <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                          <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
                        </svg>
                      </div>

                      {/* Watermark Crest */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <div className="w-80 h-80 rounded-full border-[14px] border-[#1b4329] flex items-center justify-center">
                          <Award className="w-56 h-56 text-[#a4874b]" />
                        </div>
                      </div>

                      {/* 1. Certificate Header */}
                      <div className="relative z-10 flex items-center justify-between border-b border-[#a4874b]/30 pb-3">
                        <div className="text-right space-y-0.5">
                          <p className="text-[10px] font-bold text-[#1b4329]">المملكة العربية السعودية</p>
                          <p className="text-[12px] font-extrabold text-[#1b4329] font-kufi">
                            {deanConfig.university || 'جامعة المجمعة'}
                          </p>
                          <p className="text-[10px] font-semibold text-[#785e2b]">
                            {deanConfig.deanCollege || 'الكلية التطبيقية'}
                          </p>
                        </div>

                        <div className="flex flex-col items-center">
                          <LogoBranding size="sm" variant="horizontal" />
                        </div>

                        <div className="text-left space-y-0.5" dir="ltr">
                          <p className="text-[9px] font-bold text-[#1b4329]">Kingdom of Saudi Arabia</p>
                          <p className="text-[11px] font-bold text-[#1b4329]">Majmaah University</p>
                          <p className="text-[9px] font-semibold text-[#785e2b]">Applied College</p>
                        </div>
                      </div>

                      {/* 2. Certificate Title */}
                      <div className="relative z-10 text-center my-3 sm:my-4">
                        <div className="inline-block relative">
                          <h1 className={`text-2xl sm:text-3xl font-extrabold font-kufi tracking-tight px-6 py-0.5 ${
                            certTheme === 'emerald' ? 'text-[#1b4329]' : certTheme === 'navy' ? 'text-[#0f2444]' : 'text-[#1b4329]'
                          }`}>
                            شـهـادة شـكـر وتـقـديـر
                          </h1>
                          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#a4874b] to-transparent w-full mt-1"></div>
                        </div>
                      </div>

                      {/* 3. Certificate Body Text (Minimalist & Formal) */}
                      <div className="relative z-10 text-center px-4 sm:px-8 space-y-3 leading-relaxed font-cairo">
                        <p className="text-xs sm:text-[13px] text-slate-700 font-medium">
                          تسر <strong className="text-[#1b4329] font-bold font-kufi">{deanConfig.unitName || 'وحدة الإرشاد المهني والتوظيف'}</strong> بالكلية التطبيقية أن تتقدم بوافر الشكر والتقدير لسعادة:
                        </p>

                        {/* Recipient Banner */}
                        <div className="py-2 px-6 bg-[#faf6ee]/90 border-y border-[#a4874b]/40 inline-block rounded-lg shadow-2xs">
                          <span className="text-lg sm:text-xl font-extrabold font-kufi text-[#1b4329] tracking-wide block">
                            {certSampleFacultyTitle} / {certSampleFacultyName}
                          </span>
                          <span className="text-[11px] text-[#785e2b] block font-semibold mt-0.5">
                            قسم {certSampleDept} • {certSampleCampus}
                          </span>
                        </div>

                        <p className="text-xs sm:text-[13px] text-slate-700 font-medium">
                          نظير جهوده المتميزة وتعاونه المثمر في تقديم الورشة التدريبية التخصصية:
                        </p>

                        <div className="text-xs sm:text-sm font-bold text-[#1b4329] font-kufi bg-[#f0f7f2] py-2 px-4 rounded-xl border border-[#c8e2d1] max-w-lg mx-auto shadow-2xs">
                          « {certSampleWorkshop} »
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium pt-1">
                          سائلين المولى لسعادته دوام التوفيق والسداد ومزيداً من العطاء والتميز الأكاديمي.
                        </p>
                      </div>

                      {/* 4. Signatures & Official Seals Footer */}
                      <div className="relative z-10 grid grid-cols-3 items-end pt-4 border-t border-[#a4874b]/30 text-center mt-4">
                        
                        {/* Unit Head Signature */}
                        <div className="flex flex-col items-center font-cairo space-y-1">
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                            {deanConfig.unitHeadTitle || 'مشرف وحدة الإرشاد المهني والتوظيف'}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#1b4329] font-kufi">
                            {deanConfig.unitHeadName || 'أ. ناصر العصيمي'}
                          </span>
                          <div className="w-24 h-7 flex items-center justify-center italic text-slate-400 font-serif text-[11px] select-none">
                            [توقيع معتمد]
                          </div>
                        </div>

                        {/* Official Seal / QR Verification */}
                        <div className="flex flex-col items-center justify-center">
                          {certSealMode === 'custom_image' && customSealImage ? (
                            <img
                              src={customSealImage}
                              alt="الختم الرسمي"
                              className="w-16 h-16 object-contain rounded-full border border-[#a4874b] p-1 bg-white shadow-inner"
                            />
                          ) : certSealMode === 'honor_badge' ? (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#a4874b] via-[#e5d4a6] to-[#a4874b] flex flex-col items-center justify-center p-1.5 text-center shadow-sm border border-[#785e2b]">
                              <Award className="w-6 h-6 text-[#1b4329]" />
                              <span className="text-[7px] font-bold text-[#1b4329] font-kufi mt-0.5">معتمد رسمياً</span>
                            </div>
                          ) : (
                            /* Circular Digital Seal */
                            <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-[#a4874b] bg-[#faf6ee] flex flex-col items-center justify-center p-1 shadow-inner group">
                              <QrCode className="w-6 h-6 text-[#1b4329]" />
                              <span className="text-[7px] font-bold text-[#785e2b] uppercase tracking-tighter mt-0.5 font-mono">
                                MU VERIFIED
                              </span>
                            </div>
                          )}
                          <span className="text-[9px] text-slate-400 font-mono mt-1 font-cairo">
                            الختم الرسمي والتوثيق
                          </span>
                        </div>

                        {/* Dean of Applied College Official Signature */}
                        <div className="flex flex-col items-center font-cairo space-y-1">
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#1b4329] font-kufi">
                            {deanConfig.deanTitle || 'رئيس الكلية التطبيقية'}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#785e2b] font-kufi">
                            {deanConfig.deanName || 'د. شادي بن صالح الشويعر'}
                          </span>
                          <div className="w-24 h-7 flex items-center justify-center italic text-[#1b4329] font-serif font-bold text-[11px] select-none">
                            [الاعتماد والتوقيع]
                          </div>
                        </div>

                      </div>

                      {/* Discrete Serial & Footer Tag */}
                      <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                        <span>الرقم المرجعي الموثق: MU-AC-CERT-2026</span>
                        <span>العام الجامعي {deanConfig.academicYear || '1447 / 1448 هـ'}</span>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Verification Note */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-cairo">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1b4329]" />
                      <span>جميع التعديلات على مدخلات النموذج تنعكس فورياً في المعاينة الحية أعلاه.</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">Resolution: 300 DPI Ready</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 7: ANNUAL EXECUTIVE & STRATEGIC REPORT (التقرير السنوي العام للوحدة) */}
        {adminTab === 'annual_report' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            
            {/* Top Toolbar: Actions and Print Mode (Hidden in actual print output) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30 flex items-center justify-center shadow-2xs">
                  <FileText className="w-5 h-5 text-[#8f743c]" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-kufi">
                    التقرير السنوي الشامل لوحدة الإرشاد المهني والتوظيف
                  </h2>
                  <p className="text-xs text-slate-500 font-cairo">
                    العام الأكاديمي {deanConfig.academicYear} • وثيقة إدارية وقيادية معتمدة
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-[#f0f7f2] hover:bg-[#e2f0e7] text-[#1b4329] border border-[#c8e2d1] rounded-xl text-xs font-bold font-kufi transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  title="تصدير جدول البيانات الكامل بتنسيق Excel / CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#1b4329]" />
                  <span>تصدير البيانات (Excel/CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs font-bold font-kufi shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="طباعة التقرير أو حفظ كملف PDF"
                >
                  <Printer className="w-4 h-4 text-[#e5d4a6]" />
                  <span>طباعة التقرير الشامل / حفظ PDF</span>
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL DOCUMENT CONTAINER */}
            <div className="bg-white rounded-3xl border border-slate-300/80 shadow-md p-6 sm:p-10 lg:p-12 space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-cairo relative overflow-hidden">
              
              {/* Decorative Document Border Watermark */}
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-[#1b4329] via-[#a4874b] to-[#1b4329]"></div>

              {/* 1. Official Header (ترويسة الوثيقة الرسمية) */}
              <div className="border-b-2 border-[#a4874b]/40 pb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Right Side: University & College Hierarchy */}
                  <div className="text-center sm:text-right space-y-1">
                    <div className="text-xs font-bold text-slate-500 font-kufi">المملكة العربية السعودية</div>
                    <div className="text-xs font-bold text-slate-500 font-kufi">وزارة التعليم • جامعة المجمعة</div>
                    <div className="text-sm sm:text-base font-bold text-[#1b4329] font-kufi">الكلية التطبيقية</div>
                    <div className="text-xs font-bold text-[#785e2b] font-kufi">وحدة الإرشاد والتطوير المهني والتوظيف</div>
                  </div>

                  {/* Center: University Brand Logo */}
                  <div className="flex flex-col items-center justify-center">
                    <LogoBranding size="lg" />
                    <span className="text-[10px] text-slate-400 font-mono mt-1 font-bold">
                      ACADEMIC PARTNERSHIP SYSTEM
                    </span>
                  </div>

                  {/* Left Side: Document Meta */}
                  <div className="text-center sm:text-left space-y-1 bg-[#faf6ee] p-3 rounded-2xl border border-[#a4874b]/30 min-w-[200px]">
                    <div className="text-[11px] text-slate-600 font-kufi">
                      <span className="font-bold">رقم الوثيقة:</span>{' '}
                      <span className="font-mono font-bold text-[#1b4329]">MU-AC-REP-{new Date().getFullYear()}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-kufi">
                      <span className="font-bold">العام الأكاديمي:</span>{' '}
                      <span className="font-bold text-slate-800">{deanConfig.academicYear}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-kufi">
                      <span className="font-bold">تاريخ التقرير:</span>{' '}
                      <span className="font-mono text-slate-800">{new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                </div>

                {/* Report Title Banner */}
                <div className="mt-8 text-center bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#143520] text-white py-3.5 px-4 rounded-2xl shadow-xs">
                  <h1 className="text-base sm:text-xl font-bold font-kufi text-[#faf6ee]">
                    التقرير السنوي الشامل لمنظومة الشراكة الأكاديمية والتدريب المهني
                  </h1>
                  <p className="text-xs text-emerald-200/90 font-cairo mt-1">
                    حصاد مبادرة مشاركة أعضاء هيئة التدريس في التدريب والإرشاد المهني لطلبة الكلية التطبيقية
                  </p>
                </div>
              </div>

              {/* 2. Executive Summary & KPIs (ملخص مؤشرات الإنجاز الكلية) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#1b4329] font-kufi flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#a4874b]" />
                    <span>أولاً: ملخص مؤشرات الأداء والإنجاز الكلية (Executive Summary)</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-bold font-kufi">
                    معدل إنجاز الخطة:{' '}
                    <strong className="text-emerald-800 font-mono">
                      {Math.round((completedSessions.length / (effectivePlannedWorkshops || 1)) * 100)}%
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  
                  {/* KPI 1 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 text-right space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 font-kufi">
                      <span>الورش المنفذة</span>
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
                      {completedSessions.length}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium font-cairo">
                      من أصل {effectivePlannedWorkshops} ورشة مخططة ({Math.round((completedSessions.length / (effectivePlannedWorkshops || 1)) * 100)}%)
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#a4874b]/40 text-right space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#785e2b] font-kufi">
                      <span>الطلاب المستفيدون</span>
                      <Users className="w-4 h-4 text-[#8f743c]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#1b4329] font-mono">
                      {totalStudentsReached}
                    </div>
                    <div className="text-[11px] text-[#785e2b] font-medium font-cairo">
                      المستهدف: {effectiveTargetStudents} طالب ({Math.round((totalStudentsReached / (effectiveTargetStudents || 1)) * 100)}%)
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/90 text-right space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 font-kufi">
                      <span>أعضاء التدريس المشاركون</span>
                      <UserCheck className="w-4 h-4 text-blue-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
                      {activeFacultyCount}
                    </div>
                    <div className="text-[11px] text-blue-800 font-medium font-cairo">
                      من أصل {whitelist.length} عضواً معتمداً بالقائمة
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-right space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950 font-kufi">
                      <span>شهادات الشكر الصادرة</span>
                      <Award className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
                      {totalCertificatesIssued}
                    </div>
                    <div className="text-[11px] text-amber-900 font-medium font-cairo">
                      شهادات رقمية موثقة ومعتمدة رسمياً
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Department Performance Breakdown (جدول توزيع الإنجاز حسب الأقسام) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#1b4329] font-kufi flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#a4874b]" />
                    <span>ثانياً: تحليل أداء وتوزيع الإنجاز حسب الأقسام الأكاديمية</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-kufi">مؤشر الفاعلية البرامجية</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#1b4329] text-[#faf6ee] font-kufi">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">القسم الأكاديمي</th>
                        <th className="py-3 px-4 text-center">إجمالي الورش المسجلة</th>
                        <th className="py-3 px-4 text-center">الورش المنفذة فعلياً</th>
                        <th className="py-3 px-4 text-center">الطلاب المستفيدون</th>
                        <th className="py-3 px-4 text-center">نسبة الإنجاز بالقسم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-cairo">
                      {deptStats.map((item, idx) => {
                        const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                        return (
                          <tr key={item.dept} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                            <td className="py-3 px-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-kufi">{item.dept}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{item.total}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800 bg-emerald-50/50">
                              {item.completed}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-[#1b4329]">
                              {item.students} طالب
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5 font-mono font-bold">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                                  rate >= 75 ? 'bg-emerald-100 text-emerald-900' : rate >= 40 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {rate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Detailed Activities Log (سجل الورش والأنشطة المنفذة) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#1b4329] font-kufi flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>ثالثاً: السجل التفصيلي للورش التدريبية المنفذة والمعتمدة</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono font-bold font-kufi">
                    إجمالي الورش المنفذة: {completedSessions.length}
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-kufi border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">#</th>
                        <th className="py-3 px-4">عنوان الورشة التدريبية</th>
                        <th className="py-3 px-4">عضو هيئة التدريس (الميسر)</th>
                        <th className="py-3 px-3">القسم والمقر</th>
                        <th className="py-3 px-3 text-center">التاريخ</th>
                        <th className="py-3 px-3 text-center">الطلاب الحاضرين</th>
                        <th className="py-3 px-3 text-center">رقم الشهادة الرسمية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-cairo">
                      {completedSessions.length > 0 ? (
                        completedSessions.map((session, idx) => (
                          <tr key={session.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="py-3 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-kufi">
                              {session.courseTitle}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-800">
                                {session.professorTitle} {session.professorName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{session.professorEmail}</div>
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              <div>{session.department}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{session.campus}</div>
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-slate-700 whitespace-nowrap">
                              {session.date}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/30">
                              {session.studentCountActual || session.studentCountTarget} طالب
                            </td>
                            <td className="py-3 px-3 text-center">
                              {session.certificateId ? (
                                <span className="font-mono font-bold text-[11px] text-[#1b4329] bg-[#faf6ee] px-2 py-0.5 rounded border border-[#a4874b]/30">
                                  {session.certificateId}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 font-kufi">
                            لا توجد ورش مكتملة حتى الآن لإدراجها في السجل السنوي
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Official Approvals & Endorsement Signatures (توقيع واعتماد التقرير) */}
              <div className="pt-8 border-t-2 border-[#a4874b]/40">
                <div className="text-xs font-bold text-slate-500 font-kufi mb-6 text-center">
                  اعتماد التقرير السنوي الشامل لمنظومة الشراكة الأكاديمية
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-12">
                  
                  {/* Unit Head Signature Block */}
                  <div className="bg-[#faf6ee]/70 p-5 rounded-2xl border border-[#a4874b]/30 text-center space-y-3">
                    <div className="text-xs font-bold text-slate-700 font-kufi">
                      مشرف وحدة الإرشاد والتطوير المهني والتوظيف
                    </div>
                    <div className="text-sm font-bold text-[#1b4329] font-kufi pt-1">
                      {deanConfig.unitHeadName || 'د. إبراهيم بن عبد الله الحسين'}
                    </div>
                    <div className="h-16 flex items-center justify-center">
                      <div className="border-b-2 border-dashed border-[#a4874b]/60 w-44 text-[11px] text-slate-400 font-mono">
                        (التوقيع الإلكتروني المعتمد)
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      التاريخ: {new Date().toLocaleDateString('ar-SA')}
                    </div>
                  </div>

                  {/* College Dean Signature Block */}
                  <div className="bg-[#faf6ee]/70 p-5 rounded-2xl border border-[#a4874b]/30 text-center space-y-3 relative">
                    <div className="text-xs font-bold text-slate-700 font-kufi">
                      {deanConfig.deanTitle || 'الرئيس التنفيذي للكلية التطبيقية'}
                    </div>
                    <div className="text-sm font-bold text-[#1b4329] font-kufi pt-1">
                      {deanConfig.deanName || 'أ.د. شادي بن عبد الله الشويعر'}
                    </div>
                    <div className="h-16 flex items-center justify-center">
                      <div className="border-b-2 border-dashed border-[#a4874b]/60 w-44 text-[11px] text-slate-400 font-mono">
                        (الختم والاعتماد الرسمي)
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      جامعة المجمعة • الكلية التطبيقية
                    </div>
                  </div>

                </div>

                {/* Footer Stamp Note */}
                <div className="mt-8 text-center text-[11px] text-slate-400 font-kufi">
                  {deanConfig.officialSealText || 'وثيقة رسمية صادرة ومعتمدة إلكترونياً من الكلية التطبيقية بجامعة المجمعة'}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL: ADD PROFESSOR TO WHITELIST */}
      {isAddFacultyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-[#143520] to-[#1b4329] text-white p-5 border-b border-[#a4874b]/30">
              <h3 className="text-base font-bold font-kufi flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#e5d4a6]" />
                <span>إضافة عضو هيئة تدريس إلى القائمة البيضاء المعتمدة</span>
              </h3>
              <p className="text-xs text-slate-200 font-cairo mt-1">
                يتيح للأستاذ الدخول الفوري للبوابة عبر البريد الجامعي والرمز السري (Passcode)
              </p>
            </div>

            <form onSubmit={handleSaveFaculty} className="p-6 space-y-4 text-xs font-cairo">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">اللقب الأكاديمي:</label>
                  <select
                    value={facultyTitle}
                    onChange={(e) => setFacultyTitle(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value="دكتور">دكتور</option>
                    <option value="أستاذ مساعد">أستاذ مساعد</option>
                    <option value="أستاذ مشارك">أستاذ مشارك</option>
                    <option value="أستاذ دكتور">أستاذ دكتور</option>
                    <option value="محاضر">محاضر</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الاسم الثلاثي أو الرباعي:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد العزيز بن فهد العبد الكريم"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">البريد الإلكتروني الجامعي:</label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="username@mu.edu.sa"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">رقم الجوال للتواصل:</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    value={facultyPhone}
                    onChange={(e) => setFacultyPhone(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">القسم الأكاديمي:</label>
                  <select
                    value={facultyDept}
                    onChange={(e) => setFacultyDept(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    {DEPARTMENT_OPTIONS.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">المقر / الفرع:</label>
                  <select
                    value={facultyCampus}
                    onChange={(e) => setFacultyCampus(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    {CAMPUS_OPTIONS.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الرقم الوظيفي الجامعي:</label>
                  <input
                    type="text"
                    placeholder="مثال: MU-48192"
                    value={facultyEmpId}
                    onChange={(e) => setFacultyEmpId(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الرمز السري (Passcode):</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="MU@2026"
                    value={facultyPasscode}
                    onChange={(e) => setFacultyPasscode(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-left font-bold focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddFacultyModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold cursor-pointer font-kufi shadow-2xs transition-colors"
                >
                  حفظ في القائمة البيضاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFESSOR IN WHITELIST */}
      {isEditFacultyModalOpen && facultyToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-[#143520] to-[#1b4329] text-white p-5 border-b border-[#a4874b]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-kufi flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#e5d4a6]" />
                  <span>تعديل بيانات عضو هيئة التدريس</span>
                </h3>
                <span className="text-[11px] font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-[#e5d4a6] border border-[#e5d4a6]/30">
                  {facultyToEdit.employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-cairo mt-1">
                تحديث الاسم، اللقب الأكاديمي، البريد، الرمز السري، والقسم والمقر
              </p>
            </div>

            <form onSubmit={handleSaveEditedFaculty} className="p-6 space-y-4 text-xs font-cairo">
              {/* Status Toggle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 font-kufi">حالة الحساب والتصريح:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFacultyStatus('active')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editFacultyStatus === 'active'
                        ? 'bg-[#1b4329] text-white border-[#143520] shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>مصرح ونشط</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFacultyStatus('inactive')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editFacultyStatus === 'inactive'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-200"></span>
                    <span>معطل وموقوف</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">اللقب الأكاديمي:</label>
                  <select
                    value={editFacultyTitle}
                    onChange={(e) => setEditFacultyTitle(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value="دكتور">دكتور</option>
                    <option value="أستاذ مساعد">أستاذ مساعد</option>
                    <option value="أستاذ مشارك">أستاذ مشارك</option>
                    <option value="أستاذ دكتور">أستاذ دكتور</option>
                    <option value="محاضر">محاضر</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الاسم الثلاثي أو الرباعي:</label>
                  <input
                    type="text"
                    required
                    value={editFacultyName}
                    onChange={(e) => setEditFacultyName(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">البريد الإلكتروني الجامعي:</label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={editFacultyEmail}
                    onChange={(e) => setEditFacultyEmail(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">رقم الجوال للتواصل:</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={editFacultyPhone}
                    onChange={(e) => setEditFacultyPhone(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">القسم الأكاديمي:</label>
                  <select
                    value={editFacultyDept}
                    onChange={(e) => setEditFacultyDept(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    {DEPARTMENT_OPTIONS.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">المقر / الفرع:</label>
                  <select
                    value={editFacultyCampus}
                    onChange={(e) => setEditFacultyCampus(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    {CAMPUS_OPTIONS.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الرقم الوظيفي الجامعي:</label>
                  <input
                    type="text"
                    value={editFacultyEmpId}
                    onChange={(e) => setEditFacultyEmpId(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1b4329] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الرمز السري (Passcode):</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editFacultyPasscode}
                    onChange={(e) => setEditFacultyPasscode(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-left font-bold focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditFacultyModalOpen(false);
                    setFacultyToEdit(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold cursor-pointer font-kufi shadow-2xs transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD NEW WORKSHOP COURSE */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5">
              <h3 className="text-base font-bold font-kufi">إنشاء حقيبة تدريبية جديدة</h3>
              <p className="text-xs text-blue-100 font-cairo">
                إضافة عنوان الورشة ومخرجات التعلم لتظهر في دليل أعضاء هيئة التدريس
              </p>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 text-xs font-cairo">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">رمز الحقيبة:</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">عنوان الورشة التدريبية:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الذكاء الاصطناعي في إعداد السير الذاتية"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">التصنيف المهني:</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300"
                >
                  <option value="career_readiness">التدريب والجاهزية لسوق العمل</option>
                  <option value="cv_portfolio">السيرة الذاتية والهوية المهنية (ATS)</option>
                  <option value="interview_skills">المقابلات الوظيفية وتقنية STAR</option>
                  <option value="soft_skills">المهارات الناعمة والذكاء العاطفي</option>
                  <option value="digital_tools">الأدوات الرقمية ولينكد إن</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">النبذة والهدف العام:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="وصف مختصر لأهمية الورشة لطلبة الكلية التطبيقية..."
                  value={courseOverview}
                  onChange={(e) => setCourseOverview(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">مخرجات التعلم (مخرج في كل سطر):</label>
                <textarea
                  rows={3}
                  placeholder="1. فهم معايير السوق&#10;2. تطبيق الأدوات العملية"
                  value={courseOutcomes}
                  onChange={(e) => setCourseOutcomes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold cursor-pointer font-kufi transition-colors"
                >
                  حفظ ونشر الحقيبة
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION FOR WORKSHOP SESSION */}
      {isDeleteModalOpen && sessionToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-red-50 border-b border-red-100 p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-red-950 font-kufi">تأكيد حذف ورشة العمل</h3>
                  <span className={`text-[10px] font-bold font-kufi px-2 py-0.5 rounded-full ${
                    sessionToDelete.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {sessionToDelete.status === 'completed' ? 'ورشة منفذة' : 'ورشة مجدولة'}
                  </span>
                </div>
                <p className="text-xs text-red-700 font-cairo mt-1">
                  هل أنت متأكد من رغبتك في حذف هذه الورشة من النظام وجدول الورش الحية؟
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3 font-cairo text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">اسم الورشة:</span>
                  <span className="font-bold text-slate-900 font-kufi text-xs">{sessionToDelete.courseTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-500 block text-[11px]">عضو هيئة التدريس:</span>
                    <span className="font-bold text-slate-800">{sessionToDelete.professorTitle} {sessionToDelete.professorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">الموعد والتوقيت:</span>
                    <span className="font-bold text-slate-800">{sessionToDelete.date} ({sessionToDelete.timeSlot})</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">القسم والمقر:</span>
                    <span className="font-medium text-slate-700">{sessionToDelete.department} • {sessionToDelete.campus}</span>
                  </div>
                  {sessionToDelete.status === 'completed' && (
                    <div className="text-left">
                      <span className="text-slate-500 block text-[11px]">عدد الحضور:</span>
                      <span className="font-bold text-emerald-800">{sessionToDelete.studentCountActual || sessionToDelete.studentCountTarget} طالب</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>
                  {sessionToDelete.status === 'completed'
                    ? 'تنبيه: حذف ورشة منفذة سيؤدي لتحديث إحصائيات الحضور والشهادات المرتبطة بها.'
                    : 'سيتم إزالة الورشة من الجدول ولن يتم احتسابها ضمن مؤشرات التنفيذ الحالية.'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 p-4 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                id="btn-confirm-delete-session"
                onClick={handleConfirmDeleteSession}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer font-kufi transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تأكيد الحذف النهائي</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: EDIT WORKSHOP SESSION */}
      {isEditSessionModalOpen && sessionToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-[#143520] to-[#1b4329] text-white p-5 border-b border-[#a4874b]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-kufi flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#e5d4a6]" />
                  <span>تعديل تفاصيل ورشة العمل</span>
                </h3>
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#e5d4a6]">
                  {sessionToEdit.courseCode}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-cairo mt-1">
                تعديل حالة الورشة، التاريخ والتوقيت، القاعة التدريبية، وأعداد الحضور والمستهدفين
              </p>
            </div>

            <form onSubmit={handleSaveEditedSession} className="p-5 sm:p-6 space-y-4 text-xs font-cairo">
              
              {/* Readonly Info Banner */}
              <div className="p-3 bg-[#f0f7f2] border border-[#c8e2d1] rounded-xl text-slate-800">
                <div className="font-bold text-xs font-kufi text-[#143520]">{sessionToEdit.courseTitle}</div>
                <div className="text-[11px] text-[#1b4329] mt-0.5 flex items-center justify-between">
                  <span>المحاضر: {sessionToEdit.professorTitle} {sessionToEdit.professorName}</span>
                  <span>{sessionToEdit.department} ({sessionToEdit.campus})</span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">حالة الورشة (Status):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('scheduled')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editStatus === 'scheduled'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>مجدولة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('completed')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editStatus === 'completed'
                        ? 'bg-[#1b4329] text-white border-[#143520] shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>منفذة</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">تاريخ الورشة (Date):</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الفترة والتوقيت (Time Slot):</label>
                  <select
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value="09:00 ص - 10:00 ص">09:00 ص - 10:00 ص</option>
                    <option value="10:00 ص - 11:00 ص">10:00 ص - 11:00 ص</option>
                    <option value="11:00 ص - 12:00 م">11:00 ص - 12:00 م</option>
                    <option value="12:00 م - 01:00 م">12:00 م - 01:00 م</option>
                    <option value="01:00 م - 02:00 م">01:00 م - 02:00 م</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">القاعة التدريبية / المقر:</label>
                  <input
                    type="text"
                    required
                    value={editHallName}
                    onChange={(e) => setEditHallName(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                    placeholder="مثال: قاعة التدريب الذكي (204)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">طريقة التقديم:</label>
                  <select
                    value={editDeliveryMode}
                    onChange={(e) => setEditDeliveryMode(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value="in_person">حضوري بالقاعة</option>
                    <option value="remote">عن بعد (بلاك بورد / تيمز)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">عدد الطلاب المستهدفين:</label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    required
                    value={editStudentCountTarget}
                    onChange={(e) => setEditStudentCountTarget(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  />
                </div>

                {editStatus === 'completed' && (
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1 font-kufi">عدد الطلاب الحاضرين فعلياً:</label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      required
                      value={editStudentCountActual}
                      onChange={(e) => setEditStudentCountActual(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50/50 font-bold text-emerald-950 focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">ملاحظات تنظيمية إضافية:</label>
                <textarea
                  rows={2}
                  value={editSessionNotes}
                  onChange={(e) => setEditSessionNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  placeholder="أي تعليمات أو ملاحظات خاصة بالجلسة..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSessionModalOpen(false);
                    setSessionToEdit(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  id="btn-save-edit-session"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold cursor-pointer font-kufi transition-colors shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: EDIT WORKSHOP COURSE CONTENT & MATERIALS */}
      {isEditCourseModalOpen && courseToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-[#143520] to-[#1b4329] text-white p-5 border-b border-[#a4874b]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-kufi flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#e5d4a6]" />
                  <span>تعديل محتوى الحقيبة التدريبية</span>
                </h3>
                <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded text-[#e5d4a6] font-bold">
                  {courseToEdit.code}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-cairo mt-1">
                تحديث عنوان الحقيبة، الأهداف ومخرجات التعلم، والمدة الزمنية والمواد المرفقة
              </p>
            </div>

            <form onSubmit={handleSaveEditedCourse} className="p-5 sm:p-6 space-y-4 text-xs font-cairo max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">حالة الحقيبة وإتاحتها للحجز:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditCourseIsActive(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      editCourseIsActive
                        ? 'bg-[#1b4329] text-white border-[#143520] shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>نشطة ومتاحة للحجز</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditCourseIsActive(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-kufi cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      !editCourseIsActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-200"></span>
                    <span>مسودة / تحت التعديل</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">عنوان الورشة / الحقيبة التدريبية:</label>
                <input
                  type="text"
                  required
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  placeholder="عنوان الحقيبة التدريبية..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">المجال / التصنيف المهني:</label>
                  <select
                    value={editCourseCategory}
                    onChange={(e) => setEditCourseCategory(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value="career_readiness">التدريب والجاهزية لسوق العمل</option>
                    <option value="cv_portfolio">السيرة الذاتية والهوية المهنية (ATS)</option>
                    <option value="interview_skills">المقابلات الوظيفية وتقنية STAR</option>
                    <option value="soft_skills">المهارات الناعمة والذكاء العاطفي</option>
                    <option value="digital_tools">الأدوات الرقمية ولينكد إن</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">المدة الزمنية التقديرية (بالدقائق):</label>
                  <select
                    value={editCourseDuration}
                    onChange={(e) => setEditCourseDuration(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  >
                    <option value={45}>45 دقيقة (جلسة سريعة)</option>
                    <option value={60}>60 دقيقة (جلسة قياسية - موصى بها)</option>
                    <option value={90}>90 دقيقة (ورشة معمقة مع تطبيق)</option>
                    <option value={120}>120 دقيقة (ورشة شاملة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">الجمهور والطلبة المستهدفين:</label>
                <input
                  type="text"
                  value={editCourseTargetAudience}
                  onChange={(e) => setEditCourseTargetAudience(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  placeholder="مثال: طلبة الدبلومات التطبيقية والمتوقع تخرجهم والمتدربون الميدانيون"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">النبذة والهدف العام من الحقيبة:</label>
                <textarea
                  rows={3}
                  required
                  value={editCourseOverview}
                  onChange={(e) => setEditCourseOverview(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium leading-relaxed focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  placeholder="اكتب شرحاً شاملاً لأهمية الحقيبة وأبرز المحاور المطروحة..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">مخرجات التعلم المستهدفة (مخرج تعليمي في كل سطر):</label>
                <textarea
                  rows={4}
                  value={editCourseOutcomes}
                  onChange={(e) => setEditCourseOutcomes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-medium leading-relaxed focus:ring-2 focus:ring-[#1b4329] focus:outline-none"
                  placeholder="1. فهم معايير السوق&#10;2. تطبيق الأدوات العملية&#10;3. اجتياز الفحص الآلي"
                />
              </div>

              {/* Course Materials Info */}
              <div className="p-3.5 bg-[#fcf9f2] border border-[#e5d4a6] rounded-xl space-y-3">
                <div className="font-bold text-xs font-kufi text-[#785e2b] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#a4874b]" />
                  <span>تحديث مسميات المواد التدريبية المرفقة:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم ملف العرض التقديمي (PPTX):</label>
                    <input
                      type="text"
                      value={editCoursePptxName}
                      onChange={(e) => setEditCoursePptxName(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم دليل الأنشطة / القالب (Word/PDF):</label>
                    <input
                      type="text"
                      value={editCourseDocxName}
                      onChange={(e) => setEditCourseDocxName(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditCourseModalOpen(false);
                    setCourseToEdit(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  id="btn-save-edit-course"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold cursor-pointer font-kufi transition-colors shadow-xs"
                >
                  حفظ وتحديث الحقيبة
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION FOR COURSE */}
      {isDeleteCourseModalOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-red-50 border-b border-red-100 p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-950 font-kufi">تأكيد حذف الحقيبة التدريبية</h3>
                <p className="text-xs text-red-700 font-cairo mt-0.5">
                  هل أنت متأكد من رغبتك في إزالة هذه الحقيبة من قائمة الحقائب المعتمدة؟
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3 font-cairo text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    {courseToDelete.code}
                  </span>
                  <span className="text-slate-500">{courseToDelete.durationMinutes} دقيقة</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 font-kufi text-xs block mt-1">{courseToDelete.title}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5 line-clamp-2">{courseToDelete.shortDescription}</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>لن يتمكن أعضاء هيئة التدريس من اختيار هذه الحقيبة للورش الجديدة.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 p-4 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteCourseModalOpen(false);
                  setCourseToDelete(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-kufi text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                id="btn-confirm-delete-course"
                onClick={handleConfirmDeleteCourse}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer font-kufi transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تأكيد حذف الحقيبة</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: FACULTY PREVIEW MODE (معاينة كـ عضو هيئة تدريس) */}
      {isCoursePreviewModalOpen && courseToPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp font-cairo">
            
            {/* Faculty Preview Top Header Banner */}
            <div className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white p-5 sm:p-6 relative border-b border-[#a4874b]/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-[#a4874b]/20 text-[#e5d4a6] px-2.5 py-0.5 rounded-full border border-[#a4874b]/40">
                      {courseToPreview.code}
                    </span>
                    <span className="text-xs font-semibold bg-emerald-950/70 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {courseToPreview.categoryLabel}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      courseToPreview.isActive !== false
                        ? 'bg-emerald-800 text-emerald-100 border-emerald-400/40'
                        : 'bg-amber-800 text-amber-100 border-amber-400/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${courseToPreview.isActive !== false ? 'bg-emerald-300' : 'bg-amber-300'}`}></span>
                      <span>{courseToPreview.isActive !== false ? 'متاحة للحجز' : 'مسودة غير مفعلة'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-kufi text-white leading-snug">
                    {courseToPreview.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCoursePreviewModalOpen(false);
                    setCourseToPreview(null);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="إغلاق المعاينة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulation Mode Indicator */}
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 flex items-center gap-2.5 text-xs text-emerald-100">
                <Eye className="w-4 h-4 text-[#e5d4a6] shrink-0" />
                <span>
                  <strong>وضع المعاينة كـ عضو هيئة تدريس:</strong> هكذا تظهر تفاصيل الحقيبة، خطة التيسير، ومواد البوربوينت للأستاذ الجامعي قبل اعتمادها وحجزها للطلاب.
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1b4329]" />
                <span>المدة الزمنية المقترحة: <strong className="font-kufi text-slate-900">{courseToPreview.durationMinutes} دقيقة</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#8f743c]" />
                <span>العدد المستهدف: <strong className="font-kufi text-slate-900">{courseToPreview.recommendedStudentsMin} - {courseToPreview.recommendedStudentsMax} طالباً</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#1b4329]" />
                <span>المواد المرفقة: <strong className="font-kufi text-slate-900">{courseToPreview.materials.length} ملفات جاهزة</strong></span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {/* 1. Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 font-kufi uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#1b4329]" />
                  <span>الهدف العام ونبذة الحقيبة التدريبية</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {courseToPreview.fullOverview || courseToPreview.shortDescription}
                </div>
              </div>

              {/* 2. Learning Outcomes */}
              {courseToPreview.learningOutcomes && courseToPreview.learningOutcomes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 font-kufi uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#8f743c]" />
                    <span>مخرجات التعلم والكفايات المهنية المستهدفة</span>
                  </h4>
                  <div className="space-y-2">
                    {courseToPreview.learningOutcomes.map((outcome, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-[#f0f7f2]/70 p-3 rounded-xl border border-[#c8e2d1]"
                      >
                        <CheckCircle className="w-4 h-4 text-[#1b4329] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Facilitation Steps */}
              {courseToPreview.facilitationGuide && courseToPreview.facilitationGuide.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 font-kufi uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-[#1b4329]" />
                      <span>خطة تيسير الجلسة وتوزيع التوقيت (Facilitation Guide)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      إجمالي {courseToPreview.durationMinutes} دقيقة
                    </span>
                  </div>

                  <div className="space-y-3">
                    {courseToPreview.facilitationGuide.map((step) => (
                      <div 
                        key={step.stepNumber} 
                        className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-[#1b4329]/40 transition-all shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#1b4329] text-white text-xs font-bold flex items-center justify-center font-kufi">
                              {step.stepNumber}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-kufi">{step.title}</h5>
                          </div>
                          <span className="text-[11px] font-semibold text-[#1b4329] bg-[#f0f7f2] px-2.5 py-0.5 rounded-full border border-[#c8e2d1]">
                            {step.durationMin} دقيقة
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2.5 pr-8">
                          {step.description}
                        </p>
                        <div className="text-[11px] text-[#785e2b] bg-[#faf6ee] p-2.5 rounded-xl border border-[#a4874b]/30 flex items-start gap-2 mr-8">
                          <span className="font-bold shrink-0 font-kufi">💡 توجيه للمحاضر:</span>
                          <span>{step.trainerTip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Teaching Packages & Downloadable Materials */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 font-kufi uppercase tracking-wider">
                  <Download className="w-4 h-4 text-[#1b4329]" />
                  <span>الحقيبة التدريبية والمواد القابلة للتحميل (Teaching Packages)</span>
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {courseToPreview.materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-[#f0f7f2]/50 hover:border-[#1b4329]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-2xs ${
                          mat.type === 'pptx'
                            ? 'bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30'
                            : mat.type === 'pdf'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]'
                        }`}>
                          {mat.type}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#1b4329] font-kufi">
                            {mat.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{mat.description}</span>
                            <span className="font-mono text-slate-400 font-medium">({mat.size})</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(`حقيبة تدريبية معتمدة من الكلية التطبيقية بجامعة المجمعة: ${mat.title} - ${courseToPreview.title}`)}`}
                        download={`${courseToPreview.code}-${mat.title}.${mat.type}`}
                        className="px-3 py-1.5 bg-white group-hover:bg-[#1b4329] group-hover:text-white border border-slate-300 group-hover:border-[#1b4329] text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0 font-kufi shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل الملف</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 font-kufi">
              <button
                type="button"
                onClick={() => {
                  setIsCoursePreviewModalOpen(false);
                  setCourseToPreview(null);
                }}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق المعاينة
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const selected = courseToPreview;
                    setIsCoursePreviewModalOpen(false);
                    setCourseToPreview(null);
                    handleOpenEditCourseModal(selected);
                  }}
                  className="px-4 py-2.5 bg-[#fcf9f2] hover:bg-[#f7f1e1] text-[#785e2b] border border-[#e5d4a6] rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit className="w-4 h-4 text-[#a4874b]" />
                  <span>تعديل محتوى هذه الحقيبة</span>
                </button>

                <div className="text-xs text-[#1b4329] bg-[#f0f7f2] px-3.5 py-2.5 rounded-xl border border-[#c8e2d1] font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#1b4329]" />
                  <span>معاينة مكتملة ومعتمدة</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SUPERVISOR APPROVE SESSION & ISSUE CERTIFICATE */}
      {isApproveModalOpen && sessionToApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-cairo animate-scaleUp">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#143520] to-[#1b4329] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] text-[#e5d4a6] flex items-center justify-center border border-[#e5d4a6]/30 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-kufi">
                    اعتماد تنفيذ الورشة وإصدار الشهادة
                  </h3>
                  <p className="text-xs text-emerald-200/80 font-cairo">
                    التدقيق النهائي واحتساب النقاط الأكاديمية وإصدار الشهادة الرقمية
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setSessionToApprove(null);
                }}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Workshop Summary Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 font-kufi">الورشة المستهدفة:</div>
                <div className="font-bold text-sm text-slate-900 font-kufi">{sessionToApprove.courseTitle}</div>
                <div className="flex flex-wrap items-center gap-2 text-slate-600 font-cairo pt-1 border-t border-slate-200/60 mt-1">
                  <span>المحاضر: <strong>{sessionToApprove.professorTitle} {sessionToApprove.professorName}</strong></span>
                  <span>•</span>
                  <span>القسم: {sessionToApprove.department}</span>
                  <span>•</span>
                  <span>المقر: {sessionToApprove.campus}</span>
                </div>
              </div>

              {/* Number of actual students */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 font-kufi">
                  عدد الطلاب الحاضرين المعتمد (Actual Students):
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={approveStudentCount}
                  onChange={(e) => setApproveStudentCount(Math.max(1, Number(e.target.value)))}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] focus:border-[#1b4329] text-sm font-bold font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  المستهدف الأصلي: {sessionToApprove.studentCountTarget} طالب • المرفوع من الأستاذ: {sessionToApprove.studentCountActual || sessionToApprove.studentCountTarget} طالب
                </p>
              </div>

              {/* Supervisor Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 font-kufi">
                  ملاحظات أو توجيهات المشرف (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={approveSupervisorNotes}
                  onChange={(e) => setApproveSupervisorNotes(e.target.value)}
                  placeholder="ملاحظات الاعتماد أو توثيق استلام كشف الحضور..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] text-xs resize-none"
                />
              </div>

              {/* Points calculation summary */}
              <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#a4874b]/30 space-y-1 text-slate-800">
                <div className="flex items-center justify-between font-bold text-xs font-kufi text-[#785e2b]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#a4874b]" />
                    <span>النقاط الأكاديمية المستحقة:</span>
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#1b4329]">
                    +{100 + (approveStudentCount * 5)} نقطة
                  </span>
                </div>
                <p className="text-[11px] text-[#8f743c]">
                  (100 نقطة أساسية لتنفيذ الورشة + 5 نقاط لكل طالب حاضر معتمد)
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 font-kufi">
              <button
                type="button"
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setSessionToApprove(null);
                }}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                <span>اعتماد وإصدار الشهادة فوراً</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SUPERVISOR REJECT / REQUEST MODIFICATION */}
      {isRejectModalOpen && sessionToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-cairo animate-scaleUp">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-700 text-white flex items-center justify-center border border-rose-600 shadow-xs">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-kufi">
                    طلب تعديل / إعادة مراجعة الورشة
                  </h3>
                  <p className="text-xs text-rose-200/90 font-cairo">
                    إرسال ملاحظات التدقيق إلى عضو هيئة التدريس لإعادة ضبط البيانات
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSessionToReject(null);
                }}
                className="p-1.5 text-rose-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Workshop Summary Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 font-kufi">الورشة:</div>
                <div className="font-bold text-sm text-slate-900 font-kufi">{sessionToReject.courseTitle}</div>
                <div className="text-slate-600 font-cairo">
                  المحاضر: <strong>{sessionToReject.professorTitle} {sessionToReject.professorName}</strong> ({sessionToReject.department})
                </div>
              </div>

              {/* Rejection reason */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 font-kufi">
                  سبب الإعادة / ملاحظات المشرف المطلوبة من الأستاذ:
                </label>
                <textarea
                  rows={4}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="مثال: يرجى تزويدنا بكشف الحضور الفعلي الموقع، أو التحقق من عدد الحضور المسجل، ثم إعادة الضغط على تأكيد التنفيذ..."
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs resize-none font-cairo"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ℹ️ ستظهر هذه الملاحظات في لوحة تحكم عضو هيئة التدريس مع إتاحة خيار إعادة مراجعة وتأكيد التنفيذ بعد تصحيح المطلوب.
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 font-kufi">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setSessionToReject(null);
                }}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                <span>إرسال الملاحظات وإعادة الطلب</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: EDIT STRATEGIC TARGETS & PLAN OBJECTIVES */}
      {isEditTargetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-cairo animate-scaleUp">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#235334] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] text-[#e5d4a6] flex items-center justify-center border border-[#e5d4a6]/30 shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-kufi">
                    تعديل مستهدفات المؤشرات الاستراتيجية
                  </h3>
                  <p className="text-xs text-emerald-200/80 font-cairo">
                    تحديث الأهداف الكمية للطلاب والورش لإعادة حساب نسب الإنجاز
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditTargetsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveTargets} className="p-5 sm:p-6 space-y-5 text-xs">
              
              {/* Field 1: Target Students */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold font-kufi text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#1b4329]" />
                    <span>إجمالي المستهدف من الطلاب (طالباً وطالبة):</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    الفعلي: {totalStudentsReached} طالب
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    step="5"
                    value={tempTargetStudents}
                    onChange={(e) => setTempTargetStudents(Math.max(1, Number(e.target.value)))}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] focus:border-[#1b4329] text-sm font-bold font-mono text-slate-900 bg-white shadow-2xs"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    طالب
                  </div>
                </div>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-kufi">اقتراحات سريعة:</span>
                  {[200, 320, 450, 600, 1000].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTempTargetStudents(num)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        tempTargetStudents === num
                          ? 'bg-[#1b4329] text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Live Calculated Percentage Preview */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60 font-cairo">
                  <span>نسبة الإنجاز المحسوبة فورياً:</span>
                  <span className="font-bold text-[#1b4329] font-mono">
                    {Math.round((totalStudentsReached / (tempTargetStudents || 1)) * 100)}% من المستهدف
                  </span>
                </div>
              </div>

              {/* Field 2: Planned Workshops */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold font-kufi text-xs flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-emerald-700" />
                    <span>إجمالي الورش المخطط لها (ورشة تدريبية):</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    المنفذ: {completedSessions.length} ورشة
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="1"
                    value={tempPlannedWorkshops}
                    onChange={(e) => setTempPlannedWorkshops(Math.max(1, Number(e.target.value)))}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-sm font-bold font-mono text-slate-900 bg-white shadow-2xs"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ورشة
                  </div>
                </div>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-kufi">اقتراحات سريعة:</span>
                  {[10, 15, 20, 25, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTempPlannedWorkshops(num)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        tempPlannedWorkshops === num
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Live Calculated Percentage Preview */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60 font-cairo">
                  <span>نسبة إنجاز الخطة المحسوبة فورياً:</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {Math.round((completedSessions.length / (tempPlannedWorkshops || 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Informative Guidance */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  يتم حفظ هذه المستهدفات في النظام وتحديث كافة الرسوم البيانية ونسب التقدم فوراً. يمكنك في أي وقت استعادة الحساب التلقائي من مجموع جلسات النظام.
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 font-kufi">
                <button
                  type="button"
                  onClick={handleResetTargets}
                  className="px-3 py-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="استعادة القيم الافتراضية المحسوبة تلقائياً"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة التلقائي</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditTargetsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-[#e5d4a6]" />
                    <span>حفظ وتحديث المستهدفات</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        جامعة المجمعة • الكلية التطبيقية • وحدة الإرشاد والتطوير المهني والتوظيف © {new Date().getFullYear()}
      </footer>

    </div>
  );
};
