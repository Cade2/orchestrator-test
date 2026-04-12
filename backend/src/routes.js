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
  res.json({ data: listLinks() });
});

router.post('/links', (req, res) => {
  const input = normalizeLinkInput(req.body);

  if (!input.url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const link = createLink(input);
  return res.status(201).json({ data: link });
});

router.get('/links/:linkId', (req, res) => {
  const link = getLinkById(req.params.linkId);

  if (!link) {
    return res.status(404).json({ error: 'link not found' });
  }

  return res.json({ data: link });
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
