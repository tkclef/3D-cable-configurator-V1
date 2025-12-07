import type { CableConfig } from "./cable-config"
import {
  calculatePrice,
  connectorOptions,
  cableColors,
  braidOptions,
  accessoryOptions,
  moduleOptions,
} from "./cable-config"

// Generate a shareable link with encoded config
export function generateShareableLink(config: CableConfig): string {
  const configString = btoa(JSON.stringify(config))
  if (typeof window !== "undefined") {
    return `${window.location.origin}?config=${configString}`
  }
  return `?config=${configString}`
}

// Parse config from URL
export function parseConfigFromUrl(): CableConfig | null {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const configParam = params.get("config")

  if (configParam) {
    try {
      const decoded = atob(configParam)
      return JSON.parse(decoded) as CableConfig
    } catch {
      console.error("Failed to parse config from URL")
      return null
    }
  }
  return null
}

// Generate PDF with configuration summary
export async function generatePDF(config: CableConfig, canvas?: HTMLCanvasElement): Promise<void> {
  const totalPrice = calculatePrice(config)
  const connectorA = connectorOptions.find((c) => c.id === config.connectorA)
  const connectorB = connectorOptions.find((c) => c.id === config.connectorB)
  const cableColor = cableColors.find((c) => c.hex === config.cableColor)
  const braid = braidOptions.find((b) => b.id === config.braidType)
  const selectedAccessories = accessoryOptions.filter((a) => config.accessories.includes(a.id))
  const selectedModules = moduleOptions.filter((m) => config.modules.includes(m.id))

  // Create a printable HTML document
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow popups to generate PDF")
    return
  }

  // Get canvas image if available
  let canvasImage = ""
  if (canvas) {
    try {
      canvasImage = canvas.toDataURL("image/png")
    } catch {
      console.error("Failed to capture canvas")
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CableForge Configuration</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.6;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e5e5;
        }
        .logo { 
          font-size: 24px; 
          font-weight: bold;
        }
        .date { 
          color: #666; 
          font-size: 14px;
        }
        .preview {
          text-align: center;
          margin-bottom: 40px;
        }
        .preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .section { 
          margin-bottom: 30px;
        }
        .section-title { 
          font-size: 18px; 
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }
        .item { 
          display: flex; 
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .item-label { color: #666; }
        .item-value { font-weight: 500; }
        .item-price { color: #888; font-size: 14px; }
        .total { 
          font-size: 28px; 
          font-weight: bold;
          text-align: right;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #1a1a1a;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">⚡ CableForge</div>
        <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
      </div>

      ${canvasImage ? `<div class="preview"><img src="${canvasImage}" alt="Cable Preview" /></div>` : ""}

      <div class="section">
        <div class="section-title">Configuration Details</div>
        <div class="item">
          <span class="item-label">Connector A</span>
          <span><span class="item-value">${connectorA?.name || "—"}</span> <span class="item-price">+$${connectorA?.price || 0}</span></span>
        </div>
        <div class="item">
          <span class="item-label">Connector B</span>
          <span><span class="item-value">${connectorB?.name || "—"}</span> <span class="item-price">+$${connectorB?.price || 0}</span></span>
        </div>
        <div class="item">
          <span class="item-label">Cable Color</span>
          <span class="item-value">${cableColor?.name || "Custom"}</span>
        </div>
        <div class="item">
          <span class="item-label">Length</span>
          <span><span class="item-value">${config.length}m</span> <span class="item-price">+$${config.length * 5}</span></span>
        </div>
        <div class="item">
          <span class="item-label">Braid Type</span>
          <span><span class="item-value">${braid?.name || "None"}</span> ${braid?.price ? `<span class="item-price">+$${braid.price}</span>` : ""}</span>
        </div>
      </div>

      ${
        selectedAccessories.length > 0
          ? `
      <div class="section">
        <div class="section-title">Accessories</div>
        ${selectedAccessories
          .map(
            (acc) => `
          <div class="item">
            <span class="item-label">${acc.name}</span>
            <span class="item-price">+$${acc.price}</span>
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      ${
        selectedModules.length > 0
          ? `
      <div class="section">
        <div class="section-title">Modules</div>
        ${selectedModules
          .map(
            (mod) => `
          <div class="item">
            <span class="item-label">${mod.name}</span>
            <span class="item-price">+$${mod.price}</span>
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <div class="section">
        <div class="item">
          <span class="item-label">Base Cable</span>
          <span class="item-price">$20.00</span>
        </div>
      </div>

      <div class="total">Total: $${totalPrice.toFixed(2)}</div>

      <div class="footer">
        CableForge Premium Cable Configurator | www.cableforge.com
      </div>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for images to load then print
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

// Export canvas as PNG
export function exportCanvasAsPNG(canvas: HTMLCanvasElement, filename = "cable-preview.png"): void {
  try {
    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error("Failed to export canvas:", error)
    alert("Failed to export image. Please try again.")
  }
}
