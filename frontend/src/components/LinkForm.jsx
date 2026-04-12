import { useState } from 'react';

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

export default function LinkForm({
  className = '',
  initialValues,
  onCreated,
  submitLabel = 'Create Link',
}) {
  const [values, setValues] = useState(() => normalizeInitialValues(initialValues));
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUrl = values.url.trim();

    if (!trimmedUrl) {
      setErrorMessage('Enter a destination URL.');
      setSuccessMessage('');
      return;
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      setErrorMessage('Use a valid http or https URL.');
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const createdLink = await createLink(buildPayload(values));

      setSuccessMessage(`Link created with short code ${createdLink.slug}.`);
      setValues({ ...DEFAULT_FORM_VALUES });

      if (typeof onCreated === 'function') {
        onCreated(createdLink);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create link.');
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
          disabled={isSubmitting}
          required
        />
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
          disabled={isSubmitting}
        />
      </div>

      {errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p>{successMessage}</p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>
    </form>
  );
}
