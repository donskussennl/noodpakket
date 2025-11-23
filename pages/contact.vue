<script setup lang="ts">
useHead({
  title: 'Contact | noodpakket-op-maat',
  meta: [
    {
      name: 'description',
      content:
        'Neem contact op met noodpakket-op-maat. Bekijk ons adres, e-mailadres en stuur ons een bericht.',
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900">
    <main class="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-16">
      <!-- Intro -->
      <section class="space-y-4">
        <p class="text-sm font-medium tracking-wide uppercase text-emerald-700">
          Contact
        </p>
        <h1 class="text-2xl md:text-4xl font-semibold">
          Neem contact met ons op
        </h1>
        <p class="text-base md:text-lg text-slate-700 max-w-2xl">
          Heb je vragen over ons noodpakket, je bestelling of ons bedrijf?
          Stuur ons gerust een bericht — we helpen je graag verder.
        </p>
      </section>

      <!-- Contactgegevens -->
      <section
        class="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 md:p-10 space-y-8"
      >
        <div class="space-y-2">
          <h2 class="text-xl md:text-2xl font-semibold">Onze gegevens</h2>
          <p class="text-slate-700 text-sm md:text-base">
            Je kunt ons bereiken via e-mail of per post. Binnen één werkdag reageren we op je bericht.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 md:gap-12">
          <!-- Adres -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-slate-900">Bezoek- & postadres</h3>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed">
              <span class="font-medium text-slate-900">Noodpakket-op-maat</span><br />
              Ariënsplein 1<br />
              7511 JX Enschede
            </p>
          </div>

          <!-- E-mail -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-slate-900">E-mail</h3>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed">
              Voor vragen, opmerkingen of samenwerkingen:<br />
              <a
                href="mailto:info@noodpakket-op-maat.nl"
                class="text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                info@noodpakket-op-maat.nl
              </a>
            </p>
          </div>
        </div>
      </section>

      <!-- Contactformulier -->
      <section class="space-y-6">
        <h2 class="text-xl md:text-2xl font-semibold">Stuur ons een bericht</h2>
        <p class="text-sm md:text-base text-slate-700 max-w-xl">
          Vul je gegevens in en we nemen zo snel mogelijk contact met je op.
        </p>

        <form class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-900">Naam</label>
              <input
                type="text"
                placeholder="Je naam"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-900">E-mail</label>
              <input
                type="email"
                placeholder="jij@email.nl"
                class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-900">Bericht</label>
            <textarea
              rows="5"
              placeholder="Waar kunnen we je mee helpen?"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm resize-none focus:border-emerald-600 focus:ring-emerald-600"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled
            class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm md:text-base font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            Bericht versturen
            <span aria-hidden="true">→</span>
          </button>


        </form>
      </section>
    </main>
  </div>
</template>
