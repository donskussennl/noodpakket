<template>
  <div class="min-h-screen bg-[#FFFDF3] text-slate-900 font-sans">
    <!-- Header (optioneel, maar basis voor elke pagina) -->
    <header class="border-b border-slate-200 bg-[#FFFDF3]/95 ">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/samenstellen" class="text-xl font-semibold tracking-tight">
          Noodpakket-op-maat.nl
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6 text-sm">
          <NuxtLink class="hover:text-emerald-600" to="/samenstellen">Noodpakket samenstellen</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/wees-voorbereid">Bereid je voor</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/cart">Winkelwagen</NuxtLink>
          <NuxtLink class="hover:text-emerald-600" to="/contact">Contact</NuxtLink>
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
