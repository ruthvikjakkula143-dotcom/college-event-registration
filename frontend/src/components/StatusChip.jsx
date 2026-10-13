const LABELS = { PENDING: 'Pending', CONFIRMED: 'Confirmed', CANCELLED: 'Cancelled' };

export default function StatusChip({ status }) {
  return <span className={`chip ${status.toLowerCase()}`}>{LABELS[status] || status}</span>;
}
