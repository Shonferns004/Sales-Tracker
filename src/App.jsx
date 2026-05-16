import { useEffect, useState } from 'react';
import { countLeads, createLead, deleteLead, getLead, importLeads, listLeads, updateLead, updateLeadNotes } from './lib/leads';
import { getCsvDownloadUrl, syncCsv } from './lib/csvApi';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import LeadFormPage from './pages/LeadFormPage';
import ImportPage from './pages/ImportPage';
import NoteDialog from './components/NoteDialog';
import BulkAddDialog from './components/BulkAddDialog';

import { emptyForm, toFormState, toLeadInput } from './utils/form';
import { parseCsvFile } from './utils/csv';
import { useLeadNotifications } from './hooks/useLeadNotifications';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const notificationApiAvailable =
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof Notification !== 'undefined' &&
    typeof Notification.requestPermission === 'function';

  const [view, setView] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [followFilter, setFollowFilter] = useState(null);
  const [stageFilter, setStageFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(notificationApiAvailable && Notification.permission === 'granted');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noteDialogLead, setNoteDialogLead] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [deleteDialogLead, setDeleteDialogLead] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  const { theme, toggleTheme } = useTheme();
  useLeadNotifications(leads);

  async function loadLeads(pageOverride) {
    try {
      setError('');
      const currentPage = pageOverride ?? page;
      const searchTerm = search.trim();
      const offset = searchTerm ? 0 : (currentPage - 1) * pageSize;
      const limit = searchTerm ? null : pageSize;
      const [data, total] = await Promise.all([
        listLeads(limit, offset, searchTerm || undefined),
        countLeads(searchTerm || undefined),
      ]);
      setLeads(data);
      setTotalCount(total);
      return data;
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load leads. Check your Supabase keys and the leads table setup.');
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(newPage) {
    setPage(newPage);
    setLoading(true);
    setError('');
    try {
      const offset = (newPage - 1) * pageSize;
      const searchTerm = search.trim();
      const [data, total] = await Promise.all([
        searchTerm ? listLeads(null, 0, searchTerm) : listLeads(pageSize, offset),
        countLeads(searchTerm || undefined),
      ]);
      setLeads(data);
      setTotalCount(total);
    } catch (err) {
      console.error(err);
      setError('Could not load page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [page]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      loadLeads();
    }
  }, [search, followFilter, stageFilter, priorityFilter]);

  useEffect(() => {
    if (!notificationApiAvailable) {
      setNotificationsEnabled(false);
      return;
    }
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }
    if (Notification.permission !== 'default') {
      setNotificationsEnabled(false);
      return;
    }

    Promise.resolve(Notification.requestPermission())
      .then((permission) => {
        setNotificationsEnabled(permission === 'granted');
      })
      .catch((requestError) => {
        console.error('Notification permission request failed.', requestError);
        setNotificationsEnabled(false);
      });
  }, [notificationApiAvailable]);

  async function syncCsvSnapshot(sourceLeads) {
    const nextLeads = sourceLeads || (await listLeads());
    await syncCsv(nextLeads);
  }

  function resetFormState() {
    setForm(emptyForm());
    setEditingId(null);
  }

  function navigateTo(viewName) {
    setMessage('');
    setError('');
    setSidebarOpen(false);
    if (viewName !== 'edit') {
      setEditingId(null);
    }
    if (viewName === 'add') {
      resetFormState();
    }
    setView(viewName);
  }

  function handleOpenNotes(lead) {
    setNoteDialogLead(lead);
    setNoteDialogOpen(true);
  }

  async function handleSaveNotes(leadId, notes) {
    try {
      setError('');
      await updateLeadNotes(leadId, notes);
      const data = await loadLeads();
      await syncCsvSnapshot(data);
      setMessage('Notes saved.');
    } catch (err) {
      console.error(err);
      setError('Could not save notes.');
    }
  }

  function handleDeleteClick(lead) {
    setDeleteDialogLead(lead);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteDialogLead) return;
    try {
      setError('');
      setMessage('');
      await deleteLead(deleteDialogLead.id);
      const data = await loadLeads();
      await syncCsvSnapshot(data);
      setMessage('Lead deleted.');
    } catch (err) {
      console.error(err);
      setError('Could not delete lead.');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteDialogLead(null);
    }
  }

  async function handleBulkAdd(rows) {
    try {
      setError('');
      for (const row of rows) {
        await createLead(row);
      }
      const data = await loadLeads();
      await syncCsvSnapshot(data);
      setMessage(`${rows.length} lead(s) added.`);
    } catch (err) {
      console.error(err);
      setError('Could not add leads.');
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = toLeadInput(form);

      if (editingId) {
        await updateLead(editingId, payload);
      } else {
        await createLead(payload);
      }

      const data = await loadLeads();
      try {
        await syncCsvSnapshot(data);
        setMessage(editingId ? 'Lead updated in Supabase and synced to CSV.' : 'Lead saved in Supabase and synced to CSV.');
      } catch (syncError) {
        console.error(syncError);
        setMessage(editingId ? 'Lead updated in Supabase, but CSV sync failed.' : 'Lead saved in Supabase, but CSV sync failed.');
      }
      resetFormState();
      setView('dashboard');
    } catch (saveError) {
      console.error(saveError);
      setError(saveError?.message || 'Save failed. Check your lead values and Supabase table setup.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditLead(id, quickPatch) {
    if (quickPatch && typeof quickPatch === 'object') {
      try {
        setError('');
        setMessage('');
        const lead = await getLead(id);
        const merged = { ...lead, ...quickPatch };
        await updateLead(id, merged);
        const data = await loadLeads();
        await syncCsvSnapshot(data);
        setMessage('Follow-up updated.');
      } catch (loadError) {
        console.error(loadError);
        setError('Could not update follow-up.');
      }
      return;
    }

    try {
      const lead = await getLead(id);
      setForm(toFormState(lead));
      setEditingId(id);
      setView('edit');
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load that lead for editing.');
    }
  }

  async function handleImport(file, parsedRows) {
    setImporting(true);
    setMessage('');
    setError('');

    try {
      const rows = parsedRows || (await parseCsvFile(file));
      const result = await importLeads(rows);
      const data = await loadLeads();
      const summary = `${result.insertedCount} rows imported.`;

      try {
        await syncCsvSnapshot(data);
        setMessage(`${summary} CSV sync completed.`);
      } catch (syncError) {
        console.error(syncError);
        setMessage(`${summary} CSV sync failed.`);
      }
      setView('dashboard');
    } catch (importError) {
      console.error(importError);
      setError(importError?.message || 'Import failed. Check the file values and your Supabase table rules.');
    } finally {
      setImporting(false);
    }
  }

  function resetFilters() {
    setFollowFilter(null);
    setStageFilter(null);
    setPriorityFilter(null);
    setSearch('');
  }

  function handleCancelLeadForm() {
    resetFormState();
    setView('dashboard');
  }

  const topbarConfig = {
    dashboard: {
      title: 'Lead Management',
      subtitle: 'Pipeline workspace',
      actionLabel: 'Quick Action',
    },
    add: {
      title: 'Lead Management',
      subtitle: 'New opportunity',
      actionLabel: 'Create Lead',
    },
    edit: {
      title: 'Lead Management',
      subtitle: 'Update opportunity',
      actionLabel: 'Save Changes',
    },
    import: {
      title: 'Import Center',
      subtitle: 'Bulk data intake',
      actionLabel: 'Import Tools',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activeView={view}
        onNavigate={navigateTo}
        notificationsEnabled={notificationsEnabled}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen px-4 py-4 md:ml-[248px] md:px-6">
        <Topbar
          {...topbarConfig[view]}
          downloadUrl={getCsvDownloadUrl()}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        {view === 'dashboard' ? (
          <DashboardPage
            leads={leads}
            loading={loading}
            search={search}
            setSearch={setSearch}
            followFilter={followFilter}
            setFollowFilter={setFollowFilter}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            onResetFilters={resetFilters}
            onEditLead={handleEditLead}
            onOpenNotes={handleOpenNotes}
            onDeleteLead={handleDeleteClick}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handlePageChange}
          />
        ) : null}

        {view === 'add' ? (
          <LeadFormPage
            mode="add"
            form={form}
            saving={saving}
            onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
            onSubmit={handleSave}
            onCancel={handleCancelLeadForm}
            onOpenBulkAdd={() => setBulkAddOpen(true)}
          />
        ) : null}

        {view === 'edit' ? (
          <LeadFormPage
            mode="edit"
            form={form}
            saving={saving}
            onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
            onSubmit={handleSave}
            onCancel={handleCancelLeadForm}
          />
        ) : null}

        {view === 'import' ? <ImportPage loading={importing} onImport={handleImport} /> : null}
      </main>

      {noteDialogLead && (
        <NoteDialog
          lead={noteDialogLead}
          isOpen={noteDialogOpen}
          onOpenChange={(open) => {
            setNoteDialogOpen(open);
            if (!open) setNoteDialogLead(null);
          }}
          onSave={handleSaveNotes}
        />
      )}

      <BulkAddDialog
        isOpen={bulkAddOpen}
        onOpenChange={(open) => {
          setBulkAddOpen(open);
          if (!open) resetFormState();
        }}
        onSave={handleBulkAdd}
      />

      {deleteDialogOpen && deleteDialogLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setDeleteDialogOpen(false); setDeleteDialogLead(null); }} />
          <div className="relative z-50 mx-4 w-full max-w-sm rounded-[28px] border border-slate-200 bg-white shadow-xl">
            <div className="rounded-t-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-5">
              <h3 className="text-lg font-bold tracking-tight text-white">Delete Lead</h3>
            </div>
            <div className="p-6">
              <p className="text-sm leading-7 text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">{deleteDialogLead.name}</strong>? This cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  onClick={() => { setDeleteDialogOpen(false); setDeleteDialogLead(null); }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500"
                  onClick={handleConfirmDelete}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
