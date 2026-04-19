import type { JSX } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PageSection } from '../components/PageSection';

type DetailRecord = {
  id: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED';
  vehicle: string;
  customer: string;
  notesCount: number;
};

const detailRecords: Record<string, DetailRecord> = {
  'INS-1001': {
    id: 'INS-1001',
    status: 'IN_PROGRESS',
    vehicle: '2022 Ford Transit',
    customer: 'Maya Carter',
    notesCount: 3,
  },
  'INS-1002': {
    id: 'INS-1002',
    status: 'DRAFT',
    vehicle: '2020 Honda Accord',
    customer: 'Leo Nguyen',
    notesCount: 1,
  },
  'INS-1003': {
    id: 'INS-1003',
    status: 'SUBMITTED',
    vehicle: '2019 Toyota RAV4',
    customer: 'Anika Shah',
    notesCount: 5,
  },
  'INS-1004': {
    id: 'INS-1004',
    status: 'APPROVED',
    vehicle: '2021 Tesla Model Y',
    customer: 'Milo Johnson',
    notesCount: 2,
  },
};

function normalizeInspectionId(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value.trim().toUpperCase();
}

export function InspectionDetailPage(): JSX.Element {
  const params = useParams<{ inspectionId: string }>();
  const normalizedId = normalizeInspectionId(params.inspectionId);

  if (!normalizedId || !/^INS-\d{4}$/i.test(normalizedId)) {
    return (
      <PageSection
        subtitle="Inspection identifiers must match the expected INS-#### format."
        title="Inspection Detail"
      >
        <p className="alert alert-error">The inspection ID in this route is not valid.</p>
        <Link className="text-link" to="/inspections">
          Back to inspections list
        </Link>
      </PageSection>
    );
  }

  const record = detailRecords[normalizedId];

  if (!record) {
    return (
      <PageSection subtitle="The requested inspection could not be located." title="Inspection Detail">
        <p className="empty-state">No record found for {normalizedId}.</p>
        <Link className="text-link" to="/inspections">
          Back to inspections list
        </Link>
      </PageSection>
    );
  }

  return (
    <PageSection subtitle="Snapshot of a single inspection and associated damage notes." title="Inspection Detail">
      <div className="detail-grid">
        <article className="detail-card">
          <h3>Inspection ID</h3>
          <p>{record.id}</p>
        </article>
        <article className="detail-card">
          <h3>Status</h3>
          <p>{record.status}</p>
        </article>
        <article className="detail-card">
          <h3>Damage Notes</h3>
          <p>{record.notesCount}</p>
        </article>
        <article className="detail-card detail-span">
          <h3>Customer</h3>
          <p>{record.customer}</p>
          <h3>Vehicle</h3>
          <p>{record.vehicle}</p>
        </article>
      </div>
      <Link className="text-link" to="/inspections">
        Back to inspections list
      </Link>
    </PageSection>
  );
}
