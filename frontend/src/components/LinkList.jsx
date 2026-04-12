import { getRedirectUrl } from '../api';

function formatDateTime(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getTotalClicks(link) {
  if (typeof link.totalClicks === 'number') {
    return link.totalClicks;
  }

  if (typeof link.clickCount === 'number') {
    return link.clickCount;
  }

  return 0;
}

export default function LinkList({
  className = '',
  emptyMessage = 'No links yet.',
  errorMessage = '',
  analyticsTargetLinkId = null,
  isLoadingAnalytics = false,
  isLoading = false,
  links = [],
  onLoadAnalytics,
  onSelect,
  selectedLinkId = null,
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
        const shortUrl = getRedirectUrl(link.slug);
        const totalClicks = getTotalClicks(link);
        const createdAt = link.createdAt || link.timestamp || null;
        const linkKey = link.id || link.slug;
        const isSelected = linkKey === selectedLinkId;
        const isLoadingRowAnalytics = isLoadingAnalytics && linkKey === analyticsTargetLinkId;

        return (
          <li key={linkKey}>
            <article
              aria-current={isSelected ? 'true' : undefined}
              className={isSelected ? 'is-selected' : undefined}
            >
              <p>
                Original URL:{' '}
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.url}
                </a>
              </p>

              <p>
                Short URL:{' '}
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </p>

              <p>Total clicks: {totalClicks}</p>

              <p>Created: {formatDateTime(createdAt)}</p>

              <div className="link-list__actions">
                {typeof onSelect === 'function' ? (
                  <button type="button" onClick={() => onSelect(link)}>
                    {isSelected ? 'Selected link' : 'Select link'}
                  </button>
                ) : null}

                {typeof onLoadAnalytics === 'function' ? (
                  <button
                    type="button"
                    onClick={() => onLoadAnalytics(link)}
                    disabled={isLoadingRowAnalytics}
                  >
                    {isLoadingRowAnalytics ? 'Loading analytics...' : 'Load analytics'}
                  </button>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
