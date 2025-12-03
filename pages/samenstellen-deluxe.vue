<script setup lang="ts">
// Zorg dat VimeoEmbed.vue in je /components map staat, dan werkt de auto-import van Nuxt.
// Als je het handmatig moet importeren:
// import VimeoEmbed from '~/components/VimeoEmbed.vue'

import {
  ESSENTIAL_PRODUCTS,
  type EssentialProductKey,
  type EssentialProduct
} from '~/data/essentialProducts'

// --- State voor Modals ---
const showEssentialInfo = ref(false)
const selectedEssentialKey = ref<EssentialProductKey | null>(null)
const showVideoModal = ref(false)
const showPersonsInfo = ref(false)
const showPackageInfo = ref(false)
const showToolsInfo = ref(false)

// --- Intake Logic ---
const {
  intake,
  calculatePrice,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
  FOOD_PACKAGE_PRICE
} = useIntake()

// --- Lokale data met subLabels ---
const HYGIENE_OPTS = [
  { id: 'handgel', label: 'Desinfectie gel', subLabel: '250 ml', image: '/images/noodpakket/handgel.jpg' },
  { id: 'wcpapier', label: 'Wc-papier', subLabel: '4 rollen', image: '/images/noodpakket/wcpapier.jpg' },
  { id: 'doekjes', label: 'Natte doekjes', subLabel: 'Pak van 50 stuks', image: '/images/noodpakket/doekjes.jpg' },
  { id: 'tandenborstel', label: 'Tandpasta + tandenborstel', subLabel: 'Setje', image: '/images/noodpakket/tandenborstel.jpg' },
  { id: 'maandverband', label: 'Maandverband', subLabel: '1 pak (normaal)', image: '/images/noodpakket/maandverband.jpg' },
] as const

const TOOL_OPTS = [
  { id: 'hammer', label: 'Hamer', subLabel: 'Klauwhamer', image: '/images/noodpakket/hammer.jpg' },
  { id: 'opener', label: 'Blikopener', subLabel: 'RVS', image: '/images/noodpakket/opener.jpg' },
  { id: 'saw', label: 'Zaag', subLabel: 'Handzaag (hout)', image: '/images/noodpakket/saw.jpg' },
  { id: 'tang', label: 'Kniptang', subLabel: 'Gehard staal', image: '/images/noodpakket/tang.jpg' },
] as const

// --- Computed & Helpers ---

const selectedEssentialProduct = computed(() => {
  return ESSENTIAL_PRODUCTS.find(p => p.id === selectedEssentialKey.value) || null
})

const formatPriceDot = (amount: number) => {
  return amount.toFixed(2)
}

const getProductLabel = (product?: EssentialProduct | null) => {
  if (!product) return ''
  const persons = intake.value.persons || 1
  if (product.multiplies && persons > 1) {
    return `${persons}x ${product.label}`
  }
  return product.label
}

const getProductPrice = (product: EssentialProduct) => {
  const persons = intake.value.persons || 1
  const price = product.multiplies ? product.price * persons : product.price
  return formatPriceDot(price)
}

// Hygiëne Bundel Helpers
const hygieneBundlePrice = computed(() => {
  return Object.values(HYGIENE_PRICES).reduce((sum, price) => sum + price, 0)
})

const isHygieneBundleSelected = computed(() => {
  return intake.value.hygiene.length === Object.keys(HYGIENE_PRICES).length
})

const toggleHygieneBundle = () => {
  if (isHygieneBundleSelected.value) {
    intake.value.hygiene = []
  } else {
    intake.value.hygiene = Object.keys(HYGIENE_PRICES) as any[]
  }
}

// --- Actions (Toggles etc) ---
const openEssentialProduct = (key: EssentialProductKey) => {
  selectedEssentialKey.value = key
  showEssentialInfo.value = true
}
const closeEssentialProduct = () => {
  showEssentialInfo.value = false
  selectedEssentialKey.value = null
}
const openVideoModal = () => showVideoModal.value = true
const closeVideoModal = () => showVideoModal.value = false

const toggleEssential = (id: EssentialProductKey) => {
  const list = intake.value.selectedEssentials
  if (list.includes(id)) {
    intake.value.selectedEssentials = list.filter(item => item !== id)
  } else {
    intake.value.selectedEssentials = [...list, id]
  }
}
const isEssentialSelected = (id: EssentialProductKey) => intake.value.selectedEssentials.includes(id)

