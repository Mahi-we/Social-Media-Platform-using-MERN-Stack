import { useState, useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import {
  Settings as SettingsIcon, User, Palette, Lock, Bell,
  Database, AlertTriangle, CheckCircle2, Eye, EyeOff, X, Pencil, LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { updateSettings, updateCredentials } from '../lib/api'
import { useUser } from '../context/UserContext'

// ─── Reusable Toggle ────────────────────────────────────────
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-muted'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// ─── Inline Edit Modal ───────────────────────────────────────
function EditModal({ field, currentValue, onClose, onSave }) {
  const [value, setValue] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isPassword = field === 'password'
  const labels = { username: 'Username', email: 'Email', password: 'Password' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!value.trim()) { setError('Value cannot be empty'); return }
    setSaving(true)
    setError('')
    try {
      await onSave(field, value.trim(), isPassword ? currentPassword : '')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-white text-lg">Change {labels[field]}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current value hint */}
          {!isPassword && currentValue && (
            <p className="text-sm text-muted-foreground">
              Current {labels[field]}: <span className="text-white">{currentValue}</span>
            </p>
          )}

          {/* Current password field (only for password change) */}
          {isPassword && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-white">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-secondary border border-border rounded-xl py-3 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New value input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white">
              {isPassword ? 'New Password' : `New ${labels[field]}`}
            </label>
            <div className="relative">
              <input
                type={isPassword ? (showPassword ? 'text' : 'password') : field === 'email' ? 'email' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  isPassword
                    ? 'Min. 6 characters'
                    : field === 'username'
                    ? 'e.g. cooluser123'
                    : 'e.g. you@email.com'
                }
                autoFocus
                className="w-full bg-secondary border border-border rounded-xl py-3 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-secondary rounded-xl text-sm hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : `Update ${labels[field]}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Settings Page ──────────────────────────────────────
export default function Settings() {
  const { currentUser, setCurrentUser, logout } = useUser()
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    isPrivate: false,
    showOnlineStatus: true,
    allowMessages: true,
    pushNotifications: true,
    emailNotifications: false,
    soundEffects: true,
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editField, setEditField] = useState(null) // 'username' | 'email' | 'password' | null

  // Sync from user when loaded
  useEffect(() => {
    if (!currentUser) return
    setSettings({
      isPrivate: currentUser.isPrivate ?? false,
      showOnlineStatus: currentUser.showOnlineStatus ?? true,
      allowMessages: currentUser.allowMessages ?? true,
      pushNotifications: currentUser.pushNotifications ?? true,
      emailNotifications: currentUser.emailNotifications ?? false,
      soundEffects: currentUser.soundEffects ?? true,
    })
  }, [currentUser])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!currentUser?._id || saving) return
    setSaving(true)
    try {
      const updated = await updateSettings(currentUser._id, settings)
      setCurrentUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCredentialSave = async (field, value, currentPassword) => {
    const result = await updateCredentials(currentUser._id, field, value, currentPassword)
    // Update context with new values
    setCurrentUser((prev) => ({
      ...prev,
      ...(field === 'username' ? { username: result.user.username } : {}),
      ...(field === 'email' ? { email: result.user.email } : {}),
    }))
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account preferences and application settings</p>
        </div>

        {/* Account Settings */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-white">Account</h2>
          </div>
          <div className="space-y-4">
            {/* Username */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Username</p>
                <p className="text-sm text-muted-foreground">@{currentUser?.username || '—'}</p>
              </div>
              <button
                onClick={() => setEditField('username')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Change
              </button>
            </div>
            {/* Email */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Email</p>
                <p className="text-sm text-muted-foreground">{currentUser?.email || '—'}</p>
              </div>
              <button
                onClick={() => setEditField('email')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Change
              </button>
            </div>
            {/* Password */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Password</p>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <button
                onClick={() => setEditField('password')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Change
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-white">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Font Size</p>
                <p className="text-sm text-muted-foreground">Adjust text size</p>
              </div>
              <select className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Small</option>
                <option defaultValue>Medium</option>
                <option>Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Language</p>
                <p className="text-sm text-muted-foreground">Select your language</p>
              </div>
              <select className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-white">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Private Account</p>
                <p className="text-sm text-muted-foreground">Make your posts visible to followers only</p>
              </div>
              <Toggle enabled={settings.isPrivate} onChange={(v) => updateSetting('isPrivate', v)} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Show Online Status</p>
                <p className="text-sm text-muted-foreground">{"Let others see when you're online"}</p>
              </div>
              <Toggle enabled={settings.showOnlineStatus} onChange={(v) => updateSetting('showOnlineStatus', v)} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Allow Messages</p>
                <p className="text-sm text-muted-foreground">Receive direct messages from others</p>
              </div>
              <Toggle enabled={settings.allowMessages} onChange={(v) => updateSetting('allowMessages', v)} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for new posts and messages</p>
              </div>
              <Toggle enabled={settings.pushNotifications} onChange={(v) => updateSetting('pushNotifications', v)} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <Toggle enabled={settings.emailNotifications} onChange={(v) => updateSetting('emailNotifications', v)} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Sound Effects</p>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <Toggle enabled={settings.soundEffects} onChange={(v) => updateSetting('soundEffects', v)} />
            </div>
          </div>
        </div>

        {/* Data & Storage */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-white">Data & Storage</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-white">Clear Cache</p>
                <p className="text-sm text-muted-foreground">Free up storage space</p>
              </div>
              <button className="px-4 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">Clear</button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Export Data</p>
                <p className="text-sm text-muted-foreground">Download your data</p>
              </div>
              <button className="px-4 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">Export</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl p-6 border border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="font-semibold text-destructive">Danger Zone</h2>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-white">Sign Out</p>
              <p className="text-sm text-muted-foreground">Log out of your FrameIt account</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/auth', { replace: true }) }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-secondary border border-border text-white rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-1.5 bg-destructive text-white rounded-lg text-sm hover:bg-destructive/90 transition-colors">Delete</button>
          </div>
        </div>

        {/* Save Toggles Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saved ? (
            <><CheckCircle2 className="w-5 h-5" /> Settings Saved!</>
          ) : saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Edit Modal */}
      {editField && (
        <EditModal
          field={editField}
          currentValue={editField === 'username' ? currentUser?.username : currentUser?.email}
          onClose={() => setEditField(null)}
          onSave={handleCredentialSave}
        />
      )}
    </MainLayout>
  )
}
