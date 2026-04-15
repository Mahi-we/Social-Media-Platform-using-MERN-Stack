"use client"

export function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 p-4 space-y-4">
      {/* Quick Help */}
      <div className="bg-card rounded-xl p-4 shadow-md">
        <h3 className="font-semibold text-foreground mb-3">Quick Help</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Changes are saved automatically
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Some settings require app restart
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Contact support for account issues
          </li>
        </ul>
      </div>

      {/* Account Status */}
      <div className="bg-card rounded-xl p-4 shadow-md">
        <h3 className="font-semibold text-foreground mb-3">Account Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since:</span>
            <span className="text-foreground">2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last login:</span>
            <span className="text-foreground">Today</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account type:</span>
            <span className="text-foreground">Free</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
