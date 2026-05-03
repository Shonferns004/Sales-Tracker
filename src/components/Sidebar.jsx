import { Bell, FileUp, LayoutDashboard, PlusSquare, X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', sublabel: 'Overview', icon: LayoutDashboard },
  { id: 'add', label: 'Leads', sublabel: 'Create record', icon: PlusSquare },
  { id: 'import', label: 'Import CSV', sublabel: 'Bulk upload', icon: FileUp },
];

export default function Sidebar({ activeView, onNavigate, notificationsEnabled, isOpen, onClose }) {
  return (
    <>
      <button
        aria-label="Close sidebar"
        className={`fixed inset-0 z-40 bg-slate-950/40 transition md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-col border-r border-slate-200 bg-white/95 px-4 py-6 shadow-sm backdrop-blur transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              SF
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-slate-900">Elite CRM</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Enterprise</p>
            </div>
          </div>
          <button
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 rounded-[24px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-lg shadow-slate-900/10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">Control Center</p>
          <p className="mt-2 text-lg font-semibold">Keep the pipeline moving.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Dashboard, add, and import now share the same premium workspace styling.</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className={`mt-1 block text-xs ${active ? 'text-slate-300' : 'text-slate-400'}`}>{item.sublabel}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${notificationsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Browser reminders</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {notificationsEnabled ? 'Notifications are active' : 'Notifications are unavailable or blocked'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Permission is requested automatically when the website loads.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <div className="rounded-xl px-4 py-2">Support</div>
          <div className="rounded-xl px-4 py-2">Logout</div>
        </div>
      </aside>
    </>
  );
}
