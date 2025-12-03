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
  
  // Nieuw: bijhouden welke essentials aan staan
  selectedEssentials: EssentialProductKey[]

  hygiene: HygieneOption[] | []
  tools: ToolsOption[] | []
  foodPackages: number | null
  price: number
  address: Address
}

// Prijzen voor optionele items
const FOOD_PACKAGE_PRICE = 27.14
const FLIGHTBAG_PRICE = 30.99        

const HYGIENE_PRICES: Record<HygieneOption, number> = {
  handgel: 2.07,
  wcpapier: 0.63,
  doekjes: 2.07,
  tandenborstel: 2.32,
  maandverband: 2.07,
}
const TOOL_PRICES: Record<ToolsOption, number> = {
  hammer: 7.23,
  tang: 5.79,
  saw: 7.23,
  opener: 3.76
}

export const useIntake = () => {
  const intake = useState<IntakeState>('intake', () => ({
    persons: 1,
    foodInventory: 'inhouse',
    
    // Standaard alles geselecteerd
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
    // Sommige producten (water, deken) gaan x personen, andere zijn 1x per pakket
    if (intake.value.selectedEssentials) {
      intake.value.selectedEssentials.forEach(id => {
        const product = ESSENTIAL_PRODUCTS.find(p => p.id === id)
        if (product) {
          if (product.multiplies) {
            price += product.price * persons
          } else {
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
        return sum + HYGIENE_PRICES[item]
      }, 0)
      price += hygieneTotal
    }

    // 4. Tools → som van individuele prijzen
    if (Array.isArray(intake.value.tools)) {
      const toolsTotal = intake.value.tools.reduce((sum, item) => {
        return sum + TOOL_PRICES[item]
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