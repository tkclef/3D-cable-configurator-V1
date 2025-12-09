import type { CableConfig } from "./cable-config"
import {
  seriesOptions,
  modelOptions,
  connectorOptions,
  sleeveOptions,
  colorOptions,
  getLengthOptions,
  getModelType,
  calculatePrice,
} from "./cable-config"

// Ecwid product attribute mapping
export interface EcwidProductOptions {
  series: string
  model: string
  connector: string
  sleeve: string
  length: string
  color: string
}

export function mapConfigToEcwid(config: CableConfig): EcwidProductOptions {
  const series = seriesOptions.find((s) => s.id === config.series)
  const models = modelOptions[config.series] || []
  const model = models.find((m) => m.id === config.model)
  const connector = connectorOptions.find((c) => c.id === config.connector)
  const sleeve = sleeveOptions.find((s) => s.id === config.sleeve)
  const color = colorOptions.find((c) => c.id === config.color)
  const modelType = getModelType(config.series, config.model)
  const lengthOptions = getLengthOptions(modelType)
  const length = lengthOptions.find((l) => l.id === config.length)

  return {
    series: series?.name || "",
    model: model?.name || "",
    connector: connector?.name || "",
    sleeve: sleeve?.name || "None",
    length: length?.name || "",
    color: color?.name || "",
  }
}

// Add to cart via Ecwid JS API
export function addToEcwidCart(config: CableConfig) {
  const price = calculatePrice(config)
  const options = mapConfigToEcwid(config)

  // Check if Ecwid is loaded
  if (
    typeof window !== "undefined" &&
    (window as { Ecwid?: { Cart?: { addProduct: (params: unknown) => void } } }).Ecwid?.Cart
  ) {
    const Ecwid = (window as { Ecwid: { Cart: { addProduct: (params: unknown) => void } } }).Ecwid
    Ecwid.Cart.addProduct({
      id: "custom-cable", // Your Ecwid product ID
      quantity: 1,
      options: {
        Series: options.series,
        Model: options.model,
        Connector: options.connector,
        Sleeve: options.sleeve,
        Length: options.length,
        Color: options.color,
      },
      callback: (success: boolean) => {
        if (success) {
          console.log("Product added to cart")
        } else {
          console.error("Failed to add product to cart")
        }
      },
    })
  } else {
    // Fallback: Store in localStorage for later
    console.log("Ecwid not available. Cart data:", { config, price, options })
    localStorage.setItem("pendingCartItem", JSON.stringify({ config, price, options }))
    alert("Item saved! Complete your purchase when the store is available.")
  }
}

// REST API integration (server-side recommended)
export async function addToCartViaAPI(config: CableConfig, apiToken: string, storeId: string) {
  const price = calculatePrice(config)
  const options = mapConfigToEcwid(config)

  const response = await fetch(`https://app.ecwid.com/api/v3/${storeId}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      email: "", // Customer email
      items: [
        {
          name: `${options.series} - ${options.model}`,
          price: price,
          quantity: 1,
          options: Object.entries(options)
            .filter(([, value]) => value)
            .map(([name, value]) => ({
              name,
              value,
            })),
        },
      ],
    }),
  })

  return response.json()
}
