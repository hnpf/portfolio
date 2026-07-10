export async function onRequestPost(context) {
  const { request, env } = context;

  const DB = env.DB || env.virex_db;
  if (!DB) {
    return new Response(JSON.stringify({ error: 'DB binding is missing! Check wrangler.toml/dashboard.' }), { status: 500 });
  }

  try {
    const { url, path, src = 'web' } = await request.json();

    // protocol check
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return new Response(JSON.stringify({ error: 'Stick to http or https!' }), { status: 400 });
      }
    } catch {
      return new Response(JSON.stringify({ error: 'URL is malformed!' }), { status: 400 });
    }

    const RESERVED = new Set(['dash', 'api', 'login', 'u', 'static', 'health', 'admin', 'fetch', 'r', 'blog', 'lens', 'now', 'readme', 'changelog', 'no']);

    let finalPath = path;
    if (finalPath) {
      if (!/^[a-z0-9-]{3,20}$/i.test(finalPath)) {
        return new Response(JSON.stringify({ error: 'path must be alphanumeric (3-20 chars)!' }), { status: 400 });
      }
      if (RESERVED.has(finalPath.toLowerCase())) {
        return new Response(JSON.stringify({ error: `/${finalPath} is reserved!` }), { status: 409 });
      }

      // check existence
      const existing = await DB.prepare('SELECT id FROM links WHERE path = ?').bind(finalPath).first();
      if (existing) {
        return new Response(JSON.stringify({ error: 'this custom path is already taken!' }), { status: 409 });
      }
    } else {
      // collision-resistant generation
      let tries = 0;
      do {
        finalPath = Math.random().toString(36).substring(2, 8);
        const collision = await DB.prepare('SELECT id FROM links WHERE path = ?').bind(finalPath).first();
        if (!collision && !RESERVED.has(finalPath)) break;
        if (++tries > 10) return new Response(JSON.stringify({ error: 'Failed to generate unique path' }), { status: 500 });
      } while (true);
    }

    await DB.prepare(
      'INSERT INTO links (path, original_url, src) VALUES (?, ?, ?)'
    ).bind(finalPath, url, src).run();

    return new Response(JSON.stringify({
      path: finalPath,
      original_url: url,
      short: `${new URL(request.url).origin}/r/${finalPath}`
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

