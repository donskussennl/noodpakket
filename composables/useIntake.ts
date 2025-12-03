// composables/useIntake.ts
import { ESSENTIAL_PRODUCTS, type EssentialProductKey } from '~/data/essentialProducts'

export type FoodInventory = 'inhouse' | 'buy' 
export type HygieneOption = 'handgel' | 'wcpapier' | 'doekjes' | 'tandenborstel' | 'maandverband'
export type ToolsOption = 'hammer' | 'tang' | 'saw' | 'opener'
export type Flightbag = 'no' | 'yes' 

interface Address {
  firstName: string
  lastName: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  phone: string
  city: string
  country: string
}

interface IntakeState {
  persons: number
  flightbag: Flightbag | null
  foodInventory: FoodInventory | null
  
  // Lijst met IDs. Mag dubbele waarden bevatten (bijv. ['radio', 'radio'] = 2 radio's)
  selectedEssentials: EssentialProductKey[]

  hygiene: HygieneOption[] | []
  tools: ToolsOption[] | []
  foodPackages: number | null
  price: number
  address: Address
}

// Prijzen configuratie
const FOOD_PACKAGE_PRICE = 15.51
const FLIGHTBAG_PRICE = 24.79        

const HYGIENE_PRICES: Record<HygieneOption, number> = {
  handgel: 1.65,
  wcpapier: 0.63,
  doekjes: 1.65,
  tandenborstel: 1.65,
  maandverband: 1.00,
}

const TOOL_PRICES: Record<ToolsOption, number> = {
  hammer: 5.79,
  tang: 4.63,
  saw: 5.78,
  opener: 3.01
}

export const useIntake = () => {
  const intake = useState<IntakeState>('intake', () => ({
    persons: 1,
    foodInventory: 'inhouse',
    
    // Standaard vullen we dit met 1x elk essentieel product
    selectedEssentials: ESSENTIAL_PRODUCTS.map(p => p.id),

    hygiene: [],
    flightbag: 'no',
    tools: [],
    foodPackages: null,
    price: 0,
    address: {
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      phone: '',
      city: '',
      country: 'Nederland',
    },
  }))

  const calculatePrice = () => {
    let price = 0
    const persons = intake.value.persons ?? 1

    // 1. Essentials berekenen
    // We itereren over de array. Als een ID er 2x in staat, wordt de prijs 2x opgeteld.
    if (intake.value.selectedEssentials) {
      intake.value.selectedEssentials.forEach(id => {
        const product = ESSENTIAL_PRODUCTS.find(p => p.id === id)
        if (product) {
          if (product.multiplies) {
            // Producten zoals water/dekens schalen mee met aantal personen
            price += product.price * persons
          } else {
            // Producten zoals radio zijn vaste prijs per stuk
            price += product.price
          }
        }
      })
    }

    // 2. Voedselpakket (is altijd per persoon)
    if (intake.value.foodInventory === 'buy') {
      price += persons * FOOD_PACKAGE_PRICE
    }

    // 3. Hygiëne → som van individuele prijzen
    if (Array.isArray(intake.value.hygiene)) {
      const hygieneTotal = intake.value.hygiene.reduce((sum, item) => {
        // De '|| 0' zorgt dat het niet crasht als er een oude ID in staat
        return sum + (HYGIENE_PRICES[item] || 0)
      }, 0)
      price += hygieneTotal
    }

    // 4. Tools → som van individuele prijzen
    if (Array.isArray(intake.value.tools)) {
      const toolsTotal = intake.value.tools.reduce((sum, item) => {
        return sum + (TOOL_PRICES[item] || 0)
      }, 0)
      price += toolsTotal
    }

    // 5. Vluchttas
    if (intake.value.flightbag === 'yes') {
      price += FLIGHTBAG_PRICE
    }

    intake.value.price = price
  }

  return {
    intake,
    calculatePrice,
    FOOD_PACKAGE_PRICE,
    HYGIENE_PRICES,
    TOOL_PRICES,
    FLIGHTBAG_PRICE,
  }
}