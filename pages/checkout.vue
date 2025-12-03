<script setup lang="ts">
const {
  intake,
  calculatePrice,
} = useIntake()

const loading = ref(false)
const error = ref<string | null>(null)

// Helper voor prijs weergave
const formatPrice = (price: number) => price.toFixed(2)

// Zorg dat prijs berekend is bij laden
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
          persons: intake.value.persons,
          foodInventory: intake.value.foodInventory,
          foodPackages: intake.value.foodPackages,
          hygiene: intake.value.hygiene,
          tools: intake.value.tools,
          flightbag: intake.value.flightbag,
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
  <div class="min-h-screen  flex justify-center py-8 md:py-12">
    <div class="w-full max-w-2xl px-6">
      
      <header class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900">
          Gegevens invullen
        </h1>
      </header>

      <section class="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <span class="block text-sm text-slate-500 mb-1">Totaal te betalen</span>
            <span class="text-3xl font-bold text-slate-900">€ {{ formatPrice(intake.price) }}</span>
          </div>
          
          <div class="text-sm space-y-1">
            <div class="flex items-center gap-2 text-slate-700">
              <span class="text-emerald-600">✓</span> Gratis verzending
            </div>
            <div class="flex items-center gap-2 text-slate-700">
              <span class="text-emerald-600">✓</span> Binnen 5 werkdagen in huis
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200">
          <NuxtLink 
            to="/cart" 
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            ← Bestelling aanpassen
          </NuxtLink>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Bezorgadres
        </h2>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">Voornaam</label>
              <input
                v-model="intake.address.firstName"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">Achternaam</label>
              <input
                v-model="intake.address.lastName"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2 space-y-1">
              <label class="block text-sm font-medium text-slate-700">Straat</label>
              <input
                v-model="intake.address.street"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
            <div class="col-span-1 space-y-1">
              <label class="block text-sm font-medium text-slate-700">Huisnr.</label>
              <input
                v-model="intake.address.houseNumber"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">Postcode</label>
              <input
                v-model="intake.address.postalCode"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="block text-sm font-medium text-slate-700">Plaats</label>
              <input
                v-model="intake.address.city"
                type="text"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">Land</label>
            <input
              v-model="intake.address.country"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
          </div>
        </div>

        <h2 class="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mt-8">
          Contactgegevens
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">E-mailadres</label>
            <input
              v-model="intake.address.email"
              type="email"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
            <p class="text-xs text-slate-400">Voor de orderbevestiging.</p>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700">Telefoonnummer</label>
            <input
              v-model="intake.address.phone"
              type="tel"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
            <p class="text-xs text-slate-400">Voor updates over de bezorging.</p>
          </div>
        </div>

        <div class="pt-6">
          <button
            class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !isAddressValid"
            type="button"
            @click="pay"
          >
            <span v-if="!loading">Betalen en afronden</span>
            <span v-else>Even geduld...</span>
          </button>

          <p v-if="!isAddressValid" class="text-center text-xs text-red-500 mt-3 font-medium">
            Vul alle velden in om door te gaan.
          </p>

          <p v-if="error" class="text-center text-xs text-red-500 mt-3">
            {{ error }}
          </p>

          <div class="flex items-center justify-center gap-3 mt-6 opacity-40 grayscale">
            <img src="/images/ideal.svg" alt="iDEAL" class="h-5 w-auto" />
            <img src="/images/visa.svg" alt="Visa" class="h-5 w-auto" />
            <img src="/images/mastercard.svg" alt="Mastercard" class="h-5 w-auto" />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>