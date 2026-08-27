import { FacultyMember, WorkshopCourse, WorkshopSession, WhitelistEntry, DeanOfficialConfig } from '../types';

export const INITIAL_DEAN_CONFIG: DeanOfficialConfig = {
  deanName: "د. شادي بن صالح الشويعر",
  deanTitle: "رئيس الكلية التطبيقية",
  deanCollege: "الكلية التطبيقية",
  university: "جامعة المجمعة",
  unitName: "وحدة الإرشاد المهني والتوظيف",
  unitHeadName: "أ. ناصر العصيمي",
  unitHeadTitle: "مشرف وحدة الإرشاد المهني والتوظيف",
  officialSealText: "المملكة العربية السعودية - الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف",
  academicYear: "1447 / 1448 هـ",
  semester: "الفصل الدراسي الأول",
};

export const INITIAL_WHITELIST: WhitelistEntry[] = [
  {
    id: "fac-demo",
    name: "د. عضو هيئة التدريس (تجريبي)",
    title: "أستاذ مشارك",
    email: "faculty@mu.edu.sa",
    phone: "0501234567",
    department: "الكلية التطبيقية - علوم الحاسب والتقنية",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-123456",
    passcode: "123456",
    status: "active",
    addedAt: "2026-01-01",
  },
  {
    id: "fac-user",
    name: "د. رشاد المهني",
    title: "مستشار التوجيه المهني وعضو هيئة التدريس",
    email: "alarshadalmhani@gmail.com",
    phone: "0505123456",
    department: "الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-48899",
    passcode: "Rashad2026@",
    status: "active",
    addedAt: "2026-01-01",
  },
  {
    id: "fac-1",
    name: "د. عبد الرحمن بن فهد السويكت",
    title: "أستاذ مشارك",
    email: "a.alswaiket@mu.edu.sa",
    phone: "0501234567",
    department: "علوم الحاسب وتقنية المعلومات",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-48201",
    passcode: "MU@48201",
    status: "active",
    addedAt: "2026-01-10",
  },
  {
    id: "fac-2",
    name: "د. نورة بنت سليمان الدخيل",
    title: "أستاذ مساعد",
    email: "n.aldakheel@mu.edu.sa",
    phone: "0559876543",
    department: "العلوم الإدارية والمالية",
    campus: "المجمعة (شطر الطالبات)",
    employeeId: "MU-49114",
    passcode: "MU@49114",
    status: "active",
    addedAt: "2026-01-12",
  },
  {
    id: "fac-3",
    name: "د. خالد بن منصور العتيبي",
    title: "أستاذ مشارك",
    email: "k.alotaibi@mu.edu.sa",
    phone: "0543322110",
    department: "الهندسة والتقنيات الصناعية",
    campus: "الزلفي",
    employeeId: "MU-47055",
    passcode: "MU@47055",
    status: "active",
    addedAt: "2026-01-15",
  },
  {
    id: "fac-4",
    name: "د. هدى بنت عبد الله التويجري",
    title: "أستاذ مساعد",
    email: "h.altowaijri@mu.edu.sa",
    phone: "0567788990",
    department: "الرعاية الصحية والإدارة الطبية",
    campus: "حوطة سدير",
    employeeId: "MU-51208",
    passcode: "MU@51208",
    status: "active",
    addedAt: "2026-01-18",
  },
  {
    id: "fac-5",
    name: "أ. ماجد بن صالح المطيري",
    title: "محاضر",
    email: "m.almutairi@mu.edu.sa",
    phone: "0531122334",
    department: "التسويق الرقمي والتجارة الإلكترونية",
    campus: "رماح",
    employeeId: "MU-52990",
    passcode: "MU@52990",
    status: "active",
    addedAt: "2026-01-20",
  },
  {
    id: "fac-6",
    name: "د. إبراهيم بن محمد الرشيد",
    title: "أستاذ مساعد",
    email: "i.alrasheed@mu.edu.sa",
    phone: "0590011223",
    department: "الأمن السيبراني والشبكات",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-46881",
    passcode: "MU@46881",
    status: "active",
    addedAt: "2026-01-25",
  }
];

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: "fac-demo",
    name: "د. عضو هيئة التدريس (تجريبي)",
    title: "أستاذ مشارك",
    email: "faculty@mu.edu.sa",
    phone: "0501234567",
    college: "الكلية التطبيقية",
    department: "الكلية التطبيقية - علوم الحاسب والتقنية",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-123456",
    isWhitelisted: true,
    completedWorkshopsCount: 4,
    totalStudentsReached: 156,
  },
  {
    id: "fac-user",
    name: "د. رشاد المهني",
    title: "مستشار التوجيه المهني وعضو هيئة التدريس",
    email: "alarshadalmhani@gmail.com",
    phone: "0505123456",
    college: "الكلية التطبيقية",
    department: "الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-48899",
    isWhitelisted: true,
    completedWorkshopsCount: 5,
    totalStudentsReached: 185,
  },
  {
    id: "fac-1",
    name: "د. عبد الرحمن بن فهد السويكت",
    title: "أستاذ مشارك",
    email: "a.alswaiket@mu.edu.sa",
    phone: "0501234567",
    college: "الكلية التطبيقية",
    department: "علوم الحاسب وتقنية المعلومات",
    campus: "المجمعة (المقر الرئيسي)",
    employeeId: "MU-48201",
    isWhitelisted: true,
    completedWorkshopsCount: 4,
    totalStudentsReached: 142,
  },
  {
    id: "fac-2",
    name: "د. نورة بنت سليمان الدخيل",
    title: "أستاذ مساعد",
    email: "n.aldakheel@mu.edu.sa",
    phone: "0559876543",
    college: "الكلية التطبيقية",
    department: "العلوم الإدارية والمالية",
    campus: "المجمعة (شطر الطالبات)",
    employeeId: "MU-49114",
    isWhitelisted: true,
    completedWorkshopsCount: 3,
    totalStudentsReached: 118,
  },
  {
    id: "fac-3",
    name: "د. خالد بن منصور العتيبي",
    title: "أستاذ مشارك",
    email: "k.alotaibi@mu.edu.sa",
    phone: "0543322110",
    college: "الكلية التطبيقية",
    department: "الهندسة والتقنيات الصناعية",
    campus: "الزلفي",
    employeeId: "MU-47055",
    isWhitelisted: true,
    completedWorkshopsCount: 2,
    totalStudentsReached: 76,
  }
];

