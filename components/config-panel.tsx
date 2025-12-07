"use client"

import {
  type CableConfig,
  connectorOptions,
  cableColors,
  braidOptions,
  accessoryOptions,
  moduleOptions,
  environmentPresets,
} from "@/lib/cable-config"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Cable, Palette, Ruler, Sparkles, Box, Sun } from "lucide-react"
import { useState } from "react"

interface ConfigPanelProps {
  config: CableConfig
  updateConfig: (updates: Partial<CableConfig>) => void
  environment: string
  setEnvironment: (env: string) => void
}

export function ConfigPanel({ config, updateConfig, environment, setEnvironment }: ConfigPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    connectors: true,
    appearance: true,
    length: true,
    accessories: false,
    modules: false,
    environment: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Configuration</h2>
        <p className="text-sm text-muted-foreground">Customize your cable</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Connectors Section */}
        <Collapsible open={openSections.connectors} onOpenChange={() => toggleSection("connectors")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Cable className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Connectors</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.connectors ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Connector A</Label>
              <Select value={config.connectorA} onValueChange={(value) => updateConfig({ connectorA: value })}>
                <SelectTrigger className="bg-secondary/50 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {connectorOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} (+${option.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Connector B</Label>
              <Select value={config.connectorB} onValueChange={(value) => updateConfig({ connectorB: value })}>
                <SelectTrigger className="bg-secondary/50 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {connectorOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} (+${option.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Appearance Section */}
        <Collapsible open={openSections.appearance} onOpenChange={() => toggleSection("appearance")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Appearance</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.appearance ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Cable Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {cableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateConfig({ cableColor: color.hex })}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      config.cableColor === color.hex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Braid Type</Label>
              <Select value={config.braidType} onValueChange={(value) => updateConfig({ braidType: value })}>
                <SelectTrigger className="bg-secondary/50 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {braidOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} {option.price > 0 && `(+$${option.price})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <CollapsibleContent className="pt-3 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Cable Length</Label>
                <span className="text-sm font-medium">{config.length}m</span>
              </div>
              <Slider
                value={[config.length]}
                onValueChange={([value]) => updateConfig({ length: value })}
                min={0.5}
                max={15}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5m</span>
                <span>15m</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Accessories Section */}
        <Collapsible open={openSections.accessories} onOpenChange={() => toggleSection("accessories")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Accessories</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.accessories ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {accessoryOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={config.accessories.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateConfig({ accessories: [...config.accessories, option.id] })
                      } else {
                        updateConfig({ accessories: config.accessories.filter((a) => a !== option.id) })
                      }
                    }}
                  />
                  <span className="text-sm">{option.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">+${option.price}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Modules Section */}
        <Collapsible open={openSections.modules} onOpenChange={() => toggleSection("modules")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Modules</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.modules ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {moduleOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={config.modules.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateConfig({ modules: [...config.modules, option.id] })
                      } else {
                        updateConfig({ modules: config.modules.filter((m) => m !== option.id) })
                      }
                    }}
                  />
                  <span className="text-sm">{option.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">+${option.price}</span>
              </label>
            ))}
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
