import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Helper to provide realistic rich fallback generator for all 8 academic programs
function generateLocalCurriculum(department: string, eventType: string, prompt: string, existingCount: number = 5) {
  const code = `CGU-${100 + existingCount + 1}`;
  
  let title = '';
  let category: 'career_readiness' | 'interview_skills' | 'cv_portfolio' | 'soft_skills' | 'digital_tools' = 'career_readiness';
  let categoryLabel = 'جاهزية سوق العمل';
  let overview = '';
  let outcomes: string[] = [];
  let audience = `طلبة وخريجو برنامج ${department} والمتدربون الميدانيون بالكلية التطبيقية`;

  if (department === 'البرمجة وعلوم الحاسب' || department.includes('علوم الحاسب') || department.includes('البرمجة')) {
    category = 'digital_tools';
    categoryLabel = 'البرمجة والتقنيات الرقمية';
    if (prompt && (prompt.includes('أمن') || prompt.includes('سيبراني'))) {
      title = prompt.length > 5 ? prompt : 'أساسيات الأمن السيبراني وهندسة حماية الأنظمة الرقمية';
      overview = 'تمكين طلبة برنامج البرمجة وعلوم الحاسب من استيعاب معايير الأمن السيبراني وممارسات الكشف عن الثغرات البرمجية وحماية قواعد البيانات والتطبيقات السحابية.';
      outcomes = [
        'فهم مبادئ أمن المعلومات وحماية التطبيقات والشبكات.',
        'تطبيق آليات التشفير وإدارة الهويات والتحقق الأمني للأنظمة.',
        'اكتشاف الثغرات البرمجية الشائعة وفق معايير OWASP وكيفية معالجتها.',
        'بناء استراتيجيات التعامل مع الحوادث السيبرانية في بيئة العمل.'
      ];
    } else if (prompt && (prompt.includes('ذكاء') || prompt.includes('بيانات') || prompt.includes('تعلم'))) {
      title = prompt.length > 5 ? prompt : 'تطبيقات الذكاء الاصطناعي وهندسة البيانات البرمجية لسوق العمل';
      overview = 'ورشة عملية تطبيقية تركز على توظيف نماذج الذكاء الاصطناعي ومكتبات معالجة البيانات وبناء حلول برمجية ذكية تلبي احتياجات التحول الرقمي.';
      outcomes = [
        'استيعاب خوارزميات تعلم الآلة ونماذج الذكاء الاصطناعي التوليدي.',
        'بناء خطوط معالجة واستكشاف البيانات باستخدام أدوات ولغات البرمجة الحديثة.',
        'تطوير وتكامل واجهات برمجة التطبيقات الذكية (AI APIs) مع الأنظمة.',
        'نشر نماذج الذكاء الاصطناعي واختبار كفاءتها البرمجية.'
      ];
    } else {
      title = prompt.trim() || 'الخوارزميات المتقدمة وهيكلة البرمجيات وحوسبة السحابة';
      overview = 'حقيبة تدريبية نوعية تركز على رفع الكفاءة البرمجية في كتابة الشيفرات النظيفة وتطبيق أنماط التصميم المعمارية وتقنيات الحوسبة السحابية وDevOps.';
      outcomes = [
        'إتقان كتابة الخوارزميات الفعالة وتحليل التعقيد الحسابي (Big O).',
        'تطبيق معايير الكود النظيف (Clean Code) وأنماط التصميم البرمجي.',
        'استخدام أنظمة إدارة النسخ Git وحاويات Docker والحوسبة السحابية.',
        'إعداد المشاريع البرمجية التنافسية لملفات البورتفوليو على GitHub.'
      ];
    }
  } else if (department === 'تطوير تطبيقات الأجهزة الذكية' || department.includes('الأجهزة الذكية') || department.includes('تطبيقات')) {
    category = 'digital_tools';
    categoryLabel = 'تطوير التطبيقات الذكية';
    title = prompt.trim() || (prompt.includes('flutter') || prompt.includes('swift') ? prompt : 'هندسة وبرمجة تطبيقات الهواتف الذكية وتكامل الخدمات السحابية');
    overview = 'برنامج تطبيقي موجه لطلبة برنامج تطوير تطبيقات الأجهزة الذكية لبناء تطبيقات متقدمة وسريعة الاستجابة للهواتف الذكية (iOS و Android) وربطها بالواجهات البرمجية وتجهيزها للنشر على المتاجر.';
    outcomes = [
      'هيكلة وبرمجة تطبيقات الأجهزة الذكية باستخدام أحدث أطر العمل (Flutter / Native).',
      'إدارة الحالة (State Management) وتكامل الواجهات البرمجية REST APIs.',
      'تحسين تجربة وسرعة أداء التطبيقات واختبار توافقها مع مختلف الشاشات والأجهزة.',
      'إعداد شهادات النشر وإطلاق التطبيقات على متجري App Store و Google Play.'
    ];
  } else if (department === 'التصميم الجرافيكي والوسائط الرقمية' || department.includes('التصميم') || department.includes('الوسائط')) {
    category = 'digital_tools';
    categoryLabel = 'التصميم والوسائط الرقمية';
    if (prompt && (prompt.includes('واجهات') || prompt.includes('ux') || prompt.includes('ui') || prompt.includes('figma'))) {
      title = prompt.length > 5 ? prompt : 'تصميم واجهات وتجربة المستخدم (UI/UX) وبناء النماذج التفاعلية بـ Figma';
      overview = 'ورشة عملية تفاعلية لطلبة التصميم الجرافيكي والوسائط الرقمية تركز على منهجيات التفكير التصميمي وبناء نظم التصميم (Design Systems) والنماذج الأولية الرقمية.';
      outcomes = [
        'إجراء أبحاث المستخدم وتخطيط رحلة العميل وبناء المخططات الهيكلية (Wireframes).',
        'بناء وتطبيق نظم التصميم (Design Systems) والمكونات التفاعلية على Figma.',
        'تطبيق معايير سهولة الاستخدام وإمكانية الوصول البصري الرقمي.',
        'تجهيز وتسليم ملفات التصميم للمطورين والمبرمجين بدقة واحتراف.'
      ];
    } else {
      title = prompt.trim() || 'صناعة الهويات البصرية وإنتاج الوسائط الرقمية والمحتوى الإبداعي';
      overview = 'حقيبة تدريبية تركز على إتقان تصميم الهويات التجارية الشاملة، صناعة الموشن جرافيك والمونتاج الرقمي لإنتاج محتوى وسائط متعددة عالي الجودة.';
      outcomes = [
        'تطوير أدلة الهوية البصرية والعلامات التجارية وفق الأسس التيبوغرافية واللونية.',
        'إنتاج الرسوم المتحركة (Motion Graphics) والمؤثرات البصرية للوسائط الرقمية.',
        'تحرير الفيديو وإخراج المواد الإعلانية لمنصات التواصل وسوق العمل.',
        'بناء معرض أعمال رقمي احترافي (Behance / Portfolio) يعكس القدرات التنافسية.'
      ];
    }
  } else if (department === 'التجارة الإلكترونية' || department.includes('التجارة')) {
    category = 'career_readiness';
    categoryLabel = 'التجارة والتسويق الرقمي';
    title = prompt.trim() || 'استراتيجيات إدارة المتاجر الإلكترونية والتسويق الرقمي وبوابات الدفع';
    overview = 'تأهيل طلبة برنامج التجارة الإلكترونية لإطلاق وإدارة المنصات والمتاجر الرقمية بفاعلية، وربط بوابات الدفع، وإدارة الحملات الإعلانية الممولة وتحليل قمع المبيعات.';
    outcomes = [
      'تأسيس وإدارة المتاجر الإلكترونية وضبط بوابات الدفع وشركات الشحن.',
      'تخطيط الحملات التسويقية الرقمية عبر منصات التواصل وتحسين محركات البحث SEO.',
      'تحليل مؤشرات الأداء الرقمي (KPIs) ومعدلات التحويل وقيمة سلة المشتريات.',
      'تطبيق استراتيجيات تحسين تجربة العميل الرقمية وخدمات ما بعد البيع.'
    ];
  } else if (department === 'الموارد البشرية' || department.includes('الموارد البشرية')) {
    category = 'career_readiness';
    categoryLabel = 'الموارد البشرية وسوق العمل';
    title = prompt.trim() || 'استقطاب المواهب وإدارة الأداء الوظيفي وأنظمة العمل السعودية الحديثة';
    overview = 'برنامج تطبيقي متخصص لطلبة الموارد البشرية يركز على ممارسات التوظيف الحديثة، أنظمة الفرز الآلي للكوادر، تقييم الأداء، وتطبيق لوائح نظام العمل والتأمينات الاجتماعية بالسعودية.';
    outcomes = [
      'تخطيط الاحتياجات الوظيفية واستقطاب الكفاءات باستخدام أدوات التوظيف الحديثة.',
      'تصميم نماذج ومؤشرات قياس الأداء الفردي والمؤسسي (OKRs & KPIs).',
      'فهم وتطبيق مواد نظام العمل السعودي ولوائحه التنفيذية وحقوق العاملين.',
      'تطوير استراتيجيات الاندماج والولاء الوظيفي وبرامج التدريب والتطوير المستمر.'
    ];
  } else if (department === 'إدارة وتطوير العقار' || department.includes('العقار')) {
    category = 'career_readiness';
    categoryLabel = 'التطوير والاستثمار العقاري';
    title = prompt.trim() || 'أسس التثمين العقاري وإدارة الأملاك والتشريعات العقارية السعودية';
    overview = 'حقيبة تدريبية نوعية موجهة لطلبة إدارة وتطوير العقار للتعرف على أساليب التقييم والتثمين العقاري، وإدارة المرافق والأملاك، واللوائح المعتمدة من الهيئة العامة للعقار.';
    outcomes = [
      'استيعاب طرق التقييم والتثمين العقاري المعتمدة وفق المعايير المهنية.',
      'إدارة المحافظ والأملاك العقارية وتطبيق عقود الإيجار الموحدة عبر منصة إيجار.',
      'فهم التشريعات والأنظمة العقارية ولوائح الوساطة والتطوير العقاري بالمملكة.',
      'تطبيق استراتيجيات التسويق العقاري الذكي ودراسات الجدوى للمشاريع السكنية والتجارية.'
    ];
  } else if (department === 'إدارة اللوجستيات وسلاسل الإمداد' || department.includes('اللوجستيات') || department.includes('الإمداد')) {
    category = 'career_readiness';
    categoryLabel = 'اللوجستيات وسلاسل الإمداد';
    title = prompt.trim() || 'إدارة المستودعات الذكية وسلاسل الإمداد والعمليات اللوجستية الحديثة';
    overview = 'تمكين طلبة إدارة اللوجستيات وسلاسل الإمداد من التخطيط اللوجستي الفعال وإدارة المخزون والتوزيع، وتوظيف أنظمة تخطيط الموارد (ERP) ورفع كفاءة النقل والتخزين.';
    outcomes = [
      'تخطيط ومراقبة تدفقات سلاسل الإمداد وإدارة المخزون ونقاط إعادة الطلب.',
      'تنظيم وإدارة المستودعات الذكية وتطبيق أنظمة التتبع الرقمي والتخزين الحديثة.',
      'فهم الإجراءات الجمركية والشحن الدولي والداخلي وتوثيق العمليات اللوجستية.',
      'تحسين التكلفة التشغيلية وتقليل الهدر الزمني وفق مبادئ الإدارة الرشيقة (Lean Logistics).'
    ];
  } else if (department === 'المحاسبة والضرائب' || department.includes('المحاسبة') || department.includes('الضرائب')) {
    category = 'career_readiness';
    categoryLabel = 'المحاسبة والأنظمة الضريبية';
    title = prompt.trim() || 'المحاسبة المالية وإقرارات ضريبة القيمة المضافة (VAT) والفوترة الإلكترونية';
    overview = 'ورشة عملية موجهة لطلبة برنامج المحاسبة والضرائب لإتقان إعداد القوائم المالية، والتعامل مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA)، وتطبيقات الفوترة السحابية.';
    outcomes = [
      'تسجيل القيود المحاسبية وإعداد ميزان المراجعة والقوائم المالية الختامية.',
      'احتساب وإعداد الإقرارات الضريبية وضريبة القيمة المضافة (VAT) وضريبة التصرفات العقارية.',
      'تطبيق متطلبات الفوترة الإلكترونية (مرحلة الربط والتكامل) مع هيئة الزكاة والضريبة.',
      'استخدام برامج المحاسبة السحابية ERP وإجراء عمليات التدقيق والمطابقات البنكية.'
    ];
  } else {
    // Default fallback
    title = prompt.trim() || `المهارات المهنية والتطبيقية لبرنامج ${department}`;
    overview = `حقيبة تدريبية تم إعدادها بالكلية التطبيقية بجامعة المجمعة لتمكين طلبة ${department} من اكتساب الجدارات الوظيفية التنافسية.`;
    outcomes = [
      `استيعاب المفاهيم التطبيقية الحديثة في تخصص ${department}.`,
      'تنفيذ المهام والمشاريع التخصصية بكفاءة عالية وفق معايير سوق العمل.',
      'تطوير مهارات التفكير النقدي وحل المشكلات المهنية.',
      'بناء مخرجات قابلة للإدراج في السيرة الذاتية وملف الإنجاز المهني.'
    ];
  }

  return {
    code,
    title,
    category,
    categoryLabel,
    durationMinutes: 60,
    recommendedStudentsMin: 20,
    recommendedStudentsMax: 45,
    shortDescription: overview.slice(0, 140) + '...',
    fullOverview: overview,
    learningOutcomes: outcomes,
    targetAudience: audience,
    facilitationGuide: [
      {
        stepNumber: 1,
        title: 'التهيئة وكسر الجليد واستعراض الأهداف',
        durationMin: 10,
        description: `الترحيب بطلبة برنامج ${department}، توضيح القيمة المهنية للورشة وربطها بفرص التوظيف المباشرة.`,
        trainerTip: 'ابدأ بسؤال استطلاعي تفاعلي أو استبيان فوري قصير لمعرفة خبرات الطلاب السابقة.'
      },
      {
        stepNumber: 2,
        title: 'المفاهيم المحورية والشرح التفاعلي',
        durationMin: 30,
        description: 'شرح وتوضيح الركائز الأساسية للموضوع وتطبيق نماذج واقعية وأمثلة حية من بيئات العمل السعودية.',
        trainerTip: 'قسّم الطلاب لفرق مصغرة لمناقشة دراسة حالة سريعة وتدوين النقاط الرئيسية.'
      },
      {
        stepNumber: 3,
        title: 'التطبيق العملي والمحاكاة الميدانية',
        durationMin: 15,
        description: 'تنفيذ تمرين تطبيقي فردي أو جماعي باستخدام نماذج العمل المرفقة للتأكد من استيعاب المهارة.',
        trainerTip: 'مر بين المجموعات لتقديم تغذية راجعة فورية وتصويب المفاهيم.'
      },
      {
        stepNumber: 4,
        title: 'الختام وتوزيع الاستبيان والتكريم',
        durationMin: 5,
        description: 'تلخيص أبرز النقاط والمخرجات، والإجابة عن استفسارات الطلبة وتوجيههم لتقييم الجلسة.',
        trainerTip: 'ذكّر الطلاب برابط استبيان وحدة الإرشاد والتطوير المهني لحصر الحضور.'
      }
    ],
    materials: [
      {
        id: `mat-${code}-1`,
        title: `عرض ${title} (PPTX)`,
        type: 'pptx',
        size: '14.2 MB',
        downloadUrl: '#',
        description: 'العرض التقديمي التدريبي المعتمد من الكلية التطبيقية بجامعة المجمعة'
      },
      {
        id: `mat-${code}-2`,
        title: `دليل الأنشطة وحقيبة المتدرب التطبيقية (PDF)`,
        type: 'pdf',
        size: '3.8 MB',
        downloadUrl: '#',
        description: 'أوراق العمل والتمارين التطبيقية الموجهة للطلبة'
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Workshop Curriculum Generator Endpoint
  app.post('/api/generate-workshop', async (req, res) => {
    try {
      const { department = 'قسم العلوم والحاسب', eventType = 'ورشة عمل تطبيقية', prompt = '', existingCount = 5 } = req.body || {};
      
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Return rich domain-aware local generation
        const generated = generateLocalCurriculum(department, eventType, prompt, existingCount);
        return res.json({ success: true, source: 'offline_intelligent_engine', data: generated });
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `أنت خبير تدريب وتوجيه مهني ومستشار جاهزية سوق العمل بالكلية التطبيقية بجامعة المجمعة.
مهمتك توليد حقيبة تدريبية تطبيقية متكاملة واحترافية وموجهة 100% لاحتياجات سوق العمل السعودي والوظائف الحالية (Job-Readiness & Practical Skills).

توجيهات حاسمة لصياغة المحتوى:
1. ابتعد تماماً عن المواد الأكاديمية النظرية ومفردات الكتب الجامعية المكررة.
2. ركز بالكامل على المهارات الميدانية التطبيقية، الأدوات والبرمجيات الاحترافية، ودراسات الحالة الواقعية التي يطلبها أصحاب العمل في المملكة العربية السعودية.
3. التوافق مع برامج الكلية التطبيقية الـ8 المعتمدة:
  - الموارد البشرية: HR Analytics، أنظمة التوظيف ATS، إدارة الأداء ونماذج OKRs، تجربة الموظف، نظام العمل السعودي.
  - التجارة الإلكترونية: إطلاق الحملات الممولة (TikTok & Meta)، تحسين معدل التحويل CRO، منصات زد وسلة وبوابات الدفع، التسويق بالعمولة.
  - تطوير تطبيقات الأجهزة الذكية: Flutter & Riverpod، تكامل بوابات الدفع والإشعارات، هندسة Clean Architecture، النشر على App Store و Google Play.
  - البرمجة وعلوم الحاسب: هندسة السحابة و DevOps و Docker، الذكاء الاصطناعي التوليدي وهندسة الأوامر للمطورين، ممارسات الأمن السيبراني و OWASP، واجهات Microservices.
  - إدارة وتطوير العقار: التسويق العقاري الرقمي، التثمين العقاري المعتمد من "تقييم"، منصتي إيجار ومُلاّك، دراسات الجدوى والاستثمار العقاري.
  - التصميم الجرافيكي والوسائط الرقمية: نظم التصميم و UI/UX على Figma، إنتاج الموشن جرافيك والمونتاج لمنصات التواصل، الهويات التجارية، إعداد بورتفوليو احترافي على Behance.
  - إدارة اللوجستيات وسلاسل الإمداد: المستودعات الذكية وأنظمة WMS و ERP، التخليص ومنصة سابر، كفاءة الميل الأخير Last-Mile Delivery، سلاسل الإمداد الرشيقة.
  - المحاسبة والضرائب: إقرارات VAT مع هيئة ZATCA، الفوترة الإلكترونية السحابية (مرحلة 2)، إقفال القوائم المالية ببرامج ERP، التحليل المالي والموازنات التقديرية.

المدخلات:
- البرنامج/القسم الأكاديمي: ${department}
- نوع الفعالية: ${eventType}
- موضوع أو فكرة الورشة المستهدفة: ${prompt || 'ورشة مهارات تطبيقية تنافسية لسوق العمل'}
- رمز الورشة المقترح: CGU-${100 + existingCount + 1}

يجب أن تكون الاستجابة حصراً بصيغة JSON صحيحة بدون علامات تخفيض (markdown backticks) أو نصوص إضافية، وتطابق الحقول التالية:
{
  "code": "CGU-${100 + existingCount + 1}",
  "title": "عنوان الورشة الرسمي والتطبيقي الجاذب",
  "category": "career_readiness | interview_skills | cv_portfolio | soft_skills | digital_tools",
  "categoryLabel": "التصنيف بالعربي",
  "durationMinutes": 60,
  "recommendedStudentsMin": 20,
  "recommendedStudentsMax": 45,
  "shortDescription": "نبذة تطبيقية موجزة من سطرين تركز على المهارة المكتسبة",
  "fullOverview": "شرح مفصل ومحكم للهدف الميداني وأهمية الحقيبة لتمكين خريجي البرنامج في سوق العمل",
  "learningOutcomes": ["مخرج مهني عملي 1", "مخرج مهني عملي 2", "مخرج مهني عملي 3", "مخرج مهني عملي 4"],
  "targetAudience": "طلبة وخريجو برنامج ${department} والمتدربون الميدانيون",
  "facilitationGuide": [
    { "stepNumber": 1, "title": "عنوان المرحلة", "durationMin": 10, "description": "وصف تفاعلي يركز على التطبيق", "trainerTip": "نصيحة للمدرب" },
    { "stepNumber": 2, "title": "المحتوى الرئيسي والتطبيق الميداني", "durationMin": 30, "description": "شرح الأدوات والسيناريوهات الواقعية", "trainerTip": "نصيحة للمدرب" },
    { "stepNumber": 3, "title": "التطبيق العملي والمحاكاة", "durationMin": 15, "description": "تمرين تطبيقي جماعي أو دراسة حالة", "trainerTip": "نصيحة للمدرب" },
    { "stepNumber": 4, "title": "الختام وتوزيع أدوات التقييم", "durationMin": 5, "description": "استخلاص المخرجات وتوجيه الطلبة للاستبيان", "trainerTip": "نصيحة للمدرب" }
  ],
  "materials": [
    { "id": "mat-1", "title": "العرض التقديمي التطبيقي المعتمد (PPTX)", "type": "pptx", "size": "14.2 MB", "downloadUrl": "#", "description": "عرض الشرائح التفاعلي ودراسات الحالة" },
    { "id": "mat-2", "title": "دليل التمارين وأوراق العمل الميدانية (PDF)", "type": "pdf", "size": "3.5 MB", "downloadUrl": "#", "description": "دليل التطبيقات والتمارين العملية للمتدربين" }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: systemPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, source: 'gemini_ai', course: parsed, data: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local curriculum generator:', geminiErr);
      }

      // Fallback
      const fallbackData = generateLocalCurriculum(department, eventType, prompt, existingCount);
      return res.json({ success: true, source: 'local_fallback', course: fallbackData, data: fallbackData });

    } catch (err: any) {
      console.error('Error generating workshop:', err);
      res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

