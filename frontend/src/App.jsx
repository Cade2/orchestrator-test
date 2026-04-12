import { useEffect, useMemo, useRef, useState } from 'react';

import {
  createLink,
  fetchAllLinks,
  fetchLinkAnalytics,
  getApiBaseUrl,
} from './api';
import AnalyticsPanel from './components/AnalyticsPanel';
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';

function getLinkKey(link) {
  return link?.id || link?.slug || null;
}

function getAnalyticsLookupValue(link) {
  return link?.slug || link?.id || null;
}

function formatRequestError(error, resourceLabel) {
  const backendMessage = typeof error?.payload?.error === 'string'
    ? error.payload.error.trim()
    : '';
  const genericMessage = typeof error?.message === 'string'
    ? error.message.trim()
    : '';

  if (backendMessage) {
    const statusPrefix = typeof error?.status === 'number'
      ? `Backend error (${error.status})`
      : 'Backend error';

    return `${statusPrefix}: ${backendMessage}`;
  }

  if (/failed to fetch|networkerror|load failed/i.test(genericMessage)) {
    return `Network error: unable to load ${resourceLabel} from ${getApiBaseUrl()}.`;
  }

  if (typeof error?.status === 'number' && genericMessage) {
    return `Backend error (${error.status}): ${genericMessage}`;
  }

  if (genericMessage) {
    return genericMessage;
  }

  return `Unable to load ${resourceLabel}.`;
}

