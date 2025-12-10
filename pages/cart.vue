<script setup lang="ts">
import { ESSENTIAL_PRODUCTS } from '~/data/essentialProducts'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
// --- Intake Data ---
const {
  intake,
  calculatePrice,
  FOOD_PACKAGE_PRICE,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
} = useIntake()

// --- Data Mapping Constants ---
const HYGIENE_OPTS = [
  { id: 'handgel', label: 'Desinfectie gel', subLabel: '250 ml', image: '/images/noodpakket/handgel.png' },
  { id: 'wcpapier', label: 'Wc-papier', subLabel: '4 rollen', image: '/images/noodpakket/wcpapier.png' },
  { id: 'doekjes', label: 'Natte doekjes', subLabel: 'Pak van 50 stuks', image: '/images/noodpakket/natte-doekjes.png' },
  { id: 'tandenborstel', label: 'Tandpasta + tandenborstel', subLabel: 'Setje', image: '/images/noodpakket/tandenborstel.png' },
  { id: 'maandverband', label: 'Maandverband', subLabel: '1 pak (normaal)', image: '/images/noodpakket/maandverband.png' },
]

const TOOL_OPTS = [
  { id: 'hammer', label: 'Hamer', subLabel: 'Klauwhamer', image: '/images/noodpakket/hamer.png' },
  { id: 'opener', label: 'Blikopener', subLabel: 'RVS', image: '/images/noodpakket/blikopener.png' },
  { id: 'saw', label: 'Zaag', subLabel: 'Handzaag (hout)', image: '/images/noodpakket/zaag.png' },
  { id: 'tang', label: 'Kniptang', subLabel: 'Gehard staal', image: '/images/noodpakket/tang.png' },
]

// --- State voor Row Modes ---
const itemModes = ref<Record<string, 'default' | 'editing' | 'deleting'>>({})
const touchStartX = ref(0)
const touchCurrentId = ref<string | null>(null)

// --- Helpers ---
const formatPrice = (price: number) => price.toFixed(2)


const formatPriceKomma = (price: number) => {
  return price.toFixed(2).replace('.', ',')
}

const originalTotal = computed(() => {
  // 25% korting → je betaalt 75% van de originele prijs
  return intake.value.price / 0.75
})

const discountAmount = computed(() => {
  return originalTotal.value - intake.value.price
})

