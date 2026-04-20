import { useLocation } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'

// Map routes → page titles
const PAGE_META = {
  '/dashboard': { title: 'Dashboard' },
  '/queue':     { title: 'Approval Queue' },
  '/facebook':  { title: 'Facebook',  chip: { label: '𝑓 Facebook',  className: 'bg-blue-50 text-blue-600' } },
  '/instagram': { title: 'Instagram', chip: { label: '◎ Instagram', className: 'bg-pink-50 text-pink-600' } },
  '/linkedin':  { title: 'LinkedIn',  chip: { label: 'in LinkedIn',  className: 'bg-sky-50 text-sky-700' } },
  '/tiktok':    { title: 'TikTok',    chip: { label: '♪ TikTok',    className: 'bg-gray-100 text-gray-700' } },
  '/training':  { title: 'AI Training' },
  '/team':      { title: 'Team & Permissions' },
  '/settings':  { title: 'Settings' },
}

// Reusable platform tab bar (used on Dashboard + Queue + platform pages)
export function PlatformTabs({ active, onChange, options = ['All', 'FB', 'IG', 'LI', 'TT'] }) {
  return (
    <div className="flex gap-1 bg-off border border-border rounded-[9px] p-0.5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3.5 py-1.5 rounded-[7px] text-[13px] font-semibold transition-all duration-100
            ${active === opt
              ? 'bg-white text-ink shadow-sm'
              : 'text-ink-3 hover:text-ink'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// Notification bell with red dot
function NotifBell({ count }) {
  return (
    <div className="relative w-9 h-9 border border-border rounded-lg bg-white
                    flex items-center justify-center text-base cursor-pointer
                    hover:bg-off transition-colors">
      🔔
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
      )}
    </div>
  )
}

export default function Topbar({ subtitle, right }) {
  const { pathname } = useLocation()
  const { pendingCount } = useWorkspace()

  // Match on base path (ignore sub-routes like /settings/branding)
  const base = '/' + pathname.split('/')[1]
  const meta = PAGE_META[base] ?? { title: 'CHiQ Desk' }

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center
                       px-7 gap-4 sticky top-0 z-40">
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        {meta.chip && (
          <span className={`px-2.5 py-1 rounded-md text-[13px] font-bold ${meta.chip.className}`}>
            {meta.chip.label}
          </span>
        )}
        <span className="font-display text-[18px] font-bold tracking-tight text-ink">
          {meta.title}
        </span>
        {subtitle && (
          <span className="text-[13px] text-ink-3 ml-1">{subtitle}</span>
        )}
        {base === '/dashboard' && (
          <span className="text-[13px] text-ink-3 ml-1">· {today}</span>
        )}
      </div>

      {/* Right slot — passed in per page, or default bell */}
      <div className="ml-auto flex items-center gap-3">
        {right ?? <NotifBell count={pendingCount} />}
      </div>
    </header>
  )
}
