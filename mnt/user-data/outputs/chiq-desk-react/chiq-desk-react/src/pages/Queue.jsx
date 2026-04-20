import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import Topbar, { PlatformTabs } from '../components/Topbar'
import CommentCard from '../components/CommentCard'

const TABS = [
  { id: 'escalation', label: '🚨 Escalation',        stage: 'escalation' },
  { id: 'email_hold', label: '📧 Email + Hold',       stage: 'email_hold' },
  { id: 'awaiting',   label: '👁 Awaiting Approval',  stage: 'awaiting'   },
  { id: 'auto',       label: '⚡ Auto-Handled',        stage: 'auto'       },
]

export default function Queue() {
  const { comments } = useWorkspace()
  const [activeTab, setActiveTab]         = useState('escalation')
  const [platformFilter, setPlatformFilter] = useState('All')

  const byStage = (stage) => comments.filter(c => c.stage === stage)

  const filtered = byStage(activeTab).filter(c =>
    platformFilter === 'All' || c.platform === platformFilter.toLowerCase()
  )

  const tabCount = (stage) => byStage(stage).length

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        subtitle={`· ${comments.filter(c => ['escalation','email_hold','awaiting'].includes(c.stage)).length} pending`}
        right={
          <div className="flex items-center gap-3">
            <PlatformTabs active={platformFilter} onChange={setPlatformFilter} />
            <button className="btn-ghost text-[13px] px-3.5 py-2">Filter ▾</button>
          </div>
        }
      />

      <div className="p-7 flex-1">
        {/* Tabs */}
        <div className="flex gap-0 border-b-2 border-border mb-5">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 -mb-[2px]
                          transition-all duration-100
                          ${activeTab === t.id
                            ? 'border-accent text-accent'
                            : 'border-transparent text-ink-3 hover:text-ink'
                          }`}
            >
              {t.label}
              <span className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full font-bold
                ${activeTab === t.id ? 'bg-accent text-white' : 'bg-off-2 text-ink-3'}`}>
                {tabCount(t.stage)}
              </span>
            </button>
          ))}
        </div>

        {/* Comments */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-ink-3">
            <div className="text-5xl mb-4">
              {activeTab === 'auto' ? '⚡' : '✓'}
            </div>
            <div className="font-display text-[18px] font-bold text-ink mb-2">
              {activeTab === 'auto' ? 'No auto-handled comments yet' : 'Nothing here'}
            </div>
            <div className="text-[13px]">
              {activeTab === 'auto'
                ? 'Auto-handled comments will appear here as they come in.'
                : 'All clear in this category.'}
            </div>
          </div>
        ) : (
          filtered.map(c => (
            <CommentCard
              key={c.id}
              comment={c}
              showDraft={activeTab !== 'auto'}
            />
          ))
        )}
      </div>
    </div>
  )
}
