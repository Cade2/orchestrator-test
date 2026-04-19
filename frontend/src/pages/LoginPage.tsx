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
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setSuccess('');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPassword = form.password.trim();
    const nextFieldErrors: Partial<Record<keyof LoginForm, string>> = {};

    if (!normalizedEmail) {
      nextFieldErrors.email = 'Email is required.';
    } else if (!isValidEmail(normalizedEmail)) {
      nextFieldErrors.email = 'Enter a valid email address.';
    }

    if (!normalizedPassword) {
      nextFieldErrors.password = 'Password is required.';
    } else if (normalizedPassword.length < 8) {
      nextFieldErrors.password = 'Password must be at least 8 characters long.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });

    setForm((current) => ({ ...current, email: normalizedEmail }));
    setIsSubmitting(false);
    setSuccess('Credentials validated. Authentication will be connected to the backend API in later steps.');
  }

  return (
    <PageSection subtitle="Sign in to access inspections and damage notes." title="Login">
      <form className="form-grid" noValidate onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          className={fieldErrors.email ? 'is-invalid' : undefined}
          id="email"
          name="email"
          onChange={onChange}
          placeholder="technician@shop.com"
          type="email"
          value={form.email}
          aria-invalid={fieldErrors.email ? 'true' : 'false'}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email ? (
          <p className="field-error" id="email-error" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          className={fieldErrors.password ? 'is-invalid' : undefined}
          id="password"
          name="password"
          onChange={onChange}
          placeholder="Enter your password"
          type="password"
          value={form.password}
          aria-invalid={fieldErrors.password ? 'true' : 'false'}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
        />
        {fieldErrors.password ? (
          <p className="field-error" id="password-error" role="alert">
            {fieldErrors.password}
          </p>
        ) : null}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <span className="button-loading">
              <span aria-hidden="true" className="button-spinner" />
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        {success ? <p className="alert alert-success">{success}</p> : null}
      </form>
    </PageSection>
  );
}
