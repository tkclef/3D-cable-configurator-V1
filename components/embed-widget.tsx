"use client"

import { CableConfigurator } from "./cable-configurator"

// Embeddable widget component for iframe/RapidWeaver integration
export function EmbedWidget() {
  return (
    <div className="w-full h-full min-h-screen">
      <CableConfigurator />
    </div>
  )
}

// Script-based embed initialization
export function initCableConfigurator(containerId: string) {
  if (typeof window === "undefined") return

  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`CableForge: Container #${containerId} not found`)
    return
  }

  // Set container styles
  container.style.width = "100%"
  container.style.height = "100vh"
  container.style.minHeight = "600px"

  // Create iframe
  const iframe = document.createElement("iframe")
  iframe.src = window.location.origin + "/embed"
  iframe.style.width = "100%"
  iframe.style.height = "100%"
  iframe.style.border = "none"
  iframe.allow = "fullscreen"

  container.appendChild(iframe)
}

// Export for global access
if (typeof window !== "undefined") {
  ;(window as Window & { CableForge?: { init: typeof initCableConfigurator } }).CableForge = {
    init: initCableConfigurator,
  }
}
