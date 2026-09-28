export const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
export const dateLabel = (value: string) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
export const todayKey = () => new Date().toISOString().slice(0, 10);