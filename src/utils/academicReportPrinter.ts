import { FacultyMember, WorkshopSession, DeanOfficialConfig } from '../types';

export function generateAcademicReportHTML(params: {
  professor: FacultyMember;
  completedSessions: WorkshopSession[];
  deanConfig: DeanOfficialConfig;
  totalPoints: number;
  doctorRankText: string;
  totalFacultyCount: number;
  reportRef?: string;
}): string {
  const {
    professor,
    completedSessions,
    deanConfig,
    totalPoints,
    doctorRankText,
    totalFacultyCount,
  } = params;

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
  const refCode = `MU-AC-REP-${new Date().getFullYear()}-${professor.id.replace(/\D/g, '').padStart(3, '0') || '101'}`;

  const tableRows = completedSessions.map((session, index) => {
    const certId = session.certificateId || `MU-AC-CERT-${new Date().getFullYear()}-${session.id.replace(/\D/g, '').padStart(4, '0') || '0101'}`;
    const students = session.studentCountActual || session.studentCountTarget || 0;
    return `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-family: monospace;">${index + 1}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1;">
          <div style="font-weight: bold; color: #0f172a; font-size: 13px;">${session.courseTitle}</div>
          <span style="font-size: 10px; color: #854d0e; background-color: #fef9c3; padding: 2px 6px; border-radius: 4px; border: 1px solid #fef08a; font-family: monospace;">${session.courseCode}</span>
        </td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; white-space: nowrap; font-size: 12px;">
          <div>${session.date}</div>
          <div style="font-size: 10px; color: #64748b;">${session.timeSlot}</div>
        </td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 12px;">
          <div>${session.campus}</div>
          <div style="font-size: 10px; color: #64748b;">${session.hallName}</div>
        </td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #166534; font-family: monospace; font-size: 13px;">
          ${students} طالب
        </td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center; font-family: monospace; font-size: 11px; color: #334155; font-weight: 600;">
          ${certId}
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير الإنجاز السنوي - ${professor.title} ${professor.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', 'Noto Kufi Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      direction: rtl;
      text-align: right;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .kufi {
      font-family: 'Noto Kufi Arabic', 'Cairo', sans-serif;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 28px 36px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }
    .header-table {
      width: 100%;
      border-bottom: 3px solid #1b4329;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header-table td {
      vertical-align: top;
    }
    .badge-year {
      display: inline-block;
      padding: 4px 12px;
      background: #f0fdf4;
      color: #166534;
      font-weight: bold;
      font-size: 11px;
      border-radius: 20px;
      border: 1px solid #bbf7d0;
      margin-top: 6px;
    }
    .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #1b4329;
      margin-top: 14px;
      text-align: center;
    }
    .doc-subtitle {
      font-size: 12px;
      color: #475569;
      text-align: center;
      margin-top: 4px;
    }
    .profile-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      font-size: 12px;
    }
    .profile-label {
      color: #64748b;
      font-size: 11px;
      display: block;
      margin-bottom: 2px;
    }
    .profile-val {
      font-weight: bold;
      color: #0f172a;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .stat-val {
      font-size: 22px;
      font-weight: 900;
      font-family: 'Noto Kufi Arabic', sans-serif;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: #334155;
      margin-top: 4px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .data-table th {
      background-color: #1b4329;
      color: #ffffff;
      padding: 10px 12px;
      border: 1px solid #143520;
      font-weight: 700;
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 11px;
    }
    .signatures-table {
      width: 100%;
      margin-top: 24px;
      border-top: 2px solid #e2e8f0;
      padding-top: 20px;
    }
    .signatures-table td {
      width: 50%;
      vertical-align: top;
      text-align: center;
      padding: 0 16px;
      font-size: 12px;
    }
    .sig-line {
      width: 160px;
      border-bottom: 1px dashed #94a3b8;
      margin: 32px auto 8px auto;
    }
    .auth-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #166534;
      border-radius: 20px;
      font-size: 10px;
      font-weight: bold;
      margin-top: 8px;
    }
    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 24px;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }

    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .container {
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm;
      }
    }
  </style>
</head>
<body>
  
  <div class="no-print" style="max-width: 900px; margin: 0 auto 16px auto; display: flex; justify-content: space-between; align-items: center; background: #143520; color: #fff; padding: 12px 20px; border-radius: 10px;">
    <div style="font-weight: bold; font-size: 14px;">معاينة جاهزة للطباعة والتصدير كـ PDF</div>
    <button onclick="window.print();" style="background: #e5d4a6; color: #143520; font-weight: bold; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: inherit;">
      🖨️ طباعة الآن / حفظ كـ PDF
    </button>
  </div>

  <div class="container">
    
    <!-- 1. Header -->
    <table class="header-table">
      <tr>
        <td style="width: 38%; text-align: right;">
          <div style="font-size: 11px; font-weight: bold; color: #475569;">المملكة العربية السعودية</div>
          <div style="font-size: 11px; font-weight: bold; color: #475569;">وزارة التعليم • جامعة المجمعة</div>
          <div style="font-size: 15px; font-weight: bold; color: #1b4329;" class="kufi">الكلية التطبيقية</div>
          <div style="font-size: 11px; font-weight: 600; color: #854d0e;">وحدة الإرشاد والتطوير المهني والتوظيف</div>
        </td>
        <td style="width: 24%; text-align: center;">
          <div style="width: 50px; height: 50px; margin: 0 auto; background: #faf6ee; border: 1px solid #e2d3b3; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            🎓
          </div>
          <div class="badge-year">العام الأكاديمي: ${currentAcademicYear}</div>
        </td>
        <td style="width: 38%; text-align: left; font-size: 11px; color: #475569;" dir="ltr">
          <div><strong>Ref:</strong> ${refCode}</div>
          <div><strong>Date:</strong> ${gregorianDate}</div>
          <div><strong>Hijri:</strong> ${reportDate}</div>
        </td>
      </tr>
    </table>

    <div class="doc-title kufi">تقرير الإنجاز السنوي والأنشطة الإرشادية والتدريبية</div>
    <div class="doc-subtitle">سجل توثيق ورش العمل والبرامج المهنية المنفذة لصالح طلبة الكلية التطبيقية</div>

    <!-- 2. Professor Profile -->
    <div class="profile-card" style="margin-top: 18px;">
      <div style="font-weight: bold; color: #1b4329; margin-bottom: 8px; font-size: 12px;" class="kufi">
        🏛️ بيانات عضو هيئة التدريس / المحاضر المعتمد:
      </div>
      <div class="profile-grid">
        <div>
          <span class="profile-label">اسم المحاضر:</span>
          <span class="profile-val">${professor.title} / ${professor.name}</span>
        </div>
        <div>
          <span class="profile-label">القسم الأكاديمي:</span>
          <span class="profile-val">${professor.department}</span>
        </div>
        <div>
          <span class="profile-label">مقر التدريس:</span>
          <span class="profile-val">${professor.campus}</span>
        </div>
        <div>
          <span class="profile-label">البريد الجامعي:</span>
          <span class="profile-val" style="font-family: monospace; font-size: 11px;">${professor.email}</span>
        </div>
      </div>
    </div>

    <!-- 3. Statistics KPIs -->
    <div class="stats-grid">
      <div class="stat-card" style="background: #faf6ee; border-color: #e2d3b3;">
        <div class="stat-val" style="color: #1b4329;">${completedSessions.length}</div>
        <div class="stat-label">ورش عمل منفذة ومعتمدة</div>
      </div>

      <div class="stat-card" style="background: #f0fdf4; border-color: #bbf7d0;">
        <div class="stat-val" style="color: #166534;">${totalStudents}</div>
        <div class="stat-label">طالباً مستفيداً (حضور فعلي)</div>
      </div>

      <div class="stat-card" style="background: #fefce8; border-color: #fef08a;">
        <div class="stat-val" style="color: #854d0e;">${completedSessions.length}</div>
        <div class="stat-label">شهادات شكر وتقدير صادرة</div>
      </div>

      <div class="stat-card" style="background: #143520; color: #ffffff; border-color: #1b4329;">
        <div class="stat-val" style="color: #f3e5b8; font-size: 16px;">${doctorRankText}</div>
        <div class="stat-label" style="color: #d1fae5; font-size: 10px;">الترتيب الأكاديمي (${totalPoints} نقطة)</div>
      </div>
    </div>

    <!-- 4. Detailed Table -->
    <div style="margin-bottom: 8px; font-weight: bold; color: #1b4329; font-size: 12px;" class="kufi">
      📋 سجل ورش العمل والفعاليات المنفذة تفصيلياً:
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 35%;">عنوان ورشة العمل / الحقيبة</th>
          <th style="width: 18%;">تاريخ التنفيذ</th>
          <th style="width: 18%;">المقر والقاعة</th>
          <th style="width: 12%; text-align: center;">الطلاب</th>
          <th style="width: 12%; text-align: center;">رقم الاعتماد</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">لا توجد سجلات معتمدة مسجلة</td></tr>'}
      </tbody>
    </table>

    <!-- 5. Signatures -->
    <table class="signatures-table">
      <tr>
        <td>
          <div style="font-weight: bold; color: #0f172a;" class="kufi">عضو هيئة التدريس / معد التقرير</div>
          <div style="color: #475569; margin-top: 4px; font-size: 12px;">${professor.title} / ${professor.name}</div>
          <div class="sig-line"></div>
          <div style="font-size: 10px; color: #94a3b8;">التوقيع والتاريخ</div>
        </td>
        <td>
          <div style="font-weight: bold; color: #1b4329;" class="kufi">مصادقة واعتماد وحدة الإرشاد والتطوير المهني</div>
          <div style="color: #334155; font-weight: bold; margin-top: 4px; font-size: 12px;">${deanConfig.deanTitle} / ${deanConfig.deanName}</div>
          <div style="font-size: 11px; color: #854d0e; font-weight: bold;">${deanConfig.unitHeadTitle || deanConfig.deanCollege || 'رئيس الكلية التطبيقية'}</div>
          <div class="auth-badge">🛡️ معتمد رسمياً بنظام التوثيق الأكاديمي الرقمي</div>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      تم إصدار هذا التقرير آلياً عبر منصة الإرشاد والتطوير المهني بالكلية التطبيقية • جامعة المجمعة • لا يحتاج إلى ختم ورقي في حال وجود رقم الاعتماد الرقمي.
    </div>

  </div>

  <script>
    window.onload = function() {
      // Small delay to ensure styles and fonts are applied
      setTimeout(function() {
        try {
          window.focus();
          window.print();
        } catch(e) {
          console.error(e);
        }
      }, 400);
    };
  </script>
</body>
</html>`;
}

/**
 * Universal print handler: Attempts pop-up window, falls back to iframe injection
 */
export function printAcademicReport(params: {
  professor: FacultyMember;
  completedSessions: WorkshopSession[];
  deanConfig: DeanOfficialConfig;
  totalPoints: number;
  doctorRankText: string;
  totalFacultyCount: number;
}) {
  const html = generateAcademicReportHTML(params);

  // Method 1: Try window.open (Print Window Approach)
  try {
    const printWindow = window.open('', '_blank', 'width=950,height=950,menubar=no,toolbar=no,location=no,status=no');
    if (printWindow && !printWindow.closed) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      return true;
    }
  } catch (err) {
    console.warn('window.open was blocked, trying hidden iframe fallback:', err);
  }

  // Method 2: Hidden iframe fallback (works inside restrictive sandboxes / iframes)
  try {
    const existingIframe = document.getElementById('academic-report-print-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'academic-report-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Iframe print error:', e);
          window.print();
        }
      }, 500);
      return true;
    }
  } catch (err) {
    console.error('All print methods failed, falling back to direct window.print:', err);
    window.print();
  }

  return false;
}
