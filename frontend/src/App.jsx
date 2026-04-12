import { useEffect, useMemo, useState } from 'react';

import { fetchAllLinks, fetchLinkAnalytics } from './api';
import AnalyticsPanel from './components/AnalyticsPanel';
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';

function getLinkKey(link) {
  return link?.id || link?.slug || null;
}

function getAnalyticsLookupValue(link) {
  return link?.slug || link?.id || null;
}

export default function App() {
  const [links, setLinks] = useState([]);
  const [linksErrorMessage, setLinksErrorMessage] = useState('');
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [selectedLinkAnalytics, setSelectedLinkAnalytics] = useState(null);
  const [analyticsErrorMessage, setAnalyticsErrorMessage] = useState('');
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadLinks() {
      setIsLoadingLinks(true);
      setLinksErrorMessage('');

      try {
        const loadedLinks = await fetchAllLinks();

        if (!isActive) {
          return;
        }

        setLinks(Array.isArray(loadedLinks) ? loadedLinks : []);
        setSelectedLinkId((currentSelectedLinkId) => {
          if (!loadedLinks?.length) {
            return null;
          }

          const hasCurrentSelection = loadedLinks.some(
            (link) => getLinkKey(link) === currentSelectedLinkId,
          );

          return hasCurrentSelection
            ? currentSelectedLinkId
            : getLinkKey(loadedLinks[0]);
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLinks([]);
        setSelectedLinkId(null);
        setSelectedLinkAnalytics(null);
        setLinksErrorMessage(error.message || 'Unable to load links.');
      } finally {
        if (isActive) {
          setIsLoadingLinks(false);
        }
      }
    }

    loadLinks();

    return () => {
      isActive = false;
    };
  }, []);

  const selectedLink = useMemo(
    () => links.find((link) => getLinkKey(link) === selectedLinkId) || null,
    [links, selectedLinkId],
  );

  useEffect(() => {
    let isActive = true;
    const analyticsLookupValue = getAnalyticsLookupValue(selectedLink);

    if (!analyticsLookupValue) {
      setSelectedLinkAnalytics(null);
      setAnalyticsErrorMessage('');
      setIsLoadingAnalytics(false);
      return () => {
        isActive = false;
      };
    }

    async function loadAnalytics() {
      setIsLoadingAnalytics(true);
      setAnalyticsErrorMessage('');

      try {
        const analytics = await fetchLinkAnalytics(analyticsLookupValue);

        if (isActive) {
          setSelectedLinkAnalytics(analytics);
        }
      } catch (error) {
        if (isActive) {
          setSelectedLinkAnalytics(null);
          setAnalyticsErrorMessage(error.message || 'Unable to load link analytics.');
        }
      } finally {
        if (isActive) {
          setIsLoadingAnalytics(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, [selectedLink]);

  function handleSelectLink(link) {
    setSelectedLinkId(getLinkKey(link));
  }

  function handleLinkCreated(createdLink) {
    setLinks((currentLinks) => {
      const createdLinkKey = getLinkKey(createdLink);
      const nextLinks = currentLinks.filter((link) => getLinkKey(link) !== createdLinkKey);
      return [createdLink, ...nextLinks];
    });
    setSelectedLinkId(getLinkKey(createdLink));
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
                New links are added to local state immediately and selected for analytics.
              </p>
              <LinkForm className="link-form" onCreated={handleLinkCreated} />
            </section>

            <section className="panel">
              <p className="eyebrow">Saved Links</p>
              <h2>Link library</h2>
              <p className="copy">
                Choose a link to load its analytics snapshot.
              </p>
              <LinkList
                className="link-list"
                links={links}
                isLoading={isLoadingLinks}
                errorMessage={linksErrorMessage}
                selectedLinkId={selectedLinkId}
                onSelect={handleSelectLink}
              />
            </section>
          </section>

          <aside className="app-sidebar">
            <section className="panel">
              <p className="eyebrow">Analytics</p>
              <h2>Selected link</h2>
              <p className="copy">
                The analytics panel stores the latest fetched detail for the current selection.
              </p>
              <AnalyticsPanel
                className="analytics-panel"
                selectedLink={selectedLink}
                analytics={selectedLinkAnalytics}
                isLoading={isLoadingAnalytics}
                errorMessage={analyticsErrorMessage}
              />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
