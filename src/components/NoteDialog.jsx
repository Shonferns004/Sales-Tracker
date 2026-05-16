import { useState } from 'react'
import { MessageSquare, Clock, Plus, X } from 'lucide-react'

export default function NoteDialog({ lead, isOpen, onOpenChange, onSave }) {
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const notes = lead?.notes || []

  async function handleAddNote() {
    const text = newNote.trim()
    if (!text) return
    setSaving(true)
    try {
      const note = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }
      await onSave(lead.id, [...notes, note])
      setNewNote('')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 mx-4 w-full max-w-lg rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="rounded-t-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <MessageSquare className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">Notes</p>
                <h2 className="text-xl font-bold tracking-tight text-white">{lead?.name || 'Lead'}</h2>
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

        <div className="p-6">
          {notes.length > 0 ? (
            <div className="mb-4 flex max-h-64 flex-col gap-3 overflow-auto pr-1">
              {notes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.text}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
              No notes yet. Add one below.
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">New Note</p>
            <textarea
              className="min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300"
              placeholder="Type a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Close
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!newNote.trim() || saving}
              onClick={handleAddNote}
              type="button"
            >
              <Plus className="h-4 w-4" />
              {saving ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
