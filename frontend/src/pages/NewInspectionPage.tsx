import type { ChangeEvent, FormEvent, JSX } from 'react';
import { useState } from 'react';

import { PageSection } from '../components/PageSection';

type NewInspectionForm = {
  vin: string;
  customerName: string;
  status: 'DRAFT' | 'IN_PROGRESS';
};

const initialState: NewInspectionForm = {
  vin: '',
  customerName: '',
  status: 'DRAFT',
};

function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.toUpperCase());
}

export function NewInspectionPage(): JSX.Element {
  const [form, setForm] = useState<NewInspectionForm>(initialState);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = event.target;

    if (name === 'status' && value !== 'DRAFT' && value !== 'IN_PROGRESS') {
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setMessage('');
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const vin = form.vin.trim().toUpperCase();
    const customerName = form.customerName.trim();

    if (!vin || !customerName) {
      setError('VIN and customer name are required.');
      return;
    }

    if (!isValidVin(vin)) {
      setError('VIN must contain 17 valid alphanumeric characters.');
      return;
    }

    setForm(initialState);
    setMessage(`Inspection for ${customerName} (${vin}) is ready to be submitted to the backend API.`);
  }

  return (
    <PageSection subtitle="Create an inspection draft before attaching damage notes." title="New Inspection">
      <form className="form-grid" noValidate onSubmit={onSubmit}>
        <label htmlFor="vin">Vehicle VIN</label>
        <input
          id="vin"
          maxLength={17}
          minLength={17}
          name="vin"
          onChange={onChange}
          placeholder="1FTFW1E50JFB12345"
          value={form.vin}
        />

        <label htmlFor="customerName">Customer Name</label>
        <input
          id="customerName"
          maxLength={120}
          name="customerName"
          onChange={onChange}
          placeholder="Jordan Lee"
          value={form.customerName}
        />

        <label htmlFor="status">Starting Status</label>
        <select id="status" name="status" onChange={onChange} value={form.status}>
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>

        <button type="submit">Create Inspection</button>

        {error ? <p className="alert alert-error">{error}</p> : null}
        {message ? <p className="alert alert-success">{message}</p> : null}
      </form>
    </PageSection>
  );
}
