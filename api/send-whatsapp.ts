import twilio from 'twilio';

// In-memory OTP storage with expiration timestamp (5 minutes)
export interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global OTP store for server runtime (shared / isolated per container instance)
export const whatsappOtpStore = new Map<string, OtpRecord>();

// Lazy Twilio client initialization
let twilioClient: twilio.Twilio | null = null;

function getTwilioClient(): twilio.Twilio | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken || accountSid.trim() === '' || authToken.trim() === '') {
    return null;
  }
  
  if (!twilioClient) {
    twilioClient = twilio(accountSid.trim(), authToken.trim());
  }
  return twilioClient;
}

/**
 * Normalizes phone numbers to standard E.164 international format (e.g. +9665XXXXXXXX for Saudi Arabia)
 */
function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.replace(/[^\d+]/g, '');
  
  // Handle Saudi local formats
  if (cleaned.startsWith('00966')) {
    cleaned = '+' + cleaned.substring(2);
  } else if (cleaned.startsWith('966')) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('05')) {
    cleaned = '+966' + cleaned.substring(1);
  } else if (cleaned.startsWith('5') && cleaned.length === 9) {
    cleaned = '+966' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Formats WhatsApp ID correctly for Twilio API (whatsapp:+E164)
 */
function formatWhatsAppNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  return normalized.startsWith('whatsapp:') ? normalized : `whatsapp:${normalized}`;
}

/**
 * Vercel Serverless Function handler & Express compatible handler for /api/send-whatsapp
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
    const { phone, facultyName } = req.body || {};

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return res.status(400).json({
        success: false,
        error: 'يرجى تزويد رقم جوال صحيح لإرسال رمز التحقق عبر الواتساب.',
      });
    }

    const formattedRecipient = normalizePhoneNumber(phone.trim());
    const recipientWhatsApp = formatWhatsAppNumber(phone.trim());

    // Generate a secure 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with 5-minute TTL (300,000 ms)
    whatsappOtpStore.set(formattedRecipient, {
      code: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    const client = getTwilioClient();
    const configuredFromNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'; // Twilio Sandbox default
    const senderWhatsApp = formatWhatsAppNumber(configuredFromNumber);

    const greeting = facultyName ? `سعادة ${facultyName}` : 'عضو هيئة التدريس الكريم';
    
    // WhatsApp message body
    const messageBody = `🎓 *الكلية التطبيقية - وحدة الإرشاد المهني والتوظيف*\n\n` +
      `السلام عليكم ورحمة الله وبركاته،\n` +
      `أهلاً بك ${greeting}.\n\n` +
      `رمز التحقق السريع الخاص بك للدخول إلى بوابة الشراكة الأكاديمية هو:\n` +
      `🔑 *${generatedOtp}*\n\n` +
      `⏱️ الرمز صالح لمدة 5 دقائق.\n` +
      `🔒 تنبيه: لا تشارك هذا الرمز مع أي شخص.`;

    if (client) {
      try {
        const message = await client.messages.create({
          body: messageBody,
          from: senderWhatsApp,
          to: recipientWhatsApp,
        });

        console.log(`[Twilio WhatsApp Success] Message SID: ${message.sid} sent to ${recipientWhatsApp}`);

        return res.status(200).json({
          success: true,
          deliveredVia: 'twilio_whatsapp',
          message: 'تم إرسال رمز التحقق بنجاح عبر تطبيق WhatsApp إلى رقم جوالك.',
          phone: formattedRecipient,
          sid: message.sid,
          otp: generatedOtp,
        });
      } catch (twilioError: any) {
        console.error('[Twilio WhatsApp Error]', twilioError);

        // Fallback for development / unjoined sandbox recipients
        return res.status(200).json({
          success: true,
          deliveredVia: 'twilio_fallback',
          otp: generatedOtp,
          message: `تم إنشاء رمز التحقق (تنبيه Twilio: ${twilioError.message || 'Sandbox requires opt-in'})`,
          phone: formattedRecipient,
          twilioError: twilioError.message,
        });
      }
    } else {
      // TWILIO credentials are not set in environment
      console.log(`[Dev Mode WhatsApp] Twilio credentials not set. Generated OTP for ${formattedRecipient}: ${generatedOtp}`);
      
      return res.status(200).json({
        success: true,
        deliveredVia: 'dev_preview',
        otp: generatedOtp,
        message: 'تم إنشاء رمز التحقق بنجاح عبر الواتساب. (أضف TWILIO_ACCOUNT_SID و TWILIO_AUTH_TOKEN للإرسال الفعلي المباشر)',
        phone: formattedRecipient,
        isDevMode: true,
      });
    }
  } catch (err: any) {
    console.error('[Send WhatsApp Handler Error]', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'حدث خطأ غير متوقع أثناء إرسال رمز التحقق عبر الواتساب.',
    });
  }
}
