import { getRedirectUrl } from '../api';

function formatDate(value) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

function normalizeTags(tags) {
  return Array.isArray(tags) ? tags.filter(Boolean) : [];
}

function renderCountLabel(count) {
  return `${count} click${count === 1 ? '' : 's'}`;
}

export default function LinkList({
  className = '',
  emptyMessage = 'No links yet.',
  errorMessage = '',
  isLoading = false,
  links = [],
}) {
  if (isLoading) {
    return <p className={className}>Loading links...</p>;
  }

  if (errorMessage) {
    return (
      <p className={className} role="alert">
        {errorMessage}
      </p>
    );
  }

  if (!links.length) {
    return <p className={className}>{emptyMessage}</p>;
  }

  return (
    <ul className={className}>
      {links.map((link) => {
        const tags = normalizeTags(link.tags);
        const createdAt = formatDate(link.createdAt);
        const shortUrl = getRedirectUrl(link.slug);

        return (
          <li key={link.id || link.slug}>
            <article>
              <p>
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {link.slug}
                </a>
              </p>

              {link.title ? <h2>{link.title}</h2> : null}

              <p>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.url}
                </a>
              </p>

              <p>{renderCountLabel(link.clickCount || 0)}</p>

              {createdAt ? <p>Created {createdAt}</p> : null}

              {tags.length ? (
                <p>Tags: {tags.join(', ')}</p>
              ) : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
