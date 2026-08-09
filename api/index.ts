import express from 'express';
import dotenv from 'dotenv';
import { vxaddguestbook, vxlistguestbook, validateGuestbookMessage } from './guestbook_db.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/api/guestbook', (req, res) => {
  try {
    res.json(vxlistguestbook());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guestbook', (req, res) => {
  try {
    let { name, message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required and must be a string!' });
    }
    const cleanName = typeof name === 'string' && name.trim() 
      ? name.trim().slice(0, 24) 
      : 'anonymous';
    const cleanMessage = message.trim().slice(0, 200);
    if (!validateGuestbookMessage(cleanMessage)) {
      return res.status(400).json({ error: 'your message contains flagged content. please keep it clean! :(' });
    }
    if (!validateGuestbookMessage(cleanName)) {
      return res.status(400).json({ error: 'your alias contains flagged content. please keep it clean! :(' });
    }
    const entry = vxaddguestbook(cleanName, cleanMessage);
    res.status(201).json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/report-bug', async (req, res) => {
  try {
    const { title, description, screenshot, url, userAgent } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required!' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('DISCORD WEBHOOK URL is not set in the environment variables!!');
      return res.status(500).json({ error: 'Bug reporting is currently misconfigured. The Webhook URL is missing!!!' });
    }

    const formData = new FormData();
    const embed: any = {
      title: `Bug Report: ${title.slice(0, 256)}`,
      description: description.slice(0, 2048),
      color: 16729344, // #FF4500
      fields: [
        { name: 'URL', value: url ? url.slice(0, 1024) : 'Unknown', inline: true },
        { name: 'User Agent', value: userAgent ? userAgent.slice(0, 1024) : 'Unknown', inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    if (screenshot && typeof screenshot === 'string' && screenshot.startsWith('data:')) {
      const matches = screenshot.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const extension = contentType.split('/')[1] || 'png';
        const filename = `screenshot.${extension}`;
        
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: contentType });
        formData.append('files[0]', blob, filename);
        
        embed.image = { url: `attachment://${filename}` };
      }
    }

    formData.append('payload_json', JSON.stringify({
      embeds: [embed]
    }));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Discord webhook error:', errText);
      return res.status(response.status).json({ error: `Discord API error: ${response.statusText}` });
    }

    res.status(200).json({ message: 'Bug successfully reported!' });
  } catch (err: any) {
    console.error('Report bug error:', err);
    res.status(500).json({ error: err.message });
  }
});

// FUCK ME.
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production' || process.mainModule?.filename === import.meta.filename) {
  app.listen(PORT, () => {
    console.log(`api running on http://localhost:${PORT}`);
  });
}

export default app;