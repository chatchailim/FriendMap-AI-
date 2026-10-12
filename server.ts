import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to initialize GenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: AI Face & Head Detection for Group Photos
app.post('/api/detect-heads', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured',
        message: 'กรุณาตรวจสอบการตั้งค่า GEMINI_API_KEY ใน Settings > Secrets',
      });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `Analyze this group photo and detect the location of every human head / face.
Return normalized coordinates (between 0.0 and 1.0) relative to image width and height:
- x: horizontal center of the head (0.0 = far left, 1.0 = far right)
- y: vertical center of the head (0.0 = top, 1.0 = bottom)
- radius: approximate normalized radius enclosing the head (usually between 0.015 and 0.045)
- depthRow: approximate depth level ("front_seated", "middle_standing", "back_standing")
- suggestedNicknameHint: brief descriptive visual clue (e.g. "เสื้อโปโลเทาแถวหน้า", "สูทน้ำเงิน", "ยืนแถวหลังซ้าย", "แว่นตาเสื้อขาว") to help the user identify who is who.

Please be thorough and detect all visible heads in all rows/layers from left to right.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedHeads: {
              type: Type.ARRAY,
              description: 'List of detected head positions',
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER, description: 'Normalized x center [0..1]' },
                  y: { type: Type.NUMBER, description: 'Normalized y center [0..1]' },
                  radius: { type: Type.NUMBER, description: 'Normalized radius [0..1]' },
                  depthRow: { type: Type.STRING, description: 'Row level hint' },
                  suggestedNicknameHint: { type: Type.STRING, description: 'Helpful visual hint in Thai' },
                },
                required: ['x', 'y', 'radius'],
              },
            },
            totalCount: { type: Type.INTEGER, description: 'Total heads found' },
            notes: { type: Type.STRING, description: 'General observation of group arrangement' },
          },
          required: ['detectedHeads'],
        },
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error detecting heads:', error);
    return res.status(500).json({
      error: 'Failed to detect heads with AI',
      details: error.message || String(error),
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FriendMap AI server is running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
