import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'

export default function LoginPage() {
  const { login } = useWorkspace()
  const navigate = useNavigate()
  const [email, setEmail] = useState('sarah@chiq.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = login(email, password)
    if (ok) navigate('/dashboard')
    else setError('Invalid credentials')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0d] flex items-center justify-center
                    relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-48 -right-32 w-[600px] h-[600px] rounded-full
                      bg-accent/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full
                      bg-accent/8 blur-[100px] pointer-events-none" />

      <div className="bg-white rounded-[20px] p-12 w-[420px] relative z-10
                      shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-9">
          <div className="w-9 h-9 bg-[#0f0f0d] rounded-lg flex items-center justify-center
                          font-display text-white text-[13px] font-bold">
            CQ
          </div>
          <span className="font-display text-[18px] font-semibold tracking-tight text-ink">
            CHiQ <span className="text-accent">Desk</span>
          </span>
        </div>

        <h1 className="font-display text-[26px] font-bold tracking-tight text-ink mb-1.5">
          Welcome back.
        </h1>
        <p className="text-[14px] text-ink-3 mb-8">
          Sign in to your workspace to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold tracking-wider uppercase
                               text-ink-2 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
              placeholder="you@chiq.com"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold tracking-wider uppercase
                               text-ink-2 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-[13px]">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full py-3 mt-2 font-display
                                           text-[15px] font-semibold tracking-tight">
            Sign in to CHiQ Desk →
          </button>
        </form>

        <p className="text-center text-[12px] text-ink-3 mt-6">
          Secured by CHiQ ·{' '}
          <span className="text-accent cursor-pointer hover:underline">Forgot password?</span>
        </p>
      </div>
    </div>
  )
}
