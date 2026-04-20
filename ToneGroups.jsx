import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'

const GROUP_COLORS = {
  reels:      { bg: 'bg-pink-50',   border: 'border-pink-200',  text: 'text-pink-700',  active: 'bg-pink-600'   },
  casual_dm:  { bg: 'bg-purple-50', border: 'border-purple-200',text: 'text-purple-700',active: 'bg-purple-600' },
  feed:       { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',  active: 'bg-blue-600'   },
  linkedin:   { bg: 'bg-sky-50',    border: 'border-sky-200',   text: 'text-sky-700',   active: 'bg-sky-600'    },
}

function RuleItem({ rule, index, onRemove }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-off rounded-xl
                    border border-border group hover:border-border-2 transition-colors">
      <span className="text-green-500 text-base flex-shrink-0">✓</span>
      <span className="text-[13.5px] text-ink-2 flex-1 leading-snug">{rule}</span>
      <button
        onClick={() => onRemove(index)}
        className="opacity-0 group-hover:opacity-100 transition-opacity
                   text-ink-3 hover:text-red-500 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

function AddRuleInput({ onAdd }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add a tone rule..."
        className="input flex-1 text-[13px] py-2"
      />
      <button type="submit" className="btn-accent px-4 py-2 text-[13px]">
        + Add
      </button>
    </form>
  )
}

export default function ToneGroups() {
  const { toneGroups, updateToneGroup, addToneRule, removeToneRule } = useWorkspace()
  const [activeGroup, setActiveGroup] = useState('reels')
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState('')

  const group = toneGroups[activeGroup]
  const colors = GROUP_COLORS[activeGroup] ?? GROUP_COLORS.feed

  const handleDescEdit = () => {
    setDescDraft(group.description)
    setEditingDesc(true)
  }

  const handleDescSave = () => {
    updateToneGroup(activeGroup, { description: descDraft })
    setEditingDesc(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <header className="h-[60px] bg-white border-b border-border flex items-center
                         px-7 gap-4 sticky top-0 z-40">
        <span className="font-display text-[18px] font-bold tracking-tight text-ink">
          Tone Groups
        </span>
        <span className="text-[13px] text-ink-3 ml-1">
          · Define how AI sounds across platform types
        </span>
        <div className="ml-auto">
          <button
            onClick={() => alert('Tone groups saved!')}
            className="btn-accent text-[13px] px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="p-7 flex-1">

        {/* Info banner */}
        <div className="bg-accent-light border border-accent/20 rounded-xl px-5 py-3.5
                        text-[13px] text-accent mb-6 leading-relaxed">
          ✦ <strong>Tone Groups</strong> let you manage reply style by platform type rather than
          per-platform. Changes here affect every AI-generated reply across the grouped platforms.
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-6">

          {/* ── LEFT: Group selector ── */}
          <div>
            <div className="section-label px-1">Platform Groups</div>
            <div className="flex flex-col gap-2">
              {Object.values(toneGroups).map(g => {
                const c = GROUP_COLORS[g.id] ?? GROUP_COLORS.feed
                const isActive = g.id === activeGroup
                return (
                  <button
                    key={g.id}
                    onClick={() => { setActiveGroup(g.id); setEditingDesc(false) }}
                    className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-150
                                ${isActive
                                  ? `${c.bg} ${c.border} shadow-sm`
                                  : 'bg-white border-border hover:border-border-2'
                                }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[20px]">{g.icon}</span>
                      <span className={`font-display font-bold text-[14px] tracking-tight
                                       ${isActive ? c.text : 'text-ink'}`}>
                        {g.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.platforms.map(p => (
                        <span key={p}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                     ${isActive ? `${c.bg} ${c.text}` : 'bg-off-2 text-ink-3'}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {g.rules.length} rule{g.rules.length !== 1 ? 's' : ''}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* What the grouping means */}
            <div className="mt-5 bg-white border border-border rounded-xl p-4">
              <div className="section-label mb-2">Grouping Logic</div>
              <div className="text-[12.5px] text-ink-3 leading-relaxed space-y-2">
                <div>🎬 <strong className="text-ink">Reels & TikTok</strong> — same casual energy</div>
                <div>💬 <strong className="text-ink">All DMs</strong> — same private warmth</div>
                <div>📝 <strong className="text-ink">FB & IG Posts</strong> — same balanced tone</div>
                <div>💼 <strong className="text-ink">LinkedIn</strong> — professional only</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Group editor ── */}
          <div>
            {/* Group header */}
            <div className={`card p-6 mb-5 border-2 ${colors.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[32px]">{group.icon}</span>
                <div>
                  <h2 className={`font-display text-[20px] font-bold tracking-tight ${colors.text}`}>
                    {group.name}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {group.platforms.map(p => (
                      <span key={p}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full
                                   ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description — editable */}
              <div className="mt-2">
                <div className="text-[11px] font-bold tracking-wider uppercase text-ink-3 mb-1.5">
                  Description
                </div>
                {editingDesc ? (
                  <div className="flex gap-2">
                    <input
                      value={descDraft}
                      onChange={e => setDescDraft(e.target.value)}
                      className="input flex-1 text-[13px] py-2"
                      autoFocus
                    />
                    <button onClick={handleDescSave} className="btn-accent px-3 py-2 text-[12px]">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDesc(false)}
                      className="btn-ghost px-3 py-2 text-[12px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-[13.5px] text-ink-2 flex-1">{group.description}</p>
                    <button
                      onClick={handleDescEdit}
                      className="text-[12px] text-ink-3 hover:text-accent transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rules editor */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-[16px] font-bold tracking-tight text-ink">
                    Tone Rules
                  </h3>
                  <p className="text-[12px] text-ink-3 mt-0.5">
                    These rules are injected into every AI prompt for this group.
                  </p>
                </div>
                <span className={`text-[12px] font-bold px-3 py-1 rounded-full
                                 ${colors.bg} ${colors.text}`}>
                  {group.rules.length} active
                </span>
              </div>

              {/* Rules list */}
              <div className="space-y-2 mb-3">
                {group.rules.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border
                                  rounded-xl text-ink-3 text-[13px]">
                    No rules yet. Add one below.
                  </div>
                ) : (
                  group.rules.map((rule, i) => (
                    <RuleItem
                      key={i}
                      rule={rule}
                      index={i}
                      onRemove={(idx) => removeToneRule(activeGroup, idx)}
                    />
                  ))
                )}
              </div>

              <AddRuleInput onAdd={(rule) => addToneRule(activeGroup, rule)} />

              {/* Preset suggestions */}
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-[11px] font-bold tracking-wider uppercase text-ink-3 mb-2.5">
                  Quick add suggestions
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS[activeGroup]?.filter(p => !group.rules.includes(p)).map(preset => (
                    <button
                      key={preset}
                      onClick={() => addToneRule(activeGroup, preset)}
                      className="text-[12px] px-3 py-1.5 rounded-lg border border-dashed
                                 border-border-2 text-ink-3 hover:border-accent hover:text-accent
                                 transition-all duration-100"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="card p-6 mt-5">
              <h3 className="font-display text-[15px] font-bold tracking-tight text-ink mb-3">
                Preview — how AI will sound
              </h3>
              <div className={`rounded-xl p-4 border ${colors.bg} ${colors.border}`}>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.text}">
                  Example reply for this group
                </div>
                <p className={`text-[13.5px] leading-relaxed ${colors.text}`}>
                  {PREVIEW_REPLIES[activeGroup]}
                </p>
              </div>
              <p className="text-[11px] text-ink-3 mt-2">
                This preview updates when you save changes and regenerate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Preset rule suggestions per group
const PRESETS = {
  reels: [
    'Keep replies under 2 sentences',
    'Always end with a question or CTA',
    'Match the energy of the video content',
    'Use trending language where appropriate',
    'Tag relevant product if mentioned',
  ],
  casual_dm: [
    'Address person by name',
    'Always offer a next step',
    'More detail is acceptable in DMs',
    'Never leave without a resolution path',
    'Follow up if no response in 24hr',
  ],
  feed: [
    'Keep replies under 3 sentences',
    'No product pushing unless directly relevant',
    'Acknowledge all feedback genuinely',
    'Invite to DM for complex issues',
    'Sign off with brand name naturally',
  ],
  linkedin: [
    'No emojis',
    'Reference company expertise',
    'Offer to connect or continue offline',
    'Mention product specs accurately',
    'Avoid superlatives or marketing language',
  ],
}

// Static preview replies per group
const PREVIEW_REPLIES = {
  reels: "Obsessed with this one 😍 Tag someone who needs this in their home! 🖤",
  casual_dm: "Hi Sarah, thanks so much for reaching out. I completely understand your frustration and I want to make sure this is sorted for you. Let me connect you directly with our service team — they'll be in touch within the hour.",
  feed: "Thank you for sharing this, Mark. We're sorry to hear your experience didn't meet expectations — this matters to us. Our team will reach out to you shortly.",
  linkedin: "Thank you for your question, Daniel. The CHiQ U8H does support Dolby Vision IQ and HDMI 2.1 across all rear ports. We'd be happy to connect you with a product specialist for a more detailed comparison.",
}
