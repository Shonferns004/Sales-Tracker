import { MessageSquareText } from 'lucide-react';
import { formatDate, getStatus, titleCase } from '../utils/date';

function statusClasses(status) {
  switch (status) {
    case 'note':
      return 'bg-amber-50 text-amber-700';
    case 'done':
      return 'bg-emerald-100 text-emerald-800';
    case 'today':
      return 'bg-emerald-50 text-emerald-700';
    case 'upcoming':
      return 'bg-blue-50 text-blue-700';
    case 'overdue':
      return 'bg-rose-50 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-500';
  }
}

function priorityClasses(priority) {
  switch (priority) {
    case 'high':
      return 'bg-rose-50 text-rose-700';
    case 'mid':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-emerald-50 text-emerald-700';
  }
}

export default function LeadTable({ leads, onEditLead, onOpenNotes, onDeleteLead }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Active Pipeline</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Real-time engagement tracking</h2>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
          No leads match the current filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Partner / Entity', 'Lifecycle', 'Priority', 'Follow Up', 'Activity', 'Created', 'Actions'].map((header) => (
                  <th key={header} className="px-3 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const notesCount = Array.isArray(lead.notes) ? lead.notes.length : 0;
                const status = lead.isDone ? 'done' : notesCount > 0 ? 'note' : getStatus(lead.followUpDate) || 'none';
                return (
                  <tr
                    className={`cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 ${notesCount > 0 ? 'bg-amber-50/40' : ''}`}
                    key={lead.id}
                    onClick={() => onEditLead(lead.id)}
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{lead.stage}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses(lead.priority)}`}>
                        {lead.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">{formatDate(lead.followUpDate)}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(status)}`}>
                          {status === 'note'
                            ? 'Note Added'
                            : status === 'done'
                              ? 'Done'
                              : lead.followUpDate
                                ? titleCase(status)
                                : 'No date'}
                        </span>
                        {notesCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            <MessageSquareText className="h-3 w-3" />
                            {notesCount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">{lead.createdDate}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenNotes(lead);
                          }}
                          type="button"
                        >
                          Add Note
                        </button>
                        <button
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditLead(lead.id, {
                              isDone: true,
                              followUpDate: null,
                              note: null,
                            });
                          }}
                          type="button"
                        >
                          Done
                        </button>
                        <button
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteLead(lead);
                          }}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
