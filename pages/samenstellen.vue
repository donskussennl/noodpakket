<script setup lang="ts">
useHead({
  title: 'Stel jouw noodpakket samen – Voorkom verspilling - Noodpakket-op-Maat.nl',
  meta: [
    {
      name: 'description',
      content: 'Configureer je noodpakket voor 72 uur veiligheid: water, tools, EHBO en meer.',
    }
  ]
})
import {
  ESSENTIAL_PRODUCTS,
  type EssentialProductKey,
  type EssentialProduct
} from '~/data/essentialProducts'


const showEssentialInfo = ref(false)
const selectedEssentialKey = ref<EssentialProductKey | null>(null)

const selectedEssentialProduct = computed(() => {
  return ESSENTIAL_PRODUCTS.find(p => p.id === selectedEssentialKey.value) || null
})

const openEssentialProduct = (key: EssentialProductKey) => {
  selectedEssentialKey.value = key
  showEssentialInfo.value = true
}

const closeEssentialProduct = () => {
  showEssentialInfo.value = false
  selectedEssentialKey.value = null
}
const showVideoModal = ref(false)

const openVideoModal = () => {
  showVideoModal.value = true
}

const closeVideoModal = () => {
  showVideoModal.value = false
}


const {
  intake,
  calculatePrice,
  BASE_PRICE,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
  FOOD_PACKAGE_PRICE
} = useIntake()

const showPersonsInfo = ref(false)

const showPackageInfo = ref(false)

const showToolsInfo = ref(false)

// helpers voor multi-select hygiene/tools
const toggleHygiene = (option: string) => {
  const list = intake.value.hygiene || []
  if (list.includes(option)) {
    intake.value.hygiene = list.filter((o) => o !== option)
  } else {
    intake.value.hygiene = [...list, option]
  }
}

const clearHygiene = () => {
  intake.value.hygiene = []
}

const hasHygiene = (option: string) =>
  Array.isArray(intake.value.hygiene) && intake.value.hygiene.includes(option)

const toggleTool = (option: string) => {
  const list = intake.value.tools || []
  if (list.includes(option)) {
    intake.value.tools = list.filter((o) => o !== option)
  } else {
    intake.value.tools = [...list, option]
  }
}

const clearTools = () => {
  intake.value.tools = []
}

const hasTool = (option: string) =>
  Array.isArray(intake.value.tools) && intake.value.tools.includes(option)

// init defaults & prijs
onMounted(() => {
  // standaard: water op aantal personen, tenzij al gezet
  if (intake.value.waterBags == null) {
    intake.value.waterBags = intake.value.persons || 1
  }
  calculatePrice()
})

// prijs automatisch updaten bij wijzigingen
watch(
  () => [
    intake.value.persons,
    intake.value.foodInventory,
    intake.value.waterBags,
    intake.value.hygiene,
    intake.value.tools,
    intake.value.flightbag,
  ],
  () => {
    calculatePrice()
  },
  { deep: true }
)

const goToCart = () => {
  calculatePrice()
  navigateTo('/cart')
}

const getProductLabel = (product?: EssentialProduct | null) => {
  if (!product) return ''

  const persons = intake.value.persons || 1
  const shouldMultiply = product.id === 'water' || product.id === 'blanket'

  // Alleen "2x / 3x ..." tonen als er meer dan 1 persoon is
  if (shouldMultiply && persons > 1) {
    return `${persons}x ${product.label}`
  }

  // Bij 1 persoon blijft het oude label
  return product.label
}

</script>

