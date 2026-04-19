import type { JSX, ReactNode } from 'react';

type PageSectionProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function PageSection({ children, subtitle, title }: PageSectionProps): JSX.Element {
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
