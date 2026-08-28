import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Sparkles, 
  X, 
  BookOpen, 
  CalendarCheck, 
  RotateCcw,
  Download,
  FileText,
  Presentation,
  Layers,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkshopCourse, WorkshopSession, FacultyMember } from '../../types';
import { TIME_SLOTS_PRESETS, CAMPUS_OPTIONS } from '../../data/mockData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: WorkshopCourse[];
  sessions: WorkshopSession[];
  currentProfessor: FacultyMember;
  initialSelectedCourse?: WorkshopCourse | null;
  onConfirmBooking: (sessionData: Partial<WorkshopSession>) => void;
  onOpenCourseDrawer: (course: WorkshopCourse) => void;
  onNavigateToMySessions?: () => void;
}

// Key for persisting session draft/defaults within current browser session
const SESSION_BOOKING_PREFS_KEY = 'mu_booking_session_prefs';

interface SavedBookingPrefs {
  selectedDate: string;
  selectedTimeSlot: string;
  deliveryMode: 'in_person' | 'remote';
  hallName: string;
  studentCountTarget: number;
  campus: string;
  hasBookedBefore: boolean;
}

export const InteractiveBookingCalendar: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  courses,
  sessions,
  currentProfessor,
  initialSelectedCourse,
  onConfirmBooking,
  onOpenCourseDrawer,
  onNavigateToMySessions,
}) => {
  // Read saved session preferences if any
  const getInitialPrefs = (): SavedBookingPrefs => {
    try {
      const saved = sessionStorage.getItem(SESSION_BOOKING_PREFS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 2);
    return {
      selectedDate: defaultDate.toISOString().split('T')[0],
      selectedTimeSlot: TIME_SLOTS_PRESETS[1],
      deliveryMode: 'in_person',
      hallName: 'قاعة التدريب الذكي (204) - المقر الرئيسي',
      studentCountTarget: 30,
      campus: currentProfessor.campus || CAMPUS_OPTIONS[0],
      hasBookedBefore: false,
    };
  };

  const initialPrefs = getInitialPrefs();

  // Modal Step: Step 1 (Course Review & Materials) -> Step 2 (Date & Time) -> Step 3 (Hall & Students)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedCourse, setSelectedCourse] = useState<WorkshopCourse | null>(
    initialSelectedCourse || courses[0] || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(initialPrefs.selectedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(initialPrefs.selectedTimeSlot);
  const [deliveryMode, setDeliveryMode] = useState<'in_person' | 'remote'>(initialPrefs.deliveryMode);
  const [hallName, setHallName] = useState<string>(initialPrefs.hallName);
  const [studentCountTarget, setStudentCountTarget] = useState<number>(initialPrefs.studentCountTarget);
  const [campus, setCampus] = useState<string>(initialPrefs.campus || currentProfessor.campus || CAMPUS_OPTIONS[0]);
  const [notes, setNotes] = useState<string>('');

  // Success Confirmation State
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookedSessionDetails, setBookedSessionDetails] = useState<{
    courseTitle: string;
    courseCode: string;
    date: string;
    timeSlot: string;
    hallName: string;
    deliveryMode: 'in_person' | 'remote';
    campus: string;
  } | null>(null);

  // Sync state whenever modal opens or initialSelectedCourse changes
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setStep(1); // Always start at Step 1 to review the selected course and materials
      const currentPrefs = getInitialPrefs();
      if (initialSelectedCourse) {
        setSelectedCourse(initialSelectedCourse);
      } else if (!selectedCourse && courses.length > 0) {
        setSelectedCourse(courses[0]);
      }

      // Update state with latest session prefs
      setSelectedDate(currentPrefs.selectedDate);
      setSelectedTimeSlot(currentPrefs.selectedTimeSlot);
      setDeliveryMode(currentPrefs.deliveryMode);
      setHallName(currentPrefs.hallName);
      setStudentCountTarget(currentPrefs.studentCountTarget);
      setCampus(currentPrefs.campus || currentProfessor.campus || CAMPUS_OPTIONS[0]);
      setNotes('');
    }
  }, [isOpen, initialSelectedCourse]);

  if (!isOpen) return null;

  // Check slot conflicts on chosen date
  const conflictingSessions = sessions.filter(
    (s) => s.date === selectedDate && s.timeSlot === selectedTimeSlot && s.status !== 'cancelled'
  );
  const hasConflict = conflictingSessions.length > 0;

  // Handle final submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const sessionData: Partial<WorkshopSession> = {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      courseCode: selectedCourse.code,
      professorId: currentProfessor.id,
      professorName: currentProfessor.name,
      professorTitle: currentProfessor.title,
      professorEmail: currentProfessor.email,
      professorPhone: currentProfessor.phone,
      department: currentProfessor.department,
      campus: campus,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      hallName: deliveryMode === 'in_person' ? hallName : 'عبر البلاك بورد (جلسة افتراضية)',
      deliveryMode: deliveryMode,
      studentCountTarget: Number(studentCountTarget) || 30,
      status: 'scheduled',
      sessionNotes: notes,
      certificateIssued: false,
      reminderSentWhatsApp: true,
      reminderSentEmail: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save session preferences for rapid repeated bookings in the same session
    try {
      const prefsToSave: SavedBookingPrefs = {
        selectedDate,
        selectedTimeSlot,
        deliveryMode,
        hallName,
        studentCountTarget: Number(studentCountTarget) || 30,
        campus,
        hasBookedBefore: true,
      };
      sessionStorage.setItem(SESSION_BOOKING_PREFS_KEY, JSON.stringify(prefsToSave));
    } catch {
      // ignore
    }

    // Call parent handler to persist data
    onConfirmBooking(sessionData);

    // Save details for success screen
    setBookedSessionDetails({
      courseTitle: selectedCourse.title,
      courseCode: selectedCourse.code,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      hallName: deliveryMode === 'in_person' ? hallName : 'عبر البلاك بورد (جلسة افتراضية)',
      deliveryMode,
      campus,
    });

    // Trigger success celebration
    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNavigateToSessionsTab = () => {
    onClose();
    if (onNavigateToMySessions) {
      onNavigateToMySessions();
    }
  };

  const handleResetForNewBooking = () => {
    setIsSuccess(false);
    setStep(1);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs font-kufi" id="booking-modal-overlay">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto animate-scaleUp">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#a4874b]/20 text-[#e5d4a6] border border-[#a4874b]/40">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-kufi">حجز ورشة إرشاد مهني جديدة لطلابك</h2>
              <p className="text-xs text-emerald-100/90 font-cairo">
                استعراض الحقيبة، تحميل العروض والأدلة، وجدولة موعد الجلسة بدقة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step indicator (Shown during booking wizard) */}
        {!isSuccess && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-kufi">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                step === 1 ? 'text-[#1b4329]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-[#1b4329] text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>استعراض الحقيبة والملفات</span>
            </button>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <button
              type="button"
              onClick={() => {
                if (selectedCourse) setStep(2);
              }}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                step === 2 ? 'text-[#1b4329]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-[#1b4329] text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>الموعد والتوقيت</span>
            </button>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <button
              type="button"
              onClick={() => {
                if (selectedCourse && !hasConflict) setStep(3);
              }}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                step === 3 ? 'text-[#1b4329]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-[#1b4329] text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>القاعة والأعداد</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUCCESS CONFIRMATION MODAL (شاشة تأكيد الحجز) */}
        {/* ============================================================ */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-fadeIn font-cairo">
            {/* Green Check Icon with Glowing Ring */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500/30 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-kufi text-[#143520]">
                تمت جدولة الورشة بنجاح!
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                تمت جدولة الورشة بنجاح! يمكنك الاطلاع عليها ومتابعة تنفيذها من تبويب <strong className="text-[#1b4329] font-bold">(جدول ورشي ومتابعة التنفيذ)</strong>.
              </p>
            </div>

            {/* Scheduled Session Summary Card */}
            {bookedSessionDetails && (
              <div className="bg-[#f8faf9] border border-[#c8e2d1] rounded-2xl p-4 text-right text-xs sm:text-sm space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-slate-500 font-medium">الحقيبة التدريبية:</span>
                  <span className="font-bold text-[#143520] font-kufi">{bookedSessionDetails.courseTitle}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#a4874b] shrink-0" />
                    <span>التاريخ: <strong>{bookedSessionDetails.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#a4874b] shrink-0" />
                    <span>التوقيت: <strong>{bookedSessionDetails.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-[#a4874b] shrink-0" />
                    <span>الموقع / القاعة: <strong>{bookedSessionDetails.hallName} ({bookedSessionDetails.campus})</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Hint for automated notification */}
            <div className="p-3 bg-[#faf6ee] border border-[#a4874b]/30 rounded-xl text-xs text-[#785e2b] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8f743c] shrink-0" />
              <span>تم إرسال إشعار التأكيد والمرفقات إلى بريدك الإلكتروني الجامعي مباشرة.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleNavigateToSessionsTab}
                className="w-full sm:w-auto px-6 py-3 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-kufi"
              >
                <CalendarCheck className="w-4 h-4 text-[#e5d4a6]" />
                <span>الانتقال إلى جدول ورشي</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-kufi"
              >
                <span>إغلاق</span>
              </button>

              <button
                type="button"
                onClick={handleResetForNewBooking}
                className="w-full sm:w-auto px-4 py-3 text-[#1b4329] hover:bg-[#f0f7f2] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-kufi border border-[#1b4329]/20"
                title="حجز ورشة إضافية أخرى بنفس الإعدادات"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>حجز ورشة أخرى</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* WIZARD STEPS */
          /* ============================================================ */
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            {/* Quick Fast-Track Banner if doctor booked previously */}
            {initialPrefs.hasBookedBefore && step > 1 && (
              <div className="mb-4 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-[#143520] flex items-center justify-between font-cairo">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#a4874b] shrink-0" />
                  <span>تم استرجاع تفاصيل الموعد والقاعة والمقر تلقائيًا لتسريع حجزك.</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">يمكنك التعديل في أي خطوة</span>
              </div>
            )}

            {/* STEP 1: DETAILED COURSE REVIEW & DIRECT MATERIALS ACCESS */}
            {step === 1 && selectedCourse && (
              <div className="space-y-4 font-cairo">
                {/* Course Main Details Card */}
                <div className="bg-gradient-to-br from-[#f8faf9] to-[#edf4f0] border border-[#c8e2d1] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
                  {/* Decorative background logo */}
                  <div className="absolute -left-4 -bottom-4 opacity-5 pointer-events-none">
                    <BookOpen className="w-36 h-36 text-[#1b4329]" />
                  </div>

                  <div className="relative z-10 space-y-3.5">
                    {/* Course Badges & Code */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#faf6ee] text-[#785e2b] px-2.5 py-0.5 rounded-lg border border-[#a4874b]/30">
                          {selectedCourse.code}
                        </span>
                        <span className="text-xs font-medium text-[#1b4329] bg-[#e2f0e7] px-2.5 py-0.5 rounded-lg border border-[#c8e2d1]">
                          {selectedCourse.categoryLabel}
                        </span>
                      </div>

                      {/* Course Switcher Dropdown if doctor wants to switch */}
                      {courses.length > 1 && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-500 text-[11px]">تغيير الحقيبة:</span>
                          <select
                            value={selectedCourse.id}
                            onChange={(e) => {
                              const found = courses.find((c) => c.id === e.target.value);
                              if (found) setSelectedCourse(found);
                            }}
                            className="bg-white border border-slate-300 rounded-lg text-xs py-1 px-2 text-slate-700 font-kufi focus:ring-1 focus:ring-[#1b4329]"
                          >
                            {courses.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title} ({c.code})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#143520] font-kufi">
                        {selectedCourse.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {selectedCourse.shortDescription}
                      </p>
                    </div>

                    {/* Meta Specs Grid: Duration, Target Audience & Students Count */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">المدة الزمنية</div>
                          <div className="font-bold text-slate-800 font-kufi">{selectedCourse.durationMinutes} دقيقة</div>
                        </div>
                      </div>

                      <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">الفئة المستهدفة</div>
                          <div className="font-bold text-slate-800 font-kufi text-[11px] truncate max-w-[130px]" title={selectedCourse.targetAudience}>
                            {selectedCourse.targetAudience}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">العدد الموصى به</div>
                          <div className="font-bold text-slate-800 font-kufi">{selectedCourse.recommendedStudentsMin} - {selectedCourse.recommendedStudentsMax} طالباً</div>
                        </div>
                      </div>
                    </div>

                    {/* Learning Outcomes Summary */}
                    {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                      <div className="pt-1">
                        <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 font-kufi">
                          <Sparkles className="w-3.5 h-3.5 text-[#a4874b]" />
                          <span>أبرز المخرجات والكفايات المهنية:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {selectedCourse.learningOutcomes.slice(0, 4).map((outcome, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-white/60 px-2 py-1.5 rounded-lg border border-slate-200/60">
                              <CheckCircle className="w-3.5 h-3.5 text-[#1b4329] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Embedded Teaching Materials & PPTX Section */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-[#1b4329]" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-kufi">
                        ملفات ومرفقات الحقيبة التدريبية المعتمدة:
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">جاهزة للتحميل الفوري</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Facilitator Guide Button */}
                    <div className="p-3 bg-slate-50 hover:bg-[#f0f7f2]/60 rounded-xl border border-slate-200 hover:border-[#1b4329]/40 transition-all flex items-center justify-between gap-2.5 group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate font-kufi group-hover:text-[#1b4329]">
                            دليل الميسر المعتمد (PDF)
                          </div>
                          <div className="text-[10px] text-slate-500">
                            خطة الجلسة وإرشادات الأنشطة
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenCourseDrawer(selectedCourse)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer font-kufi shadow-2xs"
                          title="معاينة الدليل وخطة التيسير"
                        >
                          معاينة
                        </button>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(`دليل الميسر المعتمد لورشة: ${selectedCourse.title} - جامعة المجمعة الكلية التطبيقية`)}`}
                          download={`${selectedCourse.code}-Facilitator-Guide.pdf`}
                          className="p-1.5 bg-white hover:bg-[#1b4329] text-slate-700 hover:text-white border border-slate-200 hover:border-[#1b4329] rounded-lg transition-all cursor-pointer shadow-2xs"
                          title="تحميل الدليل"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Presentation PPTX Button */}
                    <div className="p-3 bg-slate-50 hover:bg-[#faf6ee]/70 rounded-xl border border-slate-200 hover:border-[#a4874b]/40 transition-all flex items-center justify-between gap-2.5 group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30 flex items-center justify-center shrink-0">
                          <Presentation className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate font-kufi group-hover:text-[#785e2b]">
                            ملفات العرض التقديمي (PPTX)
                          </div>
                          <div className="text-[10px] text-slate-500">
                            الشرائح التدريبية التفاعلية
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(`العرض التقديمي المعتمد لورشة: ${selectedCourse.title} - جامعة المجمعة الكلية التطبيقية`)}`}
                          download={`${selectedCourse.code}-Presentation-Slides.pptx`}
                          className="px-3 py-1.5 bg-white hover:bg-[#785e2b] text-[#785e2b] hover:text-white border border-slate-200 hover:border-[#a4874b] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer font-kufi shadow-2xs"
                          title="تحميل ملف العرض التقديمي"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button: Next to Date & Time */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-kufi">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    disabled={!selectedCourse}
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#1b4329] hover:bg-[#143520] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer font-kufi group"
                  >
                    <span>التالي: اختيار التاريخ والوقت</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INTERACTIVE CALENDAR & TIME SLOT PICKER */}
            {step === 2 && (
              <div className="space-y-4">
                {selectedCourse && (
                  <div className="p-3 bg-[#f0f7f2] border border-[#c8e2d1] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">الورشة المختارة: </span>
                      <strong className="text-[#143520] font-bold font-kufi">{selectedCourse.title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#1b4329] underline font-bold hover:text-[#143520] cursor-pointer text-[11px] font-kufi"
                    >
                      استعراض الحقيبة والملفات
                    </button>
                  </div>
                )}

                {/* Conflict Alert Warning */}
                {hasConflict && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2 animate-fadeIn font-cairo">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>تنبيه تضارب زمني:</strong> هناك ورشة أخرى مجدولة في نفس هذا التوقيت ({selectedTimeSlot}). يرجى اختيار فترة زمنية أخرى لتفادي التعارض في القاعات والدعم الفني.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-cairo">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                      تاريخ تنفيذ الورشة:
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] text-sm bg-slate-50/50"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      يفضل اختيار موعد يسبق الورشة بـ 48 ساعة على الأقل لتجهيز القاعات.
                    </p>
                  </div>

                  {/* Time Slot Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                      الفترة الزمنية المقترحة:
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] text-xs sm:text-sm bg-slate-50/50"
                    >
                      {TIME_SLOTS_PRESETS.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Mode Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                    نمط تقديم الورشة:
                  </label>
                  <div className="grid grid-cols-2 gap-3 font-cairo">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('in_person')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryMode === 'in_person'
                          ? 'bg-[#f0f7f2] border-[#1b4329] text-[#143520] ring-2 ring-[#1b4329]/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#1b4329]" />
                      <span>حضوري داخل القاعة/المعمل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('remote')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        deliveryMode === 'remote'
                          ? 'bg-[#faf6ee] border-[#a4874b] text-[#785e2b] ring-2 ring-[#a4874b]/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#8f743c]" />
                      <span>عن بعد (جلسة Blackboard)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-kufi">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    type="button"
                    disabled={hasConflict}
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer font-kufi"
                  >
                    <span>التالي: تفاصيل القاعة والطلاب</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOCATION, TARGET COUNT & CONFIRMATION */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4 font-cairo">
                {/* Selected Course Summary Header in Step 3 */}
                {selectedCourse && (
                  <div className="p-2.5 bg-[#f0f7f2] border border-[#c8e2d1] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#143520] font-kufi">{selectedCourse.title}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{selectedDate} ({selectedTimeSlot})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[#1b4329] underline font-bold hover:text-[#143520] cursor-pointer text-[11px] font-kufi"
                    >
                      تعديل الموعد
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Campus selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                      المقر / فرع الكلية التطبيقية:
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
                    >
                      {CAMPUS_OPTIONS.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Student Count */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                      العدد التقديري للطلاب المستهدفين:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={5}
                        max={200}
                        value={studentCountTarget}
                        onChange={(e) => setStudentCountTarget(Number(e.target.value))}
                        className="w-full py-2.5 px-3.5 pr-10 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50"
                      />
                      <Users className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Hall / Room name */}
                {deliveryMode === 'in_person' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                      اسم أو رقم القاعة / المعمل:
                    </label>
                    <input
                      type="text"
                      value={hallName}
                      onChange={(e) => setHallName(e.target.value)}
                      placeholder="مثال: قاعة التدريب الذكي (204) أو مدرج الكلية"
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                    ملاحظات أو متطلبات خاصة لوحدة الإرشاد المهني (اختياري):
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: نرجو تزويدنا بروابط الاستبيانات التقييمية قبل موعد الجلسة..."
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-slate-50/50"
                  />
                </div>

                {/* Automated Email Reminder Note */}
                <div className="p-3 bg-[#f0f7f2] border border-[#c8e2d1] rounded-xl text-[#143520] text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8f743c] shrink-0" />
                  <span>
                    فور تأكيد الحجز، سيتم إرسال إشعار تأكيد وتذكير فوري إلى <strong>بريدك الإلكتروني الجامعي</strong> متضمناً تفاصيل الجلسة وروابط تنزيل الحقيبة التدريبية.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-kufi">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer font-kufi"
                  >
                    <CheckCircle className="w-4 h-4 text-[#e5d4a6]" />
                    <span>تأكيد وجدولة الورشة الآن</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
