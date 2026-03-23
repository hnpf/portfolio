import express from 'express';
import { randomBytes } from 'crypto';
import { vxshort, vxresolve, vxlistall, vxisreserved, vxpathexist } from './db.js';

const app = express();
app.use(express.json());

// genpath does what it says and nothing else
const genpath = () => randomBytes(3).toString('hex').slice(0, 6);

app.post('/api/shorten', (req, res) => {
  try {
    let { url, path, src = 'web' } = req.body;

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol))
        return res.status(400).json({ error: 'invalid protocol, stick to http/https!' });
      if (url.length > 2048)
        return res.status(400).json({ error: 'url is too long!' });
    } catch {
      return res.status(400).json({ error: 'url is malformed!' });
    }

    if (path) {
      if (!/^[a-z0-9-]{3,20}$/i.test(path))
        return res.status(400).json({ error: 'path must be alphanumeric (3-20 chars)!' });
      if (vxisreserved(path))
        return res.status(409).json({ error: `/${path} is a virex route, pick something else!` });
      if (vxpathexist(path))
        return res.status(409).json({ error: 'this custom path is already taken!' });
    } else {
      // keep trying if genpath somehow hits a collision. probably fucking with us if it does.
      let tries = 0;
      do {
        path = genpath();
        if (++tries > 10) return res.status(500).json({ error: 'failed to generate unique path' });
      } while (vxpathexist(path) || vxisreserved(path));  // was vxpathexists (typo), would've blown up ngl
    }

    vxshort(url, path, src);
    const host = req.get('host');
    res.status(201).json({
      path,
      original_url: url,
      short: `${req.protocol}://${host}/r/${path}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/urls', (req, res) => {
  try {
    res.json(vxlistall());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/r/:path', (req, res) => {
  try {
    const entry = vxresolve(req.params.path);
    if (entry) return res.redirect(301, entry.original_url);
    // redirect to the main app's 404 with context
    res.redirect(`/404?missing=${req.params.path}`);
  } catch (err: any) {
    res.status(500).send(`error: ${err.message}`);
  }
});

// future ref: add DELETE /api/urls/:id when the dash gets a delete button
// const del_handler = ... ehh?????

if (!process.env.VERCEL) {
  const port = process.env.PORT || 6767;
  app.listen(port, () => {
    // i genuinely do not care if you see this, but it's good to know the port
  });
}

export default app;