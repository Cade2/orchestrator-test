import type { ChangeEvent, FormEvent, JSX } from 'react';
import { useState } from 'react';

import { PageSection } from '../components/PageSection';

type LoginForm = {
  email: string;
  password: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginPage(): JSX.Element {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSuccess('');
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPassword = form.password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Email and password are required.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (normalizedPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setForm((current) => ({ ...current, email: normalizedEmail }));
    setSuccess('Credentials validated. Authentication will be connected to the backend API in later steps.');
  }

  return (
    <PageSection subtitle="Sign in to access inspections and damage notes." title="Login">
      <form className="form-grid" noValidate onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          onChange={onChange}
          placeholder="technician@shop.com"
          type="email"
          value={form.email}
        />

        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={onChange}
          placeholder="Enter your password"
          type="password"
          value={form.password}
        />

        <button type="submit">Sign In</button>

        {error ? <p className="alert alert-error">{error}</p> : null}
        {success ? <p className="alert alert-success">{success}</p> : null}
      </form>
    </PageSection>
  );
}
