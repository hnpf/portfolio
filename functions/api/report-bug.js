export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { title, description, screenshot, url, userAgent } = await request.json();

    if (!title || !description) {
      return new Response(JSON.stringify({ error: 'Title and description are required!' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const webhookUrl = env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('DISCORD WEBHOOK URL is not set in environment variables!!');
      return new Response(JSON.stringify({ error: 'Bug reporting is currently misconfigured. The Webhook URL is missing or wasn\'t found!' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = new FormData();
    const embed = {
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
        
        // acutlaly decode base64 to binary bytes (works w cloudfklare workers V8 runtime)
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: contentType });
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
      console.error('Discord webhook problem:', errText);
      return new Response(JSON.stringify({ error: `Discord API problem: ${response.statusText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Bug has been reported successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Report bug error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
