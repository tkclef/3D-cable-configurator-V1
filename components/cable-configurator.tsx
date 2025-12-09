"use client"

import { useState, useCallback, useEffect } from "react"
import { ConfigPanel } from "./config-panel"
import { ThreeViewer } from "./three-viewer"
import { SummaryPanel } from "./summary-panel"
import { MobileNav } from "./mobile-nav"
import { defaultConfig, type CableConfig } from "@/lib/cable-config"
import { parseConfigFromUrl } from "@/lib/pdf-export"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function CableConfigurator() {
  const [config, setConfig] = useState<CableConfig>(defaultConfig)
  const [activePanel, setActivePanel] = useState<"config" | "viewer" | "summary">("viewer")
  const [environment, setEnvironment] = useState("dark-studio")
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const urlConfig = parseConfigFromUrl()
    if (urlConfig) {
      setConfig(urlConfig)
    }
  }, [])

  const updateConfig = useCallback((updates: Partial<CableConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">CableForge</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={resetConfig} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Premium Cable Configurator</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav activePanel={activePanel} setActivePanel={setActivePanel} />}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div
          className={`${
            isMobile ? (activePanel === "config" ? "flex" : "hidden") : "flex"
          } w-full lg:w-80 xl:w-96 flex-col border-r border-border bg-card/30 overflow-hidden`}
        >
          <ConfigPanel
            config={config}
            updateConfig={updateConfig}
            environment={environment}
            setEnvironment={setEnvironment}
          />
        </div>

        {/* Center Panel - 3D Viewer */}
        <div
          className={`${
            isMobile ? (activePanel === "viewer" ? "flex" : "hidden") : "flex"
          } flex-1 flex-col bg-background overflow-hidden`}
        >
          <ThreeViewer config={config} environment={environment} isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        {/* Right Panel - Summary */}
        <div
          className={`${
            isMobile ? (activePanel === "summary" ? "flex" : "hidden") : "flex"
          } w-full lg:w-80 xl:w-96 flex-col border-l border-border bg-card/30 overflow-hidden`}
        >
          <SummaryPanel config={config} />
        </div>
      </div>
    </div>
  )
}
