import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Users, 
  Download, 
  FileText, 
  ChevronRight, 
  MessageSquare, 
  Sparkles, 
  Share2, 
  LogOut, 
  ExternalLink,
  MapPin,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FacultyMember, WorkshopCourse, WorkshopSession, DeanOfficialConfig } from '../../types';
import { LogoBranding } from '../common/LogoBranding';

interface ProfessorDashboardProps {
  currentProfessor: FacultyMember;
  courses: WorkshopCourse[];
  sessions: WorkshopSession[];
  deanConfig: DeanOfficialConfig;
  onOpenBookingModal: (preselectedCourse?: WorkshopCourse) => void;
  onOpenCourseDrawer: (course: WorkshopCourse) => void;
  onOpenCertificateModal: (session: WorkshopSession) => void;
  onConfirmSessionCompletion: (sessionId: string, actualStudentCount: number, feedbackNotes: string) => void;
  onLogout: () => void;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({
  currentProfessor,
  courses,
  sessions,
  deanConfig,
  onOpenBookingModal,
  onOpenCourseDrawer,
  onOpenCertificateModal,
  onConfirmSessionCompletion,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'my_sessions' | 'certificates'>('courses');
  const [completionModalSession, setCompletionModalSession] = useState<WorkshopSession | null>(null);
  const [actualStudentsInput, setActualStudentsInput] = useState<number>(30);
  const [sessionNotesInput, setSessionNotesInput] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter sessions for this logged-in professor
  const mySessions = sessions.filter(
    (s) => s.professorId === currentProfessor.id || s.professorEmail.toLowerCase() === currentProfessor.email.toLowerCase()
  );

  const completedSessions = mySessions.filter((s) => s.status === 'completed');
  const scheduledSessions = mySessions.filter((s) => s.status === 'scheduled');
  const totalStudentsImpacted = completedSessions.reduce((acc, curr) => acc + (curr.studentCountActual || curr.studentCountTarget), 0);

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    if (categoryFilter === 'all') return true;
    return c.category === categoryFilter;
  });

  // Handle opening completion dialog
  const handleOpenCompletionDialog = (session: WorkshopSession) => {
    setCompletionModalSession(session);
    setActualStudentsInput(session.studentCountTarget || 30);
    setSessionNotesInput('');
  };

