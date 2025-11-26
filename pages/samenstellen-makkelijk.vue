<script setup lang="ts">
import { ESSENTIAL_PRODUCTS } from '~/data/essentialProducts'

const {
  intake,
  calculatePrice,
  BASE_PRICE,
  FLIGHTBAG_PRICE,
  HYGIENE_PRICES,
  TOOL_PRICES,
} = useIntake()

type HygieneOption = 'handgel' | 'wcpapier' | 'doekjes' | 'tandenborstel' | 'maandverband'
type ToolsOption = 'hammer' | 'tang' | 'saw' | 'opener'

// alle opties als constante lijsten
const ALL_HYGIENE: HygieneOption[] = [
  'handgel',
  'wcpapier',
  'doekjes',
  'tandenborstel',
  'maandverband',
]
const showVideoModal = ref(false)

const openVideoModal = () => {
  showVideoModal.value = true
}

const closeVideoModal = () => {
  showVideoModal.value = false
}
const ALL_TOOLS: ToolsOption[] = ['hammer', 'tang', 'saw', 'opener']

const hygieneChoice = ref<'pakket' | 'geen'>('geen')
const toolsChoice = ref<'pakket' | 'geen'>('geen')

// totaalprijs voor compleet hygiëne pakket
const fullHygienePrice = computed(() => {
  return ALL_HYGIENE.reduce((sum, key) => {
    return sum + HYGIENE_PRICES[key]
  }, 0)
})

// totaalprijs voor compleet noodgereedschap pakket
const fullToolsPrice = computed(() => {
  return ALL_TOOLS.reduce((sum, key) => {
    return sum + TOOL_PRICES[key]
  }, 0)
})

// bij binnenkomst: defaults + keuzes syncen met intake
onMounted(() => {
  if (!intake.value.persons) {
    intake.value.persons = 1
  }
  if (!intake.value.flightbag) {
    intake.value.flightbag = 'no'
  }

  const hasHygiene =
    Array.isArray(intake.value.hygiene) && intake.value.hygiene.length > 0
  hygieneChoice.value = hasHygiene ? 'pakket' : 'geen'

  const hasTools =
    Array.isArray(intake.value.tools) && intake.value.tools.length > 0
  toolsChoice.value = hasTools ? 'pakket' : 'geen'

  calculatePrice()
})

const setPersons = (n: number) => {
  intake.value.persons = n
  calculatePrice()
}

const setFlightbag = (value: 'yes' | 'no') => {
  intake.value.flightbag = value
  calculatePrice()
}

const setHygieneChoice = (choice: 'pakket' | 'geen') => {
  hygieneChoice.value = choice
  intake.value.hygiene = choice === 'pakket' ? [...ALL_HYGIENE] : []
  calculatePrice()
}

const setToolsChoice = (choice: 'pakket' | 'geen') => {
  toolsChoice.value = choice
  intake.value.tools = choice === 'pakket' ? [...ALL_TOOLS] : []
  calculatePrice()
}

