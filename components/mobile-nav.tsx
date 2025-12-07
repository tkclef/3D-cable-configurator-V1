"use client"

import { Settings, Box, ShoppingBag } from "lucide-react"

interface MobileNavProps {
  activePanel: "config" | "viewer" | "summary"
  setActivePanel: (panel: "config" | "viewer" | "summary") => void
}

export function MobileNav({ activePanel, setActivePanel }: MobileNavProps) {
  return (
    <div className="flex items-center border-b border-border bg-card/50 shrink-0">
      <button
        onClick={() => setActivePanel("config")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
          activePanel === "config" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Settings className="w-4 h-4" />
        Configure
      </button>
      <button
        onClick={() => setActivePanel("viewer")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
          activePanel === "viewer" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Box className="w-4 h-4" />
        3D View
      </button>
      <button
        onClick={() => setActivePanel("summary")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
          activePanel === "summary" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        Summary
      </button>
    </div>
  )
}
