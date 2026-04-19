import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import { PageSection } from '../components/PageSection';

export function NotFoundPage(): JSX.Element {
  return (
    <PageSection subtitle="The route you entered is not part of this frontend module." title="Page Not Found">
      <p className="empty-state">We could not find the requested page.</p>
      <Link className="text-link" to="/dashboard">
        Return to dashboard
      </Link>
    </PageSection>
  );
}
