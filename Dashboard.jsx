import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import Topbar, { PlatformTabs } from '../components/Topbar'
import CommentCard from '../components/CommentCard'
import { useState } from 'react'

function StatCard({ label, value, change, changeDown }) {
  return (
    <div className="card card-hover p-5">
      <div className="section-label mb-2">{label}</div>
      <div className="font-display text-[32px] font-bold tracking-[-1px] text-ink mb-1">
        {value}
      </div>
      <div className={`text-[12px] font-semibold ${changeDown ? 'text-red-500' : 'text-green-600'}`}>
        {change}
      </div>
    </div>
  )
}

function StageCard({ icon, count, name, desc, borderColor }) {
  return (
    <div className={`card p-4 text-center border-t-[3px] ${borderColor}`}>
      <div className="text-[22px] mb-1.5">{icon}</div>
      <div className="font-display text-[28px] font-bold tracking-tight text-ink mb-0.5">
        {count}
      </div>
      <div className="text-[13px] font-bold text-ink mb-1">{name}</div>
      <div className="text-[11px] text-ink-3 leading-snug">{desc}</div>
    </div>
  )
}

export default function Dashboard() {
  const { comments, pendingCount } = useWorkspace()
  const navigate = useNavigate()
  const [platformFilter, setPlatformFilter] = useState('All')

  const escalations  = comments.filter(c => c.stage === 'escalation')
  const emailHold    = comments.filter(c => c.stage === 'email_hold')
  const awaiting     = comments.filter(c => c.stage === 'awaiting')
  const autoHandled  = comments.filter(c => c.stage === 'auto')

  // Top 3 urgent for the dashboard preview
  const needsAttention = comments
    .filter(c => ['escalation', 'email_hold', 'awaiting'].includes(c.stage))
    .slice(0, 3)

  // Filter auto-handled by platform if needed
  const filteredAuto = platformFilter === 'All'
    ? autoHandled
    : autoHandled.filter(c => c.platform === platformFilter.toLowerCase())

  const emailLog = comments.filter(c => c.emailSent)

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        right={
          <div className="flex items-center gap-3">
            <PlatformTabs active={platformFilter} onChange={setPlatformFilter} />
            <div className="relative w-9 h-9 border border-border rounded-lg bg-white
                            flex items-center justify-center text-base cursor-pointer
                            hover:bg-off transition-colors">
              🔔
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
            <button
              onClick={() => navigate('/queue')}
              className="btn-accent text-[13px] px-3.5 py-2"
            >
              View Queue →
            </button>
          </div>
        }
      />

      <div className="p-7 flex-1">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          <StatCard label="Pending Replies"     value={pendingCount}       change="↑ 3 new this hour" />
          <StatCard label="Auto-Resolved Today" value={autoHandled.length} change="↑ 12% vs yesterday" />
          <StatCard label="Avg. Response Time"  value="4m"                 change="↓ from 43 min avg" />
          <StatCard label="Emails Sent"         value={emailLog.length}    change="↑ 2 urgent" changeDown />
        </div>

        {/* Approval Stages */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">
            Approval Stages
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-7">
          <StageCard
            icon="⚡" count={autoHandled.length}
            name="Auto-Posted" borderColor="border-t-green-500"
            desc="Praise, simple FAQs, spam ignored. No human needed."
          />
          <StageCard
            icon="👁" count={awaiting.length}
            name="Awaiting Approval" borderColor="border-t-blue-500"
            desc="Complex queries. Draft ready, needs 1 click."
          />
          <StageCard
            icon="📧" count={emailHold.length}
            name="Email Sent + Hold" borderColor="border-t-amber-500"
            desc="Service issues. Email dispatched. Reply on hold."
          />
          <StageCard
            icon="🚨" count={escalations.length}
            name="Escalation" borderColor="border-t-red-500"
            desc="PR risk. Full manual review required."
          />
        </div>

        {/* Two-column: Needs attention + right panel */}
        <div className="grid grid-cols-2 gap-5">

          {/* Left: needs attention */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">
                Needs Attention
                <span className="font-body text-[13px] text-ink-3 font-normal ml-2">
                  · {needsAttention.length} items
                </span>
              </h2>
              <button
                onClick={() => navigate('/queue')}
                className="btn-ghost text-[12px] px-3 py-1.5"
              >
                See all
              </button>
            </div>
            {needsAttention.length === 0
              ? (
                <div className="card p-10 text-center text-ink-3">
                  <div className="text-4xl mb-3">🎉</div>
                  <div className="font-display font-bold text-ink mb-1">All clear!</div>
                  <div className="text-[13px]">No comments need attention right now.</div>
                </div>
              )
              : needsAttention.map(c => (
                <CommentCard key={c.id} comment={c} compact showDraft />
              ))
            }
          </div>

          {/* Right: auto-handled + email log */}
          <div>
            <div className="mb-3">
              <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">
                Auto-Handled
                <span className="font-body text-[13px] text-ink-3 font-normal ml-2">· today</span>
              </h2>
            </div>
            <div className="card p-4 mb-5">
              {filteredAuto.length === 0
                ? <p className="text-[13px] text-ink-3 text-center py-4">None yet today.</p>
                : filteredAuto.map(c => (
                  <div key={c.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg mb-2
                               bg-green-50 border border-green-100">
                    <span className="text-[16px]">⚡</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-ink truncate">
                        {c.author} — "{c.text.slice(0, 40)}…"
                      </div>
                      <div className="text-[11px] text-ink-3">
                        Auto-replied · {c.platform.toUpperCase()} · {c.time}
                      </div>
                    </div>
                    <span className="badge badge-auto flex-shrink-0">Posted</span>
                  </div>
                ))
              }
            </div>

            <div className="mb-3">
              <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">
                Email Log
                <span className="font-body text-[13px] text-ink-3 font-normal ml-2">· today</span>
              </h2>
            </div>
            <div className="card overflow-hidden">
              {emailLog.length === 0
                ? <p className="text-[13px] text-ink-3 text-center py-6">No emails sent today.</p>
                : emailLog.map((c, i) => (
                  <div key={c.id}
                    className={`flex items-center gap-3 px-4 py-3.5
                                ${i < emailLog.length - 1 ? 'border-b border-border' : ''}`}>
                    <span className="text-[16px]">📧</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-ink">
                        Service ticket — {c.author}
                      </div>
                      <div className="text-[11px] text-ink-3">
                        To: service@chiq.com · CC: marketing team · {c.time}
                      </div>
                    </div>
                    <span className={`badge ${c.stage === 'escalation' ? 'badge-urgent' : 'badge-service'}`}>
                      {c.stage === 'escalation' ? 'Urgent' : 'Service'}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
