import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import sendOtpHandler from './api/send-otp.js';
import sendWhatsappHandler from './api/send-whatsapp.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Vercel Serverless Function Proxy Route for /api/send-otp (Resend Email)
  app.all('/api/send-otp', async (req, res) => {
    try {
      await sendOtpHandler(req, res);
    } catch (error: any) {
      console.error('Error handling /api/send-otp:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
      }
    }
  });

  // Vercel Serverless Function Proxy Route for /api/send-whatsapp (Twilio WhatsApp)
  app.all('/api/send-whatsapp', async (req, res) => {
    try {
      await sendWhatsappHandler(req, res);
    } catch (error: any) {
      console.error('Error handling /api/send-whatsapp:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
      }
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
