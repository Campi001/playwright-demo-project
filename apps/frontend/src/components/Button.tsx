import { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ loading = false, disabled, children, ...props }: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type="button"
      {...props}
      disabled={isDisabled}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        backgroundColor: isDisabled ? '#94a3b8' : '#2563eb',
        color: '#fff',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}
