import { useEffect, useState } from 'react';

import { createLink } from '../api';

const DEFAULT_FORM_VALUES = {
  url: '',
  slug: '',
  title: '',
  tags: '',
};

function isValidHttpUrl(value) {
  if (!value.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

function normalizeInitialValues(initialValues = {}) {
  return {
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
    tags: Array.isArray(initialValues.tags)
      ? initialValues.tags.join(', ')
      : (initialValues.tags || ''),
  };
}

function buildPayload(values) {
  return {
    url: values.url.trim(),
    slug: values.slug.trim() || undefined,
    title: values.title.trim() || null,
    tags: values.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

function validateValues(values) {
  const errors = {};
  const trimmedUrl = values.url.trim();

  if (!trimmedUrl) {
    errors.url = 'Enter a destination URL.';
  } else if (!isValidHttpUrl(trimmedUrl)) {
    errors.url = 'Use a valid http or https URL.';
  }

  return errors;
}

export default function LinkForm({
  className = '',
  initialValues,
  onSubmit,
  submitLabel = 'Create Link',
}) {
  const [values, setValues] = useState(() => normalizeInitialValues(initialValues));
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(normalizeInitialValues(initialValues));
    setValidationErrors({});
    setSubmissionErrorMessage('');
    setSuccessMessage('');
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [name]: value,
      };

      if (validationErrors[name]) {
        setValidationErrors((currentErrors) => ({
          ...currentErrors,
          [name]: validateValues(nextValues)[name],
        }));
      }

      return nextValues;
    });

    if (successMessage) {
      setSuccessMessage('');
    }

    if (submissionErrorMessage) {
      setSubmissionErrorMessage('');
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    const nextFieldError = validateValues(values)[name];

    setValidationErrors((currentErrors) => ({
      ...currentErrors,
      [name]: nextFieldError,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextValidationErrors = validateValues(values);
    setValidationErrors(nextValidationErrors);
    setSubmissionErrorMessage('');
    setSuccessMessage('');

    if (Object.values(nextValidationErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload(values);
      const createdLink = typeof onSubmit === 'function'
        ? await onSubmit(payload)
        : await createLink(payload);

      setSuccessMessage(`Link created with short code ${createdLink.slug}.`);
      setValues({ ...DEFAULT_FORM_VALUES });
      setValidationErrors({});
    } catch (error) {
      setSubmissionErrorMessage(error.message || 'Unable to create link.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="link-form-url">Destination URL</label>
        <input
          id="link-form-url"
          name="url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/article"
          autoComplete="url"
          value={values.url}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={validationErrors.url ? 'true' : 'false'}
          aria-describedby={validationErrors.url ? 'link-form-url-error' : undefined}
          required
        />
        {validationErrors.url ? (
          <p id="link-form-url-error" role="alert">{validationErrors.url}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="link-form-slug">Custom short code</label>
        <input
          id="link-form-slug"
          name="slug"
          type="text"
          placeholder="optional"
          autoCapitalize="none"
          autoCorrect="off"
          value={values.slug}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="link-form-title">Title</label>
        <input
          id="link-form-title"
          name="title"
          type="text"
          placeholder="Optional label for this link"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="link-form-tags">Tags</label>
        <input
          id="link-form-tags"
          name="tags"
          type="text"
          placeholder="marketing, campaign, q2"
          value={values.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </div>

      {submissionErrorMessage ? (
        <p id="link-form-feedback" role="alert">{submissionErrorMessage}</p>
      ) : null}

      {successMessage ? (
        <p id="link-form-feedback">{successMessage}</p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>
    </form>
  );
}
