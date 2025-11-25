<script setup lang="ts">
import { ESSENTIAL_PRODUCTS } from '~/data/essentialProducts'

const {
  intake,
  calculatePrice,
  BASE_PRICE,
  FLIGHTBAG_PRICE,
} = useIntake()

type HygieneOption = 'handgel' | 'wcpapier' | 'doekjes' | 'tandenborstel' | 'maandverband'
type ToolsOption = 'hammer' | 'tang' | 'saw' | 'opener'

const hygieneChoice = ref<'pakket' | 'geen'>('geen')
const toolsChoice = ref<'pakket' | 'geen'>('geen')

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
  const ALL_HYGIENE: HygieneOption[] = [
    'handgel',
    'wcpapier',
    'doekjes',
    'tandenborstel',
    'maandverband',
  ]
  intake.value.hygiene = choice === 'pakket' ? [...ALL_HYGIENE] : []
  calculatePrice()
}

const setToolsChoice = (choice: 'pakket' | 'geen') => {
  toolsChoice.value = choice
  const ALL_TOOLS: ToolsOption[] = ['hammer', 'tang', 'saw', 'opener']
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
            src="https://www.rodekruis.nl/wp-content/uploads/2022/08/Noodpakket-1310x640-1.jpg"
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
        </div>

        <div class="flex items-baseline justify-between pt-3 border-t border-slate-200">
          <span class="text-sm text-slate-600">
            Totale pakketprijs
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
          <p class="text-slate-600">Huidige totaalprijs</p>
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
</template>
