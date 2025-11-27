<script setup lang="ts">
onMounted(() => {
  trackEvent('begin_checkout')
})

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

const hygieneTotal = computed(() => {
  if (!Array.isArray(intake.value.hygiene)) return 0
  return intake.value.hygiene.reduce((sum, item) => {
    return sum + HYGIENE_PRICES[item as keyof typeof HYGIENE_PRICES]
  }, 0)
})

const toolsTotal = computed(() => {
  if (!Array.isArray(intake.value.tools)) return 0
  return intake.value.tools.reduce((sum, item) => {
    return sum + TOOL_PRICES[item as keyof typeof TOOL_PRICES]
  }, 0)
})
const personsCount = computed(() => intake.value.persons || 1)


const hygieneLabels: Record<string, string> = {
  handgel: 'Handgel',
  wcpapier: 'Wc-papier',
  doekjes: 'Natte doekjes',
  tandenborstel: 'Tandpasta + tandenborstel',
  maandverband: 'Maandverband',
}

const toolLabels: Record<string, string> = {
  hammer: 'Hamer',
  saw: 'Zaag',
  tang: 'Kniptang',
}

// init aantallen
onMounted(() => {
  if (intake.value.foodInventory === 'buy') {
    if (!intake.value.foodPackages || intake.value.foodPackages < 0) {
      intake.value.foodPackages = intake.value.persons || 1
    }
  } else {
    intake.value.foodPackages = 0
  }

  if (!intake.value.waterBags || intake.value.waterBags < 0) {
    intake.value.waterBags = intake.value.persons || 1
  }

  calculatePrice()
})

watch(
  () => [
    intake.value.foodInventory,
    intake.value.foodPackages,
    intake.value.waterBags,
    intake.value.hygiene,
    intake.value.flightbag,
    intake.value.tools,
    intake.value.plan,
  ],
  () => {
    calculatePrice()
  },
  { deep: true }
)

const incrementFood = () => {
  if (intake.value.foodInventory !== 'buy') return
  intake.value.foodPackages = (intake.value.foodPackages || 0) + 1
}
const decrementFood = () => {
  if (intake.value.foodInventory !== 'buy') return
  const current = intake.value.foodPackages || 0
  intake.value.foodPackages = Math.max(0, current - 1)
}

const incrementWater = () => {
  intake.value.waterBags = (intake.value.waterBags || 0) + 1
}
const decrementWater = () => {
  const current = intake.value.waterBags || 1
  intake.value.waterBags = Math.max(1, current - 1)
}

const goToCheckout = () => {
  calculatePrice()
  navigateTo('/checkout')
}
</script>

<template>
  <div class="min-h-screen py-1">
    <div class="w-full  px-6 py-8 md:px-12 md:py-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div class="space-y-2">

          <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Winkelmandje
          </h1>
        </div>

        <NuxtLink
          to="/samenstellen"
          class="text-xs text-slate-500 hover:text-slate-700 underline"
        >
          Noodpakket aanpassen
        </NuxtLink>
      </div>

      <div class="grid md:grid-cols-3 gap-10">
        <!-- Linker: overzicht inhoud -->
        <div class="md:col-span-2 space-y-6">
          <div class=" space-y-3 text-sm">

            <div class="flex justify-between">
              <span class="text-slate-500">Aantal personen</span>
              <span class="font-medium text-slate-900">
                {{ intake.persons }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Voedselpakket</span>
              <span class="font-medium text-right text-slate-900">
                {{
                  intake.foodInventory === 'inhouse'
                    ? 'Geen voedselpakket'
                    : intake.foodInventory === 'shoppinglist'
                      ? 'Ik koop zelf nog voedsel'
                      : intake.foodInventory === 'buy'
                        ? 'Noodvoedingspakket voor 72 uur'
                        : '-'
                }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-slate-500">Vluchttas</span>
              <span class="font-medium text-slate-900">
                {{
                  intake.flightbag === 'yes'
                    ? 'Ja'
                    : 'Geen vluchttas'
                }}
              </span>
            </div>
          </div>

            <div class="pt-2 border-t border-slate-200">
              <span class="block text-slate-500 mb-1">Noodpakket basis</span>
              <ul class="text-xs text-slate-600 space-y-1">
                <li>• Noodradio</li>
                <li>• {{ personsCount }}x Wateropslag</li>
                <li>• EHBO-kit</li>
                <li>• {{ personsCount }}x Deken + kussen</li>
                <li>• Zaklamp</li>
                <li>• Batterijen</li>
                <li>• Powerbank</li>
            </ul>

            </div>

            <div v-if="Array.isArray(intake.hygiene) && intake.hygiene.length" class="pt-2 border-t border-slate-200">
              <span class="block text-slate-500 mb-1">Hygiëne</span>
              <ul class="text-xs text-slate-600 space-y-1">
                <li v-for="option in intake.hygiene" :key="option">
                  • {{ hygieneLabels[option] || option }}
                </li>
              </ul>
            </div>


            <div v-if="Array.isArray(intake.tools) && intake.tools.length" class="pt-2 border-t border-slate-200">
              <span class="block text-slate-500 mb-1">Noodgereedschap</span>
              <ul class="text-xs text-slate-600 space-y-1">
                <li v-for="option in intake.tools" :key="option">
                  • {{ toolLabels[option] || option }}
                </li>
              </ul>
            </div>


     
        </div>

        <!-- Rechter: prijs + verder knop -->
        <div class="md:col-span-1 space-y-5">
          <div class="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 space-y-3 text-sm">
            <p class="text-xs font-medium text-emerald-700 uppercase tracking-[0.16em]">
              Jouw prijs
            </p>

            <div class="flex justify-between items-center">
              <span class="text-slate-800">Noodpakket essentieel {{intake.persons}} pers.</span>
              <span class="font-medium text-slate-900">
                € {{ (BASE_PRICE+PERSON_SURCHARGE*(intake.persons-1)).toFixed(2) }}
              </span>
            </div>


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


            <!-- Verzendkosten -->
            <div class="flex justify-between text-xs">
                <span class="text-slate-800">Verzendkosten</span>
                <span class="font-medium text-orange-600">Gratis</span>
            </div>


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
          </div>

          <button
            class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            type="button"
            @click="goToCheckout"
            >
            Ik ga bestellen
            </button>

            <!-- Betaalmethoden -->
            <div class="flex items-center justify-center gap-4 mt-3 opacity-70">
            <!-- iDEAL -->
            <img
                src="../images/ideal.svg"
                alt="iDEAL"
                class="h-6 w-auto"
            />

            <!-- Creditcards (Visa + Mastercard naast elkaar gezet in één afbeelding voor nette schaal) -->
            <img
                src="../images/visa.svg"
                alt="Visa"
                class="h-6 w-auto"
            />

            <img
                src="../images/mastercard.svg"
                alt="Mastercard"
                class="h-6 w-auto"
            />
            <img
                src="../images/postnl.svg"
                alt="PostNL"
                class="h-6 w-auto"
            />
            </div>

        </div>
      </div>
    </div>
  </div>
</template>
