import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { PRIORITIES, STAGES } from '../lib/leads';
import { titleCase } from '../utils/date';

function FilterChip({ active, children, onClick }) {
  return (
    <button
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function FilterPanel({
  search,
  setSearch,
  followFilter,
  setFollowFilter,
  priorityFilter,
  setPriorityFilter,
  stageFilter,
  setStageFilter,
  onResetFilters,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Quick Search
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Refine the live pipeline.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Search, collapse, and reopen filters whenever you want a cleaner dashboard view.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            onClick={() => setCollapsed((current) => !current)}
            type="button"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            {collapsed ? 'Expand Search' : 'Collapse Search'}
          </button>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            onClick={onResetFilters}
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className={`grid transition-all ${collapsed ? 'mt-0 grid-rows-[0fr]' : 'mt-5 grid-rows-[1fr]'}`}>
        <div className="overflow-hidden">
          <div className="space-y-4 pt-1">
            <label className="relative block min-w-0">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Search by Name or Phone</span>
              <Search className="pointer-events-none absolute left-4 top-[46px] h-4 w-4 text-slate-400" />
              <input
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or phone"
                value={search}
              />
            </label>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Timeline</p>
              <div className="flex flex-wrap gap-2">
                {['today', 'upcoming', 'overdue'].map((item) => (
                  <FilterChip active={followFilter === item} key={item} onClick={() => setFollowFilter(item)}>
                    {titleCase(item)}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Priority</p>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((item) => (
                  <FilterChip active={priorityFilter === item} key={item} onClick={() => setPriorityFilter(item)}>
                    {item.toUpperCase()}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((item) => (
                  <FilterChip active={stageFilter === item} key={item} onClick={() => setStageFilter(item)}>
                    {item}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
