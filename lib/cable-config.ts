export interface CableConfig {
  series: string
  model: string
  connector: string
  sleeve: string
  length: string
  color: string
  modelFile: string
}

export const defaultConfig: CableConfig = {
  series: "echo",
  model: "echo",
  connector: "2pin",
  sleeve: "none",
  length: "4ft",
  color: "black",
  modelFile: "",
}

// Series with thumbnails
export const seriesOptions = [
  { id: "echo", name: "Echo Series", thumbnail: "/thumbnails/echo-series.jpg", description: "Entry-level audiophile" },
  { id: "exo", name: "Exo Series", thumbnail: "/thumbnails/exo-series.jpg", description: "Premium performance" },
  { id: "poetic", name: "Poetic Series", thumbnail: "/thumbnails/poetic-series.jpg", description: "Artisan crafted" },
  { id: "x", name: "X Series", thumbnail: "/thumbnails/x-series.jpg", description: "Professional grade" },
  { id: "x6", name: "X6 Series", thumbnail: "/thumbnails/x6-series.jpg", description: "6-wire configuration" },
  { id: "x8", name: "X8 Series", thumbnail: "/thumbnails/x8-series.jpg", description: "8-wire flagship" },
]

export const modelOptions: Record<
  string,
  Array<{ id: string; name: string; thumbnail: string; glbFile: string; type: "adapter" | "cable" }>
> = {
  echo: [
    {
      id: "echo",
      name: "Echo",
      thumbnail: "/thumbnails/echo.jpg",
      glbFile: "Echo.glb",
      type: "cable",
    },
    {
      id: "echo-bluetooth",
      name: "Echo Custom Bluetooth Cable",
      thumbnail: "/thumbnails/echo-bluetooth.jpg",
      glbFile: "Echo Series Custom Bluetooth Cable.glb",
      type: "cable",
    },
    {
      id: "echo-tws-adapter",
      name: "Echo Custom TWS Adapter",
      thumbnail: "/thumbnails/echo-tws-adapter.jpg",
      glbFile: "Echo Series Custom TWS Adapter.glb",
      type: "adapter",
    },
    {
      id: "echo-tws-cable",
      name: "Echo Custom TWS Cable",
      thumbnail: "/thumbnails/echo-tws-cable.jpg",
      glbFile: "Echo Series Custom TWS Cable.glb",
      type: "cable",
    },
  ],
  exo: [
    { id: "exo", name: "Exo", thumbnail: "/thumbnails/exo.jpg", glbFile: "Exo.glb", type: "cable" },
    {
      id: "exo-adapter",
      name: "Exo Adapter",
      thumbnail: "/thumbnails/exo-adapter.jpg",
      glbFile: "Exo Adapter.glb",
      type: "adapter",
    },
    {
      id: "exo-bluetooth",
      name: "Exo Custom Bluetooth Cable",
      thumbnail: "/thumbnails/exo-bluetooth.jpg",
      glbFile: "Exo Series Custom Bluetooth Cable.glb",
      type: "cable",
    },
  ],
  poetic: [
    {
      id: "poetic",
      name: "Poetic",
      thumbnail: "/thumbnails/poetic.jpg",
      glbFile: "Poetic.glb",
      type: "cable",
    },
    {
      id: "poetic-bluetooth",
      name: "Poetic Custom Bluetooth Cable",
      thumbnail: "/thumbnails/poetic-bluetooth.jpg",
      glbFile: "Poetic Series Custom Bluetooth Cable.glb",
      type: "cable",
    },
    {
      id: "poetic-tws-adapter",
      name: "Poetic Custom TWS Adapter",
      thumbnail: "/thumbnails/poetic-tws-adapter.jpg",
      glbFile: "Poetic Series Custom TWS Adapter.glb",
      type: "adapter",
    },
    {
      id: "poetic-tws-cable",
      name: "Poetic Custom TWS Cable",
      thumbnail: "/thumbnails/poetic-tws-cable.jpg",
      glbFile: "Poetic Series Custom TWS Cable.glb",
      type: "cable",
    },
  ],
  x: [{ id: "x", name: "X", thumbnail: "/thumbnails/x.jpg", glbFile: "X.glb", type: "cable" }],
  x6: [
    { id: "x6", name: "X6", thumbnail: "/thumbnails/x6.jpg", glbFile: "X6.glb", type: "cable" },
    {
      id: "x6-bluetooth",
      name: "X6 Custom Bluetooth Cable",
      thumbnail: "/thumbnails/x6-bluetooth.jpg",
      glbFile: "X6 Series Custom Bluetooth Cable.glb",
      type: "cable",
    },
    {
      id: "x6-tws-adapter",
      name: "X6 Custom TWS Adapter",
      thumbnail: "/thumbnails/x6-tws-adapter.jpg",
      glbFile: "X6 Series Custom TWS Adapter.glb",
      type: "adapter",
    },
    {
      id: "x6-tws-cable",
      name: "X6 Custom TWS Cable",
      thumbnail: "/thumbnails/x6-tws-cable.jpg",
      glbFile: "X6 Series Custom TWS Cable.glb",
      type: "cable",
    },
  ],
  x8: [
    { id: "x8", name: "X8", thumbnail: "/thumbnails/x8.jpg", glbFile: "X8.glb", type: "cable" },
    {
      id: "x8-bluetooth",
      name: "X8 Custom Bluetooth Cable",
      thumbnail: "/thumbnails/x8-bluetooth.jpg",
      glbFile: "X8 Series Custom Bluetooth Cable.glb",
      type: "cable",
    },
    {
      id: "x8-tws-adapter",
      name: "X8 Custom TWS Adapter",
      thumbnail: "/thumbnails/x8-tws-adapter.jpg",
      glbFile: "X8 Series Custom TWS Adapter.glb",
      type: "adapter",
    },
    {
      id: "x8-tws-cable",
      name: "X8 Custom TWS Cable",
      thumbnail: "/thumbnails/x8-tws-cable.jpg",
      glbFile: "X8 Series Custom TWS Cable.glb",
      type: "cable",
    },
  ],
}