export const INITIAL_COURSES: WorkshopCourse[] = [
  {
    id: "course-1",
    code: "CGU-101",
    title: "بناء السيرة الذاتية الاحترافية المتوافقة مع أنظمة الفرز الذكي (ATS)",
    category: "cv_portfolio",
    categoryLabel: "السيرة الذاتية والهوية المهنية",
    durationMinutes: 60,
    recommendedStudentsMin: 20,
    recommendedStudentsMax: 45,
    shortDescription: "تمكين طلبة الكلية التطبيقية من صياغة سيرة ذاتية احترافية مدعومة بالكلمات المفتاحية واجتياز مرشحات التوظيف الرقمية.",
    fullOverview: "حقيبة تدريبية مكثفة مصممة لطلاب وطالبات الدبلوم والبرامج التطبيقية، تركز على القواعد الذهبية لترتيب الأقسام الأكاديمية والمهنية، وصياغة الإنجازات بلغة الأرقام والتأثير، والتوافق مع أنظمة الفحص الآلي للشركات الكبرى.",
    learningOutcomes: [
      "فهم آلية عمل أنظمة فرز السير الذاتية (ATS) وكيفية اجتيازها بنجاح.",
      "هيكلة الأقسام الجوهرية (الملخص، التعليم التطبيقي، المشاريع، المهارات).",
      "صياغة المهام السابقة والإنجازات وفق معادلة (Action + Context + Result).",
      "تجنب الأخطاء الشائعة المسببة للاستبعاد الفوري."
    ],
    targetAudience: "طلبة المستويات المتقدمة والمتوقع تخرجهم والمتدربون الميدانيون.",
    facilitationGuide: [
      {
        stepNumber: 1,
        title: "التهيئة والافتتاح (10 دقائق)",
        durationMin: 10,
        description: "عرض إحصائية سريعة عن متوسط وقت فحص مسؤولي التوظيف للسيرة الذاتية (6 إلى 8 ثوانٍ) وإثارة اهتمام الطلبة.",
        trainerTip: "استخدم الشريحة التفاعلية لعرض نموذجين لسيرة ذاتية واطلب من الطلاب المقارنة السريعة."
      },
      {
        stepNumber: 2,
        title: "التشريح الفني للسيرة الاحترافية (20 دقيقة)",
        durationMin: 20,
        description: "استعراض تفصيلي للأقسام الخمسة الرئيسية، مع التركيز على كتابة المهارات التقنية لطلاب الكلية التطبيقية.",
        trainerTip: "أكّد على كتابة مشاريع التخرج والتدريب التعاوني كخبرة عملية فعلية."
      },
      {
        stepNumber: 3,
        title: "تطبيق عملي وصياغة إنجازات (20 دقيقة)",
        durationMin: 20,
        description: "توزيع نموذج السيرة الموحد (Word/ATS) والبدء في كتابة فقرة الخبرة والملخص المهني لكل طالب.",
        trainerTip: "مرّ بين الطلاب وقدم تعليقاً فورياً على عبارات الإنجاز."
      },
      {
        stepNumber: 4,
        title: "الختام والتوجيه نحو مراجعة الوحدة (10 دقائق)",
        durationMin: 10,
        description: "توضيح آلية حجز موعد تدقيق فردي لدى وحدة الإرشاد والتطوير المهني بالكلية.",
        trainerTip: "شجع الطلبة على رفع مسوداتهم عبر رابط استشارة الوحدة."
      }
    ],
    materials: [
      {
        id: "mat-1",
        title: "عرض البوربوينت التقديمي المعتمد (PPTX)",
        type: "pptx",
        size: "14.2 MB",
        downloadUrl: "#",
        description: "شرائح تفاعلية مجهزة بالكامل للأستاذ الجامعي مع ملاحظات المدرب في كل شريحة."
      },
      {
        id: "mat-2",
        title: "قالب السيرة الذاتية المعتمد ATS (Word)",
        type: "docx",
        size: "1.4 MB",
        downloadUrl: "#",
        description: "قالب نظيف باللغتين العربية والإنجليزية جاهز للتوزيع على الطلاب."
      },
      {
        id: "mat-3",
        title: "دليل الميسر وقائمة الكلمات المفتاحية التخصصية (PDF)",
        type: "pdf",
        size: "3.1 MB",
        downloadUrl: "#",
        description: "قاموس كلمات مفتاحية بحسب تخصصات الكلية التطبيقية لرفع نسبة التوافق."
      }
    ],
    iconName: "FileText",
    badgeColor: "emerald",
    isActive: true,
  },
  {
    id: "course-2",
    code: "CGU-102",
    title: "استراتيجيات اجتياز المقابلات الوظيفية وتقنية (STAR)",
    category: "interview_skills",
    categoryLabel: "المقابلات واختبارات القبول",
    durationMinutes: 60,
    recommendedStudentsMin: 15,
    recommendedStudentsMax: 40,
    shortDescription: "إكساب الطلاب مهارات الرد الاحترافي على الأسئلة السلوكية والتقنية وإتقان منهجية STAR في إبراز كفاءاتهم.",
    fullOverview: "ورشة تفاعلية تركز على كسر حاجز الرهبة في المقابلات الشخصية، والتحضير النفسي والمهني، والتعامل مع الأسئلة الصعبة والمفاجئة مع محاكاة عملية للمقابلات الفردية والجماعية.",
    learningOutcomes: [
      "فهم معايير التقييم لدى لجان التوظيف بالمملكة ومسؤولي الموارد البشرية.",
      "تطبيق تقنية STAR (الموقف، المهمة، الإجراء، النتيجة) بسلاسة وثقة.",
      "الإجابة النموذجية على سؤال (تحدث عن نفسك) و(أكبر نقاط ضعفك).",
      "إتقان لغة الجسد ونبرة الصوت الاحترافية حضورياً وعبر منصات المقابلات الافتراضية."
    ],
    targetAudience: "طلبة المستويات النهائية والمقبلون على التدريب الميداني والتوظيف.",
    facilitationGuide: [
      {
        stepNumber: 1,
        title: "كسر الجليد ومفهوم المقابلة (10 دقائق)",
        durationMin: 10,
        description: "توضيح أن المقابلة حوار مهني ثنائي لتقييم الملاءمة وليست استجواباً مخيفاً.",
        trainerTip: "اطرح سؤالاً تفاعلياً: ما هو أكبر خوف لديك من المقابلة؟"
      },
      {
        stepNumber: 2,
        title: "هندسة الإجابة عبر STAR (25 دقيقة)",
        durationMin: 25,
        description: "شرح العناصر الأربعة وطرح أمثلة حية مستمدة من تخصصات الكلية التطبيقية (إدارة، حاسب، هندسة).",
        trainerTip: "استخدم نموذج المقارنة بين إجابة ضعيفة وإجابة نموذجية."
      },
      {
        stepNumber: 3,
        title: "محاكاة حية لمقابلة وظيفية أمام الحضور (15 دقيقة)",
        durationMin: 15,
        description: "اختيار متطوعين لإجراء محاكاة سريعة لدقيقتين وتقديم تغذية راجعة فورية لطيفة ومحفزة.",
        trainerTip: "ركز على التعزيز الإيجابي وإبراز النقاط القوية أولاً."
      },
      {
        stepNumber: 4,
        title: "الأسئلة الذكية التي يطرحها المرشح والخاتمة (10 دقائق)",
        durationMin: 10,
        description: "قائمة بالأسئلة التي يطرحها الطالب في نهاية المقابلة ليعكس شغفه ومهنيته.",
        trainerTip: "توزيع بطاقة المراجعة السريعة (Pocket Guide)."
      }
    ],
    materials: [
      {
        id: "mat-4",
        title: "العرض التقديمي المعتمد - فن المقابلات (PPTX)",
        type: "pptx",
        size: "18.5 MB",
        downloadUrl: "#",
        description: "شرائح تدريبية تشمل سيناريوهات ومقاطع فيديو توضيحية مدمجة."
      },
      {
        id: "mat-5",
        title: "بطاقة عمل منهجية STAR ونماذج الأسئلة السلوكية (PDF)",
        type: "pdf",
        size: "2.8 MB",
        downloadUrl: "#",
        description: "أوراق عمل لتطبيق عملي فوري داخل القاعة الدراسية."
      }
    ],
    iconName: "UserCheck",
    badgeColor: "amber",
    isActive: true,
  },
  {
    id: "course-3",
    code: "CGU-103",
    title: "بناء الهوية المهنية الرقمية واستثمار شبكة LinkedIn",
    category: "digital_tools",
    categoryLabel: "الهوية الرقمية والتواصل المهني",
    durationMinutes: 60,
    recommendedStudentsMin: 20,
    recommendedStudentsMax: 50,
    shortDescription: "تحويل الحساب العادي على لينكد إن إلى منصة جذب لفرص التدريب التعاوني والوظائف النوعية.",
    fullOverview: "تركز هذه الورشة على صناعة الملف الشخصي المتكامل All-Star، وبناء شبكة علاقات مع مدراء التوظيف في القطاعين الحكومي والخاص، والمشاركة الفعالة بالمحتوى التخصصي.",
    learningOutcomes: [
      "صياغة عنوان مهني جذاب (Headline) يبرز التخصص والقيمة المضافة.",
      "كتابة قسم النبذة التعريفية (About) بأسلوب سردي احترافي.",
      "إضافة المشاريع التطبيقية والتراخيص المهنية والشهادات الاحترافية.",
      "استراتيجية البحث عن صانعي القرار ومسؤولي التوظيف والتواصل معهم بأدب مهني."
    ],
    targetAudience: "جميع طلبة الكلية التطبيقية من السنة الأولى وحتى التخرج.",
    facilitationGuide: [
      {
        stepNumber: 1,
        title: "لماذا لينكد إن؟ قوة الشبكة المهنية (10 دقائق)",
        durationMin: 10,
        description: "أرقام عن التوظيف عبر لينكد إن في المملكة ورؤية 2030.",
        trainerTip: "استعرض حسابات ناجحة لخريجي الكلية التطبيقية."
      },
      {
        stepNumber: 2,
        title: "بناء الملف خطوة بخطوة (25 دقيقة)",
        durationMin: 25,
        description: "شرح كل قسم من الصورة الرسمية إلى التوصيات والمهارات المصادق عليها.",
        trainerTip: "حث الطلاب على فتح التطبيق على هواتفهم أو أجهزتهم وتحديث العناوين فوراً."
      },
      {
        stepNumber: 3,
        title: "فن المراسلة والتواصل مع مسؤولي التوظيف (15 دقيقة)",
        durationMin: 15,
        description: "قوالب رسائل التواصل المحترفة وتجنب الرسائل العشوائية المزعجة.",
        trainerTip: "قدم 3 قوالب رسائل جاهزة للطلب المباشر لفرصة تدريبية."
      },
      {
        stepNumber: 4,
        title: "التقييم وخطة النشر الأسبوعي (10 دقائق)",
        durationMin: 10,
        description: "تحديد خطة نشر أسبوعية بمقدار منشور واحد يعكس ما يتعلمه الطالب في الكلية.",
        trainerTip: "تشجيع الطلبة على متابعة صفحة جامعة المجمعة والكلية التطبيقية."
      }
    ],
    materials: [
      {
        id: "mat-6",
        title: "حقيبة تدريب لينكد إن للمهنيين الواعدين (PPTX)",
        type: "pptx",
        size: "16.1 MB",
        downloadUrl: "#",
        description: "شرائح بصرية غنية بأمثلة محلية من سوق العمل السعودي."
      },
      {
        id: "mat-7",
        title: "دليل قوالب رسائل التواصل مع مسؤولي التوظيف (PDF)",
        type: "pdf",
        size: "1.9 MB",
        downloadUrl: "#",
        description: "قوالب مراسلة جاهزة للمتدربين الباحثين عن فرص تعاونية أو وظائف دائمة."
      }
    ],
    iconName: "Globe",
    badgeColor: "sky",
    isActive: true,
  },
  {
    id: "course-4",
    code: "CGU-104",
    title: "استراتيجيات اقتناص فرص التدريب التعاوني (COOP) وبدء المسار الوظيفي",
    category: "career_readiness",
    categoryLabel: "التدريب التعاوني والجاهزية",
    durationMinutes: 60,
    recommendedStudentsMin: 20,
    recommendedStudentsMax: 45,
    shortDescription: "خارطة طريق متكاملة للطالب لاختيار جهة التدريب التعاوني الأنسب وتحويل فترة التدريب إلى عرض عمل دائم.",
    fullOverview: "تسلط الورشة الضوء على كيفية البحث المبكر عن جهات التدريب، التمييز بين الشركات الكبرى والمتوسطة والناشئة، والسلوك المهني والأخلاقيات أثناء فترة التدريب التي تضمن الحصول على توصية مهنية أو عرض وظيفي.",
    learningOutcomes: [
      "تحديد قائمة بالجهات التدريبية المستهدفة المتوافقة مع تخصص الطالب وطموحه.",
      "إعداد ملف التقديم للتدريب (السيرة، السجل الأكاديمي، خطاب الرغبة).",
      "أخلاقيات بيئة العمل، الانضباط، والتعامل مع المشرف الميداني.",
      "توثيق المهام المنجزة وكتابة تقرير التدريب التعاوني بامتياز."
    ],
    targetAudience: "طلبة الفصل السابق للتدريب التعاوني وطلبة الفصول النهائية.",
    facilitationGuide: [
      {
        stepNumber: 1,
        title: "أهمية التدريب التعاوني كجسر للوظيفة (10 دقائق)",
        durationMin: 10,
        description: "إبراز أن أكثر من 60% من عروض العمل للحديثي التخرج تأتي من جهة التدريب.",
        trainerTip: "استعرض قصص نجاح حقيقية لطلاب سابقين بالكلية التطبيقية."
      },
      {
        stepNumber: 2,
        title: "قنوات البحث غير التقليدية (20 دقيقة)",
        durationMin: 20,
        description: "معارض التوظيف، منصة جدارات، لينكد إن، والتواصل المباشر مع مدراء الإدارات المستهدفة.",
        trainerTip: "اشرح كيفية استهداف الشركات في منطقة الرياض والمحافظات التابعة لجامعة المجمعة."
      },
      {
        stepNumber: 3,
        title: "كيف تتميز أثناء الـ 12 أسبوعاً للتدريب؟ (20 دقيقة)",
        durationMin: 20,
        description: "المبادرة، حل المشكلات، بناء شبكة داخل الشركة، وإظهار القيمة التخصصية.",
        trainerTip: "قدم نصيحة ذهبية: لا تنتظر أن يطلب منك المشرف عملاً، اعرض المساعدة بلباقة."
      },
      {
        stepNumber: 4,
        title: "تحويل التدريب إلى وظيفة وتوصيات الختام (10 دقائق)",
        durationMin: 10,
        description: "متى وكيف تطلب من مديرك تقييماً تمهيدياً لمناقشة التثبيت بعد التخرج.",
        trainerTip: "توزيع نموذج مذكرة الإنجاز الأسبوعية للطلبة."
      }
    ],
    materials: [
      {
        id: "mat-8",
        title: "حقيبة التدريب التعاوني وبوابات التوظيف (PPTX)",
        type: "pptx",
        size: "12.7 MB",
        downloadUrl: "#",
        description: "عرض تقديمي شامل مع دليل لأبرز منصات التوظيف والتدريب بالمملكة."
      },
      {
        id: "mat-9",
        title: "حقيبة أدوات المتدرب التعاوني الناجح (ZIP)",
        type: "zip",
        size: "8.3 MB",
        downloadUrl: "#",
        description: "تضم نماذج خطط التدريب، سجل المهام اليومي، ونموذج خطاب الرغبة (Cover Letter)."
      }
    ],
    iconName: "Compass",
    badgeColor: "emerald",
    isActive: true,
  },
  {
    id: "course-5",
    code: "CGU-105",
    title: "المهارات الناعمة والذكاء العاطفي في بيئة العمل الحديثة",
    category: "soft_skills",
    categoryLabel: "المهارات الناعمة والسلوكية",
    durationMinutes: 60,
    recommendedStudentsMin: 15,
    recommendedStudentsMax: 40,
    shortDescription: "صقل مهارات التواصل الفعال، إدارة الضغوط، العمل الجماعي، وحل النزاعات المهنية بمرونة واقتدار.",
    fullOverview: "وفقاً لأحدث تقارير مهارات المستقبل، فإن 85% من النجاح الوظيفي يعتمد على المهارات الناعمة. هذه الورشة تزود الطلاب بالأدوات العملية للتفاعل الإيجابي في فرق العمل متعددة الثقافات.",
    learningOutcomes: [
      "إدراك أنماط الشخصيات في بيئة العمل وكيفية التعامل مع كل نمط.",
      "تقنيات الاستماع النشط وتقديم التغذية الراجعة البناءة دون تصادم.",
      "إدارة الوقت وتحديد الأولويات في بيئات العمل عالية المتطلبات.",
      "بناء المرونة النفسية والتعامل مع التغييرات التنظيمية."
    ],
    targetAudience: "كافة طلبة الكلية التطبيقية في مختلف التخصصات والسنوات.",
    facilitationGuide: [
      {
        stepNumber: 1,
        title: "الفرق بين المهارات الصلبة والناعمة (10 دقائق)",
        durationMin: 10,
        description: "المهارة الصلبة تضمن لك المقابلة، المهارة الناعمة تضمن لك الاستمرار والترقي.",
        trainerTip: "شارك مقولة ستيف جوبز أو قيادات الشركات السعودية حول روح الفريق."
      },
      {
        stepNumber: 2,
        title: "مصفوفة التواصل والذكاء العاطفي (25 دقيقة)",
        durationMin: 25,
        description: "فهم الذات، إدارة الانفعالات، والتعاطف المهني مع الزملاء والعملاء.",
        trainerTip: "اطرح تمرين حالة دراسية قصيرة لمدير غاضب وكيفية امتصاص الموقف."
      },
      {
        stepNumber: 3,
        title: "تمرين فرق العمل وحل التحديات المشتركة (15 دقيقة)",
        durationMin: 15,
        description: "تقسيم القاعة إلى مجموعات صغيرة لحل سيناريو مهني معقد في 5 دقائق وعرض الحل.",
        trainerTip: "ركز على تقييم كيفية وصول المجموعة للحل بالتشاور وليس النتيجة فقط."
      },
      {
        stepNumber: 4,
        title: "خطة التطوير الشخصي والختام (10 دقائق)",
        durationMin: 10,
        description: "تحديد كل طالب لمهارتين ناعمتين يسعى لتحسينهما خلال الفصل الحالي.",
        trainerTip: "شكر الحضور والتأكيد على الحصول على الشهادة عبر البوابة."
      }
    ],
    materials: [
      {
        id: "mat-10",
        title: "حقيبة الذكاء العاطفي والمهارات السلوكية (PPTX)",
        type: "pptx",
        size: "15.4 MB",
        downloadUrl: "#",
        description: "شرائح تفاعلية متضمنة تمارين تطبيقية ومقاييس ذاتية مصغرة."
      },
      {
        id: "mat-11",
        title: "مقياس المهارات الناعمة للطلبة ونموذج خطة التطوير (PDF)",
        type: "pdf",
        size: "2.2 MB",
        downloadUrl: "#",
        description: "اختبار تقييم ذاتي سريع من 20 سؤالاً مع مفتاح تصحيح فوري."
      }
    ],
    iconName: "Award",
    badgeColor: "purple",
    isActive: true,
  }
];

