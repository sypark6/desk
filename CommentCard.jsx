import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'

const STAGE_CONFIG = {
  escalation: {
    badgeClass: 'badge-urgent',
    cardBorder: 'border-l-[3px] border-l-red-500',
    label: 'Escalation',
  },
  email_hold: {
    badgeClass: 'badge-service',
    cardBorder: 'border-l-[3px] border-l-amber-500',
    label: 'Service Issue',
  },
  awaiting: {
    badgeClass: 'badge-product',
    cardBorder: 'border-l-[3px] border-l-blue-500',
    label: 'Awaiting Approval',
  },
  auto: {
    badgeClass: 'badge-auto',
    cardBorder: 'border-l-[3px] border-l-green-500',
    label: 'Auto-handled',
  },
  praise: {
    badgeClass: 'badge-praise',
    cardBorder: 'border-l-[3px] border-l-purple-400',
    label: 'Praise',
  },
}

const PLATFORM_CHIP = {
  fb: <span className="chip-fb">FB</span>,
  ig: <span className="chip-ig">IG</span>,
  li: <span className="chip-li">LI</span>,
  tt: <span className="chip-tt">TT</span>,
}

const DRAFT_BOX = {
  escalation: 'bg-red-50 border-red-100 text-red-800',
  email_hold: 'bg-amber-50 border-amber-100 text-amber-800',
  awaiting:   'bg-blue-50 border-blue-100 text-blue-800',
}

// compact = smaller version for dashboard, full = queue/platform pages
export default function CommentCard({ comment, compact = false, showDraft = false }) {
  const { approveComment, dismissComment } = useWorkspace()
  const navigate = useNavigate()
  const cfg = STAGE_CONFIG[comment.stage] ?? STAGE_CONFIG.auto

  const handleApprove = (e) => {
    e.stopPropagation()
    approveComment(comment.id)
  }

  const handleDismiss = (e) => {
    e.stopPropagation()
    dismissComment(comment.id)
  }

  const handleClick = () => {
    if (comment.stage !== 'auto') navigate(`/queue/${comment.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white border border-border ${cfg.cardBorder}
                  rounded-xl2 p-5 mb-3 transition-all duration-150 animate-fade-up
                  ${comment.stage !== 'auto' ? 'cursor-pointer hover:border-accent hover:shadow-card' : ''}
                  ${compact ? 'p-4' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                     text-white font-bold text-sm"
          style={{ background: comment.avatarGradient }}
        >
          {comment.initials}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[14px] text-ink mb-0.5">{comment.author}</div>
          <div className="flex items-center gap-2 text-[12px] text-ink-3 flex-wrap">
            {PLATFORM_CHIP[comment.platform]}
            <span className="bg-off-2 text-ink-3 text-[11px] font-semibold px-2 py-0.5 rounded">
              {comment.contentType}
            </span>
            <span>{comment.time}</span>
          </div>
        </div>

        {/* Stage badge */}
        <span className={`badge ${cfg.badgeClass} flex-shrink-0`}>
          <span className="badge-dot" />
          {cfg.label}
        </span>
      </div>

      {/* Comment text */}
      <p className="text-[14px] text-ink-2 leading-relaxed pl-12 mb-3">
        {compact && comment.text.length > 120
          ? comment.text.slice(0, 120) + '…'
          : comment.text
        }
      </p>

      {/* AI draft (shown when showDraft=true and stage warrants it) */}
      {showDraft && comment.draftReply && DRAFT_BOX[comment.stage] && (
        <div className={`border rounded-lg px-3.5 py-2.5 ml-12 mb-3 text-[12.5px] leading-relaxed
                         ${DRAFT_BOX[comment.stage]}`}>
          <span className="font-bold mr-1">AI Draft:</span>
          {comment.draftReply}
        </div>
      )}

      {/* AI note for escalations */}
      {showDraft && comment.stage === 'escalation' && comment.aiNote && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 ml-12 mb-3
                        text-[12.5px] text-red-700">
          🚨 <span className="font-bold">AI Note:</span> {comment.aiNote}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center pl-12 gap-3">
        {/* Email sent indicator */}
        {comment.emailSent && (
          <span className="text-[12px] text-green-600 font-semibold">
            📧 Email sent to service team
          </span>
        )}

        {/* Auto posted */}
        {comment.autoPosted && (
          <span className="text-[12px] text-green-600 font-semibold">
            ⚡ Auto-replied {comment.time}
          </span>
        )}

        {/* Actions */}
        {!comment.autoPosted && (
          <div className="ml-auto flex gap-2">
            {['escalation', 'email_hold', 'awaiting'].includes(comment.stage) && (
              <>
                <button
                  onClick={handleApprove}
                  className="btn-approve text-[12px] px-3 py-1.5"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/queue/${comment.id}`) }}
                  className="btn-ghost text-[12px] px-3 py-1.5"
                >
                  Edit
                </button>
                <button
                  onClick={handleDismiss}
                  className="btn-reject text-[12px] px-3 py-1.5"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
