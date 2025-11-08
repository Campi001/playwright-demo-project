import { forwardRef, InputHTMLAttributes } from 'react';

type TextFieldProps = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, required, ...props }, ref) => {
    const fallbackId = label.toLowerCase().replace(/\s+/g, '-');
    const fieldId = id ?? props.name ?? fallbackId;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label htmlFor={fieldId} style={{ fontWeight: 600 }}>
          {label}
          {required ? ' *' : ''}
        </label>
        <input
          id={fieldId}
          ref={ref}
          required={required}
          {...props}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #94a3b8',
            fontSize: '1rem',
          }}
        />
        {error ? (
          <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</span>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
