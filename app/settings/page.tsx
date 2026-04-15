"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Lock, 
  Bell, 
  Database,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [theme, setTheme] = useState(false)
  const [fontSize, setFontSize] = useState("Medium")
  const [language, setLanguage] = useState("English")
  const [privateAccount, setPrivateAccount] = useState(false)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [allowMessages, setAllowMessages] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [soundEffects, setSoundEffects] = useState(true)

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Settings Header */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account preferences and application settings
              </p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Username</p>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-secondary/80">
                Change
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-secondary/80">
                Change
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">********</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-secondary/80">
                Change
              </Button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <button
                onClick={() => setTheme(!theme)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  theme ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    theme ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Font Size</p>
                <p className="text-sm text-muted-foreground">Adjust text size</p>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-secondary text-foreground px-3 py-1.5 rounded-lg border border-border text-sm"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">Select your language</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-secondary text-foreground px-3 py-1.5 rounded-lg border border-border text-sm"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Private Account</p>
                <p className="text-sm text-muted-foreground">Make your posts visible to followers only</p>
              </div>
              <button
                onClick={() => setPrivateAccount(!privateAccount)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  privateAccount ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    privateAccount ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Show Online Status</p>
                <p className="text-sm text-muted-foreground">{"Let others see when you're online"}</p>
              </div>
              <button
                onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  showOnlineStatus ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    showOnlineStatus ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Allow Messages</p>
                <p className="text-sm text-muted-foreground">Receive direct messages from others</p>
              </div>
              <button
                onClick={() => setAllowMessages(!allowMessages)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  allowMessages ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    allowMessages ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for new posts and messages</p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  pushNotifications ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    pushNotifications ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  emailNotifications ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    emailNotifications ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Sound Effects</p>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  soundEffects ? "bg-primary" : "bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform",
                    soundEffects ? "right-1" : "left-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Storage Section */}
        <div className="bg-card rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data & Storage</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Clear Cache</p>
                <p className="text-sm text-muted-foreground">Free up storage space</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-secondary/80">
                Clear
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <div>
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">Download your data</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary border-border hover:bg-secondary/80">
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Storage Used</p>
                <p className="text-sm text-muted-foreground">Calculating...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl p-4 shadow-md border border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-lg">
          Save All Settings
        </Button>
      </div>
    </MainLayout>
  )
}
