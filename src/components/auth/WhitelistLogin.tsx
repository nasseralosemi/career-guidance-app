import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  LogIn, 
  Info,
  KeyRound,
  Presentation,
  GraduationCap,
  MousePointerClick,
  Zap
} from 'lucide-react';
import { FacultyMember, WhitelistEntry, UserRole } from '../../types';
import { LogoBranding } from '../common/LogoBranding';

interface WhitelistLoginProps {
  whitelist: WhitelistEntry[];
  facultyList: FacultyMember[];
  onLoginSuccess: (user: FacultyMember | null, role: UserRole) => void;
}

export const WhitelistLogin: React.FC<WhitelistLoginProps> = ({
  whitelist,
  facultyList,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'professor' | 'admin'>('professor');
  
  // Professor Login State
  const [professorEmail, setProfessorEmail] = useState('');
  const [professorPasscode, setProfessorPasscode] = useState('');
  const [showProfessorPasscode, setShowProfessorPasscode] = useState(false);
  const [isSubmittingProfessor, setIsSubmittingProfessor] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('admin@mu.edu.sa');
  const [adminPassword, setAdminPassword] = useState('123456');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Demo Auto-fill Handlers
  const handleFillFacultyDemo = () => {
    setActiveTab('professor');
    setProfessorEmail('faculty@mu.edu.sa');
    setProfessorPasscode('123456');
    setErrorMessage(null);
    setSuccessMessage('تمت تعبئة بيانات الحساب التجريبي لعضو هيئة التدريس.');
  };

  const handleFillAdminDemo = () => {
    setActiveTab('admin');
    setAdminEmail('admin@mu.edu.sa');
    setAdminPassword('123456');
    setErrorMessage(null);
    setSuccessMessage('تمت تعبئة بيانات الحساب التجريبي لمشرف الوحدة.');
  };

  // Handle Professor Whitelist + Passcode Authentication
  const handleProfessorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = professorEmail.trim().toLowerCase();
    const cleanPasscode = professorPasscode.trim();

    if (!cleanEmail) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني الجامعي أو المعتمد.');
      return;
    }

    if (!cleanPasscode) {
      setErrorMessage('يرجى إدخال كلمة المرور / الرمز السري (Passcode).');
      return;
    }

    setIsSubmittingProfessor(true);

    // Look up member in Whitelist
    const matchedEntry = whitelist.find(
      (entry) => entry.email.trim().toLowerCase() === cleanEmail
    );

    if (!matchedEntry) {
      setIsSubmittingProfessor(false);
      setErrorMessage(
        'عفواً، هذا البريد الإلكتروني غير مسجل في القائمة البيضاء (Whitelist) المعتمدة لأعضاء هيئة التدريس. يرجى التواصل مع وحدة الإرشاد المهني والتوظيف للاعتماد.'
      );
      return;
    }

    if (matchedEntry.status === 'inactive') {
      setIsSubmittingProfessor(false);
      setErrorMessage(
        'تم تعطيل هذا الحساب مؤقتاً في النظام. يرجى مراجعة إدارة وحدة الإرشاد المهني والتوظيف لإعادة التفعيل.'
      );
      return;
    }

    // Verify Passcode (supports individual passcode, demo 123456, or master)
    const validPasscode = matchedEntry.passcode || (cleanEmail === 'faculty@mu.edu.sa' ? '123456' : 'Rashad2026@');
    if (cleanPasscode !== validPasscode && !(cleanEmail === 'faculty@mu.edu.sa' && cleanPasscode === '123456')) {
      setIsSubmittingProfessor(false);
      setErrorMessage(
        'كلمة المرور / الرمز السري (Passcode) غير صحيح. يرجى التأكد من الرمز المدخل وإعادة المحاولة.'
      );
      return;
    }

    // Passcode is verified against the Whitelist
    setSuccessMessage(`مرحباً بك ${matchedEntry.title} / ${matchedEntry.name}، جاري تسجيل الدخول...`);

    // Match or create FacultyMember entity
    let faculty = facultyList.find((f) => f.email.toLowerCase() === matchedEntry.email.toLowerCase());
    if (!faculty) {
      faculty = {
        id: matchedEntry.id,
        name: matchedEntry.name,
        title: matchedEntry.title,
        email: matchedEntry.email,
        phone: matchedEntry.phone,
        college: 'الكلية التطبيقية',
        department: matchedEntry.department,
        campus: matchedEntry.campus,
        employeeId: matchedEntry.employeeId,
        isWhitelisted: true,
        completedWorkshopsCount: 4,
        totalStudentsReached: 140,
      };
    }

    setTimeout(() => {
      setIsSubmittingProfessor(false);
      onLoginSuccess(faculty, 'professor');
    }, 450);
  };

  // Handle Supervisor / Admin Authentication
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();

    if (!cleanEmail) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني الإداري.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('يرجى إدخال كلمة المرور الإدارية.');
      return;
    }

    setIsSubmittingAdmin(true);

    const isValidAdmin = 
      (cleanEmail === 'admin@mu.edu.sa' || cleanEmail === 'n.alosemi@mu.edu.sa' || cleanEmail.includes('alosemi') || cleanEmail.includes('admin')) &&
      (cleanPassword === '123456' || cleanPassword === 'Nass112233&' || cleanPassword === 'admin123');

    if (isValidAdmin) {
      setSuccessMessage('تم التحقق من الصلاحيات الإدارية بنجاح، جاري الدخول للوحة التحكم...');
      setTimeout(() => {
        setIsSubmittingAdmin(false);
        onLoginSuccess(null, 'admin');
      }, 450);
    } else {
      setIsSubmittingAdmin(false);
      setErrorMessage(
        'بيانات الدخول الإدارية غير صحيحة. يرجى إدخال البريد الإداري وكلمة المرور المعتمدة لمشرف الوحدة.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-geometric-grid flex flex-col justify-between" id="whitelist-login-page">
      {/* Top Header Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <LogoBranding size="md" />
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]">
            <ShieldCheck className="w-4 h-4 text-[#1b4329]" />
            <span className="hidden sm:inline">نظام التوثيق الأكاديمي المعتمد</span>
            <span className="sm:hidden">توثيق آمن</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg glass-card rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#143520] via-[#1b4329] to-[#0f2818] text-white p-6 sm:p-7 relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10 bg-geometric-grid"></div>
            <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5">
              <div className="relative mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a4874b]/30 to-[#a4874b]/10 text-[#e5d4a6] border border-[#a4874b]/50 flex items-center justify-center shadow-lg shadow-black/20 backdrop-blur-xs">
                  <Presentation className="w-7 h-7 text-[#e5d4a6]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[#143520] border border-[#a4874b]/60 flex items-center justify-center text-[#e5d4a6] shadow-xs">
                  <GraduationCap className="w-3 h-3 text-[#e5d4a6]" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-kufi text-white tracking-tight">
                بوابة الشراكة الأكاديمية
              </h1>
              <h2 className="text-sm sm:text-base font-semibold text-[#e5d4a6] font-kufi">
                وحدة الإرشاد المهني والتوظيف
              </h2>
              <h3 className="text-xs sm:text-sm font-medium text-emerald-100/90 font-cairo">
                الكلية التطبيقية
              </h3>
            </div>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 gap-1.5">
            <button
              id="tab-professor-login"
              type="button"
              onClick={() => {
                setActiveTab('professor');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'professor'
                  ? 'bg-white text-[#1b4329] shadow-xs border-r-4 border-[#a4874b] font-bold'
                  : 'text-slate-600 hover:text-[#1b4329]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#1b4329]" />
              <span>دخول عضو هيئة التدريس</span>
            </button>
            
            <button
              id="tab-admin-login"
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-[#1b4329] shadow-xs border-r-4 border-[#1b4329] font-bold'
                  : 'text-slate-600 hover:text-[#1b4329]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#a4874b]" />
              <span>دخول المشرف</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7">
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-5 p-3.5 bg-emerald-50 border-r-4 border-emerald-600 rounded-xl text-emerald-950 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed font-medium">{successMessage}</div>
              </div>
            )}

            {/* TAB 1: PROFESSOR LOGIN (EMAIL + PASSCODE) */}
            {activeTab === 'professor' && (
              <form onSubmit={handleProfessorLogin} className="space-y-4 font-cairo">
                <div className="p-3 bg-[#f0f7f2] border border-[#c8e2d1] rounded-xl text-xs text-[#143520] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#1b4329] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    يتم التحقق من بيانات الدخول بمقارنة البريد الجامعي والرمز السري (Passcode) مع <strong>القائمة البيضاء المعتمدة</strong> لأعضاء هيئة التدريس.
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                    البريد الإلكتروني المعتمد:
                  </label>
                  <div className="relative">
                    <input
                      id="professor-email-input"
                      type="email"
                      dir="ltr"
                      required
                      placeholder="username@mu.edu.sa أو alarshadalmhani@gmail.com"
                      value={professorEmail}
                      onChange={(e) => setProfessorEmail(e.target.value)}
                      className="w-full text-left py-2.5 px-3.5 pl-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] focus:border-transparent text-xs font-mono bg-white"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 text-[#1b4329]" />
                    </div>
                  </div>
                </div>

                {/* Passcode Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 font-kufi">
                      كلمة المرور / الرمز السري (Passcode):
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="professor-passcode-input"
                      type={showProfessorPasscode ? 'text' : 'password'}
                      dir="ltr"
                      required
                      placeholder="••••••••"
                      value={professorPasscode}
                      onChange={(e) => setProfessorPasscode(e.target.value)}
                      className="w-full text-left py-2.5 px-3.5 pl-10 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] focus:border-transparent text-xs font-mono bg-white font-bold"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4 text-[#a4874b]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowProfessorPasscode(!showProfessorPasscode)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showProfessorPasscode ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showProfessorPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-professor-login"
                  type="submit"
                  disabled={isSubmittingProfessor}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#1b4329] via-[#143520] to-[#0f2818] hover:from-[#143520] hover:to-[#0a1b10] disabled:opacity-75 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 font-kufi"
                >
                  {isSubmittingProfessor ? (
                    <span>جاري التحقق من القائمة البيضاء...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-[#e5d4a6]" />
                      <span>تسجيل الدخول إلى البوابة</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN (SUPERVISOR) */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4 font-cairo">
                <div className="p-3.5 bg-gradient-to-r from-[#faf6ee] to-[#f0f7f2] border border-[#a4874b]/40 rounded-xl text-xs leading-relaxed text-slate-800">
                  <div className="flex items-center gap-2 font-bold text-[#6f5627] mb-1 font-kufi">
                    <ShieldCheck className="w-4 h-4 text-[#a4874b] shrink-0" />
                    <span>تسجيل دخول مشرف وحدة الإرشاد المهني والتوظيف:</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    أدخل البريد الإلكتروني الإداري وكلمة المرور للوصول إلى لوحة التحكم والتحليلات وإدارة القائمة البيضاء.
                  </div>
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                    البريد الإلكتروني الإداري:
                  </label>
                  <div className="relative">
                    <input
                      id="admin-email-input"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="n.alosemi@mu.edu.sa"
                      required
                      className="w-full py-2.5 px-3.5 pl-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] text-xs font-mono text-left bg-white"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-kufi">
                    كلمة المرور الإدارية:
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password-input"
                      type={showAdminPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full py-2.5 px-3.5 pl-10 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1b4329] text-xs font-mono text-left bg-white font-bold text-slate-800"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showAdminPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-admin-login"
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#1b4329] via-[#143520] to-[#0f2818] hover:from-[#143520] hover:to-[#0a1b10] disabled:opacity-75 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 font-kufi"
                >
                  {isSubmittingAdmin ? (
                    <span>جاري التحقق...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#e5d4a6]" />
                      <span>دخول لوحة تحكم الإدارة والتحليلات</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* QUICK DEMO CREDENTIALS BOX (FOR TESTING AND EVALUATION) */}
            <div className="mt-6 pt-5 border-t border-slate-200/90 font-cairo">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#143520] font-kufi">
                  <Sparkles className="w-4 h-4 text-[#a4874b]" />
                  <span>بيانات الدخول التجريبية السريعة (للمعاينة والاختبار):</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0f7f2] text-[#1b4329] border border-[#c8e2d1]">
                  تجربة فورية
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Faculty Demo Account Card */}
                <div
                  id="btn-quick-faculty-demo"
                  onClick={handleFillFacultyDemo}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    activeTab === 'professor' && professorEmail === 'faculty@mu.edu.sa'
                      ? 'bg-[#1b4329] text-white border-[#1b4329] shadow-sm'
                      : 'bg-white hover:bg-[#f0f7f2] text-slate-800 border-slate-200 hover:border-[#1b4329]'
                  }`}
                  title="انقر لتعبئة وتجربة حساب عضو هيئة التدريس"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <UserCheck className={`w-4 h-4 ${
                          activeTab === 'professor' && professorEmail === 'faculty@mu.edu.sa' ? 'text-[#e5d4a6]' : 'text-[#1b4329]'
                        }`} />
                        عضو هيئة تدريس
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        activeTab === 'professor' && professorEmail === 'faculty@mu.edu.sa'
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-50 text-[#8f743c] border border-amber-200'
                      }`}>
                        الرمز: 123456
                      </span>
                    </div>
                    <div className="font-mono text-xs text-left dir-ltr truncate font-medium">
                      faculty@mu.edu.sa
                    </div>
                  </div>

                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-bold ${
                    activeTab === 'professor' && professorEmail === 'faculty@mu.edu.sa'
                      ? 'border-white/20 text-[#e5d4a6]'
                      : 'border-slate-100 text-[#1b4329] group-hover:text-[#143520]'
                  }`}>
                    <span>تعبئة وتجربة الدخول</span>
                    <MousePointerClick className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Admin Demo Account Card */}
                <div
                  id="btn-quick-admin-demo"
                  onClick={handleFillAdminDemo}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    activeTab === 'admin' && adminEmail === 'admin@mu.edu.sa'
                      ? 'bg-[#1b4329] text-white border-[#1b4329] shadow-sm'
                      : 'bg-white hover:bg-[#faf6ee] text-slate-800 border-slate-200 hover:border-[#a4874b]'
                  }`}
                  title="انقر لتعبئة وتجربة حساب مشرف الوحدة"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Lock className={`w-4 h-4 ${
                          activeTab === 'admin' && adminEmail === 'admin@mu.edu.sa' ? 'text-[#e5d4a6]' : 'text-[#a4874b]'
                        }`} />
                        مشرف وحدة الإرشاد
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        activeTab === 'admin' && adminEmail === 'admin@mu.edu.sa'
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-50 text-[#8f743c] border border-amber-200'
                      }`}>
                        الرمز: 123456
                      </span>
                    </div>
                    <div className="font-mono text-xs text-left dir-ltr truncate font-medium">
                      admin@mu.edu.sa
                    </div>
                  </div>

                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] font-bold ${
                    activeTab === 'admin' && adminEmail === 'admin@mu.edu.sa'
                      ? 'border-white/20 text-[#e5d4a6]'
                      : 'border-slate-100 text-[#785e2b] group-hover:text-[#5c461d]'
                  }`}>
                    <span>تعبئة وتجربة الدخول</span>
                    <MousePointerClick className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>يمكنك النقر مباشرة على أي بطاقة لتعبئة البيانات تلقائياً ثم الضغط على زر الدخول.</span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 border-t border-slate-200 p-3.5 text-center text-[11px] text-slate-500">
            جامعة المجمعة • الكلية التطبيقية • جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
        </div>
      </main>

      {/* Bottom info footer */}
      <footer className="w-full py-3 text-center text-xs text-slate-500">
        بوابة الشراكة الأكاديمية للإرشاد والتطوير المهني • نظام التحقق المباشر
      </footer>
    </div>
  );
};