// Helper om aantallen te tellen in een array
const countOccurrences = (arr: string[]) => {
  return arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

// --- Cart Items Generator ---
const cartItems = computed(() => {
  const items = []
  const persons = intake.value.persons || 1

  // 1. Essentials (groeperen)
  if (intake.value.selectedEssentials) {
    const essentialCounts = countOccurrences(intake.value.selectedEssentials)
    
    // Loop door master list om volgorde te behouden
    ESSENTIAL_PRODUCTS.forEach(prod => {
      const count = essentialCounts[prod.id]
      if (count > 0) {
        // Als het product "multiplies" is (bv water), is het aantal = count * persons
        // Als het niet multiplies (bv radio), is het gewoon count
        const displayQty = prod.multiplies ? count * persons : count
        const totalPrice = prod.multiplies ? prod.price * count * persons : prod.price * count
        
        items.push({
          uniqueId: `essential-${prod.id}`,
          originalId: prod.id,
          type: 'essential',
          label: prod.label,
          subLabel: prod.subLabel,
          image: prod.image,
          quantity: displayQty, // Totaal aantal stuks
          baseCount: count,     // Aantal keer geselecteerd in array
          price: totalPrice,
          isFixedQuantity: prod.multiplies // Water/deken zit vast aan personen (of je moet hele sets toevoegen)
        })
      }
    })
  }

  // 2. Voedsel
  if (intake.value.foodInventory === 'buy') {
    // Hier nemen we aan dat 1 unit = pakket voor 1 huishouden (geschaald op personen)
    // Als je meerdere pakketten wilt, moet je foodPackages gebruiken als multiplier
    // Voor nu houden we het simpel op de boolean/persons logica van de intake
    items.push({
      uniqueId: 'food-pack',
      type: 'food',
      label: 'Houdbaar voedselpakket',
      subLabel: `Voor ${persons} personen (72u)`,
      image: '/images/noodpakket/voedselpakket-nood.png',
      quantity: persons, 
      baseCount: 1,
      price: persons * FOOD_PACKAGE_PRICE,
      isFixedQuantity: true // Zit vast aan personen in dit model
    })
  }

  // 3. Vluchttas
  if (intake.value.flightbag === 'yes') {
    items.push({
      uniqueId: 'flightbag-item',
      type: 'flightbag',
      label: 'Vluchttas',
      subLabel: '30 liter (Rugzak)',
      image: '/images/noodpakket/vluchttas.png',
      quantity: 1,
      baseCount: 1,
      price: FLIGHTBAG_PRICE,
      isFixedQuantity: false // Je zou 2 tassen kunnen willen
    })
  }

  // 4. Hygiëne (Groeperen)
  if (Array.isArray(intake.value.hygiene)) {
    const hygieneCounts = countOccurrences(intake.value.hygiene)
    
    HYGIENE_OPTS.forEach(def => {
      const count = hygieneCounts[def.id]
      if (count > 0) {
        items.push({
          uniqueId: `hygiene-${def.id}`,
          originalId: def.id,
          type: 'hygiene',
          label: def.label,
          subLabel: def.subLabel,
          image: def.image,
          quantity: count,
          baseCount: count,
          price: (HYGIENE_PRICES[def.id as keyof typeof HYGIENE_PRICES] || 0) * count,
          isFixedQuantity: false
        })
      }
    })
  }

  // 5. Tools (Groeperen)
  if (Array.isArray(intake.value.tools)) {
    const toolCounts = countOccurrences(intake.value.tools)

    TOOL_OPTS.forEach(def => {
      const count = toolCounts[def.id]
      if (count > 0) {
        items.push({
          uniqueId: `tool-${def.id}`,
          originalId: def.id,
          type: 'tool',
          label: def.label,
          subLabel: def.subLabel,
          image: def.image,
          quantity: count,
          baseCount: count,
          price: (TOOL_PRICES[def.id as keyof typeof TOOL_PRICES] || 0) * count,
          isFixedQuantity: false
        })
      }
    })
  }

  return items
})

// --- Interaction Handlers ---

const setEditMode = (uniqueId: string) => {
  // Sluit alle anderen
  Object.keys(itemModes.value).forEach(k => itemModes.value[k] = 'default')
  itemModes.value[uniqueId] = 'editing'
}

const setDeleteMode = (uniqueId: string) => {
  Object.keys(itemModes.value).forEach(k => itemModes.value[k] = 'default')
  itemModes.value[uniqueId] = 'deleting'
}

const resetMode = (uniqueId: string) => {
  itemModes.value[uniqueId] = 'default'
}

// AANTAL VERHOGEN
const increaseQty = (item: any) => {
  if (item.type === 'essential') {
    // Voeg ID toe aan array
    intake.value.selectedEssentials.push(item.originalId)
  } else if (item.type === 'hygiene') {
    intake.value.hygiene.push(item.originalId)
  } else if (item.type === 'tool') {
    intake.value.tools.push(item.originalId)
  } else if (item.type === 'flightbag') {
    // Vluchttas is in huidige setup 'yes'/'no'. 
    // Om er 2 te ondersteunen zou de intake state moeten veranderen naar number.
    // Voor nu laten we flightbag enkelvoudig, of we doen een console.warn.
    // Als je echt meerdere tassen wilt, moet useIntake aangepast worden.
    // Voor de demo doen we even niks of switchen we logica (maar dat is complexer).
    // Workaround: We laten het hier even bij 1 max voor flightbag in deze structuur.
  }
  calculatePrice()
}

// AANTAL VERLAGEN
const decreaseQty = (item: any) => {
  // Als er meer dan 1 is: eentje weghalen
  if (item.baseCount > 1) {
    if (item.type === 'essential') {
      const idx = intake.value.selectedEssentials.indexOf(item.originalId)
      if (idx > -1) intake.value.selectedEssentials.splice(idx, 1)
    } else if (item.type === 'hygiene') {
      const idx = intake.value.hygiene.indexOf(item.originalId)
      if (idx > -1) intake.value.hygiene.splice(idx, 1)
    } else if (item.type === 'tool') {
      const idx = intake.value.tools.indexOf(item.originalId)
      if (idx > -1) intake.value.tools.splice(idx, 1)
    }
    // Als flightbag > 1 zou kunnen, hier ook logic.
  } else {
    // Als het de laatste is -> Delete Mode
    setDeleteMode(item.uniqueId)
  }
  calculatePrice()
}

// ITEM VERWIJDEREN
const removeItem = (item: any) => {
  if (item.type === 'essential') {
    intake.value.selectedEssentials = intake.value.selectedEssentials.filter((id: string) => id !== item.originalId)
  } else if (item.type === 'food') {
    intake.value.foodInventory = 'inhouse'
  } else if (item.type === 'flightbag') {
    intake.value.flightbag = 'no'
  } else if (item.type === 'hygiene') {
    intake.value.hygiene = intake.value.hygiene.filter((id: string) => id !== item.originalId)
  } else if (item.type === 'tool') {
    intake.value.tools = intake.value.tools.filter((id: string) => id !== item.originalId)
  }
  
  delete itemModes.value[item.uniqueId]
  calculatePrice()
}

// --- Touch / Swipe Handling ---
const onTouchStart = (e: TouchEvent, uniqueId: string) => {
  touchStartX.value = e.touches[0].clientX
  touchCurrentId.value = uniqueId
}

const onTouchEnd = (e: TouchEvent, uniqueId: string) => {
  if (touchCurrentId.value !== uniqueId) return
  
  const endX = e.changedTouches[0].clientX
  const diff = touchStartX.value - endX

  if (diff > 50) {
    setDeleteMode(uniqueId)
  } else if (diff < -50) {
    resetMode(uniqueId)
  }
  
  touchCurrentId.value = null
}

const goToCheckout = () => {
  calculatePrice()
  navigateTo('/checkout')
}

// Klik buiten items reset de state
const handleGlobalClick = (e: MouseEvent) => {
  // Simpele check: als we niet op een 'interactive-row' klikken, resetten
  const target = e.target as HTMLElement
  if (!target.closest('.interactive-row')) {
    Object.keys(itemModes.value).forEach(k => itemModes.value[k] = 'default')
  }
}

onMounted(() => {
  calculatePrice()
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})

watch(intake, () => calculatePrice(), { deep: true })
</script>

<template>
  <div class="min-h-screen pb-32">
    <div class="sticky top-0 z-30  backdrop-blur-sm border-b border-slate-100">
      <div class="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Winkelmandje</h1>
        <NuxtLink to="/samenstellen-deluxe" class="text-sm font-medium text-emerald-600">
          Aanpassen
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-2 overflow-hidden">
      
      <div class="divide-y divide-slate-100">
        <div 
          v-for="item in cartItems" 
          :key="item.uniqueId" 
          class="relative h-[88px] w-full interactive-row"
          @touchstart="onTouchStart($event, item.uniqueId)"
          @touchend="onTouchEnd($event, item.uniqueId)"
        >
          <div class="absolute inset-y-0 left-0 flex items-center gap-3 pl-4 w-1/2">
            <button 
              @click.stop="decreaseQty(item)"
              class="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-600 flex items-center justify-center font-bold text-lg shadow-sm active:scale-95 transition-colors hover:bg-slate-50"
            >
              −
            </button>
            
            <span class="text-base font-semibold w-4 text-center">{{ item.quantity }}</span>
            
            <button 
              @click.stop="increaseQty(item)"
              class="w-8 h-8 rounded-full border border-slate-300 bg-white text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm active:scale-95 transition-colors hover:bg-slate-50"
              :class="{'opacity-50 cursor-not-allowed': item.isFixedQuantity}"
              :disabled="item.isFixedQuantity"
            >
              +
            </button>
          </div>

          <div class="absolute inset-y-0 right-0 flex items-center justify-end pr-0 w-1/3">
            <button
              @click.stop="removeItem(item)"
              class="h-full w-24 bg-[#E00000] text-white font-semibold text-sm flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              Verwijderen
            </button>
          </div>

          <div 
            class="absolute inset-0 bg-white flex items-start gap-4 py-4 px-2 transition-transform duration-300 ease-out z-10 border-b border-transparent"
            :class="{
              'translate-x-[120px]': itemModes[item.uniqueId] === 'editing',
              '-translate-x-[100px]': itemModes[item.uniqueId] === 'deleting',
              'translate-x-0': itemModes[item.uniqueId] === 'default' || !itemModes[item.uniqueId]
            }"
            @click="resetMode(item.uniqueId)"
          >
            
            <div class="shrink-0 pt-3 transition-opacity duration-200"
                 :class="itemModes[item.uniqueId] === 'editing' ? 'opacity-0 pointer-events-none' : 'opacity-100'"
                 @click.stop="setEditMode(item.uniqueId)">
              <div 
                class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200"
              >
                {{ item.quantity }}
              </div>
            </div>

            <div class="shrink-0 w-14 h-14 bg-slate-50 rounded-lg overflow-hidden">
              <img 
                :src="item.image" 
                :alt="item.label" 
                class="w-full h-full object-cover mix-blend-multiply" 
              />
            </div>

            <div class="flex-1 min-w-0 pt-1 pointer-events-none">
              <h3 class="text-base font-medium text-slate-900 leading-tight">
                {{ item.label }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5 truncate">
                {{ item.subLabel }}
              </p>
            </div>

            <div class="shrink-0 pt-1 text-right pointer-events-none">
              <span class="text-base font-bold text-slate-900 tracking-tight">
                {{ formatPrice(item.price) }}
              </span>
            </div>
          </div>

        </div>
      </div>

    <div class="mt-6 pt-6 border-t border-slate-100 space-y-3 pb-8">
        <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Normale prijs</span>
            <span class="font-medium text-slate-900">€ {{ formatPrice(originalTotal) }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Korting (25%)</span>
            <span class="font-medium text-red-700">- € {{ formatPrice(discountAmount) }}</span>
        </div>
        
        <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500">Bezorging</span>
            <span class="font-medium text-emerald-600">Altijd gratis</span>
        </div>

        <div class="flex justify-between items-center text-lg pt-2 border-t border-slate-50 mt-2">
            <span class="font-medium text-slate-900">Totaal Noodpakket</span>
            <span class="font-bold text-slate-900">€ {{ formatPrice(intake.price) }}</span>
        </div>
    </div>



      <div class="flex items-center justify-center gap-4 opacity-40 grayscale pb-4">
        <img src="/images/ideal.svg" alt="iDEAL" class="h-5 w-auto" />
        <img src="/images/visa.svg" alt="Visa" class="h-5 w-auto" />
        <img src="/images/mastercard.svg" alt="Mastercard" class="h-5 w-auto" />
        <img src="/images/postnl.svg" alt="PostNL" class="h-5 w-auto" />
      </div>

    </div>

    <div class="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 p-4 z-40 safe-area-bottom">
      <div class="max-w-2xl mx-auto">
        <button
          type="button"
          class="w-full group relative flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold py-3.5 px-5 rounded-full shadow-md transition-all active:scale-[0.98]"
          @click="goToCheckout"
        >
          <span>Ik ga bestellen</span>
          <div class="flex items-center gap-2">
            <span class="bg-black/10 px-2 py-0.5 rounded text-white group-hover:bg-black/20 transition-colors">
              € {{ formatPrice(intake.price) }}
            </span>
          </div>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.safe-area-padding {
  padding-bottom: 16px; /* Default padding */
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
</style>