// Connector options with thumbnails
export const connectorOptions = [
  { id: "2pin", name: "2-Pin", thumbnail: "/thumbnails/connector-2pin.jpg", price: 0 },
  { id: "mmcx", name: "MMCX", thumbnail: "/thumbnails/connector-mmcx.jpg", price: 5 },
  { id: "a2dc", name: "A2DC", thumbnail: "/thumbnails/connector-a2dc.jpg", price: 8 },
  { id: "ie80", name: "IE80", thumbnail: "/thumbnails/connector-ie80.jpg", price: 10 },
  { id: "ipx", name: "IPX", thumbnail: "/thumbnails/connector-ipx.jpg", price: 6 },
  { id: "qdc", name: "QDC", thumbnail: "/thumbnails/connector-qdc.jpg", price: 12 },
  { id: "tfz", name: "TFZ", thumbnail: "/thumbnails/connector-tfz.jpg", price: 8 },
  { id: "jh-audio", name: "JH Audio", thumbnail: "/thumbnails/connector-jh.jpg", price: 15 },
  { id: "ue", name: "UE/IPX", thumbnail: "/thumbnails/connector-ue.jpg", price: 12 },
]

// Sleeve options with thumbnails
export const sleeveOptions = [
  { id: "none", name: "No Sleeve", thumbnail: "/thumbnails/sleeve-none.jpg", price: 0 },
  { id: "paracord", name: "Paracord", thumbnail: "/thumbnails/sleeve-paracord.jpg", price: 15 },
  { id: "nylon", name: "Nylon Braid", thumbnail: "/thumbnails/sleeve-nylon.jpg", price: 10 },
  { id: "techflex", name: "Techflex", thumbnail: "/thumbnails/sleeve-techflex.jpg", price: 20 },
  { id: "cotton", name: "Cotton Braid", thumbnail: "/thumbnails/sleeve-cotton.jpg", price: 12 },
  { id: "pet", name: "PET Braid", thumbnail: "/thumbnails/sleeve-pet.jpg", price: 8 },
]

// Length options - Adapters: 6" to 10', Cables: 2' to 10'
export const adapterLengthOptions = [
  { id: "6in", name: '6"', thumbnail: "/thumbnails/length-6in.jpg", price: 0 },
  { id: "8in", name: '8"', thumbnail: "/thumbnails/length-8in.jpg", price: 2 },
  { id: "10in", name: '10"', thumbnail: "/thumbnails/length-10in.jpg", price: 4 },
  { id: "1ft", name: "1'", thumbnail: "/thumbnails/length-1ft.jpg", price: 5 },
  { id: "1.5ft", name: "1.5'", thumbnail: "/thumbnails/length-1-5ft.jpg", price: 8 },
  { id: "2ft", name: "2'", thumbnail: "/thumbnails/length-2ft.jpg", price: 10 },
  { id: "3ft", name: "3'", thumbnail: "/thumbnails/length-3ft.jpg", price: 15 },
  { id: "4ft", name: "4'", thumbnail: "/thumbnails/length-4ft.jpg", price: 20 },
  { id: "5ft", name: "5'", thumbnail: "/thumbnails/length-5ft.jpg", price: 25 },
  { id: "6ft", name: "6'", thumbnail: "/thumbnails/length-6ft.jpg", price: 30 },
  { id: "8ft", name: "8'", thumbnail: "/thumbnails/length-8ft.jpg", price: 40 },
  { id: "10ft", name: "10'", thumbnail: "/thumbnails/length-10ft.jpg", price: 50 },
]

