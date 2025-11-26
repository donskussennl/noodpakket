<script setup lang="ts">
useHead({
  script: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-W4K1B0FNL2",
      async: true,
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W4K1B0FNL2', { send_page_view: false });
      `
    }
  ]
})
const mobileOpen = ref(false)

const closeMobile = () => {
  mobileOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900 font-sans">
    <!-- Header -->
    <header class="border-b border-slate-200 bg-[#FFFDF3]/95">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink
          to="/samenstellen"
          class="text-xl font-semibold tracking-tight"
          @click="closeMobile"
        >
          Noodpakket-op-maat.nl
        </NuxtLink>

        <!-- Desktop navigatie -->
        <nav class="hidden md:flex items-center gap-6 text-sm">
          <NuxtLink class="hover:text-emerald-600" to="/samenstellen">Noodpakket samenstellen</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/samenstellen-deluxe">Noodpakket compleet</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/wees-voorbereid">Bereid je voor</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/cart">Winkelwagen</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/contact">Contact</NuxtLink>
        </nav>

        <!-- Mobiel hamburger -->
        <button
          class="md:hidden inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-sm"
          type="button"
          @click="mobileOpen = !mobileOpen"
        >
          <span v-if="!mobileOpen">Menu</span>
          <span v-else>Sluiten</span>
        </button>
      </div>

      <!-- Mobiele dropdown -->
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-slate-200 bg-[#FFFDF3]"
      >
        <nav class="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-3 text-sm">
          <NuxtLink
            class="py-1 hover:text-emerald-600"
            to="/samenstellen"
            @click="closeMobile"
          >
            Noodpakket samenstellen
          </NuxtLink>
          <NuxtLink
            class="py-1 hover:text-emerald-600"
            to="/wees-voorbereid"
            @click="closeMobile"
          >
            Bereid je voor
          </NuxtLink>
          <NuxtLink
            class="py-1 hover:text-emerald-600"
            to="/cart"
            @click="closeMobile"
          >
            Winkelwagen
          </NuxtLink>
          <NuxtLink
            class="py-1 hover:text-emerald-600"
            to="/contact"
            @click="closeMobile"
          >
            Contact
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="pt-10 pb-20">
      <div class="max-w-6xl mx-auto px-6">
        <NuxtPage />
      </div>
    </main>
    <!-- Footer -->
<footer class="border-t border-slate-200 bg-[#FFFDF3] mt-10">
  <div class="max-w-6xl mx-auto px-6 py-8">
    
    <!-- Icons + copyright in één grid -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">

      <!-- Betaalicons -->
      <div class="flex items-center gap-4 opacity-80">
        <img src="/images/ideal.svg" alt="iDEAL" class="h-6 w-auto" />
        <img src="/images/visa.svg" alt="Visa" class="h-6 w-auto" />
        <img src="/images/mastercard.svg" alt="Mastercard" class="h-6 w-auto" />
        <img src="/images/postnl.svg" alt="PostNL" class="h-6 w-auto" />
      </div>

      <!-- Copyright -->
      <p class="text-xs text-slate-500 text-center md:text-right">
        © {{ new Date().getFullYear() }} Noodpakket-op-maat.nl — Alle rechten voorbehouden
      </p>

    </div>

  </div>
</footer>

  </div>
</template>
