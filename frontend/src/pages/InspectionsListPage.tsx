import type { ChangeEvent, JSX } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { PageSection } from '../components/PageSection';

type InspectionStatus = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED';

type InspectionRecord = {
  id: string;
  customer: string;
  vehicle: string;
  status: InspectionStatus;
};

const inspectionRecords: InspectionRecord[] = [
  { id: 'INS-1001', customer: 'Maya Carter', vehicle: '2022 Ford Transit', status: 'IN_PROGRESS' },
  { id: 'INS-1002', customer: 'Leo Nguyen', vehicle: '2020 Honda Accord', status: 'DRAFT' },
  { id: 'INS-1003', customer: 'Anika Shah', vehicle: '2019 Toyota RAV4', status: 'SUBMITTED' },
  { id: 'INS-1004', customer: 'Milo Johnson', vehicle: '2021 Tesla Model Y', status: 'APPROVED' },
];

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function InspectionsListPage(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InspectionStatus>('ALL');

  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalizeQuery(query);

    return inspectionRecords.filter((inspection) => {
      const statusMatches = statusFilter === 'ALL' || inspection.status === statusFilter;
      if (!statusMatches) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [inspection.id, inspection.customer, inspection.vehicle]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, statusFilter]);

  function onQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  function onStatusChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextValue = event.target.value;

    if (nextValue === 'ALL') {
      setStatusFilter('ALL');
      return;
    }

    if (nextValue === 'DRAFT' || nextValue === 'IN_PROGRESS' || nextValue === 'SUBMITTED' || nextValue === 'APPROVED') {
      setStatusFilter(nextValue);
    }
  }

  return (
    <PageSection subtitle="Search and filter inspections before opening detailed records." title="Inspections List">
      <div className="toolbar">
        <label className="field-inline" htmlFor="inspection-query">
          <span>Search</span>
          <input
            id="inspection-query"
            onChange={onQueryChange}
            placeholder="Search by ID, customer, or vehicle"
            type="search"
            value={query}
          />
        </label>

        <label className="field-inline" htmlFor="inspection-status">
          <span>Status</span>
          <select id="inspection-status" onChange={onStatusChange} value={statusFilter}>
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
          </select>
        </label>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="empty-state">No inspections matched the current search and filter combination.</p>
      ) : (
        <ul className="record-list" role="list">
          {filteredRecords.map((inspection) => (
            <li key={inspection.id}>
              <article className="record-card">
                <header>
                  <h3>{inspection.id}</h3>
                  <span className={`status-pill status-${inspection.status.toLowerCase()}`}>{inspection.status}</span>
                </header>
                <p>{inspection.customer}</p>
                <p>{inspection.vehicle}</p>
                <Link className="text-link" to={`/inspections/${inspection.id}`}>
                  Open details
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
