export async function onRequestGet(context) {
  const { env } = context;
  
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'base binding missing' }), { status: 500 });
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM links ORDER BY created_at DESC LIMIT 50'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