export default function App() {
  const isMountedRef = useRef(true);
  const analyticsRequestIdRef = useRef(0);
  const [links, setLinks] = useState([]);
  const [linksErrorMessage, setLinksErrorMessage] = useState('');
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [hasLoadedInitialLinks, setHasLoadedInitialLinks] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [selectedLinkAnalytics, setSelectedLinkAnalytics] = useState(null);
  const [analyticsErrorMessage, setAnalyticsErrorMessage] = useState('');
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsTargetLinkId, setAnalyticsTargetLinkId] = useState(null);

  async function loadLinks(preferredSelectedLinkId = null) {
    if (!isMountedRef.current) {
      return [];
    }

    setIsLoadingLinks(true);
    setLinksErrorMessage('');

    try {
      const loadedLinks = await fetchAllLinks();

      if (!isMountedRef.current) {
        return loadedLinks;
      }

      setLinks(Array.isArray(loadedLinks) ? loadedLinks : []);
      setSelectedLinkId((currentSelectedLinkId) => {
        if (!loadedLinks?.length) {
          return null;
        }

        const nextSelectedLinkId = preferredSelectedLinkId ?? currentSelectedLinkId;
        const hasSelectedLink = loadedLinks.some(
          (link) => getLinkKey(link) === nextSelectedLinkId,
        );

        return hasSelectedLink ? nextSelectedLinkId : getLinkKey(loadedLinks[0]);
      });

      return loadedLinks;
    } catch (error) {
      if (!isMountedRef.current) {
        throw error;
      }

      setLinks([]);
      setSelectedLinkId(null);
      setSelectedLinkAnalytics(null);
      setLinksErrorMessage(formatRequestError(error, 'saved links'));
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsLoadingLinks(false);
        setHasLoadedInitialLinks(true);
      }
    }
  }

  useEffect(() => {
    loadLinks().catch(() => {});

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const selectedLink = useMemo(
    () => links.find((link) => getLinkKey(link) === selectedLinkId) || null,
    [links, selectedLinkId],
  );
  const isInitialLinksLoad = isLoadingLinks && !hasLoadedInitialLinks;

  async function loadAnalytics(link) {
    const analyticsLookupValue = getAnalyticsLookupValue(link);
    const targetLinkId = getLinkKey(link);
    const requestId = analyticsRequestIdRef.current + 1;

    analyticsRequestIdRef.current = requestId;

    if (!analyticsLookupValue) {
      setSelectedLinkAnalytics(null);
      setAnalyticsErrorMessage('');
      setIsLoadingAnalytics(false);
      setAnalyticsTargetLinkId(null);
      return;
    }

    setIsLoadingAnalytics(true);
    setSelectedLinkAnalytics(null);
    setAnalyticsErrorMessage('');
    setAnalyticsTargetLinkId(targetLinkId);

    try {
      const analytics = await fetchLinkAnalytics(analyticsLookupValue);

      if (!isMountedRef.current || analyticsRequestIdRef.current !== requestId) {
        return;
      }

      setSelectedLinkAnalytics(analytics);
    } catch (error) {
      if (!isMountedRef.current || analyticsRequestIdRef.current !== requestId) {
        return;
      }

      setSelectedLinkAnalytics(null);
      setAnalyticsErrorMessage(formatRequestError(error, 'link analytics'));
    } finally {
      if (isMountedRef.current && analyticsRequestIdRef.current === requestId) {
        setIsLoadingAnalytics(false);
        setAnalyticsTargetLinkId(null);
      }
    }
  }

  function handleSelectLink(link) {
    setSelectedLinkId(getLinkKey(link));
    setSelectedLinkAnalytics(null);
    setAnalyticsErrorMessage('');
  }

  async function handleLoadAnalytics(link) {
    setSelectedLinkId(getLinkKey(link));
    await loadAnalytics(link);
  }

  async function handleCreateLink(linkInput) {
    const createdLink = await createLink(linkInput);
    await loadLinks(getLinkKey(createdLink));
    return createdLink;
  }

  return (
    <div className="app-shell">
      <main className="hero">
        <header className="app-header">
          <p className="eyebrow">React Frontend</p>
          <h1>Orchestrator Test</h1>
          <p className="copy">
            Create short links, load your saved links on startup, and inspect click
            analytics for the active selection.
          </p>
        </header>

        <div className="app-layout">
          <section className="app-main stack" aria-label="Link management">
            <section className="panel">
              <p className="eyebrow">Create Link</p>
              <h2>Publish a short link</h2>
              <p className="copy">
                Successful submissions refresh the saved link list and select the new link.
              </p>
              <LinkForm className="link-form" onSubmit={handleCreateLink} />
            </section>

            <section className="panel" aria-busy={isInitialLinksLoad}>
              <p className="eyebrow">Saved Links</p>
              <h2>Link library</h2>
              <p className="copy">
                {isInitialLinksLoad
                  ? 'Loading your saved links from the API.'
                  : 'Choose a link to load its analytics snapshot.'}
              </p>
              {linksErrorMessage ? (
                <p role="alert">{linksErrorMessage}</p>
              ) : (
                <LinkList
                  className="link-list"
                  links={links}
                  isLoading={isLoadingLinks}
                  selectedLinkId={selectedLinkId}
                  isLoadingAnalytics={isLoadingAnalytics}
                  analyticsTargetLinkId={analyticsTargetLinkId}
                  onSelect={handleSelectLink}
                  onLoadAnalytics={handleLoadAnalytics}
                />
              )}
            </section>
          </section>

          <aside className="app-sidebar">
            <section className="panel" aria-busy={isInitialLinksLoad || isLoadingAnalytics}>
              <p className="eyebrow">Analytics</p>
              <h2>Selected link</h2>
              <p className="copy">
                {isInitialLinksLoad
                  ? 'Waiting for the initial link list before analytics can be shown.'
                  : 'The analytics panel stores the latest fetched detail for the current selection.'}
              </p>
              {analyticsErrorMessage ? (
                <p role="alert">{analyticsErrorMessage}</p>
              ) : null}
              <AnalyticsPanel
                className="analytics-panel"
                selectedLink={selectedLink}
                analytics={selectedLinkAnalytics}
                isLoading={isLoadingAnalytics}
                emptyMessage={
                  isInitialLinksLoad
                    ? 'Loading saved links...'
                    : 'Select a link to inspect its analytics.'
                }
              />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
