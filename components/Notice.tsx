type Props = { tone: "success" | "warning" | "danger"; children: React.ReactNode };

const tones = {
  success: "bg-success-soft border-success",
  warning: "bg-warning-soft border-warning",
  danger: "bg-accent-soft border-danger",
};

/** Server-rendered status message driven by query params. */
export function Notice({ tone, children }: Props) {
  return (
    <p role="status" className={`rounded-md border-l-4 px-4 py-3 text-body font-semibold text-fg ${tones[tone]}`}>
      {children}
    </p>
  );
}
