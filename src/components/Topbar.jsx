import { Download, Menu, Moon, Search, Sun } from 'lucide-react';

export default function Topbar({
  title = 'Lead Management',
  subtitle = 'Workspace',
  actionLabel = 'Quick Action',
  onToggleSidebar,
  downloadUrl,
  theme,
  onToggleTheme,
}) {
  return (
    <header className="sticky top-0 z-30 mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:flex-1">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          onClick={onToggleSidebar}
          type="button"
        >
          <Menu className="h-4 w-4" />
        </button>

        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
            placeholder="Search leads, companies..."
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:justify-end">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          type="button"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <a
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href={downloadUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </a>
      </div>
    </header>
  );
}
