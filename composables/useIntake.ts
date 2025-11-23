// composables/useIntake.ts
export 

type FoodInventory = 'inhouse' | 'buy' 
type HygieneOption = 'handgel' | 'wcpapier' | 'doekjes' | 'tandenborstel' | 'maandverband'
type ToolsOption = 'hammer' | 'tang' | 'saw' | 'opener'
type Flightbag = 'no' | 'yes' 

interface Address {
  firstName: string
  lastName: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
}

interface IntakeState {
  persons: number
  flightbag: Flightbag | null
  foodInventory: FoodInventory | null
  hygiene: HygieneOption[] | []
  tools: ToolsOption[] | []
  foodPackages: number | null
  price: number
  address: Address
}

const BASE_PRICE = 79
const FOOD_PACKAGE_PRICE = 29
const HYGIENE_PRICES: Record<HygieneOption, number> = {
  handgel: 3,
  wcpapier: 3,
  doekjes: 0.75,
  tandenborstel: 3,
  maandverband: 2,
}
const TOOL_PRICES: Record<ToolsOption, number> = {
  hammer: 12,
  tang: 7,
  saw: 9,
  opener: 3
}
const PERSON_SURCHARGE = 6      
const FLIGHTBAG_PRICE = 20        


export const useIntake = () => {
  const intake = useState<IntakeState>('intake', () => ({
    persons: 1,

    foodInventory: 'inhouse',
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
      city: '',
      country: 'Nederland',
    },
  }))

const calculatePrice = () => {
  let price = BASE_PRICE

  const persons = intake.value.persons ?? 1
  if (persons > 1) {
    price += (persons - 1) * PERSON_SURCHARGE
  }

  if (intake.value.foodInventory === 'buy') {
    price += persons * FOOD_PACKAGE_PRICE
  }

  // Hygiëne → som van individuele prijzen
  if (Array.isArray(intake.value.hygiene)) {
    const hygieneTotal = intake.value.hygiene.reduce((sum, item) => {
      return sum + HYGIENE_PRICES[item]
    }, 0)
    price += hygieneTotal
  }

  // Tools → som van individuele prijzen
  if (Array.isArray(intake.value.tools)) {
    const toolsTotal = intake.value.tools.reduce((sum, item) => {
      return sum + TOOL_PRICES[item]
    }, 0)
    price += toolsTotal
  }

  // Vluchttas
  if (intake.value.flightbag === 'yes') {
    price += FLIGHTBAG_PRICE
  }


  intake.value.price = price
}

 



  return {
    intake,
    calculatePrice,
    BASE_PRICE,
    FOOD_PACKAGE_PRICE,
    HYGIENE_PRICES,
    TOOL_PRICES,
    PERSON_SURCHARGE,
    FLIGHTBAG_PRICE,
    }

}
