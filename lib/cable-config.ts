export interface CableConfig {
  connectorA: string
  connectorB: string
  cableColor: string
  sleeveColor: string
  braidType: string
  length: number
  accessories: string[]
  modules: string[]
}

export const defaultConfig: CableConfig = {
  connectorA: "xlr-male",
  connectorB: "xlr-female",
  cableColor: "#1a1a1a",
  sleeveColor: "#2d2d2d",
  braidType: "nylon",
  length: 3,
  accessories: [],
  modules: [],
}

export const connectorOptions = [
  { id: "xlr-male", name: "XLR Male", price: 15 },
  { id: "xlr-female", name: "XLR Female", price: 15 },
  { id: "trs-quarter", name: '1/4" TRS', price: 12 },
  { id: "ts-quarter", name: '1/4" TS', price: 10 },
  { id: "rca", name: "RCA", price: 8 },
  { id: "3.5mm", name: "3.5mm", price: 6 },
  { id: "speakon", name: "Speakon", price: 20 },
]

export const cableColors = [
  { id: "black", hex: "#1a1a1a", name: "Stealth Black" },
  { id: "white", hex: "#f5f5f5", name: "Arctic White" },
  { id: "red", hex: "#dc2626", name: "Ruby Red" },
  { id: "blue", hex: "#2563eb", name: "Ocean Blue" },
  { id: "green", hex: "#16a34a", name: "Forest Green" },
  { id: "orange", hex: "#ea580c", name: "Sunset Orange" },
  { id: "purple", hex: "#9333ea", name: "Royal Purple" },
  { id: "gold", hex: "#ca8a04", name: "Premium Gold" },
]

export const braidOptions = [
  { id: "none", name: "No Braid", price: 0 },
  { id: "nylon", name: "Nylon Braid", price: 5 },
  { id: "cotton", name: "Cotton Braid", price: 8 },
  { id: "techflex", name: "Techflex", price: 12 },
  { id: "carbon", name: "Carbon Fiber", price: 25 },
]

export const accessoryOptions = [
  { id: "cable-tie", name: "Velcro Cable Tie", price: 3 },
  { id: "label", name: "Custom Label", price: 5 },
  { id: "case", name: "Protective Case", price: 15 },
  { id: "boot", name: "Strain Relief Boot", price: 4 },
]

export const moduleOptions = [
  { id: "y-split", name: "Y-Split Adapter", price: 20 },
  { id: "inline-pad", name: "Inline Pad (-20dB)", price: 25 },
  { id: "ground-lift", name: "Ground Lift", price: 15 },
]

export const environmentPresets = [
  { id: "light-studio", name: "Light Studio", bg: "#e5e5e5", intensity: 1.2 },
  { id: "dark-studio", name: "Dark Studio", bg: "#1a1a1a", intensity: 0.8 },
  { id: "marble", name: "Marble", bg: "#f0f0f0", intensity: 1.0 },
  { id: "fabric", name: "Fabric", bg: "#2d2d2d", intensity: 0.9 },
  { id: "metal", name: "Brushed Metal", bg: "#3a3a3a", intensity: 1.1 },
]

export function calculatePrice(config: CableConfig): number {
  const connectorAPrice = connectorOptions.find((c) => c.id === config.connectorA)?.price || 0
  const connectorBPrice = connectorOptions.find((c) => c.id === config.connectorB)?.price || 0
  const braidPrice = braidOptions.find((b) => b.id === config.braidType)?.price || 0
  const accessoriesPrice = config.accessories.reduce((sum, acc) => {
    return sum + (accessoryOptions.find((a) => a.id === acc)?.price || 0)
  }, 0)
  const modulesPrice = config.modules.reduce((sum, mod) => {
    return sum + (moduleOptions.find((m) => m.id === mod)?.price || 0)
  }, 0)

  const basePrice = 20
  const lengthPrice = config.length * 5

  return basePrice + connectorAPrice + connectorBPrice + braidPrice + lengthPrice + accessoriesPrice + modulesPrice
}
