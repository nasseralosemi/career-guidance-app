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
  AlertCircle,
  Search,
  X,
  Printer,
  Check,
  Building2,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FacultyMember, WorkshopCourse, WorkshopSession, DeanOfficialConfig } from '../../types';
import { LogoBranding } from '../common/LogoBranding';
import { AcademicReportModal } from './AcademicReportModal';
import { printAcademicReport, generateAcademicReportHTML } from '../../utils/academicReportPrinter';

interface ProfessorDashboardProps {
  currentProfessor: FacultyMember;
  courses: WorkshopCourse[];
  sessions: WorkshopSession[];
  deanConfig: DeanOfficialConfig;
  facultyList?: FacultyMember[];
  activeTab?: 'courses' | 'my_sessions' | 'certificates' | 'annual_report';
  onTabChange?: (tab: 'courses' | 'my_sessions' | 'certificates' | 'annual_report') => void;
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
  facultyList,
  activeTab: controlledActiveTab,
  onTabChange,
  onOpenBookingModal,
  onOpenCourseDrawer,
  onOpenCertificateModal,
  onConfirmSessionCompletion,
  onLogout,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'courses' | 'my_sessions' | 'certificates' | 'annual_report'>('courses');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (tab: 'courses' | 'my_sessions' | 'certificates' | 'annual_report') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };
  const [completionModalSession, setCompletionModalSession] = useState<WorkshopSession | null>(null);
  const [actualStudentsInput, setActualStudentsInput] = useState<number>(30);
  const [sessionNotesInput, setSessionNotesInput] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRankTooltipOpen, setIsRankTooltipOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isReportPrinting, setIsReportPrinting] = useState<boolean>(false);
  const [reportFeedbackMsg, setReportFeedbackMsg] = useState<string | null>(null);

  // Filter sessions for this logged-in professor
  const mySessions = sessions.filter(
    (s) => s.professorId === currentProfessor.id || s.professorEmail.toLowerCase() === currentProfessor.email.toLowerCase()
  );

  const completedSessions = mySessions.filter((s) => s.status === 'completed');
  const scheduledSessions = mySessions.filter((s) => s.status === 'scheduled');
  const totalStudentsImpacted = completedSessions.reduce((acc, curr) => acc + (curr.studentCountActual || curr.studentCountTarget), 0);

  // Automated Points Calculation: (Completed Workshops * 100) + (Attended Students * 5)
  const myCompletedWorkshopsCount = completedSessions.length;
  const myTotalPoints = (myCompletedWorkshopsCount * 100) + (totalStudentsImpacted * 5);

  // College-wide Faculty Points Aggregation & Ranking
  const allFacultyMap = new Map<string, { id: string; email: string; name: string; completedCount: number; studentsCount: number; points: number }>();

  // 1. Populate from facultyList
  if (facultyList && facultyList.length > 0) {
    facultyList.forEach((fac) => {
      const facCompleted = sessions.filter(
        (s) => (s.professorId === fac.id || s.professorEmail.toLowerCase() === fac.email.toLowerCase()) && s.status === 'completed'
      );
      const completedCount = facCompleted.length;
      const studentsCount = facCompleted.reduce((sum, s) => sum + (s.studentCountActual || s.studentCountTarget || 0), 0);
      const points = (completedCount * 100) + (studentsCount * 5);

      allFacultyMap.set(fac.email.toLowerCase(), {
        id: fac.id,
        email: fac.email.toLowerCase(),
        name: fac.name,
        completedCount,
        studentsCount,
        points,
      });
    });
  }

  // 2. Include any professors present in sessions
  sessions.forEach((s) => {
    if (s.professorEmail && !allFacultyMap.has(s.professorEmail.toLowerCase())) {
      const facCompleted = sessions.filter(
        (sub) => (sub.professorId === s.professorId || sub.professorEmail.toLowerCase() === s.professorEmail.toLowerCase()) && sub.status === 'completed'
      );
      const completedCount = facCompleted.length;
      const studentsCount = facCompleted.reduce((sum, sub) => sum + (sub.studentCountActual || sub.studentCountTarget || 0), 0);
      const points = (completedCount * 100) + (studentsCount * 5);

      allFacultyMap.set(s.professorEmail.toLowerCase(), {
        id: s.professorId,
        email: s.professorEmail.toLowerCase(),
        name: s.professorName,
        completedCount,
        studentsCount,
        points,
      });
    }
  });

  // 3. Ensure current logged-in professor has the latest reactive point total
  allFacultyMap.set(currentProfessor.email.toLowerCase(), {
    id: currentProfessor.id,
    email: currentProfessor.email.toLowerCase(),
    name: currentProfessor.name,
    completedCount: myCompletedWorkshopsCount,
    studentsCount: totalStudentsImpacted,
    points: myTotalPoints,
  });

  // 4. Sort all faculty descendingly by points, then students, then completed workshops
  const facultyLeaderboard = Array.from(allFacultyMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.studentsCount !== a.studentsCount) return b.studentsCount - a.studentsCount;
    return b.completedCount - a.completedCount;
  });

  // 5. Determine active professor rank
  const profRankIndex = facultyLeaderboard.findIndex(
    (p) => p.id === currentProfessor.id || p.email === currentProfessor.email.toLowerCase()
  );
  const calculatedDoctorRank = profRankIndex >= 0 ? profRankIndex + 1 : 1;
  const totalFacultyMembersCount = Math.max(facultyLeaderboard.length, 1);

  // Convert numeric rank to friendly Arabic ordinal text
  const getArabicOrdinalRank = (rank: number): string => {
    const ordinalMap: Record<number, string> = {
      1: 'الأول',
      2: 'الثاني',
      3: 'الثالث',
      4: 'الرابع',
      5: 'الخامس',
      6: 'السادس',
      7: 'السابع',
      8: 'الثامن',
      9: 'التاسع',
      10: 'العاشر',
      11: 'الحادي عشر',
      12: 'الثاني عشر',
      13: 'الثالث عشر',
      14: 'الرابع عشر',
      15: 'الخامس عشر',
    };
    if (ordinalMap[rank]) {
      return ordinalMap[rank];
    }
    return `المركز الـ ${rank}`;
  };

  const arabicDoctorRankText = getArabicOrdinalRank(calculatedDoctorRank);

  // Filtered courses (by category and quick search query)
  const filteredCourses = courses.filter((c) => {
    // Category match
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    if (!matchesCategory) return false;

    // Search query match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = c.title.toLowerCase().includes(q);
    const codeMatch = c.code.toLowerCase().includes(q);
    const descMatch = (c.shortDescription || '').toLowerCase().includes(q) || (c.fullOverview || '').toLowerCase().includes(q);
    const catMatch = (c.categoryLabel || '').toLowerCase().includes(q);
    const outcomesMatch = c.learningOutcomes ? c.learningOutcomes.some(o => o.toLowerCase().includes(q)) : false;

    return titleMatch || codeMatch || descMatch || catMatch || outcomesMatch;
  });

  // Handle opening completion dialog
  const handleOpenCompletionDialog = (session: WorkshopSession) => {
    setCompletionModalSession(session);
    setActualStudentsInput(session.studentCountTarget || 30);
    setSessionNotesInput('');
  };

  // Submit session completion for supervisor approval
  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionModalSession) return;

    onConfirmSessionCompletion(completionModalSession.id, Number(actualStudentsInput) || 30, sessionNotesInput);
    
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setCompletionModalSession(null);
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
      <section className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white py-5 sm:py-6 px-4 sm:px-8 relative z-30 overflow-visible">
        <div className="absolute inset-0 opacity-10 bg-geometric-grid pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 overflow-visible">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5">
            <div className="min-w-0 max-w-full">
              <div className="inline-flex items-center gap-2 bg-[#a4874b]/20 text-[#e5d4a6] text-xs px-3.5 sm:px-4 py-1.5 rounded-full border border-[#a4874b]/40 mb-2 sm:mb-2.5 shadow-2xs max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-[#e5d4a6] shrink-0" />
                <span className="font-bold font-cairo overflow-hidden text-ellipsis whitespace-nowrap">
                  منظومة الشراكة الأكاديمية بالكلية التطبيقية — للعام الأكاديمي {deanConfig.academicYear}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-kufi text-white">
                أهلاً بك، {currentProfessor.title} {currentProfessor.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl font-cairo leading-relaxed">
                بوابتك الرقمية المباشرة لاختيار حقائب الإرشاد المهني، جدولة الورش، وتحميل المواد التعليمية، مع متابعة اعتماد الورش وإصدار شهادات الشكر الرسمية المعتمدة.
              </p>
            </div>

            {/* Quick Stats Grid with 4 Evenly Distributed Metric Cards (2 cols on mobile, 4 on md) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 shrink-0 w-full xl:w-auto mt-1 xl:mt-0">
              
              {/* Card 1: ورش منجزة */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#a4874b] min-w-0">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {completedSessions.length}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">ورش معتمدة</div>
              </div>

              {/* Card 2: طالباً مستفيداً */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-emerald-400 min-w-0">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-white">
                  {totalStudentsImpacted}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">طالباً مستفيداً</div>
              </div>

              {/* Card 3: شهادات معتمدة */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#c8aa62] min-w-0">
                <div className="text-base sm:text-xl md:text-2xl font-bold font-kufi text-[#e5d4a6]">
                  {completedSessions.filter((s) => s.certificateIssued).length}
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">شهادات معتمدة</div>
              </div>

              {/* Card 4: ترتيب الدكتور / التصنيف بالكلية مع التلميح التفاعلي Tooltip on Hover */}
              <div 
                className="relative group bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center border-r-4 border-r-[#f3e5b8] min-w-0 transition-all hover:bg-white/15 cursor-pointer z-30"
                onClick={() => setIsRankTooltipOpen((prev) => !prev)}
              >
                
                {/* Small Question Mark (?) in the top corner */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRankTooltipOpen((prev) => !prev);
                  }}
                  className="absolute top-1.5 left-1.5 w-4.5 h-4.5 rounded-full bg-white/20 flex items-center justify-center text-[#e5d4a6] hover:bg-[#a4874b] hover:text-white transition-colors cursor-pointer"
                  title="معايير احتساب الترتيب والنقاط"
                  aria-label="معايير احتساب الترتيب والنقاط"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>

                {/* Main Value: Doctor Rank (Arabic Text Format) */}
                <div className="text-xs sm:text-sm md:text-base font-bold font-kufi text-[#f3e5b8] flex items-center justify-center min-h-[24px] sm:min-h-[28px] md:min-h-[32px] leading-tight truncate px-1">
                  <span>{arabicDoctorRankText}</span>
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-100/90 font-medium mt-0.5">ترتيب الدكتور</div>

                {/* Tooltip / Popover floating over lower tabs with z-50 */}
                <div 
                  className={`absolute top-full end-0 mt-3 w-72 sm:w-80 p-4 bg-slate-900/98 backdrop-blur-md text-white text-right rounded-2xl shadow-2xl border border-slate-700/90 z-50 font-cairo transition-all duration-200 ${
                    isRankTooltipOpen 
                      ? 'opacity-100 visible pointer-events-auto ring-2 ring-[#a4874b]/40' 
                      : 'opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tooltip pointer arrow pointing up */}
                  <div className="absolute bottom-full end-6 sm:end-10 border-6 border-transparent border-b-slate-900/98"></div>

                  <div className="text-xs font-bold text-[#e5d4a6] font-kufi mb-2 flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#e5d4a6]" />
                      <span>معايير احتساب الترتيب والتصنيف</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {arabicDoctorRankText} (من {totalFacultyMembersCount})
                      </span>
                      {isRankTooltipOpen && (
                        <button
                          type="button"
                          onClick={() => setIsRankTooltipOpen(false)}
                          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-200">
                    <div className="flex items-center justify-between bg-slate-800/90 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                      <span className="text-slate-300 font-medium">مجموع نقاطك المعتمدة:</span>
                      <span className="font-bold text-[#f3e5b8] font-mono text-xs">{myTotalPoints.toLocaleString('ar-SA')} نقطة</span>
                    </div>

                    <div className="text-[10px] text-slate-300 leading-relaxed bg-[#143520]/80 p-2 rounded-lg border border-emerald-500/20">
                      <div className="font-bold text-[#e5d4a6] mb-0.5">معادلة احتساب النقاط:</div>
                      <div>(100 نقطة لكل ورشة معتمدة + 5 نقاط لكل طالب حاضر فعلياً).</div>
                    </div>

                    <div className="space-y-1 text-[10px] text-slate-300 px-1 bg-slate-800/50 p-1.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">• ورش معتمدة ({myCompletedWorkshopsCount}):</span>
                        <span className="font-mono text-emerald-300">+{myCompletedWorkshopsCount * 100} نقطة</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">• طلاب حاضرون ومعتمدون ({totalStudentsImpacted}):</span>
                        <span className="font-mono text-emerald-300">+{totalStudentsImpacted * 5} نقطة</span>
                      </div>
                    </div>

                    <div className="text-[9.5px] text-amber-300/90 bg-amber-950/40 p-1.5 rounded-md border border-amber-500/20">
                      ⚠️ ملاحظة: الورش قيد المراجعة لا تُحتسب نقاطها في الترتيب إلا بعد اعتماد المشرف الرسمي.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex flex-row overflow-x-auto whitespace-nowrap scrollbar-none gap-1.5 sm:gap-2 md:gap-3 md:flex-wrap md:overflow-visible items-center">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>دليل الحقائب التدريبية ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my_sessions')}
              className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer relative ${
                activeTab === 'my_sessions'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4 shrink-0" />
              <span>جدول ورشي ومتابعة التنفيذ</span>
              {scheduledSessions.length > 0 && (
                <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#a4874b] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                  {scheduledSessions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>شهادات الشكر ({completedSessions.length})</span>
            </button>

            {/* Annual Academic Achievement Report Tab */}
            <button
              onClick={() => setActiveTab('annual_report')}
              className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'annual_report'
                  ? 'bg-[#1b4329] text-white shadow-xs border-b-2 border-[#a4874b]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>تقرير الإنجاز السنوي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: COURSES & CURRICULUM CATALOG */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            {/* Quick Search & Category Filter Full-Width Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 glass-card p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
              
              {/* Quick Search Bar */}
              <div className="relative md:w-80 lg:w-96 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث سريع في الحقائب التدريبية أو الأكواد..."
                  className="w-full pl-8 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:border-[#1b4329] focus:bg-white rounded-xl focus:ring-2 focus:ring-[#1b4329]/15 focus:outline-none transition-all placeholder:text-slate-400 font-cairo"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="مسح البحث"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Segmented Control Bar */}
              <div className="flex-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-inner">
                {[
                  { id: 'all', label: `الكل (${courses.length})` },
                  { id: 'cv_portfolio', label: 'السيرة الذاتية (ATS)' },
                  { id: 'interview_skills', label: 'المقابلات (STAR)' },
                  { id: 'career_readiness', label: 'التدريب والجاهزية' },
                  { id: 'soft_skills', label: 'المهارات الناعمة' },
                  { id: 'digital_tools', label: 'الأدوات الرقمية' },
                ].map((cat) => {
                  const isActive = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`flex-1 min-w-fit text-center px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap font-kufi ${
                        isActive
                          ? 'bg-white text-[#1b4329] shadow-xs font-bold border border-slate-200/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
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

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1b4329] transition-colors leading-snug line-clamp-2 font-kufi">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2 font-cairo">
                        {course.shortDescription}
                      </p>

                      {/* Metadata Chips */}
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-cairo">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#1b4329]" />
                          <span>{course.durationMinutes} دقيقة</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#8f743c]" />
                          <span>{course.recommendedStudentsMin} - {course.recommendedStudentsMax} طالب</span>
                        </div>
                        <div className="flex items-center gap-1 mr-auto text-[#1b4329] font-bold text-[11px] font-kufi">
                          <span>{course.materials.length} ملفات جاهزة</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-between gap-2 font-kufi">
                      <button
                        onClick={() => onOpenCourseDrawer(course)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-slate-100/90 text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold transition-all duration-200 ease-out flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#1b4329]" />
                        <span>دليل الميسر والملفات</span>
                      </button>

                      <button
                        onClick={() => onOpenBookingModal(course)}
                        className="group/book-btn py-2 px-3.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs font-bold transition-all duration-200 ease-out flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-lg hover:shadow-[#1b4329]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer border border-[#143520]/50"
                        title="حجز موعد الورشة للطلاب"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#e5d4a6] group-hover/book-btn:scale-110 transition-transform duration-200" />
                        <span>حجز الورشة</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200 font-cairo">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700 mb-1 font-kufi">لا توجد حقائب تدريبية مطابقة</h4>
                <p className="text-xs text-slate-500 mb-4">
                  لم يتم العثور على أي حقيبة تدريبية بالبحث: "{searchQuery || categoryFilter}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer font-kufi"
                >
                  إعادة ضبط البحث والتصنيفات
                </button>
              </div>
            )}

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
                  const isPendingApproval = session.status === 'pending_approval';
                  const isRejected = session.status === 'rejected';

                  return (
                    <div
                      key={session.id}
                      className={`glass-card rounded-2xl border p-5 shadow-2xs transition-all ${
                        isCompleted 
                          ? 'border-emerald-200 border-r-4 border-r-emerald-600 bg-emerald-50/15' 
                          : isPendingApproval
                          ? 'border-amber-300 border-r-4 border-r-amber-500 bg-amber-50/20'
                          : isRejected
                          ? 'border-rose-300 border-r-4 border-r-rose-500 bg-rose-50/20'
                          : 'border-slate-200 border-r-4 border-r-[#a4874b] hover:border-[#1b4329]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Session Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isPendingApproval
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                : isRejected
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : 'bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/40'
                            }`}>
                              {isCompleted 
                                ? '✓ تم الإنجاز والاعتماد الرسمي' 
                                : isPendingApproval 
                                ? '⏳ بانتظار اعتماد المشرف (قيد التدقيق)' 
                                : isRejected
                                ? '⚠️ يتطلب تعديلاً من المشرف'
                                : '📅 مجدولة ومؤكدة'}
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
                                  <>الطلاب الحاضرون: <strong className="text-emerald-800 font-bold">{session.studentCountActual} طالباً (معتمد)</strong></>
                                ) : isPendingApproval ? (
                                  <>الطلاب المسجلون بالتأكيد: <strong className="text-amber-900 font-bold">{session.studentCountActual} طالباً (قيد المراجعة)</strong></>
                                ) : (
                                  <>العدد المستهدف: <strong>{session.studentCountTarget} طالباً</strong></>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Notes and Status Messages */}
                          {session.sessionNotes && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 mt-2">
                              <strong>ملاحظات التنفيذ المرفوعة:</strong> {session.sessionNotes}
                            </p>
                          )}

                          {isRejected && session.rejectionReason && (
                            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-900 flex items-center gap-2 mt-2">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span><strong>ملاحظة المشرف لطلب التعديل:</strong> {session.rejectionReason}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions Block */}
                        <div className="flex flex-col items-center lg:items-end justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                          
                          {/* Case 1: Completed & Approved by Supervisor */}
                          {isCompleted && (
                            <>
                              <button
                                onClick={() => onOpenCertificateModal(session)}
                                className="px-4 py-2.5 bg-gradient-to-r from-[#a4874b] to-[#8f743c] hover:from-[#8f743c] hover:to-[#785e2b] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#c8aa62]/40"
                              >
                                <Award className="w-4 h-4 text-[#faf6ee]" />
                                <span>عرض وطباعة شهادة الشكر</span>
                              </button>
                              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                                ✓ معتمدة ومصدرة رسمياً
                              </span>
                            </>
                          )}

                          {/* Case 2: Pending Approval by Supervisor (Golden Shaded Alert Badge) */}
                          {isPendingApproval && (
                            <div className="p-3 sm:p-3.5 bg-gradient-to-r from-[#faf6ee] to-[#f5ecd8] border-2 border-[#a4874b]/60 rounded-2xl text-[#634e23] text-xs font-bold shadow-xs flex items-center gap-2 max-w-md">
                              <span className="text-sm leading-none shrink-0">⏳</span>
                              <span className="font-kufi">قيد المراجعة والتدقيق (بانتظار مطابقة الحضور واعتماد المشرف)</span>
                            </div>
                          )}

                          {/* Case 3: Rejected / Request Modification */}
                          {isRejected && (
                            <button
                              onClick={() => handleOpenCompletionDialog(session)}
                              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تعديل وإعادة إرسال للاعتماد</span>
                            </button>
                          )}

                          {/* Case 4: Scheduled */}
                          {!isCompleted && !isPendingApproval && !isRejected && (
                            <button
                              onClick={() => handleOpenCompletionDialog(session)}
                              className="px-4 py-2.5 bg-gradient-to-r from-[#1b4329] to-[#235334] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#e5d4a6]" />
                              <span>تأكيد التنفيذ وإرسال للاعتماد</span>
                            </button>
                          )}

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

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 bg-[#f0f7f2] rounded-xl border border-[#c8e2d1] text-xs text-[#1b4329]">
                  <span className="font-bold block">إجمالي الشهادات:</span>
                  <span className="text-lg font-bold font-kufi text-[#143520]">{completedSessions.length} معتمدة</span>
                </div>
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

        {/* TAB 4: ANNUAL ACADEMIC ACHIEVEMENT REPORT */}
        {activeTab === 'annual_report' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Action & Control Header Bar */}
            <div className="glass-card p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 border-r-4 border-r-[#1b4329] bg-white">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143520] bg-[#eef7f1] px-3 py-1 rounded-full border border-[#c8e2d1] mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1b4329]" />
                  <span>وثيقة أكاديمية رسمية معتمدة</span>
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                  تقرير الإنجاز السنوي والأنشطة الإرشادية والمهنية
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
                  سجل متكامل وموثق لجميع ورش العمل المعتمدة المنفذة للعام الأكاديمي {deanConfig.academicYear} لتقديمه في ملف الترقية أو تقرير الأداء السنوي.
                </p>
              </div>

              {/* Direct Print & Open in New Tab Action Buttons (side by side in a single line on mobile & desktop) */}
              <div className="flex flex-row items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const html = generateAcademicReportHTML({
                      professor: currentProfessor,
                      completedSessions,
                      deanConfig,
                      totalPoints: myTotalPoints,
                      doctorRankText: arabicDoctorRankText,
                      totalFacultyCount: totalFacultyMembersCount,
                    });
                    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                  }}
                  className="flex-1 md:flex-initial py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                  title="فتح التقرير في نافذة مستقلة"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                  <span>نافذة مستقلة</span>
                </button>

                <button
                  type="button"
                  disabled={isReportPrinting}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsReportPrinting(true);
                    setReportFeedbackMsg('جاري استدعاء نافذة الطباعة الرسمية وحفظ السجل كـ PDF...');

                    const success = printAcademicReport({
                      professor: currentProfessor,
                      completedSessions,
                      deanConfig,
                      totalPoints: myTotalPoints,
                      doctorRankText: arabicDoctorRankText,
                      totalFacultyCount: totalFacultyMembersCount,
                    });

                    setTimeout(() => {
                      setIsReportPrinting(false);
                      if (success) {
                        setReportFeedbackMsg('تم استدعاء أمر الطباعة / الحفظ بنجاح.');
                        setTimeout(() => setReportFeedbackMsg(null), 3500);
                      }
                    }, 800);
                  }}
                  className="flex-1 md:flex-initial py-2 sm:py-2.5 px-3 sm:px-5 bg-gradient-to-r from-[#1b4329] via-[#245836] to-[#143520] hover:from-[#143520] hover:to-[#1b4329] text-white rounded-xl text-[11px] sm:text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 border border-[#a4874b]/50 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  title="طباعة السجل الرسمي أو حفظه كملف PDF"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5d4a6] shrink-0" />
                  <span>{isReportPrinting ? 'جاري التجهيز...' : 'طباعة السجل / PDF'}</span>
                </button>
              </div>
            </div>

            {/* Notification message feedback */}
            {reportFeedbackMsg && (
              <div className="p-3 bg-[#eef7f1] border border-[#a6d4b5] rounded-xl text-xs text-[#143520] flex items-center gap-2 font-bold shadow-2xs">
                <Check className="w-4 h-4 text-[#1b4329] shrink-0" />
                <span>{reportFeedbackMsg}</span>
              </div>
            )}

            {/* FULL EMBEDDED ACADEMIC REPORT DOCUMENT */}
            <div className="bg-white rounded-2xl border border-slate-300/90 shadow-sm p-4 sm:p-6 md:p-10 text-slate-800 relative overflow-hidden font-cairo">
              {/* Subtle Document Watermark / Top Corner Trim */}
              <div className="absolute top-0 right-0 w-28 sm:w-36 h-28 sm:h-36 bg-[#1b4329]/5 rounded-bl-full pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-28 sm:w-36 h-28 sm:h-36 bg-[#a4874b]/5 rounded-br-full pointer-events-none"></div>

              {/* Official Academic Header */}
              <div className="border-b-2 border-[#1b4329] pb-4 sm:pb-6 mb-5 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-right">
                  {/* Right Header Text */}
                  <div className="space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-600">المملكة العربية السعودية</p>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-600">وزارة التعليم - جامعة المجمعة</p>
                    <p className="text-xs sm:text-sm font-black text-[#143520]">الكلية التطبيقية</p>
                    <p className="text-[11px] sm:text-xs font-bold text-[#8f743c]">وحدة الإرشاد والتطوير المهني</p>
                  </div>

                  {/* Center Emblem / Identity */}
                  <div className="flex flex-col items-center my-1 sm:my-0">
                    <LogoBranding className="h-11 sm:h-14 w-auto mb-1" showText={false} />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#143520] tracking-wider font-kufi">
                      بوابة الإرشاد والتطوير المهني
                    </span>
                  </div>

                  {/* Left Official Metadata */}
                  <div className="text-center sm:text-left space-y-1 text-xs">
                    <div className="bg-[#faf6ee] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-[#a4874b]/30 inline-block font-mono text-[10px] sm:text-[11px] font-bold text-[#785e2b]">
                      الرقم المرجعي: MU-AC-REP-{new Date().getFullYear()}-{currentProfessor.id.replace(/\D/g, '').padStart(3, '0') || '101'}
                    </div>
                    <div className="text-slate-600 text-[10px] sm:text-[11px]">
                      التاريخ: {new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                    </div>
                    <div className="text-slate-500 text-[10px] sm:text-[11px]">
                      الموافق: {new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                    </div>
                  </div>
                </div>

                {/* Report Main Banner Title */}
                <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                  <span className="inline-block bg-[#1b4329] text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-0.5 sm:py-1 rounded-full mb-1.5">
                    العام الأكاديمي: {deanConfig.academicYear}
                  </span>
                  <h1 className="text-base sm:text-xl md:text-2xl font-black text-[#143520] font-kufi">
                    تقرير الإنجاز السنوي لأنشطة التدريب والجاهزية المهنية
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-xl mx-auto">
                    سجل توثيقي رسمي للبرامج التدريبية المعتمدة المنفذة للطلبة من قبل عضو هيئة التدريس
                  </p>
                </div>
              </div>

              {/* Professor Academic Profile Card (Stacked flex on mobile, grid on sm/lg) */}
              <div className="bg-[#faf8f5] rounded-xl border border-[#e2d5be] p-3.5 sm:p-5 mb-5 sm:mb-6">
                <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                  <div className="border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-200/60">
                    <span className="text-slate-500 block mb-0.5 text-[11px]">اسم عضو هيئة التدريس:</span>
                    <strong className="text-xs sm:text-sm text-slate-900 block font-bold">{currentProfessor.name}</strong>
                  </div>
                  <div className="border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-200/60">
                    <span className="text-slate-500 block mb-0.5 text-[11px]">الرتبة الأكاديمية:</span>
                    <strong className="text-xs sm:text-sm text-[#143520] block font-bold">{currentProfessor.title || 'أستاذ مشارك'}</strong>
                  </div>
                  <div className="border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-200/60">
                    <span className="text-slate-500 block mb-0.5 text-[11px]">القسم والفرع:</span>
                    <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                      {currentProfessor.department} ({currentProfessor.campus})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 text-[11px]">البريد الإلكتروني الجامعي:</span>
                    <strong className="text-[11px] sm:text-xs font-mono text-[#8f743c] block break-all">{currentProfessor.email}</strong>
                  </div>
                </div>
              </div>

              {/* 4 Statistical KPI Highlight Cards (2 cols on mobile, 4 on lg) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-emerald-100 shadow-2xs text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black font-kufi text-[#143520] block">
                    {completedSessions.length}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-bold">ورش عمل معتمدة</span>
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-emerald-100 shadow-2xs text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black font-kufi text-[#143520] block">
                    {totalStudentsImpacted}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-bold">طالباً مستفيداً</span>
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-amber-100 shadow-2xs text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-1">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black font-kufi text-[#785e2b] block">
                    {completedSessions.length}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-bold">شهادات شكر رسمية</span>
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-amber-100 shadow-2xs text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-1">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black font-kufi text-[#785e2b] block">
                    {myTotalPoints}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-bold">
                    نقطة تميز ({arabicDoctorRankText})
                  </span>
                </div>
              </div>

              {/* Detailed Completed Workshops (Responsive Table on md/lg + Mobile Card list on sm) */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#1b4329]" />
                    <span>سجل ورش العمل والفعاليات المنفذة</span>
                  </h3>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    إجمالي الجلسات المسجلة: {completedSessions.length} ورشة
                  </span>
                </div>

                {completedSessions.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">لا توجد ورش عمل مكتملة وموثقة في هذا العام الأكاديمي حتى الآن.</p>
                    <p className="text-[11px] text-slate-500 mt-1">بمجرد تقديم ورشة وتأكيدها ستظهر كافة تفاصيلها والشهادات المعتمدة هنا تلقائياً.</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile-Friendly Cards View (Visible on small screens < md) */}
                    <div className="space-y-3 md:hidden">
                      {completedSessions.map((session, idx) => (
                        <div key={session.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#1b4329] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="font-bold text-slate-900 leading-snug">{session.courseTitle}</h4>
                                <span className="text-[10px] font-mono text-[#8f743c] bg-[#faf6ee] px-1.5 py-0.2 rounded inline-block mt-0.5 border border-[#a4874b]/30">
                                  {session.courseCode || 'MU-TRAIN'}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-[#143520] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] shrink-0">
                              {session.studentCountActual || session.studentCountTarget} طالباً
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-slate-400 block text-[10px]">التاريخ والوقت:</span>
                              <span className="text-slate-800 font-medium">{session.date} • {session.timeSlot}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">المقر والقاعة:</span>
                              <span className="text-slate-800 font-medium">{session.campus} ({session.hallName || 'قاعة التدريب'})</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">رقم الشهادة:</span>
                            <span className="font-mono text-[10px] font-bold text-[#785e2b] bg-[#faf6ee] px-2 py-0.5 rounded border border-[#a4874b]/30">
                              {session.certificateId || 'MU-AC-CERT-2026'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Standard Table View (Visible on md and larger screens) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#1b4329] text-white">
                          <tr>
                            <th className="p-3 font-bold text-center w-12">#</th>
                            <th className="p-3 font-bold">عنوان الحقيبة التدريبية</th>
                            <th className="p-3 font-bold text-center">التاريخ والتوقيت</th>
                            <th className="p-3 font-bold text-center">المقر والقاعة</th>
                            <th className="p-3 font-bold text-center">عدد الحضور</th>
                            <th className="p-3 font-bold text-center">رقم الشهادة المعتمدة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {completedSessions.map((session, idx) => (
                            <tr key={session.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                              <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                              <td className="p-3">
                                <span className="font-bold text-slate-900 block">{session.courseTitle}</span>
                                <span className="text-[10px] font-mono text-[#8f743c] bg-[#faf6ee] px-1.5 py-0.2 rounded inline-block mt-0.5 border border-[#a4874b]/30">
                                  {session.courseCode || 'MU-TRAIN'}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="block font-bold text-slate-800">{session.date}</span>
                                <span className="text-[11px] text-slate-500 block">{session.timeSlot}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="block text-slate-800">{session.campus}</span>
                                <span className="text-[11px] text-slate-500 block">{session.hallName || 'قاعة التدريب الذكي'}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="font-bold text-[#143520] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                                {session.studentCountActual || session.studentCountTarget} طالباً
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-mono text-[11px] font-bold text-[#785e2b] bg-[#faf6ee] px-2 py-0.5 rounded border border-[#a4874b]/30 inline-block">
                                {session.certificateId || 'MU-AC-CERT-2026'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

              {/* Official Endorsements & Signatures Section */}
              <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t-2 border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 items-end text-xs">
                  {/* Faculty Member Signature */}
                  <div className="text-center p-3.5 sm:p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-bold mb-1 text-[11px] sm:text-xs">مُعدّ التقرير (عضو هيئة التدريس)</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{currentProfessor.name}</p>
                    <p className="text-slate-500 text-[10px] sm:text-[11px] mb-4 sm:mb-6">{currentProfessor.title || 'أستاذ مشارك'}</p>
                    <div className="font-kufi text-[11px] sm:text-xs text-slate-400 border-b border-dashed border-slate-300 pb-1 max-w-[180px] mx-auto">
                      التوقيع الإلكتروني المعتمد
                    </div>
                  </div>

                  {/* Official Dean Seal & Signature */}
                  <div className="text-center p-3.5 sm:p-4 bg-[#faf6ee] rounded-xl border border-[#a4874b]/40 relative">
                    {/* Stamp Verification Ring */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-[9px] sm:text-[10px] font-bold text-emerald-800">
                      ✓ معتمد رسمياً
                    </div>

                    <p className="text-[#8f743c] font-bold mb-1 text-[11px] sm:text-xs">الاعتماد الرسمي</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{deanConfig.deanName}</p>
                    <p className="text-[#143520] font-bold text-[10px] sm:text-[11px] mb-3 sm:mb-4">
                      {deanConfig.deanTitle} • {deanConfig.college}
                    </p>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#a4874b] mx-auto flex flex-col items-center justify-center p-1 bg-white/80 shadow-2xs">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#8f743c] mb-0.5" />
                      <span className="text-[7.5px] sm:text-[8px] font-bold text-[#785e2b] text-center leading-tight">
                        الكلية التطبيقية<br />جامعة المجمعة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Official Notice */}
                <div className="text-center text-[9.5px] sm:text-[10px] text-slate-400 mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>تم إنشاء هذا السجل عبر النظام الأكاديمي الموحد للجاهزية المهنية - جامعة المجمعة</span>
                  <span>الرمز الأمني للتحقق: <strong>SHA256:MU-AC-{currentProfessor.id}-{deanConfig.academicYear}</strong></span>
                </div>
              </div>

            </div>
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
                  <h3 className="text-base font-bold font-kufi">تأكيد تنفيذ ورشة العمل وإرسالها للاعتماد</h3>
                  <p className="text-xs text-emerald-100 font-cairo">
                    رفع تقرير عدد الحضور الفعلي لسعادة المشرف للتدقيق والاعتماد الرسمي
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
                  عند الضغط على إرسال، سيتم تحويل التقرير إلى <strong>لوحة المشرف للتدقيق والاعتماد</strong>، وفور الاعتماد ستصدر <strong>شهادة الشكر الرسمية</strong> وتُدرج النقاط في تصنيفك الأكاديمي تلقائياً.
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
                  <span>إرسال تقرير الورشة للمشرف للاعتماد</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal: Annual Academic Achievement Report Print/Export */}
      <AcademicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        professor={currentProfessor}
        completedSessions={completedSessions}
        deanConfig={deanConfig}
        totalPoints={myTotalPoints}
        doctorRankText={arabicDoctorRankText}
        totalFacultyCount={totalFacultyMembersCount}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        جامعة المجمعة • الكلية التطبيقية • وحدة الإرشاد والتطوير المهني والتوظيف © {new Date().getFullYear()}
      </footer>

    </div>
  );
};