const goToCart = () => {
  calculatePrice()
  navigateTo('/cart')
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
      <!-- HERO: afbeelding + korte tekst + prijs -->
      <section class="space-y-5">
        <div class="w-full rounded-2xl overflow-hidden bg-slate-100">
          <img
            src="/images/noodpakket/noodpakket-compleet.jpg"
            alt="Noodpakket op maat"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium tracking-wide uppercase text-emerald-700">
            Stel je eigen noodpakket samen
          </p>
          <h1 class="text-2xl md:text-3xl font-semibold">
            Kies de samenstelling van jouw noodpakket
          </h1>
          <p class="text-sm md:text-base text-slate-700 max-w-2xl">
            Dit pakket helpt jouw huishouden de eerste 72 uur door een noodsituatie heen.
            Je kiest zelf hoeveel personen, of je een vluchttas wilt en of we hygiëne en
            noodgereedschap voor je meenemen.
          </p>

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
        </div>

        <div class="flex items-baseline justify-between pt-3 border-t border-slate-200">
          <span class="text-sm text-slate-600">
            Huidige pakketprijs
          </span>
          <span class="text-xl md:text-2xl font-semibold text-slate-900">
            € {{ (intake.price || BASE_PRICE).toLocaleString('nl-NL', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) }}
          </span>
        </div>
      </section>

      <!-- Standaard inhoud -->
      <section class="space-y-3">
        <h2 class="text-lg md:text-xl font-semibold">
          Dit zit standaard in je noodpakket
        </h2>

        <ul class="space-y-1 text-sm text-slate-700">
          <li
            v-for="product in ESSENTIAL_PRODUCTS"
            :key="product.id"
            class="flex items-start gap-2"
          >
            <span class="mt-[1px] text-emerald-600">✔</span>
            <span>{{ product.label }}</span>
          </li>
        </ul>

        <p class="text-sm text-slate-600">
          Gebaseerd op de checklist van de overheid: water, licht, communicatie, warmte en EHBO.
        </p>
      </section>

      <!-- Aantal personen -->
      <section class="space-y-4">
        <h2 class="text-lg md:text-xl font-semibold">
          Voor hoeveel personen stel je het pakket samen?
        </h2>

        <div class="flex flex-wrap gap-3">
          <button
            v-for="n in [1,2,3,4,5,6]"
            :key="n"
            type="button"
            class="flex-1 min-w-[110px] rounded-2xl border px-4 py-3 text-left text-sm md:text-base font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
            :class="intake.persons === n && 'border-emerald-500 bg-emerald-50 shadow-md'"
            @click="setPersons(n)"
          >
            <span class="text-slate-900">
              {{ n === 6 ? '6 personen' : n + (n === 1 ? ' persoon' : ' personen') }}
            </span>
          </button>
        </div>

        <p class="text-sm text-slate-600">
          De basis van het pakket en de watervoorziening worden afgestemd op het aantal personen.
        </p>
      </section>

      <!-- Vluchttas -->
      <section class="space-y-4">
        <h2 class="text-lg md:text-xl font-semibold">
          Wil je een vluchttas laten meeleveren?
        </h2>

        <div class="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            class="rounded-2xl border border-slate-200 px-5 py-4 text-left text-sm md:text-base font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
            :class="intake.flightbag === 'yes' && 'border-emerald-500 bg-emerald-50 shadow-md'"
            @click="setFlightbag('yes')"
          >
            <div class="text-slate-900">Ja, vluchttas toevoegen</div>
            <p class="mt-1 text-slate-600">
              Handige tas waarin we alle spullen voor je verpakken.
            </p>
            <p class="mt-1 text-xs text-slate-500">
              + € {{ FLIGHTBAG_PRICE.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) }}
            </p>
          </button>

          <button
            type="button"
            class="rounded-2xl border px-5 py-4 text-left text-sm md:text-base font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
            :class="intake.flightbag === 'no' && 'border-emerald-500 bg-emerald-50'"
            @click="setFlightbag('no')"
          >
            <div class="text-slate-900">Nee, ik gebruik mijn eigen tas</div>
            <p class="mt-1 text-slate-600">
              Je bergt alle spullen zelf op in een tas of koffer.
            </p>
          </button>
        </div>
      </section>

      <!-- Hygiëne pakket -->
      <section class="space-y-4">
        <h2 class="text-lg md:text-xl font-semibold">
          Hygiëne pakket toevoegen?
        </h2>

        <div class="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            class="rounded-2xl border px-5 py-4 text-left text-sm md:text-base font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
            :class="hygieneChoice === 'pakket' && 'border-emerald-500 bg-emerald-50 shadow-md'"
            @click="setHygieneChoice('pakket')"
          >
            <div class="text-slate-900">Ja, hygiëne pakket toevoegen</div>
            <p class="mt-1 text-slate-600">
              Alle aanbevolen hygiëneproducten (zoals handgel, wc-papier en maandverband) worden toegevoegd.
            </p>
            <p class="mt-1 text-xs text-slate-500">
              + € {{ fullHygienePrice.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) }}
            </p>
          </button>

          <button
            type="button"
            class="rounded-2xl border px-5 py-4 text-left text-sm md:text-base font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
            :class="hygieneChoice === 'geen' && 'border-emerald-500 bg-emerald-50'"
            @click="setHygieneChoice('geen')"
          >
            <div class="text-slate-900">Geen hygiëne pakket</div>
            <p class="mt-1 text-slate-600">
              Je regelt deze producten zelf of hebt ze al in huis.
            </p>
          </button>
        </div>
      </section>

      <!-- Noodgereedschap -->
      <section class="space-y-4">
        <h2 class="text-lg md:text-xl font-semibold">
          Noodgereedschap toevoegen?
        </h2>

        <div class="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            class="rounded-2xl border px-5 py-4 text-left text-sm md:text-base font-medium transition shadow-sm hover:border-emerald-500 hover:bg-emerald-50"
            :class="toolsChoice === 'pakket' && 'border-emerald-500 bg-emerald-50 shadow-md'"
            @click="setToolsChoice('pakket')"
          >
            <div class="text-slate-900">Ja, noodgereedschap toevoegen</div>
            <p class="mt-1 text-slate-600">
              We voegen een basisset gereedschap toe zoals hamer, zaag, tang en blikopener.
            </p>
            <p class="mt-1 text-xs text-slate-500">
              + € {{ fullToolsPrice.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) }}
            </p>
          </button>

          <button
            type="button"
            class="rounded-2xl border px-5 py-4 text-left text-sm md:text-base font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
            :class="toolsChoice === 'geen' && 'border-emerald-500 bg-emerald-50'"
            @click="setToolsChoice('geen')"
          >
            <div class="text-slate-900">Geen noodgereedschap</div>
            <p class="mt-1 text-slate-600">
              Je gebruikt het gereedschap dat je zelf al in huis hebt.
            </p>
          </button>
        </div>
      </section>

      <!-- CTA naar winkelmandje -->
      <section class="pt-4 border-t border-slate-200 flex items-center justify-between">
        <div class="text-sm">
          <p class="text-slate-600">Prijs van je noodpakket</p>
          <p class="text-xl font-semibold text-slate-900">
            € {{ (intake.price || BASE_PRICE).toLocaleString('nl-NL', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) }}
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
