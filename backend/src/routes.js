const { Router } = require('express');

const {
  createLink,
  listLinks,
  getLinkById,
  getLinkBySlug,
  updateLink,
  deleteLink,
  createClickEvent,
  listClickEvents,
  listClickEventsByLinkId,
} = require('./store');

const router = Router();
const SHORT_CODE_LENGTH = 8;
const SHORT_CODE_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateShortCode(length = SHORT_CODE_LENGTH) {
  let shortCode = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * SHORT_CODE_ALPHABET.length);
    shortCode += SHORT_CODE_ALPHABET[randomIndex];
  }

  return shortCode;
}

function isValidHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

function createUniqueShortCode() {
  let shortCode = generateShortCode();

  while (getLinkBySlug(shortCode)) {
    shortCode = generateShortCode();
  }

  return shortCode;
}

function normalizeLinkInput(body = {}) {
  return {
    url: typeof body.url === 'string' ? body.url : '',
    slug: typeof body.slug === 'string' ? body.slug : undefined,
    title: typeof body.title === 'string' ? body.title : null,
    tags: Array.isArray(body.tags) ? body.tags.filter((tag) => typeof tag === 'string') : [],
  };
}

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/links', (_req, res) => {
  const clickCountByLinkId = listClickEvents().reduce((counts, clickEvent) => {
    if (!clickEvent.linkId) {
      return counts;
    }

    counts.set(clickEvent.linkId, (counts.get(clickEvent.linkId) || 0) + 1);
    return counts;
  }, new Map());

  const links = listLinks().map((link) => ({
    ...link,
    clickCount: clickCountByLinkId.get(link.id) || 0,
  }));

  res.json({ data: links });
});

router.post('/links', (req, res) => {
  const input = normalizeLinkInput(req.body);

  if (!input.url.trim()) {
    return res.status(400).json({ error: 'url is required' });
  }

  if (!isValidHttpUrl(input.url)) {
    return res.status(400).json({ error: 'url must be a valid http or https URL' });
  }

  if (input.slug && getLinkBySlug(input.slug)) {
    return res.status(409).json({ error: 'short code already exists' });
  }

  const link = createLink({
    ...input,
    url: input.url.trim(),
    slug: input.slug || createUniqueShortCode(),
  });

  return res.status(201).json({ data: link });
});

router.get('/links/:code', (req, res) => {
  const link = getLinkBySlug(req.params.code) || getLinkById(req.params.code);

  if (!link) {
    return res.status(404).json({ error: 'link not found' });
  }

  const clickEvents = listClickEventsByLinkId(link.id);

  return res.json({
    data: {
      ...link,
      clickTimestamps: clickEvents.map((clickEvent) => clickEvent.createdAt),
      totalClicks: clickEvents.length,
    },
  });
});

router.patch('/links/:linkId', (req, res) => {
  const updates = normalizeLinkInput(req.body);
  const link = updateLink(req.params.linkId, updates);

  if (!link) {
    return res.status(404).json({ error: 'link not found' });
  }

  return res.json({ data: link });
});

router.delete('/links/:linkId', (req, res) => {
  const deleted = deleteLink(req.params.linkId);

  if (!deleted) {
    return res.status(404).json({ error: 'link not found' });
  }

  return res.status(204).send();
});

router.get('/links/:linkId/clicks', (req, res) => {
  const link = getLinkById(req.params.linkId);

  if (!link) {
    return res.status(404).json({ error: 'link not found' });
  }

  return res.json({ data: listClickEventsByLinkId(req.params.linkId) });
});

router.get('/clicks', (_req, res) => {
  res.json({ data: listClickEvents() });
});

router.get('/r/:slug', (req, res) => {
  const link = getLinkBySlug(req.params.slug);

  if (!link) {
    return res.status(404).json({ error: 'link not found' });
  }

  createClickEvent({
    linkId: link.id,
    slug: link.slug,
    referrer: req.get('referer') || null,
    ipAddress: req.ip || null,
    userAgent: req.get('user-agent') || null,
  });

  return res.redirect(link.url);
});

module.exports = router;
