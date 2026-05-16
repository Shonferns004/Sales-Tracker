import { useMemo } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import SkeletonDashboard from '../components/SkeletonDashboard';
import { StatsCards } from '../components/StatsCards';
import FilterPanel from '../components/FilterPanel';
import LeadTable from '../components/LeadTable';
import { getStatus } from '../utils/date';

export default function DashboardPage(props) {
  const {
    leads,
    loading,
    search,
    setSearch,
    followFilter,
    setFollowFilter,
    stageFilter,
    setStageFilter,
    priorityFilter,
    setPriorityFilter,
    onResetFilters,
    onEditLead,
    onOpenNotes,
    onDeleteLead,
    page,
    pageSize,
    totalCount,
    onPageChange,
  } = props;

  const filtered = useMemo(() => {
    return leads.filter((item) => {
      if (followFilter && getStatus(item.followUpDate) !== followFilter) return false;
      if (stageFilter && item.stage !== stageFilter) return false;
      if (priorityFilter && item.priority !== priorityFilter) return false;
      return true;
    });
  }, [followFilter, leads, priorityFilter, stageFilter]);

  const stats = useMemo(
    () => ({
      total: totalCount,
      today: leads.filter((lead) => getStatus(lead.followUpDate) === 'today').length,
      overdue: leads.filter((lead) => getStatus(lead.followUpDate) === 'overdue').length,
      high: leads.filter((lead) => lead.priority === 'high').length,
    }),
    [leads, totalCount]
  );

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 shadow-xl shadow-slate-200">
        <div className="flex flex-col gap-8 px-6 py-8 md:px-8 md:py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Live pipeline pulse
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">Strategic overview</h1>
            <p className="mt-4 text-base leading-8 text-slate-200">
              Welcome back. Your lead pipeline is sorted and your CSV stays synced with every saved change.
            </p>
            <button className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-900" type="button">
              Execute pipeline
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid min-w-[260px] grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur">
            <div className="px-6 py-5 text-center">
              <div className="text-5xl font-bold text-white">{stats.total}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Tracked Leads</div>
            </div>
            <div className="border-l border-white/10 px-6 py-5 text-center">
              <div className="text-5xl font-bold text-white">{stats.today}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Due Today</div>
            </div>
          </div>
        </div>
      </section>

      <StatsCards stats={stats} />

      <FilterPanel
        followFilter={followFilter}
        onResetFilters={onResetFilters}
        priorityFilter={priorityFilter}
        search={search}
        setFollowFilter={setFollowFilter}
        setPriorityFilter={setPriorityFilter}
        setSearch={setSearch}
        setStageFilter={setStageFilter}
        stageFilter={stageFilter}
      />

      <LeadTable leads={filtered} onEditLead={onEditLead} onOpenNotes={onOpenNotes} onDeleteLead={onDeleteLead} />

      {totalCount > pageSize && !search ? (
        <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{Math.min((page - 1) * pageSize + 1, totalCount)}</span>
            {' '}&ndash;{' '}
            <span className="font-semibold text-slate-700">{Math.min(page * pageSize, totalCount)}</span>
            {' '}of{' '}
            <span className="font-semibold text-slate-700">{totalCount}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Page {page} of {Math.ceil(totalCount / pageSize)}
            </span>
            <button
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page >= Math.ceil(totalCount / pageSize)}
              onClick={() => onPageChange(page + 1)}
              type="button"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
