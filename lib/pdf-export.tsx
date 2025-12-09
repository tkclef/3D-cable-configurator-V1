import type { CableConfig } from "./cable-config"
import {
  calculatePrice,
  seriesOptions,
  modelOptions,
  connectorOptions,
  sleeveOptions,
  colorOptions,
  getLengthOptions,
  getModelType,
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
  const series = seriesOptions.find((s) => s.id === config.series)
  const models = modelOptions[config.series] || []
  const model = models.find((m) => m.id === config.model)
  const connector = connectorOptions.find((c) => c.id === config.connector)
  const sleeve = sleeveOptions.find((s) => s.id === config.sleeve)
  const color = colorOptions.find((c) => c.id === config.color)
  const modelType = getModelType(config.series, config.model)
  const lengthOptions = getLengthOptions(modelType)
  const length = lengthOptions.find((l) => l.id === config.length)

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
          <span class="item-label">Series</span>
          <span class="item-value">${series?.name || "—"}</span>
        </div>
        <div class="item">
          <span class="item-label">Model</span>
          <span class="item-value">${model?.name || "—"}</span>
        </div>
        <div class="item">
          <span class="item-label">Connector</span>
          <span><span class="item-value">${connector?.name || "—"}</span> ${connector?.price ? `<span class="item-price">+$${connector.price}</span>` : ""}</span>
        </div>
        <div class="item">
          <span class="item-label">Sleeve</span>
          <span><span class="item-value">${sleeve?.name || "—"}</span> ${sleeve?.price ? `<span class="item-price">+$${sleeve.price}</span>` : ""}</span>
        </div>
        <div class="item">
          <span class="item-label">Length</span>
          <span><span class="item-value">${length?.name || "—"}</span> ${length?.price ? `<span class="item-price">+$${length.price}</span>` : ""}</span>
        </div>
        <div class="item">
          <span class="item-label">Color</span>
          <span class="item-value">${color?.name || "—"}</span>
        </div>
      </div>

      <div class="section">
        <div class="item">
          <span class="item-label">Base Cable</span>
          <span class="item-price">$50.00</span>
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
