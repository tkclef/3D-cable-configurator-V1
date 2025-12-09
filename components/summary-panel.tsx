"use client"
import {
  type CableConfig,
  calculatePrice,
  seriesOptions,
  modelOptions,
  connectorOptions,
  sleeveOptions,
  colorOptions,
  getLengthOptions,
  getModelType,
} from "@/lib/cable-config"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, FileDown, Share2, Printer, Info, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

interface SummaryPanelProps {
  config: CableConfig
}

export function SummaryPanel({ config }: SummaryPanelProps) {
  const [copied, setCopied] = useState(false)
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

  const handleAddToCart = () => {
    // Ecwid integration placeholder
    console.log("Adding to cart:", config)
    alert("Added to cart!")
  }

  const handleSavePDF = async () => {
    // PDF generation placeholder
    console.log("Generating PDF for:", config)
    alert("PDF download started!")
  }

  const handleShare = async () => {
    const configString = btoa(JSON.stringify(config))
    const shareUrl = `${window.location.origin}?config=${configString}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cable Configuration",
          text: "Check out my custom cable configuration!",
          url: shareUrl,
        })
        return
      } catch {
        // Fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <p className="text-sm text-muted-foreground">Review your configuration</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Configuration Summary */}
          <div className="space-y-3">
            <SummaryItem label="Series" value={series?.name || "—"} />
            <SummaryItem label="Model" value={model?.name || "—"} />
            <SummaryItem label="Connector" value={connector?.name || "—"} price={connector?.price} />
            <SummaryItem label="Sleeve" value={sleeve?.name || "—"} price={sleeve?.price} />
            <SummaryItem label="Length" value={length?.name || "—"} price={length?.price} />
            <SummaryItem label="Color" value={color?.name || "—"} colorSwatch={color?.hex} />
          </div>

          {/* Base Price Info */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Base</h3>
            <SummaryItem label="Premium Cable Base" price={50} />
          </div>
        </div>

        {/* Price & Actions */}
        <div className="p-4 border-t border-border space-y-4 bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-3xl font-bold">${totalPrice.toFixed(2)}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Price includes base cable ($50) + selected options</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Button onClick={handleAddToCart} className="w-full h-12 text-base font-medium">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={handleSavePDF} className="flex-col h-auto py-3">
              <FileDown className="w-4 h-4 mb-1" />
              <span className="text-xs">PDF</span>
            </Button>
            <Button variant="secondary" onClick={handleShare} className="flex-col h-auto py-3">
              {copied ? <Check className="w-4 h-4 mb-1" /> : <Share2 className="w-4 h-4 mb-1" />}
              <span className="text-xs">{copied ? "Copied!" : "Share"}</span>
            </Button>
            <Button variant="secondary" onClick={handlePrint} className="flex-col h-auto py-3">
              <Printer className="w-4 h-4 mb-1" />
              <span className="text-xs">Print</span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function SummaryItem({
  label,
  value,
  price,
  colorSwatch,
}: {
  label: string
  value?: string
  price?: number
  colorSwatch?: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {colorSwatch && (
          <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: colorSwatch }} />
        )}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-medium">{value}</span>}
        {price !== undefined && price > 0 && <span className="text-xs text-muted-foreground">+${price}</span>}
      </div>
    </div>
  )
}
