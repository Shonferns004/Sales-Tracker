import { useEffect, useState } from 'react';
import { createLead, getLead, importLeads, listLeads, updateLead } from './lib/leads';
import { getCsvDownloadUrl, syncCsv } from './lib/csvApi';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import LeadFormPage from './pages/LeadFormPage';
import ImportPage from './pages/ImportPage';
import { emptyForm, toFormState, toLeadInput } from './utils/form';
import { parseCsvFile } from './utils/csv';
import { useLeadNotifications } from './hooks/useLeadNotifications';

export default function App() {
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(typeof Notification !== 'undefined' && Notification.permission === 'granted');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useLeadNotifications(leads);

  async function loadLeads() {
    try {
      setError('');
      const data = await listLeads();
      setLeads(data);
      return data;
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load leads. Check your Supabase keys and the leads table setup.');
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }
    if (Notification.permission !== 'default') {
      setNotificationsEnabled(false);
      return;
    }

    Notification.requestPermission()
      .then((permission) => {
        setNotificationsEnabled(permission === 'granted');
      })
      .catch((requestError) => {
        console.error(requestError);
        setNotificationsEnabled(false);
      });
  }, []);

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

  async function handleEditLead(id) {
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
    </div>
  );
}
