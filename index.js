// ─── TONE GROUPS ───────────────────────────────────────────────────────────
// This is the grouping system. Platforms share tone profiles rather than
// having individual rules. Edit these to change AI behaviour per group.

export const TONE_GROUPS = {
  reels: {
    id: 'reels',
    name: 'Reels & Short Video',
    icon: '🎬',
    color: 'pink',
    platforms: ['FB Reels', 'IG Reels', 'TikTok'],
    description: 'Casual, energetic, matches video content energy. Light emojis ok.',
    rules: [
      'Keep replies short — 1-2 sentences max',
      'Match the upbeat energy of video content',
      'Use 1-2 emojis where appropriate',
      'No corporate language',
      'Always invite engagement (tag a friend, check link in bio etc.)',
    ],
  },
  casual_dm: {
    id: 'casual_dm',
    name: 'Casual DMs',
    icon: '💬',
    color: 'purple',
    platforms: ['TikTok DM', 'FB DM', 'IG DM'],
    description: 'Personal, warm, private. More detailed. Always offer resolution path.',
    rules: [
      'Address the person by name if available',
      'More conversational and personal than public replies',
      'Always offer a next step or resolution',
      'Can be slightly longer — DMs allow for detail',
      'No exclamation marks more than once per message',
    ],
  },
  feed: {
    id: 'feed',
    name: 'Feed Posts',
    icon: '📝',
    color: 'blue',
    platforms: ['FB Posts', 'IG Posts'],
    description: 'Balanced, on-brand, product-aware. Warm but professional.',
    rules: [
      'Balanced tone — not too casual, not too stiff',
      'Product mentions should feel natural, not salesy',
      'Acknowledge feedback genuinely',
      'Keep replies under 3 sentences for praise/FAQs',
      'Max 1 exclamation mark per reply',
    ],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn (Posts & DMs)',
    icon: '💼',
    color: 'sky',
    platforms: ['LinkedIn Posts', 'LinkedIn DMs'],
    description: 'Professional, measured, B2B-aware. No casual language.',
    rules: [
      'Professional and measured at all times',
      'No emojis unless absolutely contextually appropriate',
      'Reference expertise and credibility',
      'Longer, more considered replies are acceptable',
      'Offer to connect or continue conversation via proper channels',
    ],
  },
}

// ─── APPROVAL STAGES ──────────────────────────────────────────────────────

export const STAGES = {
  auto: {
    id: 'auto',
    label: 'Auto-Posted',
    icon: '⚡',
    color: 'green',
    description: 'Praise, simple FAQs, spam ignored. No human needed.',
  },
  awaiting: {
    id: 'awaiting',
    label: 'Awaiting Approval',
    icon: '👁',
    color: 'blue',
    description: 'Complex queries. Draft ready, needs 1 click.',
  },
  email_hold: {
    id: 'email_hold',
    label: 'Email Sent + Hold',
    icon: '📧',
    color: 'amber',
    description: 'Service issues. Email dispatched. Reply on hold.',
  },
  escalation: {
    id: 'escalation',
    label: 'Escalation',
    icon: '🚨',
    color: 'red',
    description: 'PR risk. Full manual review required.',
  },
}

// ─── PLATFORM DEFINITIONS ─────────────────────────────────────────────────

export const PLATFORMS = {
  fb:  { id: 'fb',  name: 'Facebook',  handle: 'CHiQ Australia',  icon: '𝑓',  chipClass: 'chip-fb' },
  ig:  { id: 'ig',  name: 'Instagram', handle: '@chiq.global',    icon: '◎',  chipClass: 'chip-ig' },
  li:  { id: 'li',  name: 'LinkedIn',  handle: 'CHiQ Official',   icon: 'in', chipClass: 'chip-li' },
  tt:  { id: 'tt',  name: 'TikTok',    handle: '@chiq_global',    icon: '♪',  chipClass: 'chip-tt' },
}

export const CONTENT_TYPES = {
  post:  'Post',
  reel:  'Reel',
  video: 'Video',
  dm:    'DM',
  comment: 'Comment',
}

// ─── MOCK COMMENTS ────────────────────────────────────────────────────────

