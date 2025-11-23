<script setup lang="ts">
const route = useRoute()
const paymentId = computed(() => route.query.id as string | undefined)
</script>

<template>
  <div class="min-h-screen text-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl p-8 md:p-10 space-y-4 text-center">
      <h1 class="text-2xl font-semibold">Bedankt voor je bestelling 🎉</h1>
      <p class="text-sm text-slate-300">
        We hebben je betaling ontvangen of zijn deze aan het verwerken. Je ontvangt je noodpakket binnen 5 werkdagen.
      </p>
      <p v-if="paymentId" class="text-[11px] text-slate-500">
        Betaalreferentie: {{ paymentId }}
      </p>

      <NuxtLink
        to="/"
        class="inline-flex items-center justify-center mt-4 px-5 py-2 rounded-full text-sm bg-slate-800 hover:bg-slate-700"
      >
        Terug naar home
      </NuxtLink>
    </div>
  </div>
</template>
