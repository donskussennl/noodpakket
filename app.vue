<script setup lang="ts">
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
  </div>
</template>
