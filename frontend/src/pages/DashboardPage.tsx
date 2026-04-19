import type { JSX } from 'react';

import { PageSection } from '../components/PageSection';

type SummaryCard = {
  label: string;
  value: string;
  trend: string;
};

const summaryCards: SummaryCard[] = [
  { label: 'Open Inspections', value: '12', trend: '+3 today' },
  { label: 'Completed This Week', value: '47', trend: '+8 vs last week' },
  { label: 'Critical Damage Notes', value: '5', trend: '-2 since yesterday' },
];

export function DashboardPage(): JSX.Element {
  return (
    <PageSection
      subtitle="Operational snapshot for intake, active repairs, and completed inspections."
      title="Dashboard"
    >
      <div className="card-grid">
        {summaryCards.map((card) => (
          <article className="metric-card" key={card.label}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>{card.trend}</span>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