export const INITIAL_SESSIONS: WorkshopSession[] = [
  {
    id: "sess-101",
    courseId: "course-1",
    courseTitle: "بناء السيرة الذاتية الاحترافية المتوافقة مع أنظمة الفرز الذكي (ATS)",
    courseCode: "CGU-101",
    professorId: "fac-1",
    professorName: "د. عبد الرحمن بن فهد السويكت",
    professorTitle: "أستاذ مشارك",
    professorEmail: "a.alswaiket@mu.edu.sa",
    professorPhone: "0501234567",
    department: "علوم الحاسب وتقنية المعلومات",
    campus: "المجمعة (المقر الرئيسي)",
    date: "2026-08-20",
    timeSlot: "09:00 ص - 10:00 ص",
    hallName: "معمل البرمجيات الذكية (قاعة 104)",
    deliveryMode: "in_person",
    studentCountTarget: 35,
    studentCountActual: 38,
    status: "completed",
    sessionNotes: "تفاعل استثنائي من طلاب السنة النهائية في قسم علوم الحاسب وتم تطبيق نماذج ATS الحية بنجاح تام.",
    studentFeedbackRating: 4.9,
    certificateIssued: true,
    certificateId: "MU-AC-CERT-2026-0081",
    certificateIssueDate: "2026-08-20",
    reminderSentWhatsApp: true,
    reminderSentEmail: true,
    completionConfirmedAt: "2026-08-20 11:15",
    createdAt: "2026-08-15",
  },
  {
    id: "sess-102",
    courseId: "course-2",
    courseTitle: "استراتيجيات اجتياز المقابلات الوظيفية وتقنية (STAR)",
    courseCode: "CGU-102",
    professorId: "fac-2",
    professorName: "د. نورة بنت سليمان الدخيل",
    professorTitle: "أستاذ مساعد",
    professorEmail: "n.aldakheel@mu.edu.sa",
    professorPhone: "0559876543",
    department: "العلوم الإدارية والمالية",
    campus: "المجمعة (شطر الطالبات)",
    date: "2026-08-22",
    timeSlot: "10:30 ص - 11:30 ص",
    hallName: "مدرج الكلية التطبيقية (شطر الطالبات)",
    deliveryMode: "in_person",
    studentCountTarget: 40,
    studentCountActual: 42,
    status: "completed",
    sessionNotes: "تم إجراء محاكاة مقابلة لـ 3 طالبات بحضور الزميلات وإتقان تقنية STAR.",
    studentFeedbackRating: 4.8,
    certificateIssued: true,
    certificateId: "MU-AC-CERT-2026-0082",
    certificateIssueDate: "2026-08-22",
    reminderSentWhatsApp: true,
    reminderSentEmail: true,
    completionConfirmedAt: "2026-08-22 12:30",
    createdAt: "2026-08-16",
  },
  {
    id: "sess-103",
    courseId: "course-3",
    courseTitle: "بناء الهوية المهنية الرقمية واستثمار شبكة LinkedIn",
    courseCode: "CGU-103",
    professorId: "fac-1",
    professorName: "د. عبد الرحمن بن فهد السويكت",
    professorTitle: "أستاذ مشارك",
    professorEmail: "a.alswaiket@mu.edu.sa",
    professorPhone: "0501234567",
    department: "علوم الحاسب وتقنية المعلومات",
    campus: "المجمعة (المقر الرئيسي)",
    date: "2026-08-26",
    timeSlot: "11:00 ص - 12:00 م",
    hallName: "قاعة التدريب التفاعلي (202)",
    deliveryMode: "in_person",
    studentCountTarget: 30,
    status: "scheduled",
    sessionNotes: "تم التنسيق لتجهيز أجهزة العرض والشاشات الذكية لتطبيق إنشاء الملفات مع الطلاب.",
    certificateIssued: false,
    reminderSentWhatsApp: true,
    reminderSentEmail: true,
    createdAt: "2026-08-21",
  },
  {
    id: "sess-104",
    courseId: "course-4",
    courseTitle: "استراتيجيات اقتناص فرص التدريب التعاوني (COOP) وبدء المسار الوظيفي",
    courseCode: "CGU-104",
    professorId: "fac-3",
    professorName: "د. خالد بن منصور العتيبي",
    professorTitle: "أستاذ مشارك",
    professorEmail: "k.alotaibi@mu.edu.sa",
    professorPhone: "0543322110",
    department: "الهندسة والتقنيات الصناعية",
    campus: "الزلفي",
    date: "2026-08-28",
    timeSlot: "09:30 ص - 10:30 ص",
    hallName: "مدرج الكلية التطبيقية بالزلفي (قاعة أ)",
    deliveryMode: "in_person",
    studentCountTarget: 45,
    status: "scheduled",
    certificateIssued: false,
    reminderSentWhatsApp: false,
    reminderSentEmail: true,
    createdAt: "2026-08-22",
  },
  {
    id: "sess-105",
    courseId: "course-5",
    courseTitle: "المهارات الناعمة والذكاء العاطفي في بيئة العمل الحديثة",
    courseCode: "CGU-105",
    professorId: "fac-2",
    professorName: "د. نورة بنت سليمان الدخيل",
    professorTitle: "أستاذ مساعد",
    professorEmail: "n.aldakheel@mu.edu.sa",
    professorPhone: "0559876543",
    department: "العلوم الإدارية والمالية",
    campus: "المجمعة (شطر الطالبات)",
    date: "2026-09-02",
    timeSlot: "01:00 م - 02:00 م",
    hallName: "عبر البلاك بورد (جلسة افتراضية)",
    deliveryMode: "remote",
    studentCountTarget: 50,
    status: "scheduled",
    certificateIssued: false,
    reminderSentWhatsApp: false,
    reminderSentEmail: false,
    createdAt: "2026-08-24",
  }
];

export const TIME_SLOTS_PRESETS = [
  "08:00 ص - 09:00 ص",
  "09:00 ص - 10:00 ص",
  "10:00 ص - 11:00 ص",
  "11:00 ص - 12:00 م",
  "12:00 م - 01:00 م",
  "01:00 م - 02:00 م",
  "02:00 م - 03:00 م",
];

export const CAMPUS_OPTIONS = [
  "المجمعة (المقر الرئيسي - طلاب)",
  "المجمعة (مجمع الكليات - طالبات)",
  "الزلفي (الكلية التطبيقية)",
  "حوطة سدير (الكلية التطبيقية)",
  "رماح (الكلية التطبيقية)",
];

export const DEPARTMENT_OPTIONS = [
  "علوم الحاسب وتقنية المعلومات",
  "العلوم الإدارية والمالية",
  "الهندسة والتقنيات الصناعية",
  "الرعاية الصحية والإدارة الطبية",
  "التسويق الرقمي والتجارة الإلكترونية",
  "الأمن السيبراني والشبكات",
];
