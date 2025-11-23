<!-- pages/intake.vue -->
<script setup lang="ts">
const { intake, calculatePrice, HYGIENE_PRICES,
  TOOL_PRICES } = useIntake()
const step = ref(1)
const totalSteps = 5

const next = () => {
  if (step.value < totalSteps) {
    step.value++
  } else {
    calculatePrice()
    navigateTo('/checkout')
  }
}

const back = () => {
  if (step.value > 1) step.value--
}

const canGoNext = computed(() => {
  if (step.value === 1) {
    return !!intake.value.householdType && !!intake.value.persons
  }
  if (step.value === 2) {
    return !!intake.value.foodInventory
  }
  if (step.value === 3) {
    return intake.value.hygiene !== null // null = nog niks, [] = bewust 'geen'
  }
  if (step.value === 4) {
    return intake.value.tools !== null
  }
  if (step.value === 5) {
    return !!intake.value.plan
  }
  return true
})

// helpers voor arrays
const toggleHygiene = (option: string) => {
  if (!intake.value.hygiene) intake.value.hygiene = []
  const list = intake.value.hygiene
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
  if (!intake.value.tools) intake.value.tools = []
  const list = intake.value.tools
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

</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-5xl  px-6 py-8 md:px-12 md:py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div class="space-y-2">

          <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Stel je noodpakket samen

          </h1>

        </div>

        <!-- stappen indicator -->
        <div class="flex flex-col items-end gap-2">
          <div class="flex gap-2">
            <div
              v-for="i in totalSteps"
              :key="i"
              class="h-2 w-10 rounded-full transition-all"
              :class="i <= step ? 'bg-emerald-500' : 'bg-slate-200'"
            />
          </div>
          <span class="text-xs text-slate-500">
            Stap {{ step }} van {{ totalSteps }}
          </span>
        </div>
      </div>

      <div class="grid md:grid-cols-1 gap-10">
        <!-- linkerkolom: info / USP's -->
 

        <!-- rechterkolom: stappen -->
        <div class="md:col-span-1 space-y-8">
          <!-- STAP 1 -->
          <div v-if="step === 1" class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-slate-900">
                Vertel ons meer over je huishouden
              </h2>
              <p class="text-sm text-slate-500">
                Je krijgt advies op basis van je gezinssamenstelling
              </p>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Uit hoeveel personen bestaat je huishouden?
              </label>
              <div class="flex flex-col sm:flex-row gap-4">
        
        
                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 1 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 1"
                >
                  <div class="text-base font-medium text-slate-900">1 persoon</div>
                </button>

                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 2 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 2"
                >
                  <div class="text-base font-medium text-slate-900">2 personen</div>
                </button>

                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 3 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 3"
                >
                  <div class="text-base font-medium text-slate-900">3 personen</div>
                </button>

                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 4 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 4"
                >
                  <div class="text-base font-medium text-slate-900">4 personen</div>
                </button>

                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 5 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 5"
                >
                  <div class="text-base font-medium text-slate-900">5 personen</div>
                </button>

                <button
                class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.persons === 6 && 'border-emerald-500 bg-emerald-50'"
                @click="intake.persons = 6"
                >
                  <div class="text-base font-medium text-slate-900">meer dan 5</div>
                </button>
       
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Wat is je gezinssamenstelling
              </label>
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.householdType === 'both' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.householdType = 'both'"
                >
                  <div class="text-base font-medium text-slate-900">Mannen en vrouwen</div>
      
                </button>

                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.householdType === 'female' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.householdType = 'female'"
                >
                  <div class="text-base font-medium text-slate-900">Alleen vrouwen</div>

                </button>

                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.householdType === 'man' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.householdType = 'man'"
                >
                  <div class="text-base font-medium text-slate-900">Alleen mannen</div>

                </button>
               </div> 
            </div>

          </div>

          <!-- STAP 2 -->
          <div v-else-if="step === 2" class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-slate-900">
                Voedselvoorziening
              </h2>
              <p class="text-sm text-slate-500">
                Zodat je minsten 72 uur kan overleven in een noodsituatie
              </p>
            </div>

               <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700">
                Heb je voor 72 uur aan droog & houdbaar voedsel voor je hele huishouden?
              </label>
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.foodInventory === 'inhouse' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.foodInventory = 'inhouse'"
                >
                  <div class="text-base font-medium text-slate-900">Ja</div>
      
                </button>

                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.foodInventory === 'shoppinglist' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.foodInventory = 'shoppinglist'"
                >
                  <div class="text-base font-medium text-slate-900">Nee, dit ga ik nog kopen*</div>

                </button>

                <button
                  class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  :class="intake.foodInventory === 'buy' && 'border-emerald-500 bg-emerald-50'"
                  @click="intake.foodInventory = 'buy'"
                >
                  <div class="text-base font-medium text-slate-900">Nee, voeg toe aan mijn noodpakket</div>

                </button>
                
               </div> 
               
              </div>
              <p class="text-sm text-slate-500">
                *Je ontvangt een boodschappenlijstje zodat je precies weet wat je nodig hebt
              </p>
            </div>

            <!-- STAP 3 -->
            <div v-else-if="step === 3" class="space-y-6">
              <div class="space-y-2">
                <h2 class="text-2xl font-semibold text-slate-900">
                  Hygiëne
                </h2>
                <p class="text-sm text-slate-500">
                  Om infecties en ziektes te voorkomen.
                </p>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700">
                  Welke hygiëneproducten wil je toevoegen aan je noodpakket?
                </label>
                <div class="flex flex-col sm:flex-row flex-wrap gap-4">
                  <!-- NONE / GEEN -->
                  <button
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="Array.isArray(intake.hygiene) && intake.hygiene.length === 0 && 'border-emerald-500 bg-emerald-50'"
                    @click="clearHygiene"
                  >
                    <div class="text-base font-medium text-slate-900">
                      Geen, ik heb alles al
                    </div>
                  </button>

                  <!-- HANDGEL -->
                  <button
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="hasHygiene('handgel') && 'border-emerald-500 bg-emerald-50'"
                    @click="toggleHygiene('handgel')"
                  >
                    <div class="text-base font-medium text-slate-900">Handgel</div>
                    <p class="text-sm text-slate-500">
                        € 4
                      </p>
                  </button>

                  <!-- WC-PAPIER -->
                  <button
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="hasHygiene('wcpapier') && 'border-emerald-500 bg-emerald-50'"
                    @click="toggleHygiene('wcpapier')"
                  >
                    <div class="text-base font-medium text-slate-900">Wc-papier</div>
                    <p class="text-sm text-slate-500">
                        € 8
                      </p>
                  </button>

                  <!-- DOEKJES -->
                  <button
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="hasHygiene('doekjes') && 'border-emerald-500 bg-emerald-50'"
                    @click="toggleHygiene('doekjes')"
                  >
                    <div class="text-base font-medium text-slate-900">Natte doekjes</div>
                    <p class="text-sm text-slate-500">
                        € 5
                      </p>
                  </button>

                  <!-- TANDPASTA + BORSTEL -->
                  <button
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="hasHygiene('tandenborstel') && 'border-emerald-500 bg-emerald-50'"
                    @click="toggleHygiene('tandenborstel')"
                  >
                    <div class="text-base font-medium text-slate-900">Tandpasta + tandenborstel</div>
                    <p class="text-sm text-slate-500">
                        € 3
                      </p>
                  </button>

                  <!-- MAANDVERBAND: alleen bij both/female -->
                  <button
                    v-if="intake.householdType === 'both' || intake.householdType === 'female'"
                    class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                    :class="hasHygiene('maandverband') && 'border-emerald-500 bg-emerald-50'"
                    @click="toggleHygiene('maandverband')"
                  >
                    <div class="text-base font-medium text-slate-900">Maandverband</div>
                    <p class="text-sm text-slate-500">
                        € 4
                      </p>
                  </button>
                </div>
              </div>
            </div>


              <!-- STAP 4 -->
              <div v-else-if="step === 4" class="space-y-6">
                <div class="space-y-2">
                  <h2 class="text-2xl font-semibold text-slate-900">
                    Levensreddende gereedschappen
                  </h2>
                  <p class="text-sm text-slate-500">
                    Handig in geval van nood.
                  </p>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-slate-700">
                    Welke gereedschappen wil je toevoegen aan je noodpakket?
                  </label>
                  <div class="flex flex-col sm:flex-row flex-wrap gap-4">
                    <!-- GEEN -->
                    <button
                      class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                      :class="Array.isArray(intake.tools) && intake.tools.length === 0 && 'border-emerald-500 bg-emerald-50'"
                      @click="clearTools"
                    >
                      <div class="text-base font-medium text-slate-900">
                        Geen, ik heb alles al
                      </div>
                    </button>

                    <!-- HAMER -->
                    <button
                      class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                      :class="hasTool('hammer') && 'border-emerald-500 bg-emerald-50'"
                      @click="toggleTool('hammer')"
                    >
                      <div class="text-base font-medium text-slate-900">Hamer</div>
                      <p class="text-sm text-slate-500">
                        € 15
                      </p>
                    </button>

                    <!-- ZAAG -->
                    <button
                      class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                      :class="hasTool('saw') && 'border-emerald-500 bg-emerald-50'"
                      @click="toggleTool('saw')"
                    >
                      <div class="text-base font-medium text-slate-900">Zaag</div>
                      <p class="text-sm text-slate-500">
                        € 19
                      </p>
                    </button>

                    <!-- KNIPTANG -->
                    <button
                      class="flex-1 rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                      :class="hasTool('tang') && 'border-emerald-500 bg-emerald-50'"
                      @click="toggleTool('tang')"
                    >
                      <div class="text-base font-medium text-slate-900">Kniptang</div>
                      <p class="text-sm text-slate-500">
                        € 9
                      </p>
                    </button>
                  </div>
                </div>
              </div>


          <!-- STAP 5 -->
          <div v-else-if="step === 5" class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-slate-900">
                Kies je plan
              </h2>
              <p class="text-sm text-slate-500">
                Je kunt dit later altijd nog aanpassen.
              </p>
            </div>

            <div class="space-y-3">
              <label
                class="flex items-center gap-3 rounded-2xl border px-4 py-4 cursor-pointer transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.plan === 'basic' && 'border-emerald-500 bg-emerald-50'"
              >
                <input
                  v-model="intake.plan"
                  type="radio"
                  value="basic"
                  class="h-4 w-4 text-emerald-600"
                />
                <div class="flex-1">
                  <div class="text-sm font-medium text-slate-900">
                    Basic
                  </div>
                  <p class="text-sm text-slate-500">
                    Complete, hoogwaardige voeding – ideaal om te starten.
                  </p>
                </div>
                <span class="text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                  Vanaf €24 / maand
                </span>
              </label>

              <label
                class="flex items-center gap-3 rounded-2xl border px-4 py-4 cursor-pointer transition hover:border-emerald-500 hover:bg-emerald-50"
                :class="intake.plan === 'premium' && 'border-emerald-500 bg-emerald-50'"
              >
                <input
                  v-model="intake.plan"
                  type="radio"
                  value="premium"
                  class="h-4 w-4 text-emerald-600"
                />
                <div class="flex-1">
                  <div class="text-sm font-medium text-slate-900">
                    Premium
                  </div>
                  <p class="text-sm text-slate-500">
                    Extra hoge vleesfractie, snacks inbegrepen en persoonlijke opvolging.
                  </p>
                </div>
                <span class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  Meest gekozen
                </span>
              </label>
            </div>
          </div>

          <!-- navigatie buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              v-if="step > 1"
              class="text-sm text-slate-500 hover:text-slate-700"
              type="button"
              @click="back"
            >
              ← Vorige stap
            </button>
            <span v-else />

            <button
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!canGoNext"
              type="button"
              @click="next"
            >
              <span>
                {{ step === totalSteps ? 'Ga naar gegevens & prijs' : 'Volgende stap' }}
              </span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
