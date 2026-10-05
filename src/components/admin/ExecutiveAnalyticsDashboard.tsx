import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Target,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ChevronDown,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  Send,
  Building2,
  GraduationCap,
  BookOpen,
  Printer
} from 'lucide-react';
import { WorkshopSession } from '../../types';
import { DEPARTMENT_OPTIONS } from '../../data/mockData';

interface ExecutiveAnalyticsDashboardProps {
  sessions: WorkshopSession[];
  onOpenRequestModal?: (department?: string) => void;
  onNavigateToSessions?: () => void;
}

// Arabic Month Name Formatter
const ARABIC_MONTHS: Record<string, string> = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'أبريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر'
};

// University Signature Colors for 8 Programs
const PROGRAM_PALETTE = [
  '#1b4329', // Forest Green (Primary)
  '#a4874b', // Gold / Bronze (Secondary)
  '#2d6a4f', // Emerald Green
  '#0284c7', // Sky Blue
  '#d97706', // Warm Amber
  '#7c3aed', // Purple Violet
  '#0d9488', // Teal
  '#e11d48', // Crimson Rose
];

export const ExecutiveAnalyticsDashboard: React.FC<ExecutiveAnalyticsDashboardProps> = ({
  sessions,
  onOpenRequestModal,
  onNavigateToSessions,
}) => {
  // Configurable Target Quota per Department (Default: 3 workshops per department)
  const [targetPerProgram, setTargetPerProgram] = useState<number>(3);
  
  // Status filter for analytics (approved only vs all sessions)
  const [includeScheduled, setIncludeScheduled] = useState<boolean>(false);

  // Chart view modes
  const [growthChartMode, setGrowthChartMode] = useState<'composed' | 'students' | 'rate'>('composed');
  const [coverageChartMode, setCoverageChartMode] = useState<'bar' | 'donut' | 'target_vs_actual'>('bar');

  // Filtered sessions based on status filter
  const activeSessions = useMemo(() => {
    if (includeScheduled) {
      return sessions.filter((s) => s.status === 'completed' || s.status === 'scheduled' || s.status === 'pending_approval');
    }
    return sessions.filter((s) => s.status === 'completed');
  }, [sessions, includeScheduled]);

  // Total completed sessions
  const completedSessions = useMemo(() => {
    return sessions.filter((s) => s.status === 'completed');
  }, [sessions]);

  // Total students reached
  const totalStudents = useMemo(() => {
    return completedSessions.reduce((sum, s) => sum + (s.studentCountActual || s.studentCountTarget || 0), 0);
  }, [completedSessions]);

  // Average student feedback rating
  const averageRating = useMemo(() => {
    const rated = completedSessions.filter((s) => s.studentFeedbackRating);
    if (rated.length === 0) return 4.9;
    const sum = rated.reduce((acc, s) => acc + (s.studentFeedbackRating || 0), 0);
    return (sum / rated.length).toFixed(2);
  }, [completedSessions]);

  // 1. COMPUTATION: Monthly Growth Rate of Approved Workshops
  const monthlyGrowthData = useMemo(() => {
    // Collect all unique months from sessions (YYYY-MM)
    const monthMap: Record<string, { completedCount: number; scheduledCount: number; studentsCount: number }> = {};

    // Ensure baseline academic semester months exist (e.g. Aug, Sep, Oct 2026)
    const baseMonths = ['2026-08', '2026-09', '2026-10'];
    baseMonths.forEach((m) => {
      monthMap[m] = { completedCount: 0, scheduledCount: 0, studentsCount: 0 };
    });

    sessions.forEach((s) => {
      if (!s.date) return;
      const monthKey = s.date.slice(0, 7); // "YYYY-MM"
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { completedCount: 0, scheduledCount: 0, studentsCount: 0 };
      }
      if (s.status === 'completed') {
        monthMap[monthKey].completedCount += 1;
        monthMap[monthKey].studentsCount += (s.studentCountActual || s.studentCountTarget || 0);
      } else if (s.status === 'scheduled' || s.status === 'pending_approval') {
        monthMap[monthKey].scheduledCount += 1;
      }
    });

    const sortedMonthKeys = Object.keys(monthMap).sort();
    let cumulative = 0;
    let cumulativeStudents = 0;
    let prevCompleted = 0;

    return sortedMonthKeys.map((key, index) => {
      const monthData = monthMap[key];
      const count = includeScheduled ? (monthData.completedCount + monthData.scheduledCount) : monthData.completedCount;
      cumulative += count;
      cumulativeStudents += monthData.studentsCount;

      // Monthly Growth Rate percentage
      let growthRate = 0;
      if (index === 0) {
        growthRate = count > 0 ? 100 : 0;
      } else if (prevCompleted > 0) {
        growthRate = Math.round(((count - prevCompleted) / prevCompleted) * 100);
      } else {
        growthRate = count > 0 ? 100 : 0;
      }
      prevCompleted = count;

      const [year, month] = key.split('-');
      const label = `${ARABIC_MONTHS[month] || month} ${year}`;

      return {
        monthKey: key,
        monthLabel: label,
        shortLabel: ARABIC_MONTHS[month] || month,
        approvedWorkshops: monthData.completedCount,
        scheduledWorkshops: monthData.scheduledCount,
        totalInMonth: count,
        cumulativeWorkshops: cumulative,
        studentsInMonth: monthData.studentsCount,
        cumulativeStudents: cumulativeStudents,
        growthRate: growthRate,
      };
    });
  }, [sessions, includeScheduled]);

  // Latest Month Growth Metric
  const latestMonthStat = useMemo(() => {
    if (monthlyGrowthData.length === 0) return { growthRate: 0, currentCount: 0, prevCount: 0 };
    const latest = monthlyGrowthData[monthlyGrowthData.length - 1];
    const prev = monthlyGrowthData.length > 1 ? monthlyGrowthData[monthlyGrowthData.length - 2] : null;
    return {
      growthRate: latest.growthRate,
      currentCount: latest.approvedWorkshops,
      prevCount: prev ? prev.approvedWorkshops : 0,
      label: latest.monthLabel,
    };
  }, [monthlyGrowthData]);

  // 2. COMPUTATION: Coverage Percentages of the 8 Academic Programs
  const programCoverageData = useMemo(() => {
    return DEPARTMENT_OPTIONS.map((dept, index) => {
      const deptSessions = sessions.filter((s) => s.department && s.department.includes(dept));
      const completed = deptSessions.filter((s) => s.status === 'completed').length;
      const scheduled = deptSessions.filter((s) => s.status === 'scheduled' || s.status === 'pending_approval').length;
      const evaluatedCount = includeScheduled ? (completed + scheduled) : completed;

      const coveragePercent = Math.min(100, Math.round((evaluatedCount / (targetPerProgram || 1)) * 100));
      const students = deptSessions.reduce((sum, s) => {
        if (s.status === 'completed') {
          return sum + (s.studentCountActual || s.studentCountTarget || 0);
        }
        return sum;
      }, 0);

      // Status Categorization
      let statusLevel: 'full' | 'advanced' | 'moderate' | 'needs_action' = 'needs_action';
      let statusText = 'بحاجة لتنشيط ودعم';
      let statusColor = '#dc2626'; // red
      let statusBg = 'bg-rose-50 border-rose-200 text-rose-800';

      if (coveragePercent >= 100) {
        statusLevel = 'full';
        statusText = 'مكتمل التغطية (100%)';
        statusColor = '#1b4329';
        statusBg = 'bg-[#f0f7f2] border-[#c8e2d1] text-[#1b4329]';
      } else if (coveragePercent >= 66) {
        statusLevel = 'advanced';
        statusText = 'تغطية متقدمة';
        statusColor = '#2d6a4f';
        statusBg = 'bg-emerald-50 border-emerald-200 text-emerald-800';
      } else if (coveragePercent >= 33) {
        statusLevel = 'moderate';
        statusText = 'تغطية متوسطة';
        statusColor = '#a4874b';
        statusBg = 'bg-amber-50 border-amber-200 text-amber-900';
      }

      return {
        dept,
        shortName: dept.length > 22 ? dept.slice(0, 20) + '...' : dept,
        completed,
        scheduled,
        evaluatedCount,
        target: targetPerProgram,
        coveragePercent,
        remainingToTarget: Math.max(0, targetPerProgram - evaluatedCount),
        students,
        statusLevel,
        statusText,
        statusColor,
        statusBg,
        chartColor: PROGRAM_PALETTE[index % PROGRAM_PALETTE.length],
      };
    });
  }, [sessions, targetPerProgram, includeScheduled]);

  // Overall Programs Coverage Ratio
  const overallCoverageSummary = useMemo(() => {
    const coveredPrograms = programCoverageData.filter((p) => p.completed > 0).length;
    const fullyTargetedPrograms = programCoverageData.filter((p) => p.coveragePercent >= 100).length;
    const averageCoveragePercent = Math.round(
      programCoverageData.reduce((sum, p) => sum + p.coveragePercent, 0) / programCoverageData.length
    );
    const topProgram = [...programCoverageData].sort((a, b) => b.completed - a.completed)[0];
    const programsNeedingWorkshops = programCoverageData.filter((p) => p.coveragePercent < 60);

    return {
      coveredCount: coveredPrograms,
      fullyTargetedCount: fullyTargetedPrograms,
      totalPrograms: DEPARTMENT_OPTIONS.length,
      averageCoveragePercent,
      topProgram,
      programsNeedingWorkshops,
    };
  }, [programCoverageData]);

  return (
    <div className="space-y-6">
      
      {/* 1. Executive Banner & Controls */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#1b4329] via-[#a4874b] to-[#2d6a4f]"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f7f2] text-[#1b4329] text-xs font-bold font-cairo border border-[#c8e2d1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a4874b]" />
              <span>لوحة القيادة الإدارية والتحليلية المتقدمة (Executive Analytics)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-kufi text-slate-900 flex items-center gap-2">
              <span>معدلات نمو الورش المهنية المعتمدة ونسب التغطية للبرامج الأكاديمية الثمانية</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-cairo max-w-3xl leading-relaxed">
              رؤية بيانية شاملة لمتابعة مسار الورش التخصصية المعتمدة شهرياً، قياس نسبة التغطية لكل برنامج من برامج الكلية التطبيقية الثمانية، وتحديد الاحتياجات الأكاديمية لتوجيه طلبات الورش للدكاترة بدقة.
            </p>
          </div>

          {/* Interactive Controls & Filters */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            {/* Target Per Program Selector */}
            <div className="flex items-center gap-1.5 text-xs font-cairo">
              <span className="text-slate-600 font-medium whitespace-nowrap">المستهدف لكل برنامج:</span>
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                {[2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetPerProgram(val)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      targetPerProgram === val
                        ? 'bg-[#1b4329] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val} ورش
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter Toggle */}
            <button
              type="button"
              onClick={() => setIncludeScheduled(!includeScheduled)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition-all flex items-center gap-1.5 cursor-pointer font-cairo ${
                includeScheduled
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{includeScheduled ? 'شامل المجدولة' : 'المعتمدة فقط'}</span>
            </button>

            {/* Direct Faculty Request Button */}
            {onOpenRequestModal && (
              <button
                type="button"
                onClick={() => onOpenRequestModal()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-kufi"
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ إرسال طلب دورة لدكتور</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Monthly Growth Rate */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 font-kufi">معدل النمو الشهري للورش</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-kufi text-emerald-950">
              {latestMonthStat.growthRate >= 0 ? `+${latestMonthStat.growthRate}%` : `${latestMonthStat.growthRate}%`}
            </span>
            <span className="inline-flex items-center text-xs font-bold font-cairo text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {latestMonthStat.growthRate >= 0 ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
              {latestMonthStat.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-cairo mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>الورش المنفذة هذا الشهر:</span>
            <strong className="text-slate-800 font-bold">{latestMonthStat.currentCount} ورشة</strong>
          </p>
        </div>

        {/* KPI 2: Overall 8-Program Coverage % */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#1b4329] to-[#2d6a4f]"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 font-kufi">نسبة التغطية العامة للبرامج الـ8</span>
            <div className="w-9 h-9 rounded-xl bg-[#f0f7f2] text-[#1b4329] flex items-center justify-center border border-[#c8e2d1]">
              <Target className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-kufi text-[#143520]">
              {overallCoverageSummary.averageCoveragePercent}%
            </span>
            <span className="text-xs font-bold text-slate-500 font-cairo">
              تغطية من المستهدف
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-cairo">
            <span className="text-slate-500">البرامج النشطة:</span>
            <strong className="text-[#1b4329]">
              {overallCoverageSummary.coveredCount} من 8 برامج
            </strong>
          </div>
        </div>

        {/* KPI 3: Total Approved Workshops & Reach */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 font-kufi">إجمالي الورش المعتمدة والطلاب</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-kufi text-slate-900">
              {completedSessions.length}
            </span>
            <span className="text-xs font-bold text-slate-500 font-cairo">
              ورشة معتمدة رسمياً
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-cairo mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>الطلاب المستفيدين:</span>
            <strong className="text-blue-900 font-bold">{totalStudents} طالب وطالبة</strong>
          </p>
        </div>

        {/* KPI 4: Top Performing Program & Student Satisfaction */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#a4874b] to-[#cbb279]"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 font-kufi">البرنامج الأكثر إنجازاً والتقييم</span>
            <div className="w-9 h-9 rounded-xl bg-[#faf6ee] text-[#785e2b] flex items-center justify-center border border-[#a4874b]/30">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-sm font-bold text-[#785e2b] font-kufi truncate" title={overallCoverageSummary.topProgram?.dept}>
              {overallCoverageSummary.topProgram?.dept || 'البرمجة وعلوم الحاسب'}
            </div>
            <div className="text-xs text-slate-500 font-cairo mt-0.5">
              إنجاز {overallCoverageSummary.topProgram?.completed || 0} ورش ({overallCoverageSummary.topProgram?.coveragePercent || 100}%)
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-cairo">
            <span className="text-slate-500">متوسط تقييم الطلبة:</span>
            <span className="font-bold text-[#785e2b] flex items-center gap-1 font-kufi">
              <span>⭐ {averageRating}</span>
              <span className="text-[10px] text-slate-400">/ 5.0</span>
            </span>
          </div>
        </div>

      </div>

      {/* 3. CHART 1: Monthly Growth Rate of Approved Workshops */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 bg-white shadow-xs space-y-4">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kufi">
                معدل نمو الورش المهنية المعتمدة شهرياً
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-cairo mt-1 mr-9">
              تتبع وتيرة اعتماد الورش، التوسع التراكمي، ونسب التغير الشهري عبر مسار الفصل الدراسي
            </p>
          </div>

          {/* Chart Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center font-cairo text-xs">
            <button
              type="button"
              onClick={() => setGrowthChartMode('composed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                growthChartMode === 'composed'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              النمو التراكمي والشهري
            </button>
            <button
              type="button"
              onClick={() => setGrowthChartMode('students')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                growthChartMode === 'students'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الورش والطلاب
            </button>
            <button
              type="button"
              onClick={() => setGrowthChartMode('rate')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                growthChartMode === 'rate'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              معدل النمو %
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-80 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            {growthChartMode === 'composed' ? (
              <ComposedChart data={monthlyGrowthData} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b4329" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1b4329" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="goldBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbb279" />
                    <stop offset="100%" stopColor="#a4874b" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="shortLabel" 
                  tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Cairo' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="right" 
                  tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Cairo' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="left" 
                  tick={{ fill: '#a4874b', fontSize: 11, fontFamily: 'Cairo' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3.5 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-right font-cairo text-xs space-y-1.5">
                          <div className="font-bold text-[#e5d4a6] border-b border-slate-700 pb-1 font-kufi">
                            {data.monthLabel}
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">الورش المنفذة بالشهر:</span>
                            <span className="font-bold text-amber-400">{data.approvedWorkshops} ورشة</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">النمو التراكمي:</span>
                            <span className="font-bold text-emerald-400">{data.cumulativeWorkshops} ورشة</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">معدل النمو الشهري:</span>
                            <span className={`font-bold ${data.growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {data.growthRate > 0 ? `+${data.growthRate}%` : `${data.growthRate}%`}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                            <span className="text-slate-400">الطلاب المستفيدين:</span>
                            <span className="font-bold text-white">{data.studentsInMonth} طالب</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 10, fontFamily: 'Cairo', fontSize: 12 }}
                  formatter={(value) => {
                    if (value === 'approvedWorkshops') return 'الورش المعتمدة خلال الشهر';
                    if (value === 'cumulativeWorkshops') return 'النمو التراكمي للورش';
                    return value;
                  }}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="approvedWorkshops" 
                  name="approvedWorkshops" 
                  fill="url(#goldBarGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
                <Area 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cumulativeWorkshops" 
                  name="cumulativeWorkshops" 
                  stroke="#1b4329" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#emeraldGradient)" 
                />
              </ComposedChart>
            ) : growthChartMode === 'students' ? (
              <BarChart data={monthlyGrowthData} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="shortLabel" tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Cairo' }} tickLine={false} />
                <YAxis yAxisId="workshops" orientation="right" tick={{ fill: '#1b4329', fontSize: 11 }} tickLine={false} />
                <YAxis yAxisId="students" orientation="left" tick={{ fill: '#0284c7', fontSize: 11 }} tickLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg text-right font-cairo text-xs space-y-1">
                          <div className="font-bold text-amber-300 font-kufi">{data.monthLabel}</div>
                          <div>الورش المعتمدة: <strong className="text-emerald-400">{data.approvedWorkshops}</strong></div>
                          <div>الطلاب المستفيدين: <strong className="text-sky-300">{data.studentsInMonth} طالب</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontFamily: 'Cairo', fontSize: 12 }} />
                <Bar yAxisId="workshops" dataKey="approvedWorkshops" name="الورش المنفذة" fill="#1b4329" radius={[6, 6, 0, 0]} barSize={26} />
                <Bar yAxisId="students" dataKey="studentsInMonth" name="الطلاب المستفيدين" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            ) : (
              <LineChart data={monthlyGrowthData} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="shortLabel" tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Cairo' }} tickLine={false} />
                <YAxis unit="%" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg text-right font-cairo text-xs">
                          <div className="font-bold text-amber-300 font-kufi">{data.monthLabel}</div>
                          <div className="mt-1">معدل التغير عن الشهر السابق: <strong className="text-emerald-400">{data.growthRate}%</strong></div>
                          <div>الورش المنفذة: {data.approvedWorkshops} ورشة</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontFamily: 'Cairo', fontSize: 12 }} />
                <Line type="monotone" dataKey="growthRate" name="معدل النمو الشهري (%)" stroke="#16a34a" strokeWidth={3} dot={{ r: 5, fill: '#1b4329' }} activeDot={{ r: 7 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Growth Key Insights Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs font-cairo">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">مؤشر تسارع وتيرة الإنجاز:</div>
              <div className="font-bold text-slate-800">
                نمو إيجابي مستمر بنسبة ({latestMonthStat.growthRate}%)
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">الشهر الأعلى إنتاجية:</div>
              <div className="font-bold text-slate-800">
                {monthlyGrowthData.reduce((prev, curr) => curr.approvedWorkshops > prev.approvedWorkshops ? curr : prev, monthlyGrowthData[0])?.monthLabel}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">متوسط حضور الطلبة لكل ورشة:</div>
              <div className="font-bold text-slate-800">
                {completedSessions.length > 0 ? Math.round(totalStudents / completedSessions.length) : 0} طالباً لكل ورشة
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. CHART 2: Coverage Percentages of the 8 Academic Programs */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 bg-white shadow-xs space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-kufi">
                نسب التغطية للبرامج الأكاديمية الثمانية
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-cairo mt-1 mr-9">
              مقارنة الإنجاز الفعلي بمستهدف الكلية ({targetPerProgram} ورش لكل برنامج) لضمان عدالة التغطية بين كافة التخصصات
            </p>
          </div>

          {/* Toggle View */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center font-cairo text-xs">
            <button
              type="button"
              onClick={() => setCoverageChartMode('bar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                coverageChartMode === 'bar'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              أعمدة نسب التغطية (%)
            </button>
            <button
              type="button"
              onClick={() => setCoverageChartMode('target_vs_actual')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                coverageChartMode === 'target_vs_actual'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              المنفذ مقابل المستهدف
            </button>
            <button
              type="button"
              onClick={() => setCoverageChartMode('donut')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                coverageChartMode === 'donut'
                  ? 'bg-white text-[#1b4329] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الحصص النسبية
            </button>
          </div>
        </div>

        {/* Coverage Chart */}
        <div className="h-96 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            {coverageChartMode === 'bar' ? (
              <BarChart
                data={programCoverageData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  unit="%" 
                  tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Cairo' }}
                />
                <YAxis 
                  dataKey="dept" 
                  type="category" 
                  tick={{ fill: '#0f172a', fontSize: 12, fontFamily: 'Cairo', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={130}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-right font-cairo text-xs space-y-1">
                          <div className="font-bold text-[#e5d4a6] font-kufi">{data.dept}</div>
                          <div className="text-emerald-300">نسبة التغطية: <strong>{data.coveragePercent}%</strong></div>
                          <div>الورش المعتمدة: <strong>{data.completed}</strong> من مستهدف {data.target}</div>
                          <div>الطلاب المستفيدين: <strong>{data.students}</strong> طالب</div>
                          <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                            الحالة: {data.statusText}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="coveragePercent" 
                  name="نسبة التغطية (%)" 
                  radius={[0, 8, 8, 0]} 
                  barSize={20}
                >
                  {programCoverageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.coveragePercent >= 100 ? '#1b4329' : entry.coveragePercent >= 66 ? '#2d6a4f' : entry.coveragePercent >= 33 ? '#a4874b' : '#ea580c'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : coverageChartMode === 'target_vs_actual' ? (
              <BarChart
                data={programCoverageData}
                margin={{ top: 15, right: 20, left: 10, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Cairo' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg text-right font-cairo text-xs space-y-1">
                          <div className="font-bold text-amber-300 font-kufi">{data.dept}</div>
                          <div>الورش المنفذة: <strong className="text-emerald-400">{data.completed}</strong></div>
                          <div>المستهدف المطلوب: <strong className="text-slate-300">{data.target}</strong></div>
                          <div>المتبقي للهدف: <strong className="text-rose-400">{data.remainingToTarget}</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontFamily: 'Cairo', fontSize: 12 }} />
                <Bar dataKey="completed" name="الورش المنفذة المعتمدة" fill="#1b4329" radius={[6, 6, 0, 0]} barSize={22} />
                <Bar dataKey="remainingToTarget" name="المتبقي لإكمال المستهدف" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            ) : (
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={programCoverageData}
                  dataKey="completed"
                  nameKey="dept"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  label={({ dept, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {programCoverageData.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.chartColor} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg text-right font-cairo text-xs">
                          <div className="font-bold text-[#e5d4a6] font-kufi">{data.dept}</div>
                          <div>الورش المعتمدة: <strong>{data.completed} ورشة</strong></div>
                          <div>نسبة المساهمة: <strong>{((data.completed / (completedSessions.length || 1)) * 100).toFixed(1)}%</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 11 }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* 5. Executive Action Matrix: The 8 Academic Programs Breakdown */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 bg-white shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-kufi flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1b4329]" />
              <span>مصفوفة المتابعة الميدانية والتدخل الإداري للبرامج الثمانية</span>
            </h3>
            <p className="text-xs text-slate-500 font-cairo mt-0.5">
              بيان تفصيلي لكل برنامج مع إمكانية إرسال طلب دورة مخصصة لدكتور في البرامج ذات التغطية المنخفضة فوراً
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-center font-cairo">
            المستهدف الحالي: {targetPerProgram} ورش / لكل برنامج
          </span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#f8faf9] text-slate-700 font-bold border-b border-slate-200 font-kufi">
              <tr>
                <th className="py-3.5 px-4">البرنامج الأكاديمي (الـ8)</th>
                <th className="py-3.5 px-4 text-center">الورش المعتمدة</th>
                <th className="py-3.5 px-4 text-center">الطلاب المستفيدين</th>
                <th className="py-3.5 px-4 min-w-[160px]">نسبة التغطية من المستهدف</th>
                <th className="py-3.5 px-4 text-center">حالة التغطية</th>
                <th className="py-3.5 px-4 text-center">الإجراء الإداري الموصى به</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-cairo">
              {programCoverageData.map((item, index) => (
                <tr key={index} className="hover:bg-[#f0f7f2]/30 transition-colors">
                  
                  {/* Department Name */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-kufi">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: item.chartColor }}
                      />
                      <span>{item.dept}</span>
                    </div>
                  </td>

                  {/* Completed Workshops */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-800 text-sm font-kufi">
                      {item.completed}
                    </span>
                    <span className="text-slate-400 text-[11px] block font-cairo">
                      من {item.target} ورش
                    </span>
                  </td>

                  {/* Students Reached */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {item.students} <span className="font-normal text-slate-500 text-[10px]">طالب</span>
                  </td>

                  {/* Progress Bar & Percentage */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold" style={{ color: item.statusColor }}>
                        {item.coveragePercent}%
                      </span>
                      {item.remainingToTarget > 0 ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          متبقي {item.remainingToTarget} ورشة
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          اكتمل المستهدف ✓
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.coveragePercent}%`,
                          backgroundColor: item.statusColor,
                        }}
                      />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.statusBg}`}>
                      {item.statusLevel === 'full' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{item.statusText}</span>
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-center">
                    {onOpenRequestModal ? (
                      <button
                        type="button"
                        onClick={() => onOpenRequestModal(item.dept)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-kufi text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer shadow-2xs"
                        title={`إرسال طلب دورة لدكتور في ${item.dept}`}
                      >
                        <Send className="w-3 h-3" />
                        <span>طلب دورة للدكتور</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
