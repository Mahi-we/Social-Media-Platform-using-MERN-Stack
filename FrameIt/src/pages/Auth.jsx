import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, AtSign, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { register, login } from '../lib/api'
import { useUser } from '../context/UserContext'

// ─── Field Input ──────────────────────────────────────────────
function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, error, rightEl }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#0f2535] border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-[#2d5a6b] focus:ring-primary/40 focus:border-primary/60'
          }`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Password Field ───────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      icon={Lock}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      rightEl={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  )
}

// ─── Password Strength ────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score] : 'bg-[#2d5a6b]'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-xs flex items-center gap-1 transition-colors ${
                c.ok ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-medium ${colors[score].replace('bg-', 'text-')}`}>
          {labels[score]}
        </span>
      </div>
    </div>
  )
}

// ─── Register Form ────────────────────────────────────────────
function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const { login: loginUser } = useUser()

  const set = (field) => (val) => {
    setForm((p) => ({ ...p, [field]: val }))
    setErrors((p) => ({ ...p, [field]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.username.trim()) e.username = 'Username is required.'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      e.username = '3–20 chars, letters/numbers/underscores only.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const { token, user } = await register(form)
      loginUser(token, user)
      onSuccess()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field icon={User} label="Full Name" value={form.name} onChange={set('name')}
        placeholder="Your full name" error={errors.name} />
      <Field icon={AtSign} label="Username" value={form.username} onChange={set('username')}
        placeholder="e.g. cooluser123" error={errors.username} />
      <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set('email')}
        placeholder="you@example.com" error={errors.email} />
      <div className="space-y-2">
        <PasswordField label="Password" value={form.password} onChange={set('password')}
          placeholder="Min. 6 characters" error={errors.password} />
        <PasswordStrength password={form.password} />
      </div>

      {serverError && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin}
          className="text-primary font-medium hover:underline">
          Sign in
        </button>
      </p>
    </form>
  )
}

// ─── Login Form ───────────────────────────────────────────────
function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [form, setForm] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const { login: loginUser } = useUser()

  const set = (field) => (val) => {
    setForm((p) => ({ ...p, [field]: val }))
    setErrors((p) => ({ ...p, [field]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.login.trim()) e.login = 'Email or username is required.'
    if (!form.password) e.password = 'Password is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const { token, user } = await login(form)
      loginUser(token, user)
      onSuccess()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm({ login: 'me@frameit.com', password: 'password123' })
    setErrors({})
    setServerError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field icon={Mail} label="Email or Username" value={form.login} onChange={set('login')}
        placeholder="you@example.com or @username" error={errors.login} />
      <PasswordField label="Password" value={form.password} onChange={set('password')}
        placeholder="Your password" error={errors.password} />

      {serverError && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
      </button>

      {/* Demo credentials quick-fill */}
      <button
        type="button"
        onClick={fillDemo}
        className="w-full py-2.5 border border-[#2d5a6b] rounded-xl text-sm text-slate-400 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        🎭 Use demo account
      </button>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister}
          className="text-primary font-medium hover:underline">
          Sign up free
        </button>
      </p>
    </form>
  )
}

// ─── Main Auth Page ───────────────────────────────────────────
export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const navigate = useNavigate()

  const onSuccess = () => navigate('/', { replace: true })

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel — Branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0f2535] border-r border-[#1a3a4a] p-12 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FrameIt</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6 relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Capture moments,<br />
              <span className="text-primary">share stories.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join a community of creators and storytellers. Share stories, and connect with people who inspire you.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['📸 Photos', '📖 24h Stories', '💬 Comments', '🔖 Bookmarks', '🔍 Explore'].map((f) => (
              <span key={f} className="px-3 py-1.5 bg-[#1a3a4a] border border-[#2d5a6b] rounded-full text-sm text-slate-300">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-[#1a3a4a] border border-[#2d5a6b] rounded-2xl p-5 relative z-10">
          <p className="text-slate-300 text-sm italic leading-relaxed mb-3">
            "FrameIt is my go-to for sharing my photography. The interface is clean and my followers love the stories feature!"
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop"
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-white text-sm font-medium">Ananya</p>
              <p className="text-slate-500 text-xs">@ananya · Photography</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">FrameIt</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'login'
                ? 'Sign in to continue to FrameIt'
                : 'Join thousands of creators on FrameIt'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-[#0f2535] rounded-xl p-1 mb-6 border border-[#1a3a4a]">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  mode === m
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <LoginForm onSuccess={onSuccess} onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSuccess={onSuccess} onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
