import { useState } from 'react'
import { Plus, Trash2, Users, X } from 'lucide-react'
import { STAGES, PRIORITIES } from '../lib/leads'
import { today } from '../utils/date'

const emptyRow = () => ({
  name: '',
  phone: '',
  stage: 'Not contacted',
  priority: 'mid',
  followUpDate: '',
  createdDate: today(),
})

export default function BulkAddDialog({ isOpen, onOpenChange, onSave }) {
  const [rows, setRows] = useState([emptyRow()])
  const [saving, setSaving] = useState(false)

  function updateRow(index, patch) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(index) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const valid = rows.filter((r) => r.name.trim())
    if (!valid.length) return
    setSaving(true)
    try {
      await onSave(valid)
      setRows([emptyRow()])
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="rounded-t-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Users className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">Bulk Entry</p>
                <h2 className="text-xl font-bold tracking-tight text-white">Add Multiple Leads</h2>
              </div>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div key={index}>
                {index > 0 && <div className="my-4 border-t border-slate-100" />}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Lead #{index + 1}</span>
                  <button
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    onClick={() => removeRow(index)}
                    type="button"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Name</label>
                    <input
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300"
                      placeholder="Lead name"
                      value={row.name}
                      onChange={(e) => updateRow(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Phone</label>
                    <input
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300"
                      placeholder="Phone number"
                      value={row.phone}
                      onChange={(e) => updateRow(index, { phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Stage</label>
                    <select
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                      value={row.stage}
                      onChange={(e) => updateRow(index, { stage: e.target.value })}
                    >
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Priority</label>
                    <select
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                      value={row.priority}
                      onChange={(e) => updateRow(index, { priority: e.target.value })}
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Follow-up Date</label>
                    <input
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                      type="date"
                      value={row.followUpDate}
                      onChange={(e) => updateRow(index, { followUpDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Created Date</label>
                    <input
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                      type="date"
                      value={row.createdDate}
                      onChange={(e) => updateRow(index, { createdDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-5 text-sm font-semibold text-slate-500 transition hover:border-blue-300 hover:text-blue-700"
              onClick={addRow}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Another Lead
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving || !rows.some((r) => r.name.trim())}
              type="submit"
            >
              {saving ? 'Saving...' : `Save ${rows.filter((r) => r.name.trim()).length} Lead(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
