import React from 'react';
import { X, Clock, Users, BookOpen, Download, CheckCircle, FileText, Sparkles, Calendar, Layers, FileCode } from 'lucide-react';
import { WorkshopCourse } from '../../types';

interface CourseCurriculumDrawerProps {
  course: WorkshopCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForBooking: (course: WorkshopCourse) => void;
}

export const CourseCurriculumDrawer: React.FC<CourseCurriculumDrawerProps> = ({
  course,
  isOpen,
  onClose,
  onSelectForBooking,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-kufi" id="course-curriculum-drawer-backdrop">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" dir="rtl">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white px-6 py-5 flex items-start justify-between relative">
            <div className="pr-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold bg-[#a4874b]/20 text-[#e5d4a6] px-2.5 py-0.5 rounded-full border border-[#a4874b]/40">
                  {course.code}
                </span>
                <span className="text-xs font-medium bg-[#143520]/80 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {course.categoryLabel}
                </span>
              </div>
              <h2 className="text-xl font-bold font-kufi leading-snug">{course.title}</h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600 font-medium font-cairo">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1b4329]" />
              <span>المدة الزمنية المقترحة: <strong className="font-kufi">{course.durationMinutes} دقيقة</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8f743c]" />
              <span>العدد المستهدف: <strong className="font-kufi">{course.recommendedStudentsMin} - {course.recommendedStudentsMax} طالباً</strong></span>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-cairo">
            
            {/* Overview Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2 font-kufi">
                <BookOpen className="w-4 h-4 text-[#1b4329]" />
                <span>الهدف العام ونبذة الحقيبة التدريبية</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {course.fullOverview}
              </p>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2.5 font-kufi">
                <Sparkles className="w-4 h-4 text-[#8f743c]" />
                <span>مخرجات التعلم والكفايات المهنية المستهدفة</span>
              </h3>
              <div className="space-y-2">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-[#f0f7f2]/70 p-2.5 rounded-lg border border-[#c8e2d1]">
                    <CheckCircle className="w-4 h-4 text-[#1b4329] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilitator Step-by-Step Guide */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-kufi">
                  <Layers className="w-4 h-4 text-[#1b4329]" />
                  <span>خطة تيسير الجلسة وتوزيع التوقيت (Facilitation Guide)</span>
                </h3>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                  إجمالي {course.durationMinutes} دقيقة
                </span>
              </div>

              <div className="space-y-3">
                {course.facilitationGuide.map((step) => (
                  <div key={step.stepNumber} className="border border-slate-200 rounded-xl p-3.5 bg-white hover:border-[#1b4329]/40 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#1b4329] text-white text-xs font-bold flex items-center justify-center font-kufi">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-kufi">{step.title}</h4>
                      </div>
                      <span className="text-[11px] font-semibold text-[#1b4329] bg-[#f0f7f2] px-2 py-0.5 rounded-full border border-[#c8e2d1]">
                        {step.durationMin} دقيقة
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2 pr-8">
                      {step.description}
                    </p>
                    <div className="text-[11px] text-[#785e2b] bg-[#faf6ee] p-2 rounded-lg border border-[#a4874b]/30 flex items-start gap-1.5 mr-8">
                      <span className="font-bold shrink-0 font-kufi">💡 توجيه للمحاضر:</span>
                      <span>{step.trainerTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloadable Teaching Packages & Materials */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2.5 font-kufi">
                <Download className="w-4 h-4 text-[#1b4329]" />
                <span>الحقيبة التدريبية والمواد القابلة للتحميل (Teaching Packages)</span>
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {course.materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#f0f7f2]/50 hover:border-[#1b4329]/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                        mat.type === 'pptx'
                          ? 'bg-[#faf6ee] text-[#785e2b] border border-[#a4874b]/30'
                          : mat.type === 'pdf'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]'
                      }`}>
                        {mat.type}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#1b4329] font-kufi">
                          {mat.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{mat.description}</span>
                          <span className="font-mono text-slate-400 font-medium">({mat.size})</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(`حقيبة تدريبية معتمدة من الكلية التطبيقية بجامعة المجمعة: ${mat.title} - ${course.title}`)}`}
                      download={`${course.code}-${mat.title}.${mat.type}`}
                      className="px-3 py-1.5 bg-white group-hover:bg-[#1b4329] group-hover:text-white border border-slate-300 group-hover:border-[#1b4329] text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0 font-kufi"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer Action Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 font-kufi">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForBooking(course);
              }}
              className="flex-1 py-2.5 px-4 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#e5d4a6]" />
              <span>جدولة هذه الورشة لطلابي الآن</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