// --- AANGEPASTE LOGICA HIER ---
const toggleFood = () => {
  intake.value.foodInventory = intake.value.foodInventory === 'buy' ? 'inhouse' : 'buy'
}
// Checken op 'buy' zodat hij false is bij 'inhouse'
const isFoodSelected = computed(() => intake.value.foodInventory === 'buy')

const toggleFlightbag = () => {
  intake.value.flightbag = intake.value.flightbag === 'yes' ? 'no' : 'yes'
}
// Checken op 'yes' zodat hij false is bij 'no'
const isFlightbagSelected = computed(() => intake.value.flightbag === 'yes')
// --------------------------------

const toggleTool = (option: string) => {
  const list = intake.value.tools || []
  if (list.includes(option)) {
    intake.value.tools = list.filter((o) => o !== option)
  } else {
    intake.value.tools = [...list, option]
  }
}
const isToolSelected = (option: string) => Array.isArray(intake.value.tools) && intake.value.tools.includes(option)

const increasePersons = () => {
  if (intake.value.persons < 10) intake.value.persons++
}
const decreasePersons = () => {
  if (intake.value.persons > 1) intake.value.persons--
}

const goToCart = () => {
  calculatePrice()
  navigateTo('/cart')
}

onMounted(() => {
  // 1. Essentiële producten wél standaard aan
  if (!intake.value.selectedEssentials || intake.value.selectedEssentials.length === 0) {
    intake.value.selectedEssentials = ESSENTIAL_PRODUCTS.map(p => p.id)
  }
  
  // 2. Hygiëne standaard UIT
  if (!intake.value.hygiene) {
    intake.value.hygiene = []
  }
  
  // 3. Tools (Gereedschap) standaard UIT
  if (!intake.value.tools) {
    intake.value.tools = []
  }

  // 4. Vluchttas en Voedsel standaard UIT
  if (!intake.value.flightbag) {
     intake.value.flightbag = 'no'
  }
  
  if (!intake.value.foodInventory) {
     intake.value.foodInventory = 'inhouse'
  }

  calculatePrice()
})
// NIEUWE WATCHER: Kijkt naar ALLES in intake
watch(
  intake,
  () => {
    calculatePrice()
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900 pb-32">
    <div class="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      
      <header class="space-y-2 mb-8 md:mb-10">
        <div class="space-y-1">
          <p class="text-sm font-medium tracking-wide uppercase text-emerald-700"> Meer dan 5,5 miljoen Nederlanders zijn al voorbereid </p>
          <h1 class="text-xl md:text-3xl font-semibold">Noodpakket compleet op basis van de checklist van de overheid</h1>
        </div>
        
        <div class="mt-3 md:hidden">
          <button type="button" @click="openVideoModal" class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md transition">
            <div class="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
              <img src="/images/noodpakket/uitlegvideo-thumb.png" alt="Uitlegvideo" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/30"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-sm font-semibold">▶</span>
              </div>
            </div>
            <div class="flex flex-col items-start text-left">
              <span class="text-sm font-medium text-slate-900">Bekijk uitlegvideo</span>
              <span class="text-xs text-slate-600">In 2 minuten weet je precies wat je krijgt</span>
            </div>
          </button>
        </div>
      </header>

      <div class="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-8 lg:gap-12">
        <aside class="md:sticky md:top-8 self-start space-y-6">
          <div class="flex flex-col items-center">
            
            <div class="hidden md:block w-full rounded-2xl bg-slate-100 overflow-hidden shadow-sm border border-slate-100">
              <VimeoEmbed videoId="1140837450" title="noodpakket-op-maat" />
            </div>

            <div class="mt-4 w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-xs">
              <div class="flex items-start gap-2">
                <span class="text-emerald-600">✓</span><div><p class="font-medium">30 dagen retourneren</p></div>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-emerald-600">✓</span><div><p class="font-medium">Gratis bezorgd binnen 5 werkdagen</p></div>
              </div>
            </div>
          </div>
        </aside>

        <section class="space-y-12 pb-8">
          
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Essentiële producten</h2>
              <p class="text-sm text-slate-600">Op basis van advies van de Nederlandse overheid.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
              <div v-for="product in ESSENTIAL_PRODUCTS" :key="product.id" class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img :src="product.image" :alt="product.label" class="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="openEssentialProduct(product.id)">
                    {{ getProductLabel(product) }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1" v-if="product.subLabel">
                    {{ product.subLabel }}
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ getProductPrice(product) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isEssentialSelected(product.id) ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleEssential(product.id)">
                    <svg v-if="isEssentialSelected(product.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Maak compleet</h2>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
              

              <div class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img src="/images/noodpakket/vluchttas.png" alt="Vluchttas" class="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <span class="text-left text-[15px] font-semibold text-slate-900 truncate">Vluchttas</span>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    30 liter (Rugzak)
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(FLIGHTBAG_PRICE) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isFlightbagSelected ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleFlightbag">
                    <svg v-if="isFlightbagSelected" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img src="/images/noodpakket/blikopener.png" alt="Blikopener" class="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="showToolsInfo = true">
                    Blikopener ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    RVS
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(TOOL_PRICES['opener']) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isToolSelected('opener') ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleTool('opener')">
                    <svg v-if="isToolSelected('opener')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img src="/images/noodpakket/tang.png" alt="Kniptang" class="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="showToolsInfo = true">
                    Kniptang ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    Gehard staal
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(TOOL_PRICES['tang']) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isToolSelected('tang') ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleTool('tang')">
                    <svg v-if="isToolSelected('tang')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>


          <section class="mt-20 space-y-8">
            <h2 class="text-xl md:text-2xl font-semibold">Veelgestelde vragen</h2>
            <div class="space-y-4">
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer"><span class="font-medium text-slate-900">Hoe lang kan ik doen met dit noodpakket?</span><span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span></summary>
                <p class="mt-3 text-sm text-slate-700">Het pakket is samengesteld voor de eerste 72 uur.</p>
              </details>
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer"><span class="font-medium text-slate-900">Kan ik het noodpakket later nog aanvullen?</span><span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span></summary>
                <p class="mt-3 text-sm text-slate-700">Ja, je kunt altijd extra producten bestellen.</p>
              </details>
            </div>
          </section>

        </section>
      </div>
    </div>

    <div class="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 p-4 safe-area-bottom">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-3">
            <button @click="decreasePersons" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors" :class="{'opacity-50 cursor-not-allowed': intake.persons <= 1}" :disabled="intake.persons <= 1">−</button>
            <span class="text-base font-semibold text-slate-900 min-w-[4.5rem] text-center">{{ intake.persons }} {{ intake.persons === 1 ? 'persoon' : 'personen' }}</span>
            <button @click="increasePersons" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors" :class="{'opacity-50 cursor-not-allowed': intake.persons >= 10}" :disabled="intake.persons >= 10">+</button>
          </div>
          <div class="text-xs font-medium text-slate-500">Totaal: <span class="text-slate-900">€ {{ formatPriceDot(intake.price) }}</span></div>
        </div>
        <button type="button" class="flex-1 md:flex-none md:min-w-[200px] inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-700 transition active:scale-95" @click="goToCart">In winkelmandje</button>
      </div>
    </div>

    <div v-if="showEssentialInfo && selectedEssentialProduct" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="closeEssentialProduct">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">{{ getProductLabel(selectedEssentialProduct) }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="closeEssentialProduct">✕</button>
        </div>
        <div class="space-y-3">
          <div v-if="selectedEssentialProduct.image" class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
            <img :src="selectedEssentialProduct.image" :alt="selectedEssentialProduct.label" class="w-full h-full object-cover" />
          </div>
          <p class="text-sm text-slate-700">{{ selectedEssentialProduct.description }}</p>
          <ul v-if="selectedEssentialProduct.bullets?.length" class="space-y-2">
            <li v-for="(item, index) in selectedEssentialProduct.bullets" :key="index" class="flex items-start gap-2 text-sm text-slate-700">
              <span class="mt-[2px] text-lg leading-none">
                <template v-if="item.type === 'check'">✔️</template>
                <template v-else-if="item.type === 'cross'">❌</template>
                <template v-else>•</template>
              </span>
              <span v-if="item.html" v-html="item.html"></span>
              <span v-else>{{ item.text }}</span>
            </li>
          </ul>
        </div>
        <div class="pt-2 flex justify-end">
          <button type="button" class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700" @click="closeEssentialProduct">Begrijp ik</button>
        </div>
      </div>
    </div>

    <div v-if="showVideoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeVideoModal">
      <div class="bg-white rounded-2xl max-w-3xl w-full mx-4 p-4 md:p-6 space-y-4 shadow-lg">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">Uitlegvideo noodpakket</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="closeVideoModal">✕</button>
        </div>
        <div class="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
           <VimeoEmbed videoId="1140837450" title="noodpakket-op-maat" />
        </div>
      </div>
    </div>

    </div>
</template>

<style scoped>
.safe-area-padding {
  padding-bottom: 12px; /* Default padding */
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}
</style>