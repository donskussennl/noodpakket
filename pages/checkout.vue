<!-- pages/checkout.vue -->
<script setup lang="ts">
const {
  intake,
  calculatePrice,
  BASE_PRICE,
  FOOD_PACKAGE_PRICE,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
  PERSON_SURCHARGE,
} = useIntake()

const loading = ref(false)
const error = ref<string | null>(null)

// totaal van gekozen hygiëneproducten
const hygieneTotal = computed(() => {
  if (!Array.isArray(intake.value.hygiene)) return 0
  return intake.value.hygiene.reduce((sum, item) => {
    return sum + HYGIENE_PRICES[item as keyof typeof HYGIENE_PRICES]
  }, 0)
})

// totaal van gekozen gereedschap
const toolsTotal = computed(() => {
  if (!Array.isArray(intake.value.tools)) return 0
  return intake.value.tools.reduce((sum, item) => {
    return sum + TOOL_PRICES[item as keyof typeof TOOL_PRICES]
  }, 0)
})

// bij directe navigatie naar /checkout toch een prijs hebben
onMounted(() => {
  if (!intake.value.price || intake.value.price === 0) {
    calculatePrice()
  }
})

const isAddressValid = computed(() => {
  const a = intake.value.address
  return (
    !!a.firstName &&
    !!a.lastName &&
    !!a.email &&
    !!a.street &&
    !!a.houseNumber &&
    !!a.postalCode &&
    !!a.city &&
    !!a.country
  )
})

const pay = async () => {
  if (!isAddressValid.value) return

  loading.value = true
  error.value = null

  try {
    const { url } = await $fetch<{ url: string }>('/api/checkout', {
      method: 'POST',
      body: {
        price: intake.value.price,
        description: 'Noodpakket op maat',
        meta: {
          // laat deze velden staan als je backend ze verwacht,
          // ook als ze eventueel undefined zijn
          householdType: (intake.value as any).householdType,
          persons: intake.value.persons,
          foodInventory: intake.value.foodInventory,
          foodPackages: intake.value.foodPackages,
          waterBags: (intake.value as any).waterBags,
          hygiene: intake.value.hygiene,
          tools: intake.value.tools,
          plan: (intake.value as any).plan,
          address: intake.value.address,
        },
      },
    })

    window.location.href = url
  } catch (e: any) {
    console.error('Checkout error:', e)
    const msg = e?.data?.statusMessage || e?.data?.message || null
    error.value = msg || 'Er ging iets mis bij het starten van de betaling.'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="min-h-screen  flex items-center justify-center py-1">
    <div class="w-full  px-6 py-8 md:px-10 md:py-10">
      <!-- Header -->
      <header class="mb-8 space-y-2">

        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          Noodpakket op maat bestellen
        </h1>


        <NuxtLink
          to="/cart"
          class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 underline mt-2"
        >
          ← Terug naar winkelwagen
        </NuxtLink>
      </header>

      <!-- 1. Samenvatting + prijs (bovenaan) -->
      <section class="space-y-4 mb-8">
    

        <!-- Prijs breakdown -->
        <!-- Prijs breakdown -->
        <div class="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 space-y-3 text-sm">
          <p class="text-xs font-medium text-emerald-700 uppercase tracking-[0.16em]">
            Jouw noodpakket op maat
          </p>

          <!-- Basis -->
          <div class="flex justify-between items-center">
            <span class="text-slate-800">Noodpakket essentieel {{ intake.persons }} pers.</span>
            <span class="font-medium text-slate-900">
              € {{ (BASE_PRICE + PERSON_SURCHARGE * (intake.persons - 1)).toFixed(2) }}
            </span>
          </div>

          <!-- Voedselpakketten -->
          <div
            v-if="intake.foodInventory === 'buy'"
            class="flex justify-between text-xs"
          >
            <span class="text-slate-800">
              + Voedselpakket
            </span>
            <span class="font-medium text-slate-900">
              € {{ (((intake.foodPackages || 0) * FOOD_PACKAGE_PRICE)).toFixed(2) }}
            </span>
          </div>

          <!-- Vluchttas -->
          <div
            v-if="intake.flightbag === 'yes'"
            class="flex justify-between text-xs"
          >
            <span class="text-slate-800">
              + Vluchttas
            </span>
            <span class="font-medium text-slate-900">
              € {{ FLIGHTBAG_PRICE.toFixed(2) }}
            </span>
          </div>

          <!-- Hygiëne -->
          <div
            v-if="Array.isArray(intake.hygiene) && intake.hygiene.length"
            class="flex justify-between text-xs"
          >
            <span class="text-slate-800">
              + Hygiëne producten
            </span>
            <span class="font-medium text-slate-900">
              € {{ hygieneTotal.toFixed(2) }}
            </span>
          </div>

          <!-- Tools -->
          <div
            v-if="Array.isArray(intake.tools) && intake.tools.length"
            class="flex justify-between text-xs"
          >
            <span class="text-slate-800">
              + Noodgereedschap
            </span>
            <span class="font-medium text-slate-900">
              € {{ toolsTotal.toFixed(2) }}
            </span>
          </div>

          <!-- Totaal -->
          <div class="border-t border-emerald-100 pt-3 mt-2 flex justify-between items-baseline">
            <span class="text-xs font-medium text-emerald-800 uppercase tracking-[0.16em]">
              Totaal
            </span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-semibold text-emerald-800">
                € {{ intake.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <p class="text-[11px] text-emerald-800">
            Bedrag inclusief btw. Het noodpakket heb je binnen 5 werkdagen in huis!
          </p>
        </div>

      </section>

      <!-- 2. Adres + betalingen -->
      <section class="space-y-6">
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-slate-900">
            Bezorgadres
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Voornaam
              </label>
              <input
                v-model="intake.address.firstName"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Achternaam
              </label>
              <input
                v-model="intake.address.lastName"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">
              E-mailadres
            </label>
            <input
              v-model="intake.address.email"
              type="email"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p class="text-xs text-slate-400">
              We sturen je bevestiging en updates naar dit adres.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2 space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Straat
              </label>
              <input
                v-model="intake.address.street"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div class="col-span-1 space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Nr.
              </label>
              <input
                v-model="intake.address.houseNumber"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Postcode
              </label>
              <input
                v-model="intake.address.postalCode"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="block text-sm font-medium text-slate-700">
                Plaats
              </label>
              <input
                v-model="intake.address.city"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">
              Land
            </label>
            <input
              v-model="intake.address.country"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="loading || !isAddressValid"
          type="button"
          @click="pay"
        >
          <span v-if="!loading">Bestelling plaatsen en betalen</span>
          <span v-else>Betaling wordt klaargezet…</span>
        </button>

        <p v-if="!isAddressValid" class="text-xs text-slate-400">
          Vul je bezorgadres en e-mailadres volledig in om door te gaan naar de betaalpagina.
        </p>

        <p v-if="error" class="text-xs text-red-500">
          {{ error }}
        </p>

        <p class="text-[11px] text-slate-400">
          Door af te rekenen ga je akkoord met onze algemene voorwaarden en privacyverklaring.
        </p>
      </section>
    </div>
  </div>
</template>
