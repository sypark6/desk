import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import Topbar from '../components/Topbar'

const STAGE_BADGE = {
  escalation: 'badge-urgent',
  email_hold: 'badge-service',
  awaiting:   'badge-product',
  auto:       'badge-auto',
}

const STAGE_LABEL = {
  escalation: 'Escalation · PR Risk',
  email_hold: 'Service Issue',
  awaiting:   'Awaiting Approval',
  auto:       'Auto-handled',
}

const PLATFORM_LABEL = {
  fb: 'Facebook', ig: 'Instagram', li: 'LinkedIn', tt: 'TikTok',
}

const TONES = ['Empathetic', 'Professional', 'Apologetic', 'Friendly', 'Concise']

export default function CommentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { comments, approveComment, updateDraft, dismissComment } = useWorkspace()

  const comment = comments.find(c => c.id === id)

  const [draft, setDraft]         = useState(comment?.draftReply ?? '')
  const [activeTone, setActiveTone] = useState('Empathetic')
  const [approved, setApproved]   = useState(false)

  if (!comment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar subtitle="· Comment not found" />
        <div className="flex-1 flex items-center justify-center text-ink-3">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <div className="font-display font-bold text-xl text-ink mb-2">Comment not found</div>
            <button onClick={() => navigate('/queue')} className="btn-ghost mt-3">
              ← Back to Queue
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleApprove = () => {
    updateDraft(comment.id, draft)
    approveComment(comment.id)
    setApproved(true)
    setTimeout(() => navigate('/queue'), 1200)
  }

  const handleDiscard = () => {
    dismissComment(comment.id)
    navigate('/queue')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/queue')} className="btn-ghost text-[13px] px-3 py-1.5">
              ← Back
            </button>
            <span className={`badge ${STAGE_BADGE[comment.stage]}`}>
              <span className="badge-dot" />
              {STAGE_LABEL[comment.stage]}
            </span>
            <span className="badge badge-neutral">
              {PLATFORM_LABEL[comment.platform]} · {comment.contentType}
            </span>
          </div>
        }
      />

      {approved && (
        <div className="mx-7 mt-5 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5
                        text-green-700 font-semibold text-[14px] flex items-center gap-2">
          ✓ Reply approved and posted. Redirecting…
        </div>
      )}

      <div className="p-7 flex-1">
        <div className="grid grid-cols-[1fr_360px] gap-5">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Original comment */}
            <div className="card p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center
                                text-white font-bold text-lg flex-shrink-0"
                     style={{ background: comment.avatarGradient }}>
                  {comment.initials}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[15px] text-ink">{comment.author}</div>
                  <div className="text-[12px] text-ink-3">
                    {PLATFORM_LABEL[comment.platform]} · {comment.time}
                  </div>
                </div>
                <span className={`badge ${STAGE_BADGE[comment.stage]}`}>
                  <span className="badge-dot" />
                  {STAGE_LABEL[comment.stage]}
                </span>
              </div>

              {/* Comment bubble */}
              <div className="bg-off rounded-xl p-4 border-l-[3px] border-accent
                              text-[15px] leading-relaxed text-ink mb-4">
                "{comment.text}"
              </div>

              {/* Analysis chips */}
              <div className="flex gap-2 flex-wrap">
                <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 text-[12px]">
                  <strong className="text-red-600">Sentiment:</strong>{' '}
                  <span className="text-ink-2">
                    {comment.sentiment?.replace('_', ' ') ?? 'Unknown'}
                  </span>
                </div>
                <div className="bg-off-2 border border-border rounded-lg px-3 py-1.5 text-[12px]">
                  <strong className="text-ink">Category:</strong>{' '}
                  <span className="text-ink-2">{STAGE_LABEL[comment.stage]}</span>
                </div>
                <div className="bg-off-2 border border-border rounded-lg px-3 py-1.5 text-[12px]">
                  <strong className="text-ink">Urgency:</strong>{' '}
                  <span className="text-ink-2">
                    {comment.stage === 'escalation' ? 'Immediate' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reply editor */}
            <div className="card p-6 mb-4">
              <div className="font-display text-[15px] font-bold text-ink mb-3">
                ✦ AI Draft Reply
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={5}
                className="input resize-y leading-relaxed mb-3"
              />

              {/* Tone chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {TONES.map(tone => (
                  <button
                    key={tone}
                    onClick={() => setActiveTone(tone)}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border
                                transition-all duration-100
                                ${activeTone === tone
                                  ? 'bg-accent-light border-accent text-accent'
                                  : 'bg-white border-border text-ink-3 hover:border-border-2'
                                }`}
                  >
                    {tone}
                  </button>
                ))}
                <button className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border
                                   border-border text-ink-3 hover:border-border-2 transition-all">
                  ↻ Regenerate
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleApprove}
                  className="btn-accent flex-1 py-2.5 font-display font-semibold"
                >
                  ✓ Approve & Post
                </button>
                <button className="btn-ghost px-4 py-2.5">Save Draft</button>
                <button
                  onClick={handleDiscard}
                  className="btn-ghost px-4 py-2.5 text-red-500 border-red-100 hover:bg-red-50"
                >
                  Discard
                </button>
              </div>
            </div>

            {/* Email draft (if applicable) */}
            {comment.emailSent && (
              <div className="card p-6">
                <div className="font-display text-[15px] font-bold text-ink mb-1">
                  📧 Service Email
                </div>
                <div className="text-[12px] text-ink-3 mb-4">
                  Auto-drafted and sent at time of receipt.
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-3">
                    📧 Sent to Service Team
                  </div>
                  <div className="space-y-1.5 text-[13px] mb-3">
                    <div className="flex gap-2">
                      <span className="text-ink-3 font-semibold w-6">To:</span>
                      <span className="text-ink-2">service@chiq.com</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-ink-3 font-semibold w-6">CC:</span>
                      <span className="text-ink-2">marketing1@chiq.com, marketing2@chiq.com</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-ink-3 font-semibold w-6">Sub:</span>
                      <span className="text-ink-2 font-semibold">
                        [URGENT] Customer complaint — {comment.platform.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-amber-200 pt-3 text-[13px] text-ink-2 leading-relaxed">
                    Hi team,<br /><br />
                    Customer <strong>{comment.author}</strong> has posted a complaint on our{' '}
                    {PLATFORM_LABEL[comment.platform]} page.{' '}
                    {comment.stage === 'escalation' && 'PR risk — please prioritise within 2 hours.'}<br /><br />
                    — CHiQ Desk AI
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            <div className="card p-5 mb-4">
              <div className="section-label">Comment Info</div>
              <div className="space-y-3 text-[13.5px]">
                {[
                  ['Platform',      PLATFORM_LABEL[comment.platform]],
                  ['Content type',  comment.contentType],
                  ['Time received', comment.time],
                  ['Tone group',    comment.toneGroup],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-ink-3">{k}</span>
                    <span className="font-semibold text-ink">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-ink-3">Stage</span>
                  <span className={`badge ${STAGE_BADGE[comment.stage]}`}>
                    <span className="badge-dot" />
                    {STAGE_LABEL[comment.stage]}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-5 mb-4">
              <div className="section-label">AI Analysis</div>
              <div className="text-[13px] text-ink-2 leading-relaxed space-y-2">
                {comment.stage === 'escalation' && (
                  <div>🔴 <strong>PR Risk:</strong> Public threat to share widely.</div>
                )}
                <div>
                  😤 <strong>Sentiment:</strong>{' '}
                  {comment.sentiment?.replace('_', ' ') ?? 'Unknown'}
                </div>
                <div>
                  ⏱ <strong>Recommended action:</strong>{' '}
                  {comment.stage === 'escalation' ? 'Reply within 5 minutes.' : 'Reply within 10 minutes.'}
                </div>
                {comment.emailSent && (
                  <div>📧 <strong>Email:</strong> Auto-sent on receipt.</div>
                )}
                {comment.aiNote && (
                  <div className="mt-2 text-[12px] text-ink-3 bg-off rounded-lg p-3 leading-snug">
                    {comment.aiNote}
                  </div>
                )}
              </div>
            </div>

            <div className="card p-5">
              <div className="section-label">Reply History</div>
              <div className="text-[13px] text-ink-3 text-center py-5">
                No previous interactions with this user.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
