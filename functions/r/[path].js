export async function onRequestGet(context) {
  const { request, params, env } = context;
  const path = params.path;

  if (!env.DB) {
    return Response.redirect(`${new URL(request.url).origin}/404?error=db_missing`, 302);
  }

  try {
    const entry = await env.DB.prepare(
      'SELECT original_url FROM links WHERE path = ?'
    ).bind(path).first();

    if (entry) {
      // don't await to keep redirect fast, 
      // though D1 is fast enough, this is cleaner for th UX
      context.waitUntil(
        env.DB.prepare('UPDATE links SET visits = visits + 1 WHERE path = ?').bind(path).run()
      );
      
      return Response.redirect(entry.original_url, 301);
    }
  } catch (err) {
    console.error('Redirect error:', err);
  }

  return Response.redirect(`${new URL(request.url).origin}/404?missing=${path}`, 302);
}
