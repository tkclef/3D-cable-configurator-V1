import type { CableConfig } from "./cable-config"
import {
  connectorOptions,
  cableColors,
  braidOptions,
  accessoryOptions,
  moduleOptions,
  calculatePrice,
} from "./cable-config"

// Ecwid product attribute mapping
export interface EcwidProductOptions {
  connectorA: string
  connectorB: string
  color: string
  length: string
  braid: string
  accessories: string[]
  modules: string[]
}

export function mapConfigToEcwid(config: CableConfig): EcwidProductOptions {
  const connectorA = connectorOptions.find((c) => c.id === config.connectorA)
  const connectorB = connectorOptions.find((c) => c.id === config.connectorB)
  const cableColor = cableColors.find((c) => c.hex === config.cableColor)
  const braid = braidOptions.find((b) => b.id === config.braidType)

  return {
    connectorA: connectorA?.name || "",
    connectorB: connectorB?.name || "",
    color: cableColor?.name || "Custom",
    length: `${config.length}m`,
    braid: braid?.name || "None",
    accessories: config.accessories.map((id) => accessoryOptions.find((a) => a.id === id)?.name || ""),
    modules: config.modules.map((id) => moduleOptions.find((m) => m.id === id)?.name || ""),
  }
}

// Add to cart via Ecwid JS API
export function addToEcwidCart(config: CableConfig, storeId?: string) {
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
        "Connector A": options.connectorA,
        "Connector B": options.connectorB,
        Color: options.color,
        Length: options.length,
        Braid: options.braid,
        ...(options.accessories.length > 0 && { Accessories: options.accessories.join(", ") }),
        ...(options.modules.length > 0 && { Modules: options.modules.join(", ") }),
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
          name: "Custom Cable Configuration",
          price: price,
          quantity: 1,
          options: Object.entries(options)
            .filter(([, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
            .map(([name, value]) => ({
              name,
              value: Array.isArray(value) ? value.join(", ") : value,
            })),
        },
      ],
    }),
  })

  return response.json()
}
