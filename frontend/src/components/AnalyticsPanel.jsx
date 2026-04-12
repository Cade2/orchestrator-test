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

function formatRelativeAge(value) {
  if (!value) {
    return 'No activity yet';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No activity yet';
  }

  const elapsedMs = Date.now() - date.getTime();
  const elapsedMinutes = Math.max(0, Math.round(elapsedMs / 60000));

  if (elapsedMinutes < 1) {
    return 'Just now';
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`;
  }

  const elapsedDays = Math.round(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}

function getTotalClicks(analytics) {
  if (typeof analytics?.totalClicks === 'number') {
    return analytics.totalClicks;
  }

  if (typeof analytics?.clickCount === 'number') {
    return analytics.clickCount;
  }

  return Array.isArray(analytics?.clickTimestamps)
    ? analytics.clickTimestamps.length
    : 0;
}

function buildDailyBuckets(clickTimestamps = []) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const counts = new Map();

  clickTimestamps.forEach((timestamp) => {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const bucketKey = date.toISOString().slice(0, 10);
    const bucketLabel = formatter.format(date);
    const currentBucket = counts.get(bucketKey);

    counts.set(bucketKey, {
      key: bucketKey,
      label: bucketLabel,
      count: (currentBucket?.count || 0) + 1,
    });
  });

  return Array.from(counts.values())
    .sort((left, right) => left.key.localeCompare(right.key))
    .slice(-7);
}

export default function AnalyticsPanel({
  analytics,
  className = '',
  emptyMessage = 'Select a link to inspect its analytics.',
  errorMessage = '',
  isLoading = false,
}) {
  if (isLoading) {
    return <section className={className}>Loading analytics...</section>;
  }

  if (errorMessage) {
    return (
      <section className={className} role="alert">
        {errorMessage}
      </section>
    );
  }

  if (!analytics) {
    return <section className={className}>{emptyMessage}</section>;
  }

  const totalClicks = getTotalClicks(analytics);
  const clickTimestamps = Array.isArray(analytics.clickTimestamps)
    ? analytics.clickTimestamps
    : [];
  const latestClick = clickTimestamps[clickTimestamps.length - 1] || null;
  const dailyBuckets = buildDailyBuckets(clickTimestamps);
  const peakCount = dailyBuckets.reduce(
    (highestCount, bucket) => Math.max(highestCount, bucket.count),
    0,
  );

  return (
    <section className={className} aria-label="Analytics detail">
      <header>
        <p>Analytics overview</p>
        <h2>{analytics.title || analytics.slug || 'Untitled link'}</h2>
        <p>
          <a href={analytics.url} target="_blank" rel="noreferrer">
            {analytics.url}
          </a>
        </p>
      </header>

      <div>
        <article>
          <p>Total clicks</p>
          <strong>{totalClicks}</strong>
        </article>

        <article>
          <p>Last click</p>
          <strong>{formatRelativeAge(latestClick)}</strong>
        </article>

        <article>
          <p>Created</p>
          <strong>{formatDateTime(analytics.createdAt)}</strong>
        </article>
      </div>

      <div>
        <p>Short code: <code>{analytics.slug || 'Unavailable'}</code></p>
        <p>Updated: {formatDateTime(analytics.updatedAt)}</p>
        <p>
          Tags:{' '}
          {analytics.tags?.length
            ? analytics.tags.join(', ')
            : 'No tags'}
        </p>
      </div>

      <section aria-label="Recent daily click activity">
        <h3>Recent activity</h3>

        {dailyBuckets.length ? (
          <ul>
            {dailyBuckets.map((bucket) => {
              const width = peakCount > 0
                ? `${Math.max((bucket.count / peakCount) * 100, 8)}%`
                : '0%';

              return (
                <li key={bucket.key}>
                  <div>
                    <span>{bucket.label}</span>
                    <strong>{bucket.count}</strong>
                  </div>
                  <div
                    aria-hidden="true"
                    style={{
                      height: '0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(17, 24, 39, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, #b45309, #f59e0b)',
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No click events have been recorded yet.</p>
        )}
      </section>

      <section aria-label="Latest click timestamps">
        <h3>Latest clicks</h3>

        {clickTimestamps.length ? (
          <ol>
            {[...clickTimestamps].reverse().slice(0, 5).map((timestamp) => (
              <li key={timestamp}>
                <time dateTime={timestamp}>{formatDateTime(timestamp)}</time>
              </li>
            ))}
          </ol>
        ) : (
          <p>No click timeline available.</p>
        )}
      </section>
    </section>
  );
}