export const MOCK_COMMENTS = [
  {
    id: '1',
    author: 'Mark Thompson',
    initials: 'M',
    avatarGradient: 'linear-gradient(135deg,#f43f5e,#ec4899)',
    platform: 'fb',
    contentType: 'post',
    toneGroup: 'feed',
    stage: 'escalation',
    time: '2 min ago',
    text: 'This is absolutely unacceptable. My CHiQ fridge stopped working after 3 months and your service team has ignored 4 emails. I\'m going to post this everywhere.',
    sentiment: 'very_negative',
    aiNote: 'High PR risk. Negative sentiment + public threat to share. Recommend urgent human response. Service email auto-sent.',
    draftReply: 'Hi Mark, we\'re truly sorry to hear this — this is not the experience we want for any CHiQ customer. A member of our team has been notified and will reach out to you directly within the next few hours to resolve this as a priority. We appreciate your patience.',
    emailSent: true,
  },
  {
    id: '2',
    author: 'Jessica L.',
    initials: 'J',
    avatarGradient: 'linear-gradient(135deg,#f59e0b,#f97316)',
    platform: 'ig',
    contentType: 'reel',
    toneGroup: 'reels',
    stage: 'email_hold',
    time: '18 min ago',
    text: 'Love the reel! But my AC remote stopped responding after the update. Is there a fix?',
    sentiment: 'mixed',
    aiNote: 'Mixed — positive about content, service issue re: AC remote firmware.',
    draftReply: 'Hi Jessica! We\'re so sorry to hear about that — this isn\'t the experience we want for you. Our team is looking into the remote firmware issue and will DM you directly with a fix within the hour! 💙',
    emailSent: true,
  },
  {
    id: '3',
    author: 'Daniel W.',
    initials: 'D',
    avatarGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    platform: 'li',
    contentType: 'comment',
    toneGroup: 'linkedin',
    stage: 'awaiting',
    time: '34 min ago',
    text: 'Does the CHiQ U8H support Dolby Vision IQ and HDMI 2.1? Comparing against Samsung for a home cinema build.',
    sentiment: 'neutral',
    aiNote: 'Technical product query. LinkedIn tone applied — professional, no emojis.',
    draftReply: 'Great question, Daniel. The CHiQ U8H supports Dolby Vision IQ and features HDMI 2.1 across all rear ports — well-suited for high-performance home cinema setups. Happy to connect you with our product specialists for a tailored comparison.',
    emailSent: false,
  },
  {
    id: '4',
    author: 'Amira F.',
    initials: 'A',
    avatarGradient: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    platform: 'fb',
    contentType: 'post',
    toneGroup: 'feed',
    stage: 'auto',
    time: '1 hr ago',
    text: 'Just got my CHiQ TV delivered and the picture quality is stunning! Way better than expected for the price 😍',
    sentiment: 'positive',
    aiNote: 'Praise. Auto-replied.',
    draftReply: 'Thank you so much, Amira! We\'re thrilled to hear you\'re loving your new CHiQ TV. Enjoy every moment of it! 🙌',
    emailSent: false,
    autoPosted: true,
  },
  {
    id: '5',
    author: '@techfan99',
    initials: 'T',
    avatarGradient: 'linear-gradient(135deg,#10b981,#059669)',
    platform: 'tt',
    contentType: 'video',
    toneGroup: 'reels',
    stage: 'auto',
    time: '2 hr ago',
    text: 'omg the CHiQ fridge is so aesthetic!! where can i get this in australia??',
    sentiment: 'positive',
    aiNote: 'TikTok — reels tone applied. Product FAQ. Auto-replied.',
    draftReply: 'You can grab it at JB Hi-Fi and Harvey Norman across Australia 🛒 Link in bio for online too! 🖤',
    emailSent: false,
    autoPosted: true,
  },
]

// ─── MOCK TEAM ────────────────────────────────────────────────────────────

export const MOCK_TEAM = [
  {
    id: '1',
    name: 'Sarah Kim',
    email: 'sarah@chiq.com',
    initials: 'S',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    role: 'marketing_asst',
    isYou: true,
    permissions: { approve: true, post: true, manageTeam: true, viewEmails: true, trainAI: true },
  },
  {
    id: '2',
    name: 'James Park',
    email: 'james@chiq.com',
    initials: 'J',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    role: 'manager',
    permissions: { approve: true, post: true, manageTeam: true, viewEmails: true, trainAI: true },
  },
  {
    id: '3',
    name: 'Lisa Nguyen',
    email: 'lisa@chiq.com',
    initials: 'L',
    gradient: 'linear-gradient(135deg,#f43f5e,#ec4899)',
    role: 'marketing_asst',
    permissions: { approve: true, post: false, manageTeam: false, viewEmails: true, trainAI: false },
  },
  {
    id: '4',
    name: 'Ryan Teo',
    email: 'ryan@chiq.com',
    initials: 'R',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    role: 'viewer',
    permissions: { approve: false, post: false, manageTeam: false, viewEmails: false, trainAI: false },
  },
]

export const ROLES = {
  admin:         { label: 'Admin',            colorClass: 'bg-purple-50 text-purple-700' },
  manager:       { label: 'Manager',          colorClass: 'bg-blue-50 text-blue-700' },
  marketing_asst:{ label: 'Marketing Asst.',  colorClass: 'bg-green-50 text-green-700' },
  viewer:        { label: 'Viewer',           colorClass: 'bg-gray-100 text-gray-600' },
}

// ─── WORKSPACE DEFAULTS ───────────────────────────────────────────────────

export const WORKSPACE_DEFAULTS = {
  name: 'CHiQ Desk',
  logo: null, // null = use text logo
  serviceEmail: 'service@chiq.com',
  ccEmails: ['marketing1@chiq.com', 'marketing2@chiq.com'],
  syncFrequency: 5, // minutes
  autoProcessOnSync: true,
}