  // Submit session completion
  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionModalSession) return;

    onConfirmSessionCompletion(completionModalSession.id, Number(actualStudentsInput) || 30, sessionNotesInput);
    
    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    const targetSession = {
      ...completionModalSession,
      status: 'completed' as const,
      studentCountActual: Number(actualStudentsInput) || 30,
      certificateIssued: true,
    };

    setCompletionModalSession(null);
    // Auto prompt certificate view
    setTimeout(() => {
      onOpenCertificateModal(targetSession);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-kufi" id="professor-portal">
      
      {/* Top Navigation Bar with Official University Branding */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <LogoBranding size="md" />
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>{currentProfessor.title} / {currentProfessor.name}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {currentProfessor.department} • {currentProfessor.campus}
              </div>
            </div>

            <button
              onClick={onLogout}
              title="تسجيل الخروج"
              className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner - Geometric Balance */}
      <section className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white py-6 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-geometric-grid pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#a4874b]/20 text-[#e5d4a6] text-xs px-3 py-1 rounded-full border border-[#a4874b]/40 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#e5d4a6]" />
                <span>منظومة الشراكة الأكاديمية بالكلية التطبيقية</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-kufi text-white">
                أهلاً بك، {currentProfessor.title} {currentProfessor.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl font-cairo">
                بوابتك الرقمية المباشرة لاختيار حقائب الإرشاد المهني، جدولة الورش، وتحميل المواد التعليمية، مع إصدار شهادات الشكر الفورية المعتمدة من رئيس الكلية التطبيقية.
              </p>
            </div>

            {/* Quick Stats Grid with Geometric Balance */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center border-r-4 border-r-[#a4874b]">
                <div className="text-lg sm:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {completedSessions.length}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">ورش منجزة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center border-r-4 border-r-emerald-400">
                <div className="text-lg sm:text-2xl font-bold font-kufi text-white">
                  {totalStudentsImpacted}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">طالباً مستفيداً</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center border-r-4 border-r-[#c8aa62]">
                <div className="text-lg sm:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {completedSessions.filter((s) => s.certificateIssued).length}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">شهادات معتمدة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 py-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل الحقائب التدريبية المعتمدة ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my_sessions')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
                activeTab === 'my_sessions'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>جدول ورشي ومتابعة التنفيذ</span>
              {scheduledSessions.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#a4874b] text-white text-[10px] font-bold flex items-center justify-center">
                  {scheduledSessions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>شهادات الشكر والتقدير الرقمية ({completedSessions.length})</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#1b4329]" />
            <span>العام الأكاديمي: {deanConfig.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: COURSES & CURRICULUM CATALOG */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            {/* Header Controls & Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>الحقائب التدريبية الجاهزة للإرشاد والتطوير المهني</span>
                  <span className="text-xs font-normal text-slate-500">
                    (انقر على أي حقيبة لمعاينة دليل الميسر وتنزيل ملفات العرض PPTX)
                  </span>
                </h2>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-[#1b4329] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  الكل ({courses.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('cv_portfolio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    categoryFilter === 'cv_portfolio'
                      ? 'bg-[#1b4329] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  السيرة الذاتية (ATS)
                </button>
                <button
                  onClick={() => setCategoryFilter('interview_skills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    categoryFilter === 'interview_skills'
                      ? 'bg-[#1b4329] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  المقابلات (STAR)
                </button>
                <button
                  onClick={() => setCategoryFilter('career_readiness')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    categoryFilter === 'career_readiness'
                      ? 'bg-[#1b4329] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  التدريب التعاوني (COOP)
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="glass-card rounded-2xl border border-slate-200 hover:border-[#1b4329] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group border-r-4 border-r-[#1b4329]"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold bg-[#faf6ee] text-[#785e2b] px-2.5 py-1 rounded-lg border border-[#a4874b]/30">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-[#1b4329] bg-[#f0f7f2] px-2.5 py-0.5 rounded-full border border-[#c8e2d1]">
                        {course.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1b4329] transition-colors leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2 font-cairo">
                      {course.shortDescription}
                    </p>

                    {/* Metadata Chips */}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1b4329]" />
                        <span>{course.durationMinutes} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#8f743c]" />
                        <span>{course.recommendedStudentsMin} - {course.recommendedStudentsMax} طالب</span>
                      </div>
                      <div className="flex items-center gap-1 mr-auto text-[#1b4329] font-bold text-[11px]">
                        <span>{course.materials.length} ملفات جاهزة</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenCourseDrawer(course)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#1b4329]" />
                      <span>دليل الميسر والملفات</span>
                    </button>

                    <button
                      onClick={() => onOpenBookingModal(course)}
                      className="py-2 px-3.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-[#e5d4a6]" />
                      <span>حجز الورشة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: MY SESSIONS & EXECUTION TRACKER */}
        {activeTab === 'my_sessions' && (
          <div className="space-y-6">
            
            <div className="glass-card p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900">سجل جلساتي وورش العمل المجدولة</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تأكيد التنفيذ بضغطة زر واحدة بعد الانتهاء من إلقاء الورشة لإصدار شهادة الشكر فوراً. (يتم حجز الورش الجديدة حصراً عبر تبويب دليل الحقائب التدريبية المعتمدة).
              </p>
            </div>

            {mySessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f0f7f2] text-[#1b4329] flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">لا توجد ورش مسجلة باسمك حالياً</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  لحجز ورشة جديدة، تفضل بزيارة دليل الحقائب المعتمدة لاختيار الحقيبة المناسبة وتحديد موعد جلستك.
                </p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-[#e5d4a6]" />
                  <span>الانتقال لدليل الحقائب التدريبية لحجز ورشة</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mySessions.map((session) => {
                  const isCompleted = session.status === 'completed';
                  return (
                    <div
                      key={session.id}
                      className={`glass-card rounded-2xl border p-5 shadow-2xs transition-all ${
                        isCompleted ? 'border-slate-200 border-r-4 border-r-emerald-600 bg-emerald-50/10' : 'border-slate-200 border-r-4 border-r-[#a4874b] hover:border-[#1b4329]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Session Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                                : 'bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/40'
                            }`}>
                              {isCompleted ? '✓ تم التنفيذ بنجاح' : '⏳ مجدولة ومؤكدة'}
                            </span>
                            
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {session.courseCode}
                            </span>

                            <span className="text-xs text-slate-500 font-medium">
                              المقر: {session.campus}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900">{session.courseTitle}</h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#1b4329]" />
                              <span>التاريخ: <strong>{session.date}</strong></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#1b4329]" />
                              <span>الوقت: <strong>{session.timeSlot}</strong></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#8f743c]" />
                              <span>{session.hallName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span>
                                {isCompleted ? (
                                  <>الطلاب الحاضرون: <strong className="text-emerald-800">{session.studentCountActual} طالباً</strong></>
                                ) : (
                                  <>العدد المستهدف: <strong>{session.studentCountTarget} طالباً</strong></>
                                )}
                              </span>
                            </div>
                          </div>

                          {session.sessionNotes && (
                            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mt-2">
                              <strong>ملاحظات التنفيذ:</strong> {session.sessionNotes}
                            </p>
                          )}
                        </div>

                        {/* Actions Block */}
                        <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          
                          {/* ONE CLICK CONFIRMATION BUTTON */}
                          {!isCompleted ? (
                            <button
                              onClick={() => handleOpenCompletionDialog(session)}
                              className="px-4 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                              <span>تأكيد إنجاز الورشة وإصدار الشهادة</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenCertificateModal(session)}
                              className="px-4 py-2.5 bg-gradient-to-r from-[#a4874b] to-[#8f743c] hover:from-[#8f743c] hover:to-[#785e2b] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#c8aa62]/40"
                            >
                              <Award className="w-4 h-4 text-[#faf6ee]" />
                              <span>عرض وطباعة شهادة الشكر</span>
                            </button>
                          )}

                          {/* Secondary Action */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#1b4329]/80 font-medium text-[11px]">
                              ✓ تم إرسال التأكيد للبريد الجامعي
                            </span>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DIGITAL APPRECIATION CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 border-r-4 border-r-[#a4874b]">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#785e2b] bg-[#faf6ee] px-2.5 py-1 rounded-full border border-[#a4874b]/30 mb-1">
                  <Award className="w-3.5 h-3.5 text-[#8f743c]" />
                  <span>اعتماد الكلية التطبيقية الرسمي</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">شهادات الشكر والتقدير الأكاديمية</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  شهادات رسمية موقعة ومعتمدة من سعادة <strong>{deanConfig.deanTitle} ({deanConfig.deanName})</strong> توثق مساهمتك في بناء الجاهزية المهنية للطلبة.
                </p>
              </div>

              <div className="p-3 bg-[#f0f7f2] rounded-xl border border-[#c8e2d1] text-xs text-[#1b4329] shrink-0">
                <span className="font-bold block">إجمالي الشهادات المكتسبة:</span>
                <span className="text-lg font-bold font-kufi text-[#143520]">{completedSessions.length} شهادة معتمدة</span>
              </div>
            </div>

            {completedSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">لا توجد شهادات شكر مصدرة حتى الآن</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  بمجرد تنفيذ ورشة عمل وتأكيد حضور الطلاب، سيتم إنشاء شهادتك الرقمية المعتمدة فوراً وتستطيع طباعتها أو إضافتها لملف ترقيتك الأكاديمي.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="glass-card rounded-2xl border-2 border-[#a4874b]/40 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden border-r-4 border-r-[#a4874b]"
                  >
                    {/* Top Watermark Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a4874b]/5 rounded-bl-full pointer-events-none"></div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-[#785e2b] bg-[#faf6ee] px-2 py-0.5 rounded border border-[#a4874b]/30">
                          {session.certificateId || 'MU-AC-CERT-2026'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          تاريخ الاعتماد: {session.certificateIssueDate || session.date}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        شهادة شكر لتقديم ورشة: « {session.courseTitle} »
                      </h3>

                      <div className="text-xs text-slate-600 mt-2 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>جهة الاعتماد: <strong>{deanConfig.deanTitle} • {deanConfig.university}</strong></div>
                        <div>الطلاب المستفيدون: <strong>{session.studentCountActual || session.studentCountTarget} طالباً</strong></div>
                        <div>القسم والفرع: <strong>{session.department} ({session.campus})</strong></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onOpenCertificateModal(session)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#a4874b] to-[#8f743c] hover:from-[#8f743c] hover:to-[#785e2b] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>فتح الشهادة الرسمية والطباعة</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* QUICK ONE-MINUTE COMPLETION MODAL */}
      {completionModalSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-scaleUp">
            
            <div className="bg-gradient-to-r from-[#143520] to-[#1b4329] text-white p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#e5d4a6]" />
                <div>
                  <h3 className="text-base font-bold font-kufi">تأكيد إنجاز ورشة العمل وإصدار الشهادة</h3>
                  <p className="text-xs text-emerald-100 font-cairo">
                    خطوة واحدة فقط لاعتماد الإنجاز رسميًا في سجل الكلية التطبيقية
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmCompletion} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>الورشة: <strong className="text-[#143520]">{completionModalSession.courseTitle}</strong></div>
                <div>تاريخ الانعقاد: <strong>{completionModalSession.date} ({completionModalSession.timeSlot})</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العدد الفعلي للطلاب الحاضرين في الجلسة:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    required
                    value={actualStudentsInput}
                    onChange={(e) => setActualStudentsInput(Number(e.target.value))}
                    className="w-full py-2.5 px-3.5 pr-10 rounded-xl border border-slate-300 text-sm font-bold bg-slate-50/50 focus:ring-2 focus:ring-[#1b4329]"
                  />
                  <Users className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  انطباع أو ملاحظات سريعة حول تفاعل الطلاب (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={sessionNotesInput}
                  onChange={(e) => setSessionNotesInput(e.target.value)}
                  placeholder="مثال: تفاعل متميز وأسئلة ثرية حول اجتياز فحص أنظمة ATS..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50 focus:ring-2 focus:ring-[#1b4329]"
                />
              </div>

              <div className="p-3 bg-[#faf6ee] rounded-xl border border-[#a4874b]/30 text-xs text-[#785e2b] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#8f743c] shrink-0 mt-0.5" />
                <span>
                  عند الضغط على تأكيد، سيتم إصدار <strong>شهادة شكر وتقدير رسمية</strong> معتمدة من رئيس الكلية التطبيقية وإضافتها لسجلك فوراً.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCompletionModalSession(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                  <span>اعتماد الإنجاز واستلام الشهادة</span>
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
