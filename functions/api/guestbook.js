const BANNED_ROOTS = [
  "fuck",
  "shit",
  "asshole",
  "bitch",
  "bastard",
  "cunt",
  "dick",
  "pussy",
  "nigger",
  "chink",
  "faggot",
  "retard"
];

const LEET_MAP = {
  '4': 'a', '@': 'a',
  '3': 'e',
  '1': 'i', '!': 'i', '|': 'i',
  '0': 'o',
  '5': 's', '$': 's',
  '7': 't', '+': 't',
  'v': 'u', 'μ': 'u'
};

function normalizeText(text) {
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[\s\-_.,\/#!$%\^&\*;:{}=\-_`~()[\]'"]/g, "");
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");
  
  let normalized = "";
  for (const char of cleaned) {
    normalized += LEET_MAP[char] || char;
  }
  
  return normalized;
}

export function validateGuestbookMessage(message) {
  if (!message || typeof message !== "string") return false;
  
  const lowerMsg = message.toLowerCase();
  const normalizedMsg = normalizeText(message);
  
  for (const word of BANNED_ROOTS) {
    if (lowerMsg.includes(word)) return false;
    if (normalizedMsg.includes(word)) return false;
  }
  
  return true;
}

export async function onRequestGet(context) {
  const { env } = context;
  const DB = env.DB || env.virex_db;
  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
  }

  try {
    const { results } = await DB.prepare(
      'SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC LIMIT 50'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const DB = env.DB || env.virex_db;
  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
  }

  try {
    const { name, message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required!' }), { status: 400 });
    }

    if (!validateGuestbookMessage(message)) {
      return new Response(JSON.stringify({ error: 'Your message contains flagged content. Keep it clean!' }), { status: 400 });
    }

    if (name && typeof name === 'string' && name.toLowerCase() !== 'anonymous' && !validateGuestbookMessage(name)) {
      return new Response(JSON.stringify({ error: 'Your name contains flagged content. Keep it clean!' }), { status: 400 });
    }

    const finalName = (name && typeof name === 'string') ? name.trim().slice(0, 30) : 'anonymous';
    const finalMessage = message.trim().slice(0, 200);

    const result = await DB.prepare(
      'INSERT INTO guestbook (name, message, created_at) VALUES (?, ?, ?)'
    ).bind(finalName, finalMessage, new Date().toISOString()).run();

    return new Response(JSON.stringify({
      id: result.meta?.last_row_id || Date.now(),
      name: finalName,
      message: finalMessage,
      created_at: new Date().toISOString()
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