export const cableLengthOptions = [
  { id: "2ft", name: "2'", thumbnail: "/thumbnails/length-2ft.jpg", price: 0 },
  { id: "3ft", name: "3'", thumbnail: "/thumbnails/length-3ft.jpg", price: 5 },
  { id: "4ft", name: "4'", thumbnail: "/thumbnails/length-4ft.jpg", price: 10 },
  { id: "5ft", name: "5'", thumbnail: "/thumbnails/length-5ft.jpg", price: 15 },
  { id: "6ft", name: "6'", thumbnail: "/thumbnails/length-6ft.jpg", price: 20 },
  { id: "8ft", name: "8'", thumbnail: "/thumbnails/length-8ft.jpg", price: 30 },
  { id: "10ft", name: "10'", thumbnail: "/thumbnails/length-10ft.jpg", price: 40 },
]

// Color options with thumbnails - hex values and restrictions
export const colorOptions = [
  { id: "black", name: "Black", hex: "#1a1a1a", thumbnail: "/thumbnails/color-black.jpg" },
  { id: "white", name: "White", hex: "#f5f5f5", thumbnail: "/thumbnails/color-white.jpg" },
  { id: "silver", name: "Silver", hex: "#c0c0c0", thumbnail: "/thumbnails/color-silver.jpg" },
  { id: "gold", name: "Gold", hex: "#d4af37", thumbnail: "/thumbnails/color-gold.jpg" },
  { id: "copper", name: "Copper", hex: "#b87333", thumbnail: "/thumbnails/color-copper.jpg" },
  { id: "blue", name: "Blue", hex: "#2563eb", thumbnail: "/thumbnails/color-blue.jpg" },
  { id: "red", name: "Red", hex: "#dc2626", thumbnail: "/thumbnails/color-red.jpg" },
  { id: "green", name: "Green", hex: "#16a34a", thumbnail: "/thumbnails/color-green.jpg" },
  { id: "purple", name: "Purple", hex: "#9333ea", thumbnail: "/thumbnails/color-purple.jpg" },
  { id: "orange", name: "Orange", hex: "#ea580c", thumbnail: "/thumbnails/color-orange.jpg" },
]

// Color restrictions: Echo and Poetic with sleeve = black only
export function getAvailableColors(series: string, sleeve: string): typeof colorOptions {
  if ((series === "echo" || series === "poetic") && sleeve !== "none") {
    return colorOptions.filter((c) => c.id === "black")
  }
  return colorOptions
}

// Get the appropriate length options based on model type
export function getLengthOptions(modelType: "adapter" | "cable") {
  return modelType === "adapter" ? adapterLengthOptions : cableLengthOptions
}

// Get GLB path for current model
export function getModelGlbPath(series: string, model: string): string {
  const models = modelOptions[series]
  const selectedModel = models?.find((m) => m.id === model)
  return selectedModel?.glbPath || ""
}

// Get model type (adapter or cable)
export function getModelType(series: string, model: string): "adapter" | "cable" {
  const models = modelOptions[series]
  const selectedModel = models?.find((m) => m.id === model)
  return selectedModel?.type || "cable"
}

export const environmentPresets = [
  { id: "light-studio", name: "Light Studio", bg: "#e5e5e5", intensity: 1.2 },
  { id: "dark-studio", name: "Dark Studio", bg: "#1a1a1a", intensity: 0.8 },
  { id: "marble", name: "Marble", bg: "#f0f0f0", intensity: 1.0 },
  { id: "fabric", name: "Fabric", bg: "#2d2d2d", intensity: 0.9 },
  { id: "metal", name: "Brushed Metal", bg: "#3a3a3a", intensity: 1.1 },
]

export function calculatePrice(config: CableConfig): number {
  const connector = connectorOptions.find((c) => c.id === config.connector)
  const sleeve = sleeveOptions.find((s) => s.id === config.sleeve)
  const modelType = getModelType(config.series, config.model)
  const lengthOptions = getLengthOptions(modelType)
  const length = lengthOptions.find((l) => l.id === config.length)

  const basePrice = 50 // Base price for cable
  const connectorPrice = connector?.price || 0
  const sleevePrice = sleeve?.price || 0
  const lengthPrice = length?.price || 0

  return basePrice + connectorPrice + sleevePrice + lengthPrice
}

export function getModelGlbFile(series: string, model: string): string {
  const models = modelOptions[series]
  const selectedModel = models?.find((m) => m.id === model)
  return selectedModel?.glbFile || ""
}
