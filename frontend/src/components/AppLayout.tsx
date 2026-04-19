import type { JSX } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

type NavItem = {
  label: string;
  path: string;
  end?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Login', path: '/login', end: true },
  { label: 'Dashboard', path: '/dashboard', end: true },
  { label: 'Inspections', path: '/inspections', end: true },
  { label: 'New Inspection', path: '/inspections/new', end: true },
  { label: 'Inspection Detail', path: '/inspections/INS-1001', end: true },
];

function formatPath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return 'Dashboard';
  }

  const segments = pathname.split('/').filter(Boolean);

  return segments
    .map((segment) => {
      if (/^ins-\d+$/i.test(segment)) {
        return segment.toUpperCase();
      }

      return segment
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    })
    .join(' / ');
}

export function AppLayout(): JSX.Element {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">Workshop Inspect Lite</p>
          <h1>Front Desk</h1>
        </div>

        <nav aria-label="Primary navigation" className="nav-grid">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
              end={item.end}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="active-path" aria-live="polite">
          <span className="active-path-label">Current View</span>
          <strong>{formatPath(location.pathname)}</strong>
        </div>
      </header>

      <main className="content" role="main">
        <Outlet />
      </main>
    </div>
  );
}