<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900">
    <div class="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      <!-- Globale kop + intro -->
      <header class="space-y-2 mb-8 md:mb-10">
        <div class="space-y-1">
          <p class="text-sm font-medium tracking-wide uppercase text-emerald-700">
            Meer dan 5,5 miljoen Nederlanders zijn al voorbereid
          </p>
          <h1 class="text-xl md:text-3xl font-semibold">Stel je eigen noodpakket samen</h1>
          <p class="text-base md:text-xl text-slate-800">
            Bereid je huishouden voor op een noodgeval. Met dit noodpakket kom je de eerste 72 uur door.
          </p>
        </div>

        <!-- Uitlegvideo trigger -->
        <div class="mt-3">
          <button
            type="button"
            @click="openVideoModal"
            class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md transition"
          >
            <!-- Thumbnail met play-icoon -->
            <div class="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
              <!-- Gebruik hier je eigen thumbnail -->
              <img
                src="/images/noodpakket/uitlegvideo-thumb.png"
                alt="Uitlegvideo noodpakket"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/30"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-sm font-semibold"
                >
                  ▶
                </span>
              </div>
            </div>

            <!-- Tekst -->
            <div class="flex flex-col items-start text-left">
              <span class="text-sm font-medium text-slate-900">
                Bekijk uitlegvideo
              </span>
              <span class="text-xs text-slate-600">
                In 2 minuten weet je precies wat je krijgt
              </span>
            </div>
          </button>
        </div>
      </header>



      <div
        class="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-8 lg:gap-12 pb-16"
      >
        <!-- LINKERKOLOM: productafbeelding + retour/verzendinfo (sticky) -->
        <aside class="md:sticky md:top-8 self-start space-y-6">
          <div class=" flex flex-col items-center">
            <div
              class="w-full aspect-[4/3] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm overflow-hidden"
            >
              <img
                src="/images/noodpakket/noodpakket-compleet.jpg"
                alt="Noodpakket"
                class="w-full h-full object-cover"
              />
            </div>

            <p class="mt-2 text-sm text-center text-slate-600 max-w-xs">
                         • Watervoorziening voor 72 uur • Noodradio op baterijen • Zaklamp • Powerbank • EHBO-kit • Zaklamp • Warme deken en kussen • Lucifers • Kaarsen • Fluitje • Plattegrond van je woonplaats    
            </p>

            <div class="mt-4 w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-xs">
              <div class="flex items-start gap-2">
                <span class="mt-[2px]">↩︎</span>
                <div>
                  <p class="font-medium">30 dagen retourneren</p>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <span class="mt-[2px]">🚚</span>
                <div>
                  <p class="font-medium">Levering binnen 5 werkdagen</p>
                </div>
              </div>
            </div>

            <div class="mt-6 w-full border-t border-slate-100 pt-4 flex items-baseline justify-between">
              <span class="text-l font-medium text-slate-600">
                € {{ (intake.price || BASE_PRICE).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
            </div>
          </div>
        </aside>

        <!-- RECHTERKOLOM: alle vragen onder elkaar -->
        <section class="space-y-16">
          <!-- Standaard producten in het pakket -->
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">
                Je noodpakket bevat al deze essentiële producten
              </h2>
            </div>




            <div class="space-y-1">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="product in ESSENTIAL_PRODUCTS"
                  :key="product.id"
                  type="button"
                  class="group flex-1 min-w-[140px] rounded-2xl border border-slate-200 px-5 py-4 text-center text-base md:text-lg font-medium
       bg-white shadow-sm flex flex-col items-center gap-2
       hover:border-slate-300 hover:shadow-md hover:-translate-y-[1px] transition"
                  @click="openEssentialProduct(product.id)"
                >
                  <span class="font-medium text-slate-900">
                    {{ getProductLabel(product) }}
                  </span>

                  <!-- kleine hint dat het klikbaar is -->
                  <span class="inline-flex items-center gap-1 text-xs text-emerald-700">
                    <span
                      class="inline-flex items-center justify-center w-4 h-4 rounded-full border border-emerald-700 text-[9px] leading-none"
                    >
                      i
                    </span>
                    <span class="underline-offset-2 group-hover:underline">
                      Meer uitleg
                    </span>
                  </span>
                </button>
              </div>

              <p class="text-sm text-slate-600">
                Onmisbare essentials op basis van de checklist van de overheid.
              </p>
            </div>

          </section>

          <!-- 1. Huishouden -->
          <section class="space-y-6">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">
                Uit hoeveel personen bestaat je huishouden?
              </h2>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="n in [1,2,3,4,5,6]"
                  :key="n"
                  class="flex-1 min-w-[140px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="{
                      'border-emerald-500 bg-emerald-50 shadow-md': intake.persons === n
                  }"
                  @click="intake.persons = n"
                >

                  <div class="text-slate-900">
                    {{ n === 6 ? '6 personen' : n + (n === 1 ? ' persoon' : ' personen') }}
                  </div>
                </button>
              </div>
              <p class="text-sm text-slate-600">
                Bepaalt de watervoorziening en evt. noodvoeding.
              </p>
              <button
                type="button"
                class="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 "
                @click="showPackageInfo = true"
              >
                <span>Wat kan ik verwachten?</span>
                <span
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-700 text-[10px] leading-none"
                >
                  i
                </span>
              </button>
            </div>
          </section>

          <!-- 2. Voedselvoorziening -->
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Noodvoedselpakket toevoegen</h2>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap gap-3">
                <!-- JA: noodvoedselpakket -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="{
                    'border-emerald-500 bg-emerald-50 shadow-md': intake.foodInventory === 'buy',
                    'border-slate-200': intake.foodInventory !== 'buy'
                  }"
                  @click="intake.foodInventory = 'buy'"
                >
                  <div class="font-medium text-slate-900">Ja, voor {{ intake.persons }} personen</div>
                  <p class="text-sm text-slate-500">
                    + €
                    {{
                      (FOOD_PACKAGE_PRICE * intake.persons).toLocaleString('nl-NL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    }}
                  </p>
                </button>

                <!-- NEE: geen noodvoedselpakket -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="{
                    'border-emerald-500 bg-emerald-50 shadow-md': intake.foodInventory === 'inhouse',
                    'border-slate-200': intake.foodInventory !== 'inhouse'
                  }"
                  @click="intake.foodInventory = 'inhouse'"
                >
                  <div class="font-medium text-slate-900">Geen noodvoedselpakket</div>
                </button>
              </div>

              <p class="text-sm text-slate-600">
                Genoeg voor de eerste 72 uur van een noodsituatie.
              </p>

              <button
                type="button"
                class="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800"
                @click="showPersonsInfo = true"
              >
                <span>Wat zit er in het noodvoedselpakket?</span>
                <span
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-700 text-[10px] leading-none"
                >
                  i
                </span>
              </button>
            </div>
          </section>


          <!-- 3. Hygiëne -->
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Kies hygiëne producten voor in je vluchttas</h2>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap gap-3">
                <!-- Handgel -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasHygiene('handgel') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleHygiene('handgel')"
                >
                  <div class="font-medium text-slate-900">Desinfectie gel</div>
                  <p class="text-sm text-slate-500">
                    + € {{ HYGIENE_PRICES['handgel'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- WC-papier -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasHygiene('wcpapier') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleHygiene('wcpapier')"
                >
                  <div class="font-medium text-slate-900">Wc-papier</div>
                  <p class="text-sm text-slate-500">
                    + € {{ HYGIENE_PRICES['wcpapier'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Doekjes -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasHygiene('doekjes') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleHygiene('doekjes')"
                >
                  <div class="font-medium text-slate-900">Natte doekjes</div>
                  <p class="text-sm text-slate-500">
                    + € {{ HYGIENE_PRICES['doekjes'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Tandenborstel -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasHygiene('tandenborstel') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleHygiene('tandenborstel')"
                >
                  <div class="font-medium text-slate-900">Tandpasta + tandenborstel</div>
                  <p class="text-sm text-slate-500">
                    + € {{ HYGIENE_PRICES['tandenborstel'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Maandverband -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasHygiene('maandverband') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleHygiene('maandverband')"
                >
                  <div class="font-medium text-slate-900">Maandverband</div>
                  <p class="text-sm text-slate-500">
                    + € {{ HYGIENE_PRICES['maandverband'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Geen -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.hygiene.length === 0 && 'border-emerald-500 bg-emerald-50'"
                  @click="clearHygiene"
                >
                  <div class="font-medium text-slate-900">Geen hygiëne producten</div>
                </button>
              </div>
              <p class="text-sm text-slate-600">
                Deze hygiëneproducten worden geadviseerd door de overheid.
              </p>
            </div>
          </section>

          <!-- 4. Gereedschap -->
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Kies gereedschap voor een noodgeval</h2>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap gap-3">
                <!-- Hamer -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasTool('hammer') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleTool('hammer')"
                >
                  <div class="font-medium text-slate-900">Hamer</div>
                  <p class="text-sm text-slate-600">
                    + € {{ TOOL_PRICES['hammer'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- opener -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasTool('opener') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleTool('opener')"
                >
                  <div class="font-medium text-slate-900">Blikopener</div>
                  <p class="text-sm text-slate-600">
                    + € {{ TOOL_PRICES['opener'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Zaag -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasTool('saw') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleTool('saw')"
                >
                  <div class="font-medium text-slate-900">Zaag</div>
                  <p class="text-sm text-slate-600">
                    + € {{ TOOL_PRICES['saw'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Tang -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="hasTool('tang') && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="toggleTool('tang')"
                >
                  <div class="font-medium text-slate-900">Kniptang</div>
                  <p class="text-sm text-slate-600">
                    + € {{ TOOL_PRICES['tang'].toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </p>
                </button>

                <!-- Geen -->
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.tools.length === 0 && 'border-emerald-500 bg-emerald-50'"
                  @click="clearTools"
                >
                  <div class="font-medium text-slate-900">Geen noodgereedschap</div>
                </button>
              </div>
              <p class="text-sm text-slate-600">
                Dit gereedschap wordt geadviseerd door de overheid.

              </p>
              <button
                type="button"
                class="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800"
                @click="showToolsInfo = true"
              >
                <span>Waarom heb ik gereedschap nodig?</span>
                <span
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-700 text-[10px] leading-none"
                >
                  i
                </span>
              </button>
            </div>
          </section>

          <!-- 5. Tas -->
          <section class="space-y-4">
            <div class="space-y-1">
              <h2 class="text-xl md:text-2xl font-semibold">Kies voor gemak</h2>
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap gap-3">
                <button
                  class="flex-1 min-w-[160px] rounded-2xl border border-slate-200 px-5 py-4 text-left text-base md:text-lg font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.flightbag === 'yes' && 'border-emerald-500 bg-emerald-50 shadow-md'"
                  @click="intake.flightbag = 'yes'"
                >
                  <div class="font-medium text-slate-900">Vluchttas toevoegen</div>
                    <p class="text-sm text-slate-600">
                        + € {{ FLIGHTBAG_PRICE.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </p>

                </button>

                <button
                  class="flex-1 min-w-[160px] rounded-2xl border px-5 py-4 text-left text-base md:text-lg font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.flightbag === 'no' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.flightbag = 'no'"
                >
                  <div class="font-medium text-slate-900">Geen vluchttas</div>
                </button>
              </div>
              <p class="text-sm text-slate-600">
                Breng jezelf en je gezin snel in veiligheid
              </p>
            </div>
          </section>

          <!-- Naar winkelwagen -->
          <section class="pt-6 border-t border-slate-200 flex items-center justify-between">
            <div class="text-sm">
              <p class="text-xl font-semibold text-slate-900">
                € {{ (intake.price || BASE_PRICE).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm md:text-base font-medium text-white shadow-sm hover:bg-emerald-700"
              @click="goToCart"
            >
              In mijn winkelmandje
              <span aria-hidden="true">→</span>
            </button>
          </section>

          <!-- FAQ / Veelgestelde vragen -->
          <section class="mt-20 space-y-8">
            <h2 class="text-xl md:text-2xl font-semibold">Veelgestelde vragen</h2>

            <div class="space-y-4">

              <!-- Vraag 1 -->
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer">
                  <span class="text-base md:text-lg font-medium text-slate-900">
                    Hoe lang kan ik doen met dit noodpakket?
                  </span>
                  <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p class="mt-3 text-sm text-slate-700">
                  Het pakket is samengesteld voor de eerste <strong>72 uur</strong> van een noodsituatie,
                  gebaseerd op de richtlijnen van de Nederlandse overheid.
                </p>
              </details>

              <!-- Vraag 2 -->
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer">
                  <span class="text-base md:text-lg font-medium text-slate-900">
                    Wordt het pakket geleverd als één doos?
                  </span>
                  <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p class="mt-3 text-sm text-slate-700">
                  Ja, alle producten worden samen in één stevige doos geleverd. Kies je voor een vluchttas,
                  dan wordt alles netjes in de tas verpakt.
                </p>
              </details>

              <!-- Vraag 3 -->
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer">
                  <span class="text-base md:text-lg font-medium text-slate-900">
                    Kan ik het noodpakket later nog aanvullen?
                  </span>
                  <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p class="mt-3 text-sm text-slate-700">
                  Zeker! Je kunt altijd extra personen aanklikken, voedselpakketten of gereedschap toevoegen
                  door later terug te keren naar deze configurator.
                </p>
              </details>

              <!-- Vraag 4 -->
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer">
                  <span class="text-base md:text-lg font-medium text-slate-900">
                    Kan ik de inhoud van het pakket wijzigen nadat ik besteld heb?
                  </span>
                  <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p class="mt-3 text-sm text-slate-700">
                  Bestellingen kunnen binnen 30 dagen worden gewijzigd of geretourneerd, zolang de
                  producten ongebruikt zijn.
                </p>
              </details>

               <!-- Vraag 3 -->
              <details class="group bg-white border border-slate-200 rounded-2xl p-5 shadow-soft">
                <summary class="flex items-center justify-between cursor-pointer">
                  <span class="text-base md:text-lg font-medium text-slate-900">
                    Wat moet ik zelf nog regelen?
                  </span>
                  <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p class="mt-3 text-sm text-slate-700">
                  € 70 cash per volwassene, € 30 per kind, kopie van je identiteitsbewijs, een lijst met belangrijke telefoonnummers, medicijnen en een noodpakket voor je huisdier. <br>Bron: <a style="color: blue; text-decoration: underline;" href="https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen">denkvooruit.nl</a>
                </p>
              </details>

            </div>
          </section>

        </section>
      </div>
    </div>

    <!-- Modal voor uitleg prijs/voedselpakket -->
    <div
      v-if="showPersonsInfo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="showPersonsInfo = false"
    >
      <div
        v-if="showPersonsInfo"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showPersonsInfo = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full mx-4 p-6 space-y-4 shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-lg font-semibold text-slate-900">
              Het noodvoedselpakket bevat per 2 personen
            </h3>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600"
              @click="showPersonsInfo = false"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>

          <div
            class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center"
          >
            <img
              src="/images/noodpakket/voedselpakket-nood.jpg"
              alt="Noodvoedselpakket Nood"
              class="w-full h-full object-cover"
            />
          </div>
          
          <p class="text-sm text-slate-700">
            Kies voor echt voedsel in blik; voedzamer dan poederzakjes. Gebaseerd op het eten en drinken advies voor een noodpakket van het <a style="color: blue; text-decoration: underline" href="https://www.voedingscentrum.nl/nl/service/vraag-en-antwoord/boodschappen-doen/moet-ik-een-noodpakket-met-eten-en-drinken-in-huis-hebben.aspx">voedingscentrum</a>.
          </p>

          <ul class="text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>3–4 blikken maaltijdsoep, chili of bonen</li>
            <li>3 blikken groente zoals mais, doperwt of wortel</li>
            <li>1–2 blikken saus zoals tomatensaus of pastasaus</li>
            <li>1 zak rijst, pasta of couscous</li>
            <li>Aanvulling zoals crackers, pindakaas, jam of repen</li>
          </ul>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              @click="showPersonsInfo = false"
            >
              Begrijp ik
            </button>
          </div>
        </div>
      </div>
    </div>

        <!-- Modal voor uitleg prijs/voedselpakket -->
    <div
      v-if="showToolsInfo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="showToolsInfo = false"
    >
      <div
        v-if="showToolsInfo"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showToolsInfo = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full mx-4 p-6 space-y-4 shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-lg font-semibold text-slate-900">
              Waarom heb ik gereedschap nodig?
            </h3>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600"
              @click="showToolsInfo = false"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>

          <p class="text-sm text-slate-700">
            In een noodsituatie kan elke minuut tellen. Stormschade of omgevallen objecten kunnen routes blokkeren, en met het juiste gereedschap maak je die snel weer vrij. Veel mensen hebben dit al in huis, maar vaak verspreid en lastig terug te vinden. Ons advies: zorg dat je weet waar je gereedschap ligt, zodat je direct kunt handelen wanneer het erop aankomt.
          </p>

          <p class="text-sm text-slate-700">
            bron: <a style="color: blue; text-decoration: underline;" href="https://www.denkvooruit.nl/vraag-en-antwoord-2/noodpakket">denkvooruit.nl</a>
          </p>


          <div class="pt-2 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              @click="showToolsInfo = false"
            >
              Begrijp ik
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal voor uitleg prijs/voedselpakket -->
    <div
      v-if="showPackageInfo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="showPersonsInfo = false"
    >
      <div
        v-if="showPackageInfo"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showPackageInfo = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full mx-4 p-6 space-y-4 shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-lg font-semibold text-slate-900">
              Wat kan ik verwachten
            </h3>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600"
              @click="showPackageInfo = false"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>


          <ul class="text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>Het pakket wordt afgestemd op het aantal personen.</li>
            <li>Watervoorziening schaalt automatisch mee per huishouden.</li>
            <li>Je krijgt alleen producten waar je echt op kunt vertrouwen.</li>
            <li>Geen reinigingstabletten maar een echte wateropslag.</li>
            <li>Je kiest zelf de aanvullende producten om verspilling te voorkomen.</li>
          </ul>


          <div class="pt-2 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              @click="showPackageInfo = false"
            >
              Begrijp ik
            </button>
          </div>
        </div>
      </div>
      </div>
  </div>
  <!-- Modal: uitleg essentieel product -->
<div
  v-if="showEssentialInfo && selectedEssentialProduct"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  @click.self="closeEssentialProduct"
>
  <div class="bg-white rounded-2xl max-w-md w-full mx-4 p-6 space-y-4 shadow-lg">
    <div class="flex items-start justify-between gap-4">
      <h3 class="text-lg font-semibold text-slate-900">
        {{ getProductLabel(selectedEssentialProduct) }}
      </h3>
      <button
        type="button"
        class="text-slate-400 hover:text-slate-600"
        @click="closeEssentialProduct"
        aria-label="Sluiten"
      >
        ✕
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-if="selectedEssentialProduct.image"
        class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center"
      >
        <img
          :src="selectedEssentialProduct.image"
          :alt="selectedEssentialProduct.label"
          class="w-full h-full object-cover"
        />
      </div>

      <p class="text-sm text-slate-700">
        {{ selectedEssentialProduct.description }}
      </p>

      <ul
        v-if="selectedEssentialProduct.bullets?.length"
        class="space-y-2"
      >
        <li
          v-for="(item, index) in selectedEssentialProduct.bullets"
          :key="index"
          class="flex items-start gap-2 text-sm text-slate-700"
        >
          <!-- icoon -->
          <span class="mt-[2px] text-lg leading-none">
            <template v-if="item.type === 'check'">✔️</template>
            <template v-else-if="item.type === 'cross'">❌</template>
            <template v-else>•</template>
          </span>

          <!-- tekst of html -->
          <span v-if="item.html" v-html="item.html"></span>
          <span v-else>{{ item.text }}</span>
        </li>
      </ul>


    </div>

    <div class="pt-2 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        @click="closeEssentialProduct"
      >
        Begrijp ik
      </button>
    </div>
  </div>
</div>
<!-- Modal: uitlegvideo -->
<div
  v-if="showVideoModal"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  @click.self="closeVideoModal"
>
  <div class="bg-white rounded-2xl max-w-3xl w-full mx-4 p-4 md:p-6 space-y-4 shadow-lg">
    <div class="flex items-start justify-between gap-4">
      <h3 class="text-lg font-semibold text-slate-900">
        Uitlegvideo noodpakket
      </h3>
      <button
        type="button"
        class="text-slate-400 hover:text-slate-600"
        @click="closeVideoModal"
        aria-label="Sluiten"
      >
        ✕
      </button>
    </div>

    <!-- Vimeo embed via bestaand component -->
    <VimeoEmbed videoId="1140837450" title="noodpakket-op-maat" />

    <p class="text-sm text-slate-700">
      In deze video laten we je zien wat er in het noodpakket zit en hoe je het het beste kunt gebruiken.
    </p>

    <div class="pt-2 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        @click="closeVideoModal"
      >
        Begrijp ik
      </button>
    </div>
  </div>
</div>


</template>
