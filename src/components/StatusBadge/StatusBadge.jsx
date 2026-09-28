import Badge from '../ui/Badge';

const statuses = {
  NotStarted: { label: 'Not started', variant: 'neutral' },
  InProgress: { label: 'In progress', variant: 'info' },
  Completed: { label: 'Completed', variant: 'success' },
};

export default function StatusBadge({ status }) {
  const appearance = statuses[status] ?? {
    label: 'Unknown status',
    variant: 'neutral',
  };

  return (
    <Badge
      label={appearance.label}
      variant={appearance.variant}
      accessibilityLabel={`Status: ${appearance.label}`}
    />
  );
}
