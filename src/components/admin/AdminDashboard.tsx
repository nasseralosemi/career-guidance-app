import React, { useState } from 'react';
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
  Edit,
  MessageSquare,
  KeyRound,
  Eye,
  Layers,
  X
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
  const [adminTab, setAdminTab] = useState<'analytics' | 'approvals' | 'sessions' | 'whitelist' | 'courses' | 'settings'>('analytics');
  
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

  // Analytics Computations
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const pendingApprovalSessions = sessions.filter((s) => s.status === 'pending_approval');
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled');
  const rejectedSessions = sessions.filter((s) => s.status === 'rejected');
  const activeFacultyCount = new Set(sessions.map((s) => s.professorEmail)).size;
  const totalStudentsReached = completedSessions.reduce((sum, s) => sum + (s.studentCountActual || s.studentCountTarget), 0);
  const targetStudentsPlanned = sessions.reduce((sum, s) => sum + s.studentCountTarget, 0);
  const totalCertificatesIssued = completedSessions.filter((s) => s.certificateIssued).length;

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
      
      {/* Top Admin Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <LogoBranding size="md" />
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300/80 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>لوحة القيادة الإدارية والتحليلية</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[#f0f7f2] hover:bg-[#e2f0e7] text-[#1b4329] border border-[#c8e2d1] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="تصدير تقرير إكسل متكامل"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#1b4329]" />
              <span className="hidden sm:inline">تصدير التقرير (Excel/CSV)</span>
              <span className="sm:hidden">تصدير</span>
            </button>

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

      {/* Admin Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 py-2">
            <button
              onClick={() => setAdminTab('analytics')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'analytics'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>المؤشرات والتحليلات</span>
            </button>

            <button
              onClick={() => setAdminTab('approvals')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                adminTab === 'approvals'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-[#e5d4a6]" />
              <span>طلبات الاعتماد والتدقيق</span>
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
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                adminTab === 'sessions'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>متابعة الورش ({sessions.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('whitelist')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'whitelist'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>القائمة البيضاء ({whitelist.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('courses')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'courses'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الحقائب التدريبية ({courses.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'settings'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>الاعتماد والشهادات</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>مسؤول النظام: {deanConfig.unitHeadName}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
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

            {/* Top KPI Cards - Enhanced Uniform Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Card 1: Completed Workshops */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">الورش المنفذة فعلياً</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-kufi text-emerald-950 tracking-tight">
                      {completedSessions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-cairo">
                      من إجمالي {totalSessions} ورشة
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-cairo mb-1.5">
                    <span>نسبة إنجاز الخطة</span>
                    <span className="font-bold text-emerald-800">
                      {totalSessions ? Math.round((completedSessions.length / totalSessions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalSessions ? (completedSessions.length / totalSessions) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card 2: Students Reached */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#1b4329] to-[#2d6a4f]"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-kufi">إجمالي الطلاب المستفيدين</span>
                    <div className="w-10 h-10 rounded-xl bg-[#f0f7f2] text-[#1b4329] flex items-center justify-center border border-[#c8e2d1] shadow-2xs">
                      <Users className="w-5 h-5" />
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
                    <span>المستهدف: {targetStudentsPlanned} طالب</span>
                    <span className="font-bold text-[#1b4329]">
                      {Math.round((totalStudentsReached / (targetStudentsPlanned || 1)) * 100)}% من المستهدف
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1b4329] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalStudentsReached / (targetStudentsPlanned || 1)) * 100)}%` }}
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
                      من أصل {whitelist.length} بالقائمة
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
            <div className="glass-card rounded-2xl border border-slate-200 shadow-xs bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#f8faf9] text-slate-700 font-bold border-b border-slate-200 font-kufi">
                    <tr>
                      <th className="p-3.5">الورشة التدريبية</th>
                      <th className="p-3.5">عضو هيئة التدريس</th>
                      <th className="p-3.5">القسم والمقر</th>
                      <th className="p-3.5">الموعد والتوقيت</th>
                      <th className="p-3.5">الطلاب (المستهدف / الفعلي)</th>
                      <th className="p-3.5">الحالة</th>
                      <th className="p-3.5">الشهادة المعتمدة</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-cairo">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-medium font-cairo">
                          لا توجد ورش عمل مطابقة لمعايير البحث الحالية
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((session) => {
                        const isCompleted = session.status === 'completed';
                        const isPendingApproval = session.status === 'pending_approval';
                        const isRejected = session.status === 'rejected';

                        return (
                          <tr key={session.id} className="hover:bg-[#f0f7f2]/50 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                              <div className="truncate font-kufi">{session.courseTitle}</div>
                              <span className="text-[10px] text-slate-400 font-mono font-normal">{session.courseCode}</span>
                            </td>
                            
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800 font-kufi">{session.professorTitle} {session.professorName}</div>
                              <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{session.professorEmail}</div>
                            </td>

                            <td className="p-3.5">
                              <div className="text-slate-800 font-medium">{session.department}</div>
                              <div className="text-[11px] text-slate-500">{session.campus}</div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{session.date}</div>
                              <div className="text-[11px] text-slate-500">{session.timeSlot}</div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold">
                                {isCompleted ? (
                                  <span className="text-emerald-800 font-kufi">{session.studentCountActual} حاضر (معتمد)</span>
                                ) : isPendingApproval ? (
                                  <span className="text-amber-900 font-kufi">{session.studentCountActual} حاضر (قيد التدقيق)</span>
                                ) : (
                                  <span className="text-slate-600">{session.studentCountTarget} مستهدف</span>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-kufi ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : isPendingApproval
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {isCompleted 
                                  ? 'منفذة ومعتمدة' 
                                  : isPendingApproval 
                                  ? 'بانتظار الاعتماد' 
                                  : isRejected 
                                  ? 'معادة للتعديل' 
                                  : 'مجدولة'}
                              </span>
                            </td>

                            <td className="p-3.5">
                              {session.certificateIssued ? (
                                <button
                                  onClick={() => onOpenCertificateModal(session)}
                                  className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer transition-colors"
                                >
                                  <Award className="w-3.5 h-3.5 text-[#a4874b]" />
                                  <span className="text-[11px]">معاينة الشهادة</span>
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px]">
                                  {isPendingApproval ? 'تصدر فور اعتماد المشرف' : 'تصدر فور التنفيذ'}
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {isPendingApproval ? (
                                  <>
                                    <button
                                      onClick={() => handleOpenApproveModal(session)}
                                      className="px-2.5 py-1 bg-[#1b4329] hover:bg-[#143520] text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-2xs font-kufi"
                                      title="اعتماد التنفيذ وإصدار الشهادة"
                                    >
                                      اعتماد
                                    </button>
                                    <button
                                      onClick={() => handleOpenRejectModal(session)}
                                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold cursor-pointer transition-colors font-kufi"
                                      title="طلب تعديل أو إعادة مراجعة"
                                    >
                                      تعديل
                                    </button>
                                  </>
                                ) : !isCompleted ? (
                                  <button
                                    onClick={() => handleOpenApproveModal(session)}
                                    className="px-2.5 py-1 bg-[#1b4329] hover:bg-[#143520] text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-2xs font-kufi"
                                    title="تأكيد واعتماد تنفيذ الورشة"
                                  >
                                    اعتماد
                                  </button>
                                ) : null}

                                <button
                                  onClick={() => handleOpenEditModal(session)}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[#785e2b] border border-[#a4874b]/40 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors font-kufi"
                                  title="تعديل تفاصيل ورشة العمل"
                                >
                                  <Edit className="w-3 h-3 text-[#a4874b]" />
                                  <span>تعديل</span>
                                </button>

                                <button
                                  onClick={() => handleOpenDeleteModal(session)}
                                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                  title="حذف ورشة العمل"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    alert(`تم إرسال إشعار تذكيري للبريد الجامعي للأستاذ: ${session.professorName}`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-[#1b4329] hover:bg-[#f0f7f2] border border-slate-200 rounded-lg transition-colors cursor-pointer"
                                  title="إرسال إشعار تذكيري للبريد الجامعي"
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
            <div className="glass-card rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">عضو هيئة التدريس</th>
                      <th className="p-3.5">البريد المعتمد</th>
                      <th className="p-3.5">الرمز السري (Passcode)</th>
                      <th className="p-3.5">القسم الأكاديمي</th>
                      <th className="p-3.5">المقر / الفرع</th>
                      <th className="p-3.5">الرقم الوظيفي</th>
                      <th className="p-3.5">حالة الوصول</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWhitelist.map((entry) => (
                      <tr key={entry.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{entry.title} / {entry.name}</div>
                          <div className="text-[10px] text-slate-400">أضيف بتاريخ: {entry.addedAt}</div>
                        </td>

                        <td className="p-3.5 font-mono text-slate-700" dir="ltr">
                          {entry.email}
                        </td>

                        <td className="p-3.5" dir="ltr">
                          <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 text-[11px]">
                            {entry.passcode || 'Rashad2026@'}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-800">
                          {entry.department}
                        </td>

                        <td className="p-3.5 text-slate-600">
                          {entry.campus}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-600">
                          {entry.employeeId}
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => onToggleWhitelistStatus(entry.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              entry.status === 'active'
                                ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-red-50 text-red-900 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            {entry.status === 'active' ? '✓ مصرح ونشط' : '✗ معطل'}
                          </button>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText?.(`البريد: ${entry.email}\nالرمز السري: ${entry.passcode || 'Rashad2026@'}`);
                                alert(`تم نسخ بيانات الدخول للأستاذ: ${entry.name}`);
                              }}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="نسخ بيانات الدخول"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف الأستاذ ${entry.name} من القائمة البيضاء؟`)) {
                                  onDeleteWhitelistEntry(entry.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="حذف من القائمة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

        {/* TAB 5: OFFICIAL DEAN CREDENTIALS CONFIG */}
        {adminTab === 'settings' && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-3xl space-y-6 border-r-4 border-r-amber-500">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>إعدادات الاعتماد الرسمي لشهادات الشكر والتقدير</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-cairo">
                تظهر هذه البيانات مباشرة على الشهادات الرقمية الصادرة لأعضاء هيئة التدريس بعد إنجاز ورش العمل.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('تم حفظ إعدادات الاعتماد الرسمي ورئيس الكلية التطبيقية بنجاح!');
              }}
              className="space-y-4 text-xs font-cairo"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">اسم رئيس الكلية التطبيقية (المعتمد الرسمي):</label>
                  <input
                    type="text"
                    value={deanConfig.deanName}
                    onChange={(e) => onUpdateDeanConfig({ ...deanConfig, deanName: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">الصفة الرسمية:</label>
                  <input
                    type="text"
                    value={deanConfig.deanTitle}
                    onChange={(e) => onUpdateDeanConfig({ ...deanConfig, deanTitle: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">مشرف وحدة الإرشاد والتطوير المهني:</label>
                  <input
                    type="text"
                    value={deanConfig.unitHeadName}
                    onChange={(e) => onUpdateDeanConfig({ ...deanConfig, unitHeadName: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">العام الأكاديمي والفصل:</label>
                  <input
                    type="text"
                    value={deanConfig.academicYear}
                    onChange={(e) => onUpdateDeanConfig({ ...deanConfig, academicYear: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-kufi">نص الختم الرقمي الرسمي:</label>
                <input
                  type="text"
                  value={deanConfig.officialSealText}
                  onChange={(e) => onUpdateDeanConfig({ ...deanConfig, officialSealText: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold cursor-pointer font-kufi"
                >
                  حفظ وتحديث بيانات الاعتماد
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* MODAL: ADD PROFESSOR TO WHITELIST */}
      {isAddFacultyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5">
              <h3 className="text-base font-bold font-kufi">إضافة عضو هيئة تدريس إلى القائمة البيضاء المعتمدة</h3>
              <p className="text-xs text-blue-100 font-cairo">
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
                    className="w-full py-2 px-2.5 rounded-xl border border-slate-300"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-left font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">القسم الأكاديمي:</label>
                  <select
                    value={facultyDept}
                    onChange={(e) => setFacultyDept(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300"
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
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-left font-bold"
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
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold cursor-pointer font-kufi"
                >
                  حفظ في القائمة البيضاء
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        جامعة المجمعة • الكلية التطبيقية • وحدة الإرشاد والتطوير المهني والتوظيف © {new Date().getFullYear()}
      </footer>

    </div>
  );
};
