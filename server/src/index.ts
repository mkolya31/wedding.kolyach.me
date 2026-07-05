import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RSVP_SECRET = process.env.RSVP_SECRET;

if (!APPS_SCRIPT_URL) {
    throw new Error('APPS_SCRIPT_URL env variable is required');
}

if (!RSVP_SECRET) {
    throw new Error('RSVP_SECRET env variable is required');
}

// Приложение будет стоять за внешним nginx reverse proxy.
app.set('trust proxy', 1);

app.use(express.json({ limit: '20kb' }));

const rsvpLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false
});

const rsvpSchema = z.object({
    name: z.string().trim().min(1).max(120),

    i_will_come: z.string().trim().max(100).optional().default(''),
    alcohol: z.string().trim().max(200).optional().default(''),
    meal: z.string().trim().max(200).optional().default(''),
    need_transfer: z.string().trim().max(100).optional().default(''),

    // Honeypot-поле против простых ботов.
    // На фронте оно должно быть скрытым и оставаться пустым.
    website: z.string().optional().default('')
});

type AppsScriptResponse = {
    ok: boolean;
    error?: string;
};

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.post('/api/rsvp', rsvpLimiter, async (req, res) => {
    try {
        const parsed = rsvpSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                ok: false,
                error: 'INVALID_FORM_DATA'
            });
        }

        const data = parsed.data;

        // Если бот заполнил скрытое поле — отвечаем успешно,
        // но ничего не отправляем в таблицу.
        if (data.website) {
            return res.json({ ok: true });
        }

        const appsScriptResponse = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: RSVP_SECRET,
                name: data.name,
                i_will_come: data.i_will_come,
                alcohol: data.alcohol,
                meal: data.meal,
                need_transfer: data.need_transfer
            })
        });

        const responseText = await appsScriptResponse.text();

        let responseData: AppsScriptResponse;

        try {
            responseData = JSON.parse(responseText) as AppsScriptResponse;
        } catch {
            console.error('Apps Script returned non-JSON response:', responseText);

            return res.status(502).json({
                ok: false,
                error: 'INVALID_APPS_SCRIPT_RESPONSE'
            });
        }

        if (!appsScriptResponse.ok || !responseData.ok) {
            console.error('Apps Script error:', responseData);

            return res.status(502).json({
                ok: false,
                error: 'APPS_SCRIPT_SAVE_FAILED'
            });
        }

        return res.json({ ok: true });
    } catch (error) {
        console.error('RSVP submit error:', error);

        return res.status(500).json({
            ok: false,
            error: 'RSVP_SAVE_FAILED'
        });
    }
});

const frontendDistPath = path.resolve(__dirname, '../../dist');

app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Wedding site server is running on port ${PORT}`);
});