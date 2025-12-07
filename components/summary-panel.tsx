"use client"
import {
  type CableConfig,
  calculatePrice,
  connectorOptions,
  cableColors,
  braidOptions,
  accessoryOptions,
  moduleOptions,
} from "@/lib/cable-config"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, FileDown, Share2, Printer, Info, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generatePDF, generateShareableLink } from "@/lib/pdf-export"
import { addToEcwidCart } from "@/lib/ecwid-integration"
import { useState } from "react"

interface SummaryPanelProps {
  config: CableConfig
}

export function SummaryPanel({ config }: SummaryPanelProps) {
  const [copied, setCopied] = useState(false)
  const totalPrice = calculatePrice(config)
  const connectorA = connectorOptions.find((c) => c.id === config.connectorA)
  const connectorB = connectorOptions.find((c) => c.id === config.connectorB)
  const cableColor = cableColors.find((c) => c.hex === config.cableColor)
  const braid = braidOptions.find((b) => b.id === config.braidType)
  const selectedAccessories = accessoryOptions.filter((a) => config.accessories.includes(a.id))
  const selectedModules = moduleOptions.filter((m) => config.modules.includes(m.id))

  const handleAddToCart = () => {
    addToEcwidCart(config)
  }

  const handleSavePDF = async () => {
    // Try to get the canvas element from the 3D viewer
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null
    await generatePDF(config, canvas || undefined)
  }

  const handleShare = async () => {
    const shareUrl = generateShareableLink(config)

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CableForge Configuration",
          text: "Check out my custom cable configuration!",
          url: shareUrl,
        })
        return
      } catch {
        // Fall through to clipboard
      }
    }

    // Fallback to clipboard
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null
    generatePDF(config, canvas || undefined)
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
            <SummaryItem label="Connector A" value={connectorA?.name || "—"} price={connectorA?.price} />
            <SummaryItem label="Connector B" value={connectorB?.name || "—"} price={connectorB?.price} />
            <SummaryItem label="Cable Color" value={cableColor?.name || "Custom"} colorSwatch={config.cableColor} />
            <SummaryItem label="Length" value={`${config.length}m`} price={config.length * 5} />
            <SummaryItem label="Braid" value={braid?.name || "None"} price={braid?.price} />
          </div>

          {/* Accessories */}
          {selectedAccessories.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Accessories</h3>
                {selectedAccessories.map((acc) => (
                  <SummaryItem key={acc.id} label={acc.name} price={acc.price} />
                ))}
              </div>
            </>
          )}

          {/* Modules */}
          {selectedModules.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Modules</h3>
                {selectedModules.map((mod) => (
                  <SummaryItem key={mod.id} label={mod.name} price={mod.price} />
                ))}
              </div>
            </>
          )}

          {/* Base Price Info */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Base</h3>
            <SummaryItem label="Premium Cable Base" price={20} />
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
                <p>Price includes base cable ($20) + selected options</p>
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
