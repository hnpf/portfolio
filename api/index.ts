import express from 'express';
import { randomBytes } from 'crypto';
import { vxShorten, vxResolve, vxListAll, vxIsReserved, vxSlugExists } from './db.js';

const app = express();
app.use(express.json());

// _genslug genuinly does what it says and nothing else
const _genslug = () => {
  return randomBytes(3).toString('hex').slice(0, 6);
};

app.post('/api/shorten', (req, res) => {
  try {
    let { url, slug, src = 'web' } = req.body;
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return res.status(400).json({ error: 'invalid protocol, stick to http/https!' });
      }
      if (url.length > 2048) {
        return res.status(400).json({ error: 'url is too long!' });
      }
    } catch {
      return res.status(400).json({ error: 'url is malformed!' });
    }

    if (slug) {
      if (!/^[a-z0-9-]{3,20}$/i.test(slug)) {
        return res.status(400).json({ error: 'slug must be alphanumeric (3-20 chars)!' });
      }
      if (vxIsReserved(slug)) {
        return res.status(409).json({ error: `/${slug} is a virex route, pick something else!` });
      }
      if (vxSlugExists(slug)) {
        return res.status(409).json({ error: 'slug is already taken!' });
      }
    } else {
      // keep trying if _genslug somehow hits a collision. probably fucking with us if it does.
      let tries = 0;
      do {
        slug = _genslug();
        if (++tries > 10) return res.status(500).json({ error: 'failed to generate unique slug' });
      } while (vxSlugExists(slug) || vxIsReserved(slug));
    }

    vxShorten(url, slug, src);
    const host = req.get('host');
    res.status(201).json({
      slug,
      original_url: url,
      short: `${req.protocol}://${host}/r/${slug}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/urls', (req, res) => {
  try {
    res.json(vxListAll());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/r/:slug', (req, res) => {
  try {
    const url = vxResolve(req.params.slug);
    if (url) {
      return res.redirect(301, url.original_url);
    }

    // redirect to the main apps 404 with da context
    res.redirect(`/404?missing=${req.params.slug}`);
  } catch (err: any) {
    res.status(500).send(`error: ${err.message}`);
  }
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 6767;
  app.listen(port, () => {
    // i genuinely do not care if you see this, but it's good to know the port
  });
}

export default app;
