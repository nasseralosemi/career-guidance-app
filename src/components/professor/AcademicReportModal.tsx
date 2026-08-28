import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Calendar, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  X, 
  Download, 
  Sparkles,
  FileText,
  Building2,
  GraduationCap,
  ExternalLink,
  Check
} from 'lucide-react';
import { FacultyMember, WorkshopSession, DeanOfficialConfig } from '../../types';
import { printAcademicReport, generateAcademicReportHTML } from '../../utils/academicReportPrinter';

interface AcademicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  professor: FacultyMember;
  completedSessions: WorkshopSession[];
  deanConfig: DeanOfficialConfig;
  totalPoints: number;
  doctorRankText: string;
  totalFacultyCount: number;
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  isOpen,
  onClose,
  professor,
  completedSessions,
  deanConfig,
  totalPoints,
  doctorRankText,
  totalFacultyCount,
}) => {
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsPrinting(true);
    setFeedbackMsg('جاري تجهيز وثيقة التقرير واستدعاء نافذة الطباعة...');

    const success = printAcademicReport({
      professor,
      completedSessions,
      deanConfig,
      totalPoints,
      doctorRankText,
      totalFacultyCount,
    });

    setTimeout(() => {
      setIsPrinting(false);
      if (success) {
        setFeedbackMsg('تم استدعاء أمر الطباعة / الحفظ بنجاح.');
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    }, 1000);
  };

  const handleOpenInNewTab = () => {
    const html = generateAcademicReportHTML({
      professor,
      completedSessions,
      deanConfig,
      totalPoints,
      doctorRankText,
      totalFacultyCount,
    });

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const totalStudents = completedSessions.reduce(
    (sum, s) => sum + (s.studentCountActual || s.studentCountTarget || 0),
    0
  );

  const reportDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const gregorianDate = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const currentAcademicYear = `${new Date().getFullYear() - 1} / ${new Date().getFullYear()}م`;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs font-kufi print:static print:p-0 print:m-0 print:bg-transparent print:backdrop-blur-none print:overflow-visible print:w-full print:block" 
      id="annual-report-modal"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-4 print:shadow-none print:rounded-none print:border-none print:m-0 print:max-w-none print:w-full print:bg-white print:overflow-visible">
        
        {/* Action Header (Hidden during print) */}
        <div className="no-print bg-gradient-to-r from-[#143520] to-[#1b4329] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#a4874b]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#245836] text-[#e5d4a6] flex items-center justify-center border border-[#a4874b]/40 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-kufi">
                السجل الأكاديمي السنوي للإنجازات والأنشطة الإرشادية
              </h3>
              <p className="text-xs text-emerald-200/90 font-cairo">
                وثيقة رسمية معتمدة جاهزة للطباعة والتصدير كملف إنجاز أكاديمي (PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2 bg-gradient-to-r from-[#a4874b] to-[#c4a96b] hover:from-[#8f743c] hover:to-[#a4874b] text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer font-kufi active:scale-95 disabled:opacity-50"
              title="طباعة السجل أو حفظه كملف PDF"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'جاري التحضير...' : 'طباعة السجل / حفظ كـ PDF'}</span>
            </button>

            {/* Open in full independent window */}
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer font-kufi"
              title="فتح الوثيقة المستقلة في نافذة جديدة كاملة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#e5d4a6]" />
              <span className="hidden sm:inline">نافذة مستقلة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if triggered */}
        {feedbackMsg && (
          <div className="no-print bg-[#faf6ee] border-b border-[#e2d3b3] px-5 py-2 text-xs text-[#1b4329] font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Printable Report Document (A4 Styling) */}
        <div className="printable-report p-6 sm:p-10 md:p-12 bg-white text-slate-900 overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible print:p-0 print:m-0 print:shadow-none print:border-none">
          
          {/* 1. Official Header with Islamic & Gregorian Date */}
          <div className="border-b-2 border-[#1b4329] pb-6 mb-6">
            <div className="flex justify-between items-start">
              
              {/* Right Side: University & College details */}
              <div className="text-right space-y-1">
                <div className="text-xs font-bold text-slate-600 font-cairo">المملكة العربية السعودية</div>
                <div className="text-xs font-bold text-slate-600 font-cairo">وزارة التعليم • جامعة المجمعة</div>
                <div className="text-base font-bold text-[#1b4329] font-kufi">الكلية التطبيقية</div>
                <div className="text-xs font-semibold text-[#8f743c] font-cairo">وحدة الإرشاد والتطوير المهني والتوظيف</div>
              </div>

              {/* Center Emblem/Title */}
              <div className="text-center px-4">
                <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-[#faf6ee] border border-[#a4874b]/40 flex items-center justify-center text-[#1b4329] shadow-xs">
                  <GraduationCap className="w-8 h-8 text-[#1b4329]" />
                </div>
                <div className="inline-block px-3 py-1 bg-[#1b4329]/10 text-[#1b4329] text-[11px] font-bold rounded-full font-cairo border border-[#1b4329]/20">
                  العام الأكاديمي: {currentAcademicYear}
                </div>
              </div>

              {/* Left Side: Report Metadata */}
              <div className="text-left space-y-1 text-xs text-slate-600 font-cairo" dir="ltr">
                <div><strong>Ref:</strong> MU-AC-REP-{new Date().getFullYear()}-{professor.id.replace(/\D/g, '').padStart(3, '0') || '101'}</div>
                <div><strong>Date:</strong> {gregorianDate}</div>
                <div><strong>Hijri:</strong> {reportDate}</div>
              </div>
            </div>

            {/* Document Main Title */}
            <div className="mt-6 text-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#1b4329] font-kufi">
                تقرير الإنجاز السنوي والأنشطة الإرشادية والتدريبية
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-cairo mt-1">
                سجل توثيق ورش العمل والبرامج المهنية المنفذة لصالح طلبة الكلية التطبيقية
              </p>
            </div>
          </div>

          {/* 2. Professor Information Profile Box */}
          <div className="bg-[#fcfbf9] border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/80 font-bold text-[#1b4329] font-kufi">
              <Building2 className="w-4 h-4 text-[#8f743c]" />
              <span>بيانات عضو هيئة التدريس / المحاضر المعتمد:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-cairo">
              <div>
                <span className="text-slate-500 text-xs block">اسم المحاضر:</span>
                <span className="font-bold text-slate-900">{professor.title} / {professor.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">القسم الأكاديمي:</span>
                <span className="font-bold text-slate-900">{professor.department}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">مقر التدريس:</span>
                <span className="font-bold text-slate-900">{professor.campus}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">البريد الجامعي:</span>
                <span className="font-mono text-xs font-semibold text-slate-700">{professor.email}</span>
              </div>
            </div>
          </div>

          {/* 3. Summary Dashboard & KPI Cards */}
          <div className="mb-6">
            <div className="text-xs font-bold text-[#1b4329] font-kufi mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a4874b]" />
              <span>ملخص مؤشرات الأداء والإنجازات المعتمدة:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Stat 1 */}
              <div className="p-3.5 rounded-xl bg-[#faf6ee] border border-[#a4874b]/30 text-center">
                <div className="text-xl sm:text-2xl font-bold font-kufi text-[#1b4329]">
                  {completedSessions.length}
                </div>
                <div className="text-xs text-slate-700 font-semibold font-cairo mt-0.5">
                  ورش عمل منفذة ومعتمدة
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                <div className="text-xl sm:text-2xl font-bold font-kufi text-emerald-900">
                  {totalStudents}
                </div>
                <div className="text-xs text-slate-700 font-semibold font-cairo mt-0.5">
                  طالباً مستفيداً (حضور فعلي)
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                <div className="text-xl sm:text-2xl font-bold font-kufi text-amber-950">
                  {completedSessions.length}
                </div>
                <div className="text-xs text-slate-700 font-semibold font-cairo mt-0.5">
                  شهادات شكر وتقدير رسمية
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3.5 rounded-xl bg-[#143520] text-white text-center border border-[#a4874b]/40">
                <div className="text-sm sm:text-base font-bold font-kufi text-[#e5d4a6]">
                  {doctorRankText}
                </div>
                <div className="text-[11px] text-emerald-100 font-cairo mt-0.5">
                  الترتيب الأكاديمي بالكلية ({totalPoints} نقطة)
                </div>
              </div>

            </div>
          </div>

          {/* 4. Detailed Table of Completed & Approved Workshops */}
          <div className="mb-8">
            <div className="text-xs font-bold text-[#1b4329] font-kufi mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>سجل ورش العمل والفعاليات المنفذة تفصيلياً:</span>
              </div>
              <span className="text-xs text-slate-500 font-cairo">
                إجمالي السجلات: {completedSessions.length} ورشة
              </span>
            </div>

            {completedSessions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 text-xs font-cairo">
                لا توجد ورش عمل معتمدة مسجلة في هذا العام حتى الآن.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1b4329] text-white font-kufi text-[11px]">
                      <th className="p-3 font-bold border-b border-[#143520]">#</th>
                      <th className="p-3 font-bold border-b border-[#143520]">عنوان ورشة العمل / الحقيبة</th>
                      <th className="p-3 font-bold border-b border-[#143520]">تاريخ التنفيذ</th>
                      <th className="p-3 font-bold border-b border-[#143520]">المقر والقاعة</th>
                      <th className="p-3 font-bold border-b border-[#143520] text-center">الطلاب الحاضرين</th>
                      <th className="p-3 font-bold border-b border-[#143520] text-center">رقم الاعتماد الرسمي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-cairo">
                    {completedSessions.map((session, index) => {
                      const certId = session.certificateId || `MU-AC-CERT-${new Date().getFullYear()}-${session.id.replace(/\D/g, '').padStart(4, '0') || '0101'}`;
                      return (
                        <tr key={session.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-3 font-bold text-slate-700 font-mono text-center">{index + 1}</td>
                          <td className="p-3 font-bold text-slate-900">
                            <div>{session.courseTitle}</div>
                            <span className="text-[10px] text-[#785e2b] bg-[#faf6ee] px-1.5 py-0.5 rounded border border-[#a4874b]/30 font-mono">
                              {session.courseCode}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700 whitespace-nowrap">
                            <div>{session.date}</div>
                            <div className="text-[10px] text-slate-500">{session.timeSlot}</div>
                          </td>
                          <td className="p-3 text-slate-700">
                            <div>{session.campus}</div>
                            <div className="text-[10px] text-slate-500">{session.hallName}</div>
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-800 font-mono">
                            {session.studentCountActual || session.studentCountTarget} طالب
                          </td>
                          <td className="p-3 text-center font-mono text-[11px] text-slate-600 font-semibold">
                            {certId}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 5. Official Signatures & Accreditation Footer */}
          <div className="pt-6 border-t-2 border-slate-200 font-cairo">
            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              
              {/* Member Signature */}
              <div className="space-y-3">
                <div className="font-bold text-slate-800 font-kufi">
                  عضو هيئة التدريس / معد التقرير
                </div>
                <div className="text-slate-600">
                  {professor.title} / {professor.name}
                </div>
                <div className="pt-6 border-b border-dashed border-slate-400 w-36 mx-auto"></div>
                <div className="text-[10px] text-slate-400">التوقيع والتاريخ</div>
              </div>

              {/* Dean / Supervisor Endorsement */}
              <div className="space-y-3">
                <div className="font-bold text-[#1b4329] font-kufi">
                  مصادقة واعتماد وحدة الإرشاد والتطوير المهني
                </div>
                <div className="text-slate-700 font-semibold">
                  {deanConfig.deanTitle} / {deanConfig.deanName}
                </div>
                <div className="text-[11px] text-[#8f743c] font-bold font-kufi">
                  {deanConfig.unitHeadTitle || deanConfig.deanCollege || 'رئيس الكلية التطبيقية'}
                </div>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>معتمد رسمياً بنظام التوثيق الأكاديمي الرقمي</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Print Note */}
            <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              تم إصدار هذا التقرير آلياً عبر منصة الإرشاد والتطوير المهني بالكلية التطبيقية • جامعة المجمعة • لا يحتاج إلى ختم ورقي في حال وجود رقم الاعتماد الرقمي.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
