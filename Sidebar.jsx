import { NavLink, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'

const NAV = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: '⊞', badgeKey: 'pending' },
      { to: '/queue',     label: 'Approval Queue', icon: '◫', badgeKey: 'queue' },
    ],
  },
  {
    section: 'Platforms',
    items: [
      { to: '/facebook',  label: 'Facebook',  icon: '𝑓' },
      { to: '/instagram', label: 'Instagram', icon: '◎' },
      { to: '/linkedin',  label: 'LinkedIn',  icon: 'in' },
      { to: '/tiktok',    label: 'TikTok',    icon: '♪' },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { to: '/training',    label: 'AI Training',   icon: '✦' },
      { to: '/tone-groups', label: 'Tone Groups',   icon: '◈' },
    ],
  },
  {
    section: 'Admin',
    items: [
      { to: '/team',     label: 'Team & Permissions', icon: '◻' },
      { to: '/settings', label: 'Settings',           icon: '⊙' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout, workspace, comments, pendingCount } = useWorkspace()
  const navigate = useNavigate()

  const escalationCount = comments.filter(c => c.stage === 'escalation').length
  const queueCount = comments.filter(c =>
    ['escalation', 'email_hold', 'awaiting'].includes(c.stage)
  ).length

  const getBadge = (key) => {
    if (key === 'pending') return escalationCount > 0 ? escalationCount : null
    if (key === 'queue')   return queueCount > 0 ? queueCount : null
    return null
  }

  const getBadgeColor = (key) => {
    if (key === 'pending') return 'bg-red-500'
    if (key === 'queue')   return 'bg-amber-500'
    return 'bg-accent'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 bg-[#0f0f0d] flex flex-col fixed top-0 left-0 bottom-0 z-50">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8 flex items-center gap-2.5">
        {workspace.logo
          ? <img src={workspace.logo} alt="logo" className="w-8 h-8 rounded-lg object-contain bg-white" />
          : (
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center
                            font-display text-white text-xs font-bold flex-shrink-0">
              CQ
            </div>
          )
        }
        <div>
          <div className="font-display text-white text-base font-semibold leading-tight tracking-tight">
            {workspace.name}
          </div>
          <div className="text-white/40 text-[11px] font-light">Social Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV.map(group => (
          <div key={group.section} className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/30
                            px-2 mb-1.5">
              {group.section}
            </div>
            {group.items.map(item => {
              const badge = item.badgeKey ? getBadge(item.badgeKey) : null
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-[13.5px]
                     font-medium transition-all duration-100 no-underline
                     ${isActive
                       ? 'bg-accent/25 text-white'
                       : 'text-white/55 hover:bg-white/7 hover:text-white/85'
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`w-5 text-center text-base flex-shrink-0
                        ${isActive ? 'text-accent' : ''}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {badge && (
                        <span className={`text-white text-[10px] font-bold
                                         px-1.5 py-0.5 rounded-full min-w-[18px]
                                         text-center ${getBadgeColor(item.badgeKey)}`}>
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg
                        hover:bg-white/7 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                          text-white text-sm font-bold"
               style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">{user?.name}</div>
            <div className="text-white/40 text-[11px] truncate">
              {user?.role?.replace('_', ' ')} · Full Access
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 text-white/40
                       hover:text-white/80 text-xs transition-all"
            title="Sign out"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}
