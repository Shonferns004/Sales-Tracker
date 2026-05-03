import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { PRIORITIES, STAGES } from '../lib/leads';

const priorityLabel = {
  low: 'Low',
  mid: 'Mid',
  high: 'High',
};

export default function LeadForm({ title, subtitle, form, saving, onChange, onSubmit, onCancel }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 shadow-xl shadow-slate-200">
        <div className="px-6 py-8 md:px-8 md:py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">Pipeline Entry</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{subtitle}</p>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Lead Specification</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">New Opportunity</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Transform prospects into partners. Complete the details below to initiate a high-value relationship and track progress in your pipeline.
            </p>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">General Information</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_320px]">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Lead Name</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300"
                    onChange={(event) => onChange({ name: event.target.value })}
                    placeholder="John Doe"
                    required
                    value={form.name}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Phone Number</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300"
                    onChange={(event) => onChange({ phone: event.target.value })}
                    placeholder="+1 (555) 000-0000"
                    required
                    value={form.phone}
                  />
                </label>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
              <div className="space-y-4">
                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Follow-up Date</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                    onChange={(event) => onChange({ followUpDate: event.target.value })}
                    type="date"
                    value={form.followUpDate}
                  />
                </label>

                <div className="space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Priority Level</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRIORITIES.map((priority) => {
                      const active = form.priority === priority;
                      return (
                        <button
                          key={priority}
                          className={`h-11 rounded-xl border text-sm font-semibold transition ${
                            active
                              ? 'border-blue-300 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                          onClick={() => onChange({ priority })}
                          type="button"
                        >
                          {priorityLabel[priority]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Initial Status</span>
                  <select
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                    onChange={(event) => onChange({ stage: event.target.value })}
                    value={form.stage}
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Created Date</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                    onChange={(event) => onChange({ createdDate: event.target.value })}
                    required
                    type="date"
                    value={form.createdDate}
                  />
                </label>

                <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                  High-priority leads trigger visible reminders in the pipeline.
                </div>
              </div>
            </aside>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
            <button
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={onCancel}
              type="button"
            >
              Discard
            </button>

            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Progress Step 1 of 1</span>
              <button
                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? 'Saving...' : 'Create Lead'}
              </button>
            </div>
          </div>
        </form>
      </section>

    </div>
  );
}
