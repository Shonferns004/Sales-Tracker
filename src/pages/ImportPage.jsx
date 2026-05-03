import { useRef, useState } from 'react';
import { ArrowUpRight, FileSpreadsheet, FolderUp, ShieldCheck, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/date';
import { parseCsvFile } from '../utils/csv';

const recentImports = [
  { fileName: 'Q4_Midwest_Prospects.csv', status: 'Success', leadsAdded: '1,248', date: 'Oct 12, 2023' },
  { fileName: 'TechCrunch_Event_List.xlsx', status: 'Partial', leadsAdded: '892', date: 'Oct 09, 2023' },
];

export default function ImportPage({ loading, onImport }) {
  const [preview, setPreview] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadError('');
      const rows = await parseCsvFile(file);
      if (!rows.length) {
        throw new Error('No usable rows were found. Completely empty rows are skipped.');
      }
      setSelectedFile(file);
      setPreview([...rows].sort((a, b) => String(b.createdDate || '').localeCompare(String(a.createdDate || ''))));
    } catch (error) {
      setSelectedFile(null);
      setPreview([]);
      setUploadError(error instanceof Error ? error.message : 'Could not read the selected file.');
      event.target.value = '';
    }
  }

  async function handleExecuteImport() {
    if (!selectedFile) return;
    await onImport(selectedFile, preview);
    setSelectedFile(null);
    setPreview([]);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 shadow-xl shadow-slate-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl px-6 py-8 md:px-8 md:py-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Lead Acceleration
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">Import Data</h1>
            <p className="mt-4 text-base leading-8 text-slate-200">
              Bring your external lead data into the pipeline seamlessly. We support bulk CSV and Excel formatting with intelligent date preservation and clean mapping.
            </p>
          </div>

          <div className="mx-6 grid min-w-[260px] grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur md:mx-8">
            <div className="px-6 py-5 text-center">
              <div className="text-5xl font-bold text-white">84%</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Auto-Map Rate</div>
            </div>
            <div className="border-l border-white/10 px-6 py-5 text-center">
              <div className="text-5xl font-bold text-white">2s</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Avg Processing</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Upload Sources</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Import CSV or Excel files and preserve original dates.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_340px]">
          <div className="space-y-4">
            <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/40">
              <input
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <FolderUp className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">Drag and drop your files here</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Support for `.csv`, `.xlsx`, and `.xls` files with mixed headers, blank cells, and uneven formatting.
              </p>
              <span className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white">
                Choose File
              </span>
            </label>

            {uploadError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{uploadError}</div>
            ) : null}

            <div className="flex flex-col gap-4 xl:flex-row">
              <div className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 ${selectedFile ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{selectedFile ? selectedFile.name : 'No file selected'}</p>
                  <p className="mt-1 text-xs text-slate-400">{selectedFile ? `${Math.max(1, Math.round(selectedFile.size / 1024))} KB` : '--- KB'}</p>
                </div>
              </div>

              <button
                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedFile || loading}
                onClick={handleExecuteImport}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  {loading ? 'Importing...' : 'Execute Import'}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Requirements</h4>
              <ul className="mt-4 space-y-4 text-sm leading-7 text-slate-500">
                <li><span className="mr-2 text-blue-600">•</span>Name and phone can be blank. Completely empty rows are skipped.</li>
                <li><span className="mr-2 text-blue-600">•</span>Dates are preserved in <strong>ISO format</strong> automatically when possible.</li>
                <li><span className="mr-2 text-blue-600">•</span>Imported rows from CSV or Excel are synced back into the same backend CSV file after database save.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">Pro Tip</h4>
              <p className="mt-3 text-sm leading-7 text-amber-900/80">Messy headers like `Phone Number`, `mobile_number`, `Lead Name`, or `Follow Up Date` are accepted now.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Security Note</h4>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-500">Files are processed for import only. The app rewrites the synced CSV snapshot in the backend after completion.</p>
            </div>
          </div>
        </div>
      </section>

      {preview.length > 0 ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Preview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Incoming rows detected from the selected file.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {preview.slice(0, 6).map((lead, index) => (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={`${lead.name || 'blank'}-${lead.phone || 'blank'}-${index}`}>
                <p className="text-sm font-semibold text-slate-900">{lead.name || 'No name'}</p>
                <p className="mt-2 text-sm text-slate-500">{lead.phone || 'No phone'}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {lead.createdDate || 'No created date'} | {formatDate(lead.followUpDate)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Recent Activity</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Recent imports in the workspace.</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['File Name', 'Status', 'Leads Added', 'Date'].map((header) => (
                  <th key={header} className="px-3 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentImports.map((item) => (
                <tr className="border-b border-slate-100" key={item.fileName}>
                  <td className="px-3 py-4 text-sm font-medium text-slate-900">{item.fileName}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">{item.leadsAdded}</td>
                  <td className="px-3 py-4 text-sm text-slate-600">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
