import { AlertCircle, BriefcaseBusiness, CalendarClock, Flame } from 'lucide-react';

const accents = {
  blue: 'border-l-blue-500 bg-blue-50/30',
  indigo: 'border-l-indigo-500 bg-indigo-50/30',
  rose: 'border-l-rose-500 bg-rose-50/30',
  amber: 'border-l-amber-500 bg-amber-50/30',
};

export function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Leads', value: stats.total, accent: 'blue', icon: BriefcaseBusiness },
    { label: 'Tasks Today', value: stats.today, accent: 'indigo', icon: CalendarClock },
    { label: 'Pending Action', value: stats.overdue, accent: 'rose', icon: AlertCircle },
    { label: 'Forecast Value', value: stats.high, accent: 'amber', icon: Flame },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article className={`rounded-[24px] border border-slate-200 border-l-4 p-5 shadow-sm ${accents[card.accent]}`} key={card.label}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
            <card.icon className="h-4 w-4 text-slate-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
          <p className="mt-1 text-sm text-slate-500">Live pipeline view</p>
        </article>
      ))}
    </section>
  );
}
