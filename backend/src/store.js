const { nanoid } = require('nanoid');

const links = new Map();
const clicks = [];

function cloneLink(link) {
  return {
    ...link,
    tags: [...link.tags],
  };
}

function cloneClick(click) {
  return {
    ...click,
  };
}

function createLink(input = {}) {
  const now = new Date().toISOString();
  const link = {
    id: input.id || nanoid(),
    url: input.url || '',
    slug: input.slug || nanoid(8),
    title: input.title || null,
    tags: Array.isArray(input.tags) ? [...input.tags] : [],
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
  };

  links.set(link.id, link);
  return cloneLink(link);
}

function listLinks() {
  return Array.from(links.values()).map(cloneLink);
}

function getLinkById(linkId) {
  const link = links.get(linkId);
  return link ? cloneLink(link) : null;
}

function getLinkBySlug(slug) {
  for (const link of links.values()) {
    if (link.slug === slug) {
      return cloneLink(link);
    }
  }

  return null;
}

function updateLink(linkId, updates = {}) {
  const existingLink = links.get(linkId);

  if (!existingLink) {
    return null;
  }

  const createdAt = existingLink.createdAt || new Date().toISOString();
  const nextLink = {
    ...existingLink,
    ...updates,
    createdAt,
    tags: Array.isArray(updates.tags) ? [...updates.tags] : [...existingLink.tags],
    updatedAt: new Date().toISOString(),
  };

  links.set(linkId, nextLink);
  return cloneLink(nextLink);
}

function deleteLink(linkId) {
  return links.delete(linkId);
}

function createClickEvent(input = {}) {
  const event = {
    id: input.id || nanoid(),
    linkId: input.linkId || null,
    slug: input.slug || null,
    referrer: input.referrer || null,
    ipAddress: input.ipAddress || null,
    userAgent: input.userAgent || null,
    createdAt: input.createdAt || new Date().toISOString(),
  };

  clicks.push(event);
  return cloneClick(event);
}

function listClickEvents() {
  return clicks.map(cloneClick);
}

function listClickEventsByLinkId(linkId) {
  return clicks.filter((click) => click.linkId === linkId).map(cloneClick);
}

function resetStore() {
  links.clear();
  clicks.length = 0;
}

module.exports = {
  createLink,
  listLinks,
  getLinkById,
  getLinkBySlug,
  updateLink,
  deleteLink,
  createClickEvent,
  listClickEvents,
  listClickEventsByLinkId,
  resetStore,
};
