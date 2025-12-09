"use client"

import { useEffect } from "react"
import {
  type CableConfig,
  seriesOptions,
  modelOptions,
  connectorOptions,
  sleeveOptions,
  colorOptions,
  getAvailableColors,
  getLengthOptions,
  getModelType,
  environmentPresets,
} from "@/lib/cable-config"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Layers, Box, Cable, Shirt, Ruler, Palette, Sun } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface ConfigPanelProps {
  config: CableConfig
  updateConfig: (updates: Partial<CableConfig>) => void
  environment: string
  setEnvironment: (env: string) => void
}

function ThumbnailImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-secondary ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          // Fallback to placeholder on error
          e.currentTarget.src = `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(alt)}`
        }}
      />
    </div>
  )
}

export function ConfigPanel({ config, updateConfig, environment, setEnvironment }: ConfigPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    series: true,
    model: true,
    connector: true,
    sleeve: true,
    length: true,
    color: true,
    environment: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Get current models for selected series
  const currentModels = modelOptions[config.series] || []
  const currentModel = currentModels.find((m) => m.id === config.model)
  const modelType = getModelType(config.series, config.model)
  const lengthOptions = getLengthOptions(modelType)
  const availableColors = getAvailableColors(config.series, config.sleeve)

  useEffect(() => {
    const models = modelOptions[config.series]
    if (models && models.length > 0) {
      const currentModelExists = models.some((m) => m.id === config.model)
      if (!currentModelExists) {
        updateConfig({ model: models[0].id, modelFile: models[0].glbFile || "" })
      }
    }
  }, [config.series, config.model, updateConfig])

  useEffect(() => {
    if ((config.series === "echo" || config.series === "poetic") && config.sleeve !== "none") {
      if (config.color !== "black") {
        updateConfig({ color: "black" })
      }
    }
  }, [config.series, config.sleeve, config.color, updateConfig])

  useEffect(() => {
    const newModelType = getModelType(config.series, config.model)
    const newLengthOptions = getLengthOptions(newModelType)
    const lengthExists = newLengthOptions.some((l) => l.id === config.length)
    if (!lengthExists) {
      updateConfig({ length: newLengthOptions[0].id })
    }
  }, [config.series, config.model, config.length, updateConfig])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Configuration</h2>
        <p className="text-sm text-muted-foreground">Customize your cable</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Series Section */}
        <Collapsible open={openSections.series} onOpenChange={() => toggleSection("series")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Series</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.series ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <Select value={config.series} onValueChange={(value) => updateConfig({ series: value })}>
              <SelectTrigger className="bg-secondary/50 border-0 h-14">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          seriesOptions.find((s) => s.id === config.series)?.thumbnail ||
                          "/placeholder.svg?height=40&width=40&query=series" ||
                          "/placeholder.svg"
                        }
                        alt={config.series}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{seriesOptions.find((s) => s.id === config.series)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {seriesOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={option.thumbnail || `/placeholder.svg?height=40&width=40&query=${option.name}`}
                          alt={option.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Model Section */}
        <Collapsible open={openSections.model} onOpenChange={() => toggleSection("model")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Model</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.model ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <Select
              value={config.model}
              onValueChange={(value) => {
                const selectedModel = currentModels.find((m) => m.id === value)
                updateConfig({ model: value, modelFile: selectedModel?.glbFile || "" })
              }}
            >
              <SelectTrigger className="bg-secondary/50 border-0 h-14">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                      <Image
                        src={currentModel?.thumbnail || "/placeholder.svg?height=40&width=40&query=model"}
                        alt={config.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span>{currentModel?.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({currentModel?.type === "adapter" ? "Adapter" : "Cable"})
                      </span>
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currentModels.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={option.thumbnail || `/placeholder.svg?height=40&width=40&query=${option.name}`}
                          alt={option.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.type === "adapter" ? "Adapter" : "Cable"}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Connector Section */}
        <Collapsible open={openSections.connector} onOpenChange={() => toggleSection("connector")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Cable className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Connector</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.connector ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <Select value={config.connector} onValueChange={(value) => updateConfig({ connector: value })}>
              <SelectTrigger className="bg-secondary/50 border-0 h-14">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          connectorOptions.find((c) => c.id === config.connector)?.thumbnail ||
                          "/placeholder.svg?height=40&width=40&query=connector" ||
                          "/placeholder.svg"
                        }
                        alt={config.connector}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{connectorOptions.find((c) => c.id === config.connector)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {connectorOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={option.thumbnail || `/placeholder.svg?height=40&width=40&query=${option.name}`}
                          alt={option.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        {option.price > 0 && <div className="text-xs text-muted-foreground">+${option.price}</div>}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Sleeve Section */}
        <Collapsible open={openSections.sleeve} onOpenChange={() => toggleSection("sleeve")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Shirt className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Sleeve</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.sleeve ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <Select value={config.sleeve} onValueChange={(value) => updateConfig({ sleeve: value })}>
              <SelectTrigger className="bg-secondary/50 border-0 h-14">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          sleeveOptions.find((s) => s.id === config.sleeve)?.thumbnail ||
                          "/placeholder.svg?height=40&width=40&query=sleeve" ||
                          "/placeholder.svg"
                        }
                        alt={config.sleeve}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{sleeveOptions.find((s) => s.id === config.sleeve)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sleeveOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={option.thumbnail || `/placeholder.svg?height=40&width=40&query=${option.name}`}
                          alt={option.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        {option.price > 0 && <div className="text-xs text-muted-foreground">+${option.price}</div>}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(config.series === "echo" || config.series === "poetic") && config.sleeve !== "none" && (
              <p className="text-xs text-amber-500 mt-2 px-1">
                Note: {config.series.charAt(0).toUpperCase() + config.series.slice(1)} series with sleeve is only
                available in Black.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Length Section */}
        <Collapsible open={openSections.length} onOpenChange={() => toggleSection("length")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Length</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.length ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <p className="text-xs text-muted-foreground px-1 mb-2">
              {modelType === "adapter" ? "Adapters: 6\" to 10'" : "Cables: 2' to 10'"}
            </p>
            <Select value={config.length} onValueChange={(value) => updateConfig({ length: value })}>
              <SelectTrigger className="bg-secondary/50 border-0 h-14">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          lengthOptions.find((l) => l.id === config.length)?.thumbnail ||
                          "/placeholder.svg?height=40&width=40&query=length" ||
                          "/placeholder.svg"
                        }
                        alt={config.length}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{lengthOptions.find((l) => l.id === config.length)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {lengthOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded bg-secondary overflow-hidden flex-shrink-0">
                        <Image
                          src={option.thumbnail || `/placeholder.svg?height=40&width=40&query=length ${option.name}`}
                          alt={option.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        {option.price > 0 && <div className="text-xs text-muted-foreground">+${option.price}</div>}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Color Section */}
        <Collapsible open={openSections.color} onOpenChange={() => toggleSection("color")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Color</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.color ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => updateConfig({ color: color.id })}
                  className={`relative w-full aspect-square rounded-lg border-2 transition-all group ${
                    config.color === color.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {config.color === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {colorOptions.find((c) => c.id === config.color)?.name}
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Environment Section */}
        <Collapsible open={openSections.environment} onOpenChange={() => toggleSection("environment")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Environment</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.environment ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2">
            <Label className="text-sm text-muted-foreground">Background Preset</Label>
            <div className="grid grid-cols-1 gap-2">
              {environmentPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setEnvironment(preset.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    environment === preset.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: preset.bg }} />
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
