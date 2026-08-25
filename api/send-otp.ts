import { Resend } from 'resend';

// In-memory OTP storage with expiration timestamp (5 minutes)
export interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global OTP store for server runtime
export const otpStore = new Map<string, OtpRecord>();

// Lazy Resend client initialization
let resendClient: Resend | null = null;
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey.trim());
  }
  return resendClient;
}

/**
 * Generates an elegant HTML template for the OTP email in Arabic.
 */
function createOtpHtmlEmail(otp: string, facultyName?: string): string {
  const nameGreeting = facultyName ? `سعادة ${facultyName}` : 'عضو هيئة التدريس الكريم';
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>رمز التحقق للدخول</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="580px" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); padding: 30px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 6px 0; font-weight: bold;">
                الكلية التطبيقية
              </h1>
              <p style="color: #fbbf24; font-size: 14px; margin: 0; font-weight: 600;">
                وحدة الإرشاد المهني والتوظيف
              </p>
              <div style="margin-top: 12px; display: inline-block; background-color: rgba(255, 255, 255, 0.1); padding: 4px 14px; border-radius: 20px; color: #e2e8f0; font-size: 12px;">
                بوابة الشراكة الأكاديمية الذكية
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 16px; margin: 0 0 16px 0; color: #0f172a; font-weight: 600;">
                السلام عليكم ورحمة الله وبركاته،
              </p>
              <p style="font-size: 14px; line-height: 1.7; margin: 0 0 24px 0; color: #334155;">
                أهلاً بك <strong>${nameGreeting}</strong>. لقد تلقينا طلباً لتسجيل الدخول إلى حسابك في <strong>بوابة الشراكة الأكاديمية للإرشاد والتطوير المهني</strong>.
              </p>
              
              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 20px; text-align: center; display: inline-block; min-width: 240px;">
                      <span style="display: block; font-size: 12px; color: #166534; font-weight: bold; margin-bottom: 8px;">
                        رمز التحقق لتسجيل الدخول (OTP)
                      </span>
                      <span style="display: block; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #14532d; font-family: monospace; direction: ltr;">
                        ${otp}
                      </span>
                      <span style="display: block; font-size: 11px; color: #15803d; margin-top: 6px;">
                        صالح لمدة 5 دقائق فقط
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-top: 20px;">
                <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.6;">
                  🔒 <strong>تنبيه أمني:</strong> لا تشارك هذا الرمز مع أي شخص. موظفو الكلية ووحدة الإرشاد لن يطلبوا منك هذا الرمز أبداً. إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">
                الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                هذه رسالة آلية تم إنشاؤها وتوثيقها عبر النظام الأكاديمي الموحد.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Vercel Serverless Function handler & Express compatible handler for /api/send-otp
 */
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST.',
    });
  }

  try {
    const { email, facultyName } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'يرجى تزويد بريد إلكتروني صحيح لإرسال رمز التحقق.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate a secure 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with 5-minute TTL (300,000 ms)
    otpStore.set(normalizedEmail, {
      code: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    const resend = getResendClient();

    // If Resend API Key is configured, send the real email
    if (resend) {
      const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      
      const { data, error } = await resend.emails.send({
        from: senderEmail,
        to: [normalizedEmail],
        subject: `رمز التحقق للدخول: ${generatedOtp} | الكلية التطبيقية`,
        html: createOtpHtmlEmail(generatedOtp, facultyName),
      });

      if (error) {
        console.error('[Resend Error]', error);
        // Fallback: Return OTP in response so development/testing is never blocked by unverified test domains
        return res.status(200).json({
          success: true,
          deliveredVia: 'resend_fallback',
          otp: generatedOtp,
          message: `تم إنشاء رمز التحقق. (تنبيه Resend: ${error.message})`,
          email: normalizedEmail,
          resendError: error.message,
        });
      }

      console.log(`[Resend Success] Real OTP email sent to ${normalizedEmail} with ID: ${data?.id}`);
      return res.status(200).json({
        success: true,
        deliveredVia: 'resend_email',
        message: 'تم إرسال رمز التحقق بنجاح إلى بريدك الإلكتروني.',
        email: normalizedEmail,
        id: data?.id,
      });
    } else {
      // RESEND_API_KEY is not yet configured in environment variables
      console.log(`[Dev Mode] RESEND_API_KEY is not set. Generated OTP for ${normalizedEmail}: ${generatedOtp}`);
      return res.status(200).json({
        success: true,
        deliveredVia: 'dev_preview',
        otp: generatedOtp,
        message: 'تم إنشاء رمز التحقق بنجاح. (لتفعيل الإرسال البريدي الفعلي، يرجى إضافة RESEND_API_KEY)',
        email: normalizedEmail,
        isDevMode: true,
      });
    }
  } catch (err: any) {
    console.error('[Send OTP Handler Error]', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'حدث خطأ غير متوقع أثناء إرسال رمز التحقق.',
    });
  }
}
