<script setup lang="ts">
// Zorg dat VimeoEmbed.vue in je /components map staat
// import VimeoEmbed from '~/components/VimeoEmbed.vue'

import {
  ESSENTIAL_PRODUCTS,
  type EssentialProductKey,
  type EssentialProduct,
  type BulletItem // Zorg dat deze geëxporteerd is in essentialProducts.ts
} from '~/data/essentialProducts'

useHead({
  title: 'Noodpakket samenstellen - Laagste prijs van NL | Noodpakket-op-maat.nl',
  meta: [
    {
      name: 'description',
      content:
        'Stel je eigen noodpakket samen op basis van de checklist van de overheid. Kies alleen de noodartikelen die je nog niet in huis hebt en bestel direct.'
    },
    {
      property: 'og:title',
      content: 'Noodpakket samenstellen | Noodpakket-op-maat.nl'
    },
    {
      property: 'og:description',
      content:
        'Maak een compleet noodpakket op maat. Producten volgens de checklist van de overheid, snel geleverd en alleen wat jij nodig hebt.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// --- Interface voor lokale producten ---
interface LocalProductInfo {
  id: string
  label: string
  subLabel?: string
  image: string
  description: string
  bullets: BulletItem[]
}

const originalPrice = computed(() => {
  return intake.value.price / 0.75  // want 25% korting → je betaalt 75%
})

const discountAmount = computed(() => {
  return originalPrice.value - intake.value.price
})

// --- State ---
const showProductModal = ref(false)
const selectedProductInfo = ref<EssentialProduct | LocalProductInfo | null>(null)
const showVideoModal = ref(false)

// --- Intake Logic ---
const {
  intake,
  calculatePrice,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
  FOOD_PACKAGE_PRICE
} = useIntake()

// --- DATA: Lokale definities met info voor de modal ---

const FOOD_INFO: LocalProductInfo = {
  id: 'food',
  label: 'Voedselpakket',
  subLabel: '2400 kcal per dag',
  image: '/images/noodpakket/voedselpakket-nood.png', 
  description: 'Kies voor echt voedsel in blik en stevige verpakkingen; voedzamer en smakelijker dan poederzakjes. Gebaseerd op het advies van het Voedingscentrum.',
  bullets: [
    { type: 'check', text: '3–4 blikken maaltijdsoep, chili of bonen' },
    { type: 'check', text: '3 blikken groente (mais, doperwt, wortel)' },
    { type: 'check', text: '1–2 blikken saus en zak rijst/pasta' },
    { type: 'check', text: 'Aanvulling: crackers, repen, jam' },
    { type: 'dot',   text: 'Voldoende energie voor 72 uur' }
  ]
}

const FLIGHTBAG_INFO: LocalProductInfo = {
  id: 'flightbag',
  label: 'Vluchttas',
  subLabel: '30 liter (Rugzak)',
  image: '/images/noodpakket/vluchttas.png',
  description: 'Een stevige, ruime rugzak waar je hele noodpakket in past. Zorg dat je in geval van een evacuatie direct weg kunt.',
  bullets: [
    { type: 'check', text: 'Ruim hoofdcompartiment (30 liter)' },
    { type: 'check', text: 'Stevige, comfortabele schouderbanden' },
    { type: 'check', text: 'Houdt je handen vrij tijdens evacuatie' },
    { type: 'dot',   text: 'Discreet design' }
  ]
}

const HYGIENE_OPTS: LocalProductInfo[] = [
  { 
    id: 'handgel', 
    label: 'Desinfectie gel', 
    subLabel: '250 ml', 
    image: '/images/noodpakket/handgel.jpg',
    description: 'Houd je handen schoon, ook als er geen stromend water beschikbaar is. Cruciaal om ziektes te voorkomen.',
    bullets: [
      { type: 'check', text: 'Doodt 99.9% van de bacteriën' },
      { type: 'check', text: 'Geen water nodig' },
      { type: 'check', text: 'Sneldrogend' }
    ]
  },
  { 
    id: 'wcpapier', 
    label: 'Wc-papier', 
    subLabel: '4 rollen', 
    image: '/images/noodpakket/wcpapier.jpg',
    description: 'Een basisbehoefte die vaak als eerste opraakt in winkels tijdens noodsituaties.',
    bullets: [
      { type: 'check', text: '4 rollen per pakket' },
      { type: 'check', text: 'Zacht en stevig' },
      { type: 'dot',   text: 'Compact verpakt' }
    ]
  },
  { 
    id: 'doekjes', 
    label: 'Natte doekjes', 
    subLabel: 'Pak van 50 stuks', 
    image: '/images/noodpakket/doekjes.jpg',
    description: 'Voor snelle lichamelijke hygiëne of het schoonmaken van oppervlakken.',
    bullets: [
      { type: 'check', text: 'Verfrissend en reinigend' },
      { type: 'check', text: 'Hersluitbare verpakking' },
      { type: 'check', text: 'Geschikt voor lichaam en gezicht' }
    ]
  },
  { 
    id: 'tandenborstel', 
    label: 'Tandpasta + tandenborstel', 
    subLabel: 'Setje', 
    image: '/images/noodpakket/tandenborstel.jpg',
    description: 'Mondhygiëne is belangrijk voor je gezondheid en moraal.',
    bullets: [
      { type: 'check', text: 'Inclusief tandpasta' },
      { type: 'check', text: 'Reisformaat, makkelijk mee te nemen' }
    ]
  },
  { 
    id: 'maandverband', 
    label: 'Maandverband', 
    subLabel: '1 pak (normaal)', 
    image: '/images/noodpakket/maandverband.jpg',
    description: 'Essentieel voor vrouwen in het huishouden. Kan in nood ook dienen als verbandmateriaal.',
    bullets: [
      { type: 'check', text: 'Hoog absorptievermogen' },
      { type: 'check', text: 'Individueel verpakt' }
    ]
  },
]

const TOOL_OPTS: LocalProductInfo[] = [
  { 
    id: 'hammer', 
    label: 'Hamer', 
    subLabel: 'Klauwhamer', 
    image: '/images/noodpakket/hamer.png',
    description: 'Een hamer is onmisbaar voor noodreparaties, het openbreken van obstakels of het bevestigen van beschutting.',
    bullets: [
      { type: 'check', text: 'Stevige klauwhamer' },
      { type: 'check', text: 'Anti-slip handvat' },
      { type: 'dot',   text: 'Multifunctioneel inzetbaar' }
    ]
  },
  { 
    id: 'opener', 
    label: 'Blikopener', 
    subLabel: 'RVS', 
    image: '/images/noodpakket/blikopener.png',
    description: 'Zonder blikopener is je noodvoorraad in blik waardeloos. Een eenvoudig, onverwoestbaar model.',
    bullets: [
      { type: 'check', text: 'Werkt altijd, geen stroom nodig' },
      { type: 'check', text: 'Roestvrij staal' },
      { type: 'cross', text: 'Niet afhankelijk van lipjes op blikken' }
    ]
  },
  { 
    id: 'saw', 
    label: 'Zaag', 
    subLabel: 'Handzaag (hout)', 
    image: '/images/noodpakket/zaag.png',
    description: 'Om hout te zagen voor warmte, of om obstakels (zoals omgevallen bomen) weg te werken.',
    bullets: [
      { type: 'check', text: 'Scherp getand blad' },
      { type: 'check', text: 'Compact formaat' }
    ]
  },
  { 
    id: 'tang', 
    label: 'Kniptang', 
    subLabel: 'Gehard staal', 
    image: '/images/noodpakket/tang.png',
    description: 'Voor het doorknippen van draden, kabels of het losmaken van vastzittende objecten.',
    bullets: [
      { type: 'check', text: 'Sterke knipkracht' },
      { type: 'check', text: 'Geisoleerde handvaten' }
    ]
  },
]

// --- Helpers ---

const formatPriceDot = (amount: number) => {
  return amount.toFixed(2).replace('.', ',')
}

const getProductLabel = (product?: EssentialProduct | LocalProductInfo | null) => {
  if (!product) return ''
  const p = product as EssentialProduct
  const persons = intake.value.persons || 1
  
  if (p.multiplies && persons > 1) {
    return `${persons}x ${product.label}`
  }
  return product.label
}
const getProductPrice = (product: EssentialProduct) => {
  const persons = intake.value.persons || 1
  const price = product.multiplies ? product.price * persons : product.price
  return price.toFixed(2)
}
const getProductOriginalPrice = (product: EssentialProduct) => {
  const persons = intake.value.persons || 1
  const price = product.multiplies ? product.price * persons : product.price
  const original = price / 0.75        // 25% korting → je betaalt 75%
  return original.toFixed(2)
}


// Hygiëne Bundel Helpers
const hygieneBundlePrice = computed(() => {
  return Object.values(HYGIENE_PRICES).reduce((sum, price) => sum + price, 0)
})

const isHygieneBundleSelected = computed(() => {
  return intake.value.hygiene.length === Object.keys(HYGIENE_PRICES).length
})

const toggleHygieneBundle = () => {
  const isRemoving = isHygieneBundleSelected.value
  
  if (isRemoving) {
    intake.value.hygiene = []
  } else {
    intake.value.hygiene = Object.keys(HYGIENE_PRICES) as any[]
  }

  trackEvent('toggle_product', {
    item_id: 'hygiene_bundle',
    item_name: 'Hygiëne producten',
    action: isRemoving ? 'remove' : 'add'
  })
}

// --- Actions (Toggles etc) ---

// 1. GENERIEKE OPEN FUNCTIE
const openInfo = (product: any) => {
  selectedProductInfo.value = product
  showProductModal.value = true

  // 1. Stuur het normale interactie event (zoals we eerder deden)
  trackEvent('select_content', {
    content_type: 'product_modal',
    item_id: product.id
  })

  // 2. FORCEER EEN PAGEVIEW (Virtual Pageview)
  // Dit vertelt Google: "De gebruiker ziet nu de pagina '/product/naam-van-product'"
  trackEvent('page_view', {
    page_title: `Product: ${product.label}`,
    page_location: `${window.location.origin}/modal/${product.id}` 
  })
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProductInfo.value = null
}

// Video
// Video (aangepast met tracking)
const openVideoModal = () => {
  showVideoModal.value = true
  trackEvent('select_content', {
    content_type: 'video',
    item_name: 'Uitlegvideo noodpakket'
  })
}
const closeVideoModal = () => showVideoModal.value = false

// Toggles (aangepast met tracking)
const toggleEssential = (id: EssentialProductKey) => {
  const list = intake.value.selectedEssentials
  const isRemoving = list.includes(id)

  if (isRemoving) {
    intake.value.selectedEssentials = list.filter(item => item !== id)
  } else {
    intake.value.selectedEssentials = [...list, id]
  }

  trackEvent('toggle_product', {
    item_id: id,
    item_category: 'essential',
    action: isRemoving ? 'remove' : 'add'
  })
}
const isEssentialSelected = (id: EssentialProductKey) => intake.value.selectedEssentials.includes(id)

// Helper functie om events veilig naar Google Analytics te sturen
const trackEvent = (eventName: string, params: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
    // Voor debugging in je console (optioneel, haal weg in productie):
    console.log(`GA Event: ${eventName}`, params) 
  }
}

const toggleFood = () => {
  const isRemoving = intake.value.foodInventory === 'buy'
  intake.value.foodInventory = isRemoving ? 'inhouse' : 'buy'

  trackEvent('toggle_product', {
    item_id: 'food_package',
    item_name: 'Houdbaar voedselpakket',
    action: isRemoving ? 'remove' : 'add'
  })
}
const isFoodSelected = computed(() => intake.value.foodInventory === 'buy')

const toggleFlightbag = () => {
  const isRemoving = intake.value.flightbag === 'yes'
  intake.value.flightbag = isRemoving ? 'no' : 'yes'

  trackEvent('toggle_product', {
    item_id: 'flightbag',
    item_name: 'Vluchttas',
    action: isRemoving ? 'remove' : 'add'
  })
}
const isFlightbagSelected = computed(() => intake.value.flightbag === 'yes')

const toggleTool = (option: string) => {
  const list = intake.value.tools || []
  const isRemoving = list.includes(option)

  if (isRemoving) {
    intake.value.tools = list.filter((o) => o !== option)
  } else {
    intake.value.tools = [...list, option]
  }

  trackEvent('toggle_product', {
    item_id: option,
    item_category: 'tools',
    action: isRemoving ? 'remove' : 'add'
  })
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
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: intake.value.price, 
    person_count: intake.value.persons 
  })
  navigateTo('/cart')
}

onMounted(() => {
  if (!intake.value.selectedEssentials || intake.value.selectedEssentials.length === 0) {
    intake.value.selectedEssentials = ESSENTIAL_PRODUCTS.map(p => p.id)
  }
  if (!intake.value.hygiene) intake.value.hygiene = []
  if (!intake.value.tools) intake.value.tools = []
  
  // Defaults
  if (!intake.value.flightbag) intake.value.flightbag = 'no'
  if (!intake.value.foodInventory) intake.value.foodInventory = 'inhouse'

  calculatePrice()
})

watch(
  intake,
  () => {
    calculatePrice()
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-[#fff] text-slate-900 pb-15">
    <div class="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      
      <header class="space-y-2 mb-8 md:mb-10">
        <div class="space-y-1">
          <p class="text-sm font-medium tracking-wide uppercase text-emerald-700"> Meer dan 5,5 miljoen Nederlanders zijn al voorbereid </p>
          <h1 class="text-xl md:text-3xl font-semibold">Noodpakket - Bereid je voor op basis van de checklist van de overheid</h1>
          <p class="mt-2 text-sm text-slate-700 max-w-2xl">
            Kies zelf welke noodartikelen je nodig hebt voor de eerste 72 uur. Je betaalt alleen voor producten die je nog niet in huis hebt,
            volledig volgens het advies van de overheid.
          </p>
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
         <div
      class="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 mt-2 text-[11px] font-semibold text-emerald-800"
    >
      <span class="text-xs">🔥</span>
      <span>Tijdelijk 25% korting op alle producten • beperkte voorraad</span>
    </div>
      </header>
     

      <div class="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-8 lg:gap-12">
        <aside class="md:sticky md:top-8 self-start space-y-6">
          <div class="flex flex-col items-center">
            
            <div class="hidden md:block w-full rounded-2xl bg-slate-100 overflow-hidden shadow-sm border border-slate-100">
              <VimeoEmbed videoId="1144930981" title="noodpakket-op-maat" />
            </div>

            <div class="mt-4 w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-xs">
            <div class="flex items-start gap-2">
              <span class="text-emerald-600">✓</span>
              <p class="font-medium">LAAGSTE PRIJS van NL!</p>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-emerald-600">✓</span>
              <p class="font-medium">Gratis bezorgd binnen 5 werkdagen</p>
            </div>
          </div>

          <!-- Logo groter + betere positie -->
          <div class="mt-5 flex justify-center md:justify-start">
            <img 
              src="/images/webwinkel-keur.webp"
              alt="WebwinkelKeur"
              class="h-20 w-auto opacity-95"
              loading="lazy"
            />
          </div>

          </div>
        </aside>

        <section class="space-y-12 pb-8">
          
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Essentiële producten</h2>
              <p class="text-sm text-slate-600">Klik op het vinkje als je het product al hebt.</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
              <div v-for="product in ESSENTIAL_PRODUCTS" :key="product.id" class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-[#FFFDF3] overflow-hidden relative">
                  <img :src="product.image" :alt="product.label" class="w-full h-full object-contain drop-shadow-[8px_8px_15px_rgba(0,0,0,0.1)]" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="openInfo(product)">
                    {{ getProductLabel(product) }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1" v-if="product.subLabel">
                    {{ product.subLabel }}
                  </div>

                  <div class="text-sm font-medium">
                    <span class="text-slate-400 line-through mr-1">
                       {{ getProductOriginalPrice(product) }}
                    </span>
                    <span class="text-red-600">
                       {{ getProductPrice(product) }}
                    </span>
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
                  <img :src="FOOD_INFO.image" :alt="FOOD_INFO.label" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="openInfo(FOOD_INFO)">
                    {{ FOOD_INFO.label }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    {{ FOOD_INFO.subLabel }}
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(FOOD_PACKAGE_PRICE * intake.persons) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isFoodSelected ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleFood">
                    <svg v-if="isFoodSelected" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img :src="FLIGHTBAG_INFO.image" :alt="FLIGHTBAG_INFO.label" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 truncate hover:underline" @click="openInfo(FLIGHTBAG_INFO)">
                    {{ FLIGHTBAG_INFO.label }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    {{ FLIGHTBAG_INFO.subLabel }}
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

              <div 
                 v-for="tool in TOOL_OPTS.filter(t => t.id === 'opener' || t.id === 'tang')" 
                 :key="tool.id"
                 class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img :src="tool.image" :alt="tool.label" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="openInfo(tool)">
                    {{ tool.label }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    {{ tool.subLabel }}
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(TOOL_PRICES[tool.id as keyof typeof TOOL_PRICES]) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isToolSelected(tool.id) ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleTool(tool.id)">
                    <svg v-if="isToolSelected(tool.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Uit je eigen huis</h2>
              <p class="text-sm text-slate-600">Vaak heb je deze spullen al, maar zijn ze verspreid.</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
              
              <div 
                 v-for="tool in TOOL_OPTS.filter(t => t.id === 'hammer' || t.id === 'saw')" 
                 :key="tool.id"
                 class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img :src="tool.image" :alt="tool.label" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <button type="button" class="text-left text-[15px] font-semibold text-slate-900 hover:underline truncate" @click="openInfo(tool)">
                    {{ tool.label }} ›
                  </button>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    {{ tool.subLabel }}
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(TOOL_PRICES[tool.id as keyof typeof TOOL_PRICES]) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isToolSelected(tool.id) ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleTool(tool.id)">
                    <svg v-if="isToolSelected(tool.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                <div class="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                  <img src="/images/noodpakket/hygiene-producten.png" alt="Hygiëne" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <span class="text-left text-[15px] font-semibold text-slate-900 truncate">
                    Hygiëne bundel 
                  </span>
                  
                  <div class="text-sm text-slate-500 line-clamp-1">
                    Handgel, wc-papier, natte doekjes en tandverzorging
                  </div>

                  <div class="text-sm font-medium text-slate-900">
                    {{ formatPriceDot(hygieneBundlePrice) }}
                  </div>
                </div>
                <div class="shrink-0 pr-1">
                  <button type="button" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none" :class="isHygieneBundleSelected ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-slate-200'" @click="toggleHygieneBundle">
                    <svg v-if="isHygieneBundleSelected" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>

            </div>
          </section>

          <!-- Samenvatting + CTA net boven FAQ -->
          <section class="mt-10">
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1">
             
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                      {{ intake.persons }} {{ intake.persons === 1 ? 'persoon' : 'personen' }}
                    </span>
                    <div class="flex flex-col">
                      <span class="text-lg md:text-xl font-bold text-slate-900">
                        € {{ formatPriceDot(intake.price) }}
                      </span>

                      <span class="text-xs text-red-700 font-medium">
                        Je bespaart € {{ formatPriceDot(discountAmount) }} (25% korting)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="w-full md:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-700 transition active:scale-95"
                @click="goToCart"
              >
                In winkelmandje
              </button>
            </div>
          </section>

          <section class="mt-20 space-y-8">
            <h2 class="text-xl md:text-2xl font-semibold">Veelgestelde vragen</h2>
            <div class="space-y-4">
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer"><span class="font-medium text-slate-900">Hoe lang kan ik doen met dit noodpakket?</span><span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span></summary>
                <p class="mt-3 text-sm text-slate-700">Het pakket is samengesteld voor de eerste 72 uur. Het water is een jaar houdbaar en kan je elk jaar verversen. Het voedselpakket is 2 jaar houdbaar.</p>
              </details>
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer"><span class="font-medium text-slate-900">Waarom bestel ik bij Noodpakket-op-maat.nl?</span><span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span></summary>
                <p class="mt-3 text-sm text-slate-700">Je besteld alleen producten die op de checklist van de overheid staan. Kies  de producten die je nog niet in huis hebt of op 1 plek hebt liggen. Altijd voor de beste prijs.</p>
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
          <div class="text-xs font-medium text-slate-500">Prijs noodpakket: <span class="text-slate-900">€ {{ formatPriceDot(intake.price) }}</span></div>
        </div>
        <button type="button" class="flex-1 md:flex-none md:min-w-[200px] inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-700 transition active:scale-95" @click="goToCart">In winkelmandje</button>
      </div>
    </div>

    <div
      v-if="showProductModal && selectedProductInfo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="closeProductModal"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">{{ getProductLabel(selectedProductInfo) }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="closeProductModal">✕</button>
        </div>
        <div class="space-y-3">
          <div v-if="selectedProductInfo.image" class="w-full aspect-[4/3] rounded-xl bg-[#FFFDF3] border border-slate-100 flex items-center justify-center p-8">
            <img 
                :src="selectedProductInfo.image" 
                :alt="selectedProductInfo.label" 
                class="w-full h-full object-contain drop-shadow-[10px_10px_20px_rgba(0,0,0,0.25)]" 
              />         
           </div>
          <p class="text-sm text-slate-700">{{ selectedProductInfo.description }}</p>
          <ul v-if="selectedProductInfo.bullets?.length" class="space-y-2">
            <li v-for="(item, index) in selectedProductInfo.bullets" :key="index" class="flex items-start gap-2 text-sm text-slate-700">
              <span class="mt-[2px] text-lg leading-none">
                <template v-if="item.type === 'check'">✔️</template>
                <template v-else-if="item.type === 'cross'">✔️</template>
                <template v-else>•</template>
              </span>
              <span v-if="item.html" v-html="item.html"></span>
              <span v-else>{{ item.text }}</span>
            </li>
          </ul>
        </div>
        <div class="pt-2 flex justify-end">
          <button type="button" class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700" @click="closeProductModal">Begrijp ik</button>
        </div>
      </div>
    </div>

    <div
      v-if="showVideoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="closeVideoModal"
    >
      <div class="bg-white rounded-2xl max-w-3xl w-full mx-4 p-4 md:p-6 space-y-4 shadow-lg">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-semibold text-slate-900">Uitlegvideo noodpakket</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="closeVideoModal">✕</button>
        </div>
        <div class="w-full bg-slate-100 rounded-xl overflow-hidden text-slate-400">
          <VimeoEmbed videoId="1144930981" title="noodpakket-op-maat" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.safe-area-padding {
  padding-bottom: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}
</style>