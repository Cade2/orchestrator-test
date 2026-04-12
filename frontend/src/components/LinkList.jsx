import { getRedirectUrl } from '../api';

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
        const shortUrl = getRedirectUrl(link.slug);
        const totalClicks = getTotalClicks(link);

        return (
          <li key={link.id || link.slug}>
            <article>
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
            </article>
          </li>
        );
      })}
    </ul>
  );
}
