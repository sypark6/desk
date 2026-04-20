import { createContext, useContext, useState } from 'react'
import { MOCK_COMMENTS, MOCK_TEAM, WORKSPACE_DEFAULTS, TONE_GROUPS } from '../data'

const WorkspaceContext = createContext(null)

export function WorkspaceProvider({ children }) {
  // Auth
  const [user, setUser] = useState(null)

  // Workspace settings (logo upload, name change etc.)
  const [workspace, setWorkspace] = useState(WORKSPACE_DEFAULTS)

  // Comments / queue
  const [comments, setComments] = useState(MOCK_COMMENTS)

  // Team
  const [team, setTeam] = useState(MOCK_TEAM)

  // Tone groups (editable in Settings)
  const [toneGroups, setToneGroups] = useState(TONE_GROUPS)

  // Brand voice rules (AI Training page)
  const [brandRules, setBrandRules] = useState([
    'Warm but restrained — no slang',
    'Max 1 exclamation mark per reply',
    'Always offer a resolution path for complaints',
    'LinkedIn replies: professional, no emojis',
    'Reels / TikTok: casual, match video energy, 1-2 emojis ok',
  ])

  // ── Auth actions ──
  const login = (email, password) => {
    // In production: call Supabase auth here
    setUser({ id: '1', name: 'Sarah Kim', email, role: 'marketing_asst', fullAccess: true })
    return true
  }

  const logout = () => setUser(null)

  // ── Workspace actions ──
  const updateWorkspace = (updates) =>
    setWorkspace(prev => ({ ...prev, ...updates }))

  const uploadLogo = (file) => {
    const url = URL.createObjectURL(file)
    setWorkspace(prev => ({ ...prev, logo: url }))
  }

  // ── Comment actions ──
  const approveComment = (id) =>
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, stage: 'auto', autoPosted: true } : c
    ))

  const updateDraft = (id, text) =>
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, draftReply: text } : c
    ))

  const dismissComment = (id) =>
    setComments(prev => prev.filter(c => c.id !== id))

  // ── Team actions ──
  const updatePermission = (memberId, perm, value) =>
    setTeam(prev => prev.map(m =>
      m.id === memberId
        ? { ...m, permissions: { ...m.permissions, [perm]: value } }
        : m
    ))

  const inviteMember = (email, role, permissions) => {
    const newMember = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      initials: email[0].toUpperCase(),
      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      role,
      permissions,
    }
    setTeam(prev => [...prev, newMember])
  }

  // ── Tone group actions ──
  const updateToneGroup = (groupId, updates) =>
    setToneGroups(prev => ({
      ...prev,
      [groupId]: { ...prev[groupId], ...updates },
    }))

  const addToneRule = (groupId, rule) =>
    setToneGroups(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        rules: [...prev[groupId].rules, rule],
      },
    }))

  const removeToneRule = (groupId, index) =>
    setToneGroups(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        rules: prev[groupId].rules.filter((_, i) => i !== index),
      },
    }))

  // ── Brand rules actions ──
  const addBrandRule = (rule) => setBrandRules(prev => [...prev, rule])
  const removeBrandRule = (index) => setBrandRules(prev => prev.filter((_, i) => i !== index))

  // ── Computed ──
  const pendingCount = comments.filter(c =>
    ['escalation', 'email_hold', 'awaiting'].includes(c.stage)
  ).length

  const commentsByStage = (stage) => comments.filter(c => c.stage === stage)

  return (
    <WorkspaceContext.Provider value={{
      // State
      user, workspace, comments, team, toneGroups, brandRules,
      // Auth
      login, logout,
      // Workspace
      updateWorkspace, uploadLogo,
      // Comments
      approveComment, updateDraft, dismissComment,
      commentsByStage,
      // Team
      updatePermission, inviteMember,
      // Tone groups
      updateToneGroup, addToneRule, removeToneRule,
      // Brand
      addBrandRule, removeBrandRule,
      // Computed
      pendingCount,
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}
