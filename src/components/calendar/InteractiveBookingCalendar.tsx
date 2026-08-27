import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, MapPin, Users, Sparkles, X, BookOpen } from 'lucide-react';
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
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(initialSelectedCourse ? 2 : 1);
  const [selectedCourse, setSelectedCourse] = useState<WorkshopCourse | null>(initialSelectedCourse || courses[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS_PRESETS[1]);
  const [deliveryMode, setDeliveryMode] = useState<'in_person' | 'remote'>('in_person');
  const [hallName, setHallName] = useState<string>('قاعة التدريب الذكي (204) - المقر الرئيسي');
  const [studentCountTarget, setStudentCountTarget] = useState<number>(30);
  const [campus, setCampus] = useState<string>(currentProfessor.campus || CAMPUS_OPTIONS[0]);
  const [notes, setNotes] = useState<string>('');

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

    onConfirmBooking({
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
    });
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
                خطوات سريعة لا تتجاوز دقيقة واحدة لتنسيق الورشة واستلام الحقيبة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 1 ? 'text-[#1b4329]' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-[#1b4329] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>اختيار الحقيبة</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 font-bold ${step === 2 ? 'text-[#1b4329]' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-[#1b4329] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>الموعد والتوقيت</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 font-bold ${step === 3 ? 'text-[#1b4329]' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-[#1b4329] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>القاعة والأعداد</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* STEP 1: SELECT WORKSHOP COURSE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  اختر ورشة الإرشاد والتطوير المهني المناسبة لمقررك الدراسي:
                </label>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {courses.map((c) => {
                  const isSelected = selectedCourse?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourse(c)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#1b4329] bg-[#f0f7f2] ring-2 ring-[#1b4329]/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono font-bold bg-[#faf6ee] text-[#785e2b] px-2 py-0.5 rounded border border-[#a4874b]/30">
                            {c.code}
                          </span>
                          <span className="text-[11px] font-medium text-[#1b4329] bg-[#e2f0e7] px-2 py-0.5 rounded">
                            {c.categoryLabel}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-kufi">{c.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-cairo">{c.shortDescription}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCourseDrawer(c);
                          }}
                          className="text-[11px] font-bold text-[#1b4329] hover:text-[#143520] bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#1b4329]/40 flex items-center gap-1 shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#1b4329]" />
                          <span>معاينة الحقيبة</span>
                        </button>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#1b4329] flex items-center gap-0.5 mt-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>محدد</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  disabled={!selectedCourse}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>التالي: اختيار التاريخ والوقت</span>
                  <ChevronLeft className="w-4 h-4" />
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
                    className="text-[#1b4329] underline font-bold hover:text-[#143520] cursor-pointer text-[11px]"
                  >
                    تغيير
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
                <div className="grid grid-cols-2 gap-3">
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

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
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
                  className="px-5 py-2.5 bg-[#1b4329] hover:bg-[#143520] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer font-kufi"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer font-kufi"
                >
                  <CheckCircle className="w-4 h-4 text-[#e5d4a6]" />
                  <span>تأكيد وجدولة الورشة الآن</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
