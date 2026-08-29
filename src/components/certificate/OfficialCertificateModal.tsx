import React, { useEffect, useRef } from 'react';
import { X, Printer, Download, Share2, Award, CheckCircle2, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkshopSession, DeanOfficialConfig } from '../../types';
import { LogoBranding } from '../common/LogoBranding';

interface OfficialCertificateModalProps {
  session: WorkshopSession | null;
  deanConfig: DeanOfficialConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  session,
  deanConfig,
  isOpen,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Fire festive academic confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b0893a', '#1b4332', '#d4af37', '#2d6a4f'],
      });
    }
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const certificateNumber = session.certificateId || `MU-AC-CERT-${new Date().getFullYear()}-${session.id.replace(/\D/g, '').padStart(4, '0') || '0101'}`;
  const issueDateArabic = session.certificateIssueDate || session.date || new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs font-kufi" id="certificate-modal">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-600/30 flex flex-col my-auto">
        
        {/* Action Header (No Print) */}
        <div className="no-print bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">الشهادة الرقمية المعتمدة من رئيس الكلية التطبيقية</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
              {certificateNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="طباعة أو حفظ بصيغة PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate View */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-x-auto flex justify-center">
          <div
            ref={certRef}
            className="printable-certificate relative w-[800px] h-[565px] bg-[#fcfaf5] text-slate-800 p-8 rounded-sm shadow-lg border-[10px] border-[#1b4329] flex flex-col justify-between select-none overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 0 3px #a4874b, inset 0 0 0 7px #1b4329, inset 0 0 0 9px #d4af37',
            }}
          >
            {/* Arabesque Corner Ornaments */}
            <div className="absolute top-3 right-3 w-16 h-16 pointer-events-none opacity-40">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-[#8f743c]">
                <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.2" />
                <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute top-3 left-3 w-16 h-16 pointer-events-none opacity-40 transform -scale-x-100">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-[#8f743c]">
                <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.2" />
                <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute bottom-3 right-3 w-16 h-16 pointer-events-none opacity-40 transform -scale-y-100">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-[#8f743c]">
                <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.2" />
                <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute bottom-3 left-3 w-16 h-16 pointer-events-none opacity-40 transform scale-[-1]">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-[#8f743c]">
                <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="#a4874b" opacity="0.2" />
                <path d="M5 5 L95 5 M5 5 L5 95 M15 15 L85 15 M15 15 L15 85" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Background Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <div className="w-96 h-96 rounded-full border-[18px] border-[#1b4329] flex items-center justify-center">
                <Award className="w-64 h-64 text-[#a4874b]" />
              </div>
            </div>

            {/* Certificate Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#a4874b]/30 pb-3">
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-bold text-[#1b4329]">المملكة العربية السعودية</p>
                <p className="text-[12px] font-extrabold text-[#1b4329] font-kufi">
                  {deanConfig.university || 'جامعة المجمعة'}
                </p>
                <p className="text-[10px] font-semibold text-[#8f743c]">
                  {deanConfig.deanCollege || 'الكلية التطبيقية'}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <LogoBranding size="md" variant="horizontal" />
              </div>

              <div className="text-left space-y-0.5" dir="ltr">
                <p className="text-[9px] font-bold text-[#1b4329]">Kingdom of Saudi Arabia</p>
                <p className="text-[11px] font-bold text-[#1b4329]">Majmaah University</p>
                <p className="text-[9px] font-semibold text-[#8f743c]">Applied College</p>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="relative z-10 text-center my-3">
              <div className="inline-block relative">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4329] font-kufi tracking-tight px-6 py-1">
                  شـهـادة شـكـر وتـقـديـر
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#a4874b] to-transparent w-full mt-1"></div>
              </div>
            </div>

            {/* Certificate Body Text (Minimalist & Dignified) */}
            <div className="relative z-10 text-center px-6 space-y-3 leading-relaxed font-cairo">
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                تسر <strong className="text-[#1b4329] font-bold font-kufi">{deanConfig.unitName || 'وحدة الإرشاد المهني والتوظيف'}</strong> بالكلية التطبيقية أن تتقدم بوافر الشكر والتقدير لسعادة:
              </p>

              {/* Professor Name Banner */}
              <div className="py-2 px-6 bg-[#faf6ee] border-y border-[#a4874b]/40 inline-block rounded-lg shadow-2xs">
                <span className="text-lg sm:text-xl font-extrabold font-kufi text-[#1b4329] tracking-wide block">
                  {session.professorTitle} / {session.professorName}
                </span>
                <span className="text-xs text-[#8f743c] block font-semibold mt-0.5">
                  قسم {session.department} • {session.campus}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                نظير جهوده المتميزة وتعاونه المثمر في تقديم الورشة التدريبية التخصصية:
              </p>

              <div className="text-xs sm:text-sm font-bold text-[#1b4329] font-kufi bg-[#f0f7f2] py-2 px-4 rounded-xl border border-[#c8e2d1] max-w-lg mx-auto shadow-2xs">
                « {session.courseTitle} »
              </div>

              <p className="text-xs text-slate-500 font-medium pt-1">
                سائلين المولى لسعادته دوام التوفيق والسداد ومزيداً من العطاء والتميز الأكاديمي.
              </p>
            </div>

            {/* Signatures & Official Seals Footer */}
            <div className="relative z-10 grid grid-cols-3 items-end pt-4 border-t border-[#a4874b]/30 text-center mt-4">
              
              {/* Unit Head Signature */}
              <div className="flex flex-col items-center font-cairo space-y-1">
                <span className="text-[11px] font-bold text-slate-700">{deanConfig.unitHeadTitle || 'مشرف وحدة الإرشاد المهني والتوظيف'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#1b4329] font-kufi">{deanConfig.unitHeadName || 'أ. ناصر العصيمي'}</span>
                <div className="w-24 h-7 flex items-center justify-center italic text-slate-400 font-serif text-[11px] select-none">
                  [توقيع معتمد]
                </div>
              </div>

              {/* Official Seal / QR Verification */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#a4874b] bg-[#faf6ee] flex flex-col items-center justify-center p-1 shadow-inner">
                  <QrCode className="w-7 h-7 text-[#1b4329]" />
                  <span className="text-[8px] font-bold text-[#8f743c] uppercase tracking-tighter mt-0.5 font-mono">MU Verified</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 font-cairo">الختم والتوثيق الرقمي</span>
              </div>

              {/* Dean of Applied College Official Signature */}
              <div className="flex flex-col items-center font-cairo space-y-1">
                <span className="text-[11px] font-extrabold text-[#1b4329] font-kufi">{deanConfig.deanTitle || 'رئيس الكلية التطبيقية'}</span>
                <span className="text-xs sm:text-sm font-bold text-[#785e2b] font-kufi">{deanConfig.deanName || 'د. شادي بن صالح الشويعر'}</span>
                <div className="w-24 h-7 flex items-center justify-center italic text-[#1b4329] font-serif font-bold text-[11px] select-none">
                  [الاعتماد والتوقيع]
                </div>
              </div>

            </div>

            {/* Discrete Serial & Issue Date Tag */}
            <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span>الرقم المرجعي: {certificateNumber}</span>
              <span>تاريخ الاعتماد: {issueDateArabic}م</span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions (No Print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-cairo">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#1b4329]" />
            <span>هذه الشهادة وثيقة رسمية معتمدة برقم تسلسلي موثق في سجلات الكلية التطبيقية.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `شهادة شكر وتقدير رسمية معتمدة من سعادة رئيس الكلية التطبيقية بجامعة المجمعة (${deanConfig.deanName}) لتقديم ورشة: ${session.courseTitle}. رقم الشهادة: ${certificateNumber}`;
                navigator.clipboard?.writeText?.(text);
                alert('تم نسخ تفاصيل الشهادة ورابط التحقق بنجاح!');
              }}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer font-kufi"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>مشاركة الاعتماد</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1b4329] hover:bg-[#143520] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer font-kufi"
            >
              <Download className="w-4 h-4" />
              <span>تحميل وطباعة الشهادة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
