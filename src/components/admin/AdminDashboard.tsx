import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar as CalendarIcon, 
  Award, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
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
  MessageSquare
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
  onUpdateSessionStatus: (sessionId: string, status: WorkshopSession['status']) => void;
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
  onUpdateSessionStatus,
  onOpenCertificateModal,
  onLogout,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'sessions' | 'whitelist' | 'courses' | 'settings'>('analytics');
  
  // Whitelist modal states
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('');
  const [facultyTitle, setFacultyTitle] = useState('أستاذ مساعد');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyDept, setFacultyDept] = useState(DEPARTMENT_OPTIONS[0]);
  const [facultyCampus, setFacultyCampus] = useState(CAMPUS_OPTIONS[0]);
  const [facultyEmpId, setFacultyEmpId] = useState('');

  // Course modal states
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState(`CGU-${100 + courses.length + 1}`);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<WorkshopCourse['category']>('career_readiness');
  const [courseDuration, setCourseDuration] = useState(60);
  const [courseOverview, setCourseOverview] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState('');

  // Filter states
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('all');
  const [sessionDeptFilter, setSessionDeptFilter] = useState('all');
  const [whitelistSearch, setWhitelistSearch] = useState('');

  // Analytics Computations
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled');
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
      status: 'active',
    });

    setIsAddFacultyModalOpen(false);
    setFacultyName('');
    setFacultyEmail('');
    setFacultyPhone('');
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
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="تصدير تقرير إكسل متكامل"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-700" />
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
                  ? 'bg-blue-900 text-white shadow-xs border-b-2 border-amber-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>المؤشرات والتحليلات التنفيذية</span>
            </button>

            <button
              onClick={() => setAdminTab('sessions')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                adminTab === 'sessions'
                  ? 'bg-blue-900 text-white shadow-xs border-b-2 border-amber-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>متابعة الورش الحية ({sessions.length})</span>
              {scheduledSessions.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('whitelist')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'whitelist'
                  ? 'bg-blue-900 text-white shadow-xs border-b-2 border-amber-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>إدارة القائمة البيضاء ({whitelist.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('courses')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'courses'
                  ? 'bg-blue-900 text-white shadow-xs border-b-2 border-amber-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>إدارة الحقائب التدريبية ({courses.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'settings'
                  ? 'bg-blue-900 text-white shadow-xs border-b-2 border-amber-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>بيانات الاعتماد الرسمي والشهادات</span>
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
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Completed Workshops */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs border-r-4 border-r-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">الورش المنفذة فعلياً</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-kufi text-slate-900">
                    {completedSessions.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    من إجمالي {totalSessions} ورشة مخطط لها
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${totalSessions ? (completedSessions.length / totalSessions) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Card 2: Students Reached */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs border-r-4 border-r-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">إجمالي الطلاب المستفيدين</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-kufi text-slate-900">
                    {totalStudentsReached}
                  </span>
                  <span className="text-xs text-blue-800 font-bold">
                    طالباً وطالبة
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between font-cairo">
                  <span>المستهدف الفصلي: {targetStudentsPlanned} طالب</span>
                  <span className="font-bold text-blue-900">
                    {Math.round((totalStudentsReached / (targetStudentsPlanned || 1)) * 100)}% من المستهدف
                  </span>
                </div>
              </div>

              {/* Card 3: Active Faculty */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs border-r-4 border-r-blue-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">أعضاء هيئة التدريس الفاعلون</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-kufi text-slate-900">
                    {activeFacultyCount}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    من أصل {whitelist.length} في القائمة
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 font-cairo">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>نسبة المشاركة الأكاديمية: {Math.round((activeFacultyCount / (whitelist.length || 1)) * 100)}%</span>
                </div>
              </div>

              {/* Card 4: Official Certificates */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs border-r-4 border-r-amber-400">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">شهادات الشكر المعتمدة</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-kufi text-amber-900">
                    {totalCertificatesIssued}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    معتمدة من رئيس الكلية
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 font-cairo">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>اعتماد رقمي موثق 100%</span>
                </div>
              </div>

            </div>

            {/* Department Participation Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Department Leaderboard */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-700" />
                    <span>معدلات إنجاز الورش حسب الأقسام الأكاديمية بالكلية التطبيقية</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {deptStats.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{item.dept}</span>
                        <span className="text-slate-500">
                          {item.completed} ورش منفذة • <strong className="text-blue-900">{item.students} طالب</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-blue-900' : idx === 1 ? 'bg-amber-600' : 'bg-indigo-700'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(10, (item.students / 150) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Action & System Health */}
              <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>التكامل الذكي والإشعارات</span>
                  </h3>

                  <div className="space-y-2.5 text-xs text-slate-600 font-cairo">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                      <div className="font-bold text-blue-950 font-kufi">تذكير WhatsApp الآلي</div>
                      <div className="text-[11px] text-blue-800/90 mt-0.5">
                        يتم إرسال تذكير فوري لأعضاء هيئة التدريس قبل موعد الورشة بـ 24 ساعة مع رابط الحقيبة.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="font-bold text-amber-950 font-kufi">التحقق من القائمة البيضاء</div>
                      <div className="text-[11px] text-amber-800/90 mt-0.5">
                        مفعل وصارم - يُسمح فقط لأعضاء هيئة التدريس المصرح لهم في النظام بالدخول عبر OTP.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setAdminTab('whitelist')}
                    className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>إضافة عضو هيئة تدريس للقائمة البيضاء</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LIVE SESSIONS TRACKING */}
        {adminTab === 'sessions' && (
          <div className="space-y-5">
            
            {/* Filter Bar */}
            <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="ابحث بالورشة، المحاضر، أو القسم..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="w-full py-2 px-3 pr-9 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-2.5 my-auto" />
                </div>

                <select
                  value={sessionStatusFilter}
                  onChange={(e) => setSessionStatusFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="scheduled">مجدولة</option>
                  <option value="completed">منفذة ومكتملة</option>
                </select>

                <select
                  value={sessionDeptFilter}
                  onChange={(e) => setSessionDeptFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 hidden sm:block"
                >
                  <option value="all">كافة الأقسام</option>
                  {DEPARTMENT_OPTIONS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                عرض <strong>{filteredSessions.length}</strong> ورشة عمل
              </div>
            </div>

            {/* Sessions Table */}
            <div className="glass-card rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-100">
                    {filteredSessions.map((session) => {
                      const isCompleted = session.status === 'completed';
                      return (
                        <tr key={session.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                            <div className="truncate">{session.courseTitle}</div>
                            <span className="text-[10px] text-slate-400 font-mono font-normal">{session.courseCode}</span>
                          </td>
                          
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800">{session.professorTitle} {session.professorName}</div>
                            <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{session.professorEmail}</div>
                          </td>

                          <td className="p-3.5">
                            <div className="text-slate-800">{session.department}</div>
                            <div className="text-[11px] text-slate-500">{session.campus}</div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{session.date}</div>
                            <div className="text-[11px] text-slate-500">{session.timeSlot}</div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold">
                              {isCompleted ? (
                                <span className="text-emerald-800">{session.studentCountActual} حاضر</span>
                              ) : (
                                <span className="text-slate-600">{session.studentCountTarget} مستهدف</span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-50 text-amber-900 border border-amber-300'
                            }`}>
                              {isCompleted ? 'منفذة ومكتملة' : 'مجدولة'}
                            </span>
                          </td>

                          <td className="p-3.5">
                            {session.certificateIssued ? (
                              <button
                                onClick={() => onOpenCertificateModal(session)}
                                className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 cursor-pointer"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span className="text-[11px]">معاينة الشهادة</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">تصدر فور التنفيذ</span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {!isCompleted && (
                                <button
                                  onClick={() => onUpdateSessionStatus(session.id, 'completed')}
                                  className="px-2 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded text-[11px] font-bold cursor-pointer"
                                  title="تأكيد التنفيذ يدوياً"
                                >
                                  اعتماد
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  alert(`تم إرسال تذكير فوري عبر WhatsApp ورسالة SMS للأستاذ: ${session.professorName}`);
                                }}
                                className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                                title="إرسال تذكير WhatsApp مباشر"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                  onClick={() => setIsAddFacultyModalOpen(true)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>إضافة عضو جديد للقائمة البيضاء</span>
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
                      <th className="p-3.5">البريد الجامعي المعتمد</th>
                      <th className="p-3.5">رقم الجوال (WhatsApp)</th>
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

                        <td className="p-3.5 font-mono text-slate-700" dir="ltr">
                          {entry.phone}
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
                                alert(`تم إرسال رسالة دعوة عبر WhatsApp إلى: ${entry.phone}`);
                              }}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="إرسال رابط الدخول السريع عبر WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
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
            
            <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">الحقائب التدريبية المعتمدة</h3>
                <p className="text-xs text-slate-500 mt-0.5">إضافة حقائب جديدة، تعديل أدلة الميسر، وإرفاق شرائح البوربوينت</p>
              </div>

              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>إضافة حقيبة تدريبية جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="glass-card rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between border-r-4 border-r-blue-700">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        {course.code}
                      </span>
                      <span className="text-xs text-blue-900 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {course.durationMinutes} دقيقة
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 font-cairo">{course.shortDescription}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between font-cairo">
                      <span>عدد المواد المرفقة: <strong>{course.materials.length} ملفات</strong></span>
                      <span>خطوات التيسير: <strong>{course.facilitationGuide.length} خطوات</strong></span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => alert(`تم فتح نافذة تحديث المواد التعليمية للحقيبة: ${course.code}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      تعديل المحتوى
                    </button>
                  </div>
                </div>
              ))}
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
                يتيح للأستاذ الدخول الفوري للبوابة عبر البريد الجامعي أو OTP تطبيق WhatsApp
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
                  <label className="block font-bold text-slate-700 mb-1 font-kufi">رقم الجوال (لرسائل WhatsApp):</label>
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
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold cursor-pointer font-kufi"
                >
                  حفظ ونشر الحقيبة
                </button>
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
