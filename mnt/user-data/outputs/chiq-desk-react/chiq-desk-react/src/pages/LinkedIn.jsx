import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'
import Topbar from '../components/Topbar'
import CommentCard from '../components/CommentCard'

const TABS = ['Posts', 'Comments', 'DMs']

export default function LinkedIn() {
  const { comments } = useWorkspace()
  const [activeTab, setActiveTab] = useState('Posts')

  const platformComments = comments.filter(c => c.platform === 'li')

  const getCount = (tab) =>
    platformComments.filter(c =>
      c.contentType.toLowerCase().includes(tab.toLowerCase().replace(/s$/, ''))
    ).length

  const displayed = platformComments.filter(c =>
    c.contentType.toLowerCase().includes(activeTab.toLowerCase().replace(/s$/, ''))
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        right={
          <button className="btn-accent text-[13px] px-3.5 py-2">Sync ↻</button>
        }
      />
      <div className="p-7 flex-1">

        {/* LinkedIn tone banner */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 mb-5
                        text-[13px] text-sky-800">
          💼 <strong>LinkedIn Tone:</strong> Professional, measured, B2B-aware. No casual language.
          Emojis used only when contextually appropriate. Focus on expertise and credibility.
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b-2 border-border mb-5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 -mb-[2px]
                          transition-all duration-100
                          ${activeTab === tab
                            ? 'border-sky-600 text-sky-700'
                            : 'border-transparent text-ink-3 hover:text-ink'
                          }`}
            >
              {tab}
              <span className="ml-2 text-[11px] bg-off-2 text-ink-3 px-1.5 py-0.5 rounded-full">
                {getCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {displayed.length === 0
          ? <div className="text-center py-16 text-ink-3 text-[13px]">No comments in this section.</div>
          : displayed.map(c => <CommentCard key={c.id} comment={c} showDraft />)
        }
      </div>
    </div>
  )
}
