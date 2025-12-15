<script setup lang="ts">
import { ESSENTIAL_PRODUCTS, type EssentialProduct } from '~/data/essentialProducts'
import { CATALOG_PRODUCTS, type CatalogProductInfo } from '~/data/productCatalog'

const {
  intake,
  calculatePrice,
  HYGIENE_PRICES,
  TOOL_PRICES,
  FLIGHTBAG_PRICE,
  FOOD_PACKAGE_PRICE
} = useIntake()

type AnyProduct =
  | (EssentialProduct & { kind: 'essential'; category: string; promoLabel?: string })
  | (CatalogProductInfo & { kind: CatalogProductInfo['kind'] })

const essentialsForAanbod = computed<AnyProduct[]>(() =>
  ESSENTIAL_PRODUCTS.map(p => ({
    ...p,
    kind: 'essential' as const,
    category: (p as any).category || 'Essentieel',
    promoLabel: (p as any).promoLabel
  }))
)

const allProducts = computed<AnyProduct[]>(() => [
  ...essentialsForAanbod.value,
  ...(CATALOG_PRODUCTS as AnyProduct[])
])

type Tab = { key: string; label: string }
const categories = computed(() => {
  const set = new Set<string>()
  allProducts.value.forEach(p => set.add(p.category || 'Overig'))
  return Array.from(set)
})

const tabs = computed<Tab[]>(() => [
  { key: 'all', label: 'Alles' },
  ...categories.value.map(c => ({ key: c, label: c })),
])

const activeTab = ref('all')
const filteredProducts = computed(() => {
  if (activeTab.value === 'all') return allProducts.value
  return allProducts.value.filter(p => (p.category || 'Overig') === activeTab.value)
})

const fmt = (n: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

const getUnitPrice = (p: AnyProduct): number => {
  if (p.kind === 'essential') return p.price
  if (p.kind === 'food') return FOOD_PACKAGE_PRICE
  if (p.kind === 'flightbag') return FLIGHTBAG_PRICE
  if (p.kind === 'hygiene') return HYGIENE_PRICES[p.id as any] || 0
  if (p.kind === 'tool') return TOOL_PRICES[p.id as any] || 0
  return 0
}

const getOldPrice = (p: AnyProduct): number | null => {
  // Alleen tonen als er een promoLabel is (actie)
  const promo = (p as any).promoLabel
  if (!promo) return null
  const old = getUnitPrice(p) / 0.85
  return Math.round(old * 100) / 100
}

const cartCount = computed(() => {
  const essentials = intake.value.selectedEssentials?.length || 0
  const hygiene = intake.value.hygiene?.length || 0
  const tools = intake.value.tools?.length || 0
  const flightbag = intake.value.flightbag === 'yes' ? 1 : 0
  const food = intake.value.foodInventory === 'buy' ? (intake.value.persons || 1) : 0
  return essentials + hygiene + tools + flightbag + food
})

// -------- Modal --------
const modalOpen = ref(false)
const modalProduct = ref<AnyProduct | null>(null)
const modalImgIndex = ref(0)

const openModal = (p: AnyProduct) => {
  modalProduct.value = p
  modalImgIndex.value = 0
  modalOpen.value = true
}
const closeModal = () => {
  modalOpen.value = false
  modalProduct.value = null
}

const modalImages = computed(() => {
  if (!modalProduct.value) return []
  const imgs = [modalProduct.value.image]
  const img2 = (modalProduct.value as any).image2 as string | undefined
  if (img2) imgs.push(img2)
  return imgs
})

// -------- Add-to-cart + fly animation --------
const addingId = ref<string | null>(null)

const addToCart = async (p: AnyProduct, imgEl?: HTMLElement | null) => {
  addingId.value = p.id

  if (p.kind === 'essential') {
    intake.value.selectedEssentials.push(p.id as any)
  } else if (p.kind === 'hygiene') {
    const id = p.id as any
    if (!intake.value.hygiene.includes(id)) intake.value.hygiene.push(id)
  } else if (p.kind === 'tool') {
    const id = p.id as any
    if (!intake.value.tools.includes(id)) intake.value.tools.push(id)
  } else if (p.kind === 'flightbag') {
    intake.value.flightbag = 'yes'
  } else if (p.kind === 'food') {
    intake.value.foodInventory = 'buy'
  }

  calculatePrice()
  if (imgEl) flyToCart(imgEl)

  await new Promise(r => setTimeout(r, 250))
  addingId.value = null
}

const getCartTargetEl = (): HTMLElement | null => {
  const byId = document.getElementById('cart-fly-target') as HTMLElement | null
  if (byId) return byId
  const byData = document.querySelector('[data-cart-target="1"]') as HTMLElement | null
  if (byData) return byData
  const byHref = document.querySelector('a[href="/cart"]') as HTMLElement | null
  return byHref
}

const flyToCart = (imgEl: HTMLElement) => {
  const target = getCartTargetEl()
  if (!target) return

  const imgRect = imgEl.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  const ghost = (imgEl as HTMLImageElement).cloneNode(true) as HTMLImageElement
  ghost.style.position = 'fixed'
  ghost.style.left = `${imgRect.left}px`
  ghost.style.top = `${imgRect.top}px`
  ghost.style.width = `${imgRect.width}px`
  ghost.style.height = `${imgRect.height}px`
  ghost.style.objectFit = 'cover'
  ghost.style.zIndex = '9999'
  ghost.style.borderRadius = '14px'
  ghost.style.pointerEvents = 'none'
  ghost.style.transition = 'transform 650ms cubic-bezier(.2,.9,.2,1), opacity 650ms ease'
  document.body.appendChild(ghost)

  const dx = (targetRect.left + targetRect.width / 2) - (imgRect.left + imgRect.width / 2)
  const dy = (targetRect.top + targetRect.height / 2) - (imgRect.top + imgRect.height / 2)

  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.08)`
    ghost.style.opacity = '0.2'
  })

  const cleanup = () => {
    ghost.removeEventListener('transitionend', cleanup)
    ghost.remove()
  }
  ghost.addEventListener('transitionend', cleanup)
}

const onEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && modalOpen.value) closeModal()
}
onMounted(() => window.addEventListener('keydown', onEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', onEscape))
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-3 md:px-6 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-slate-900 font-semibold">Aanbiedingen</span>
        </div>

        <NuxtLink
          to="/cart"
          id="cart-fly-target"
          class="relative inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 hover:border-slate-300"
          aria-label="Naar winkelwagen"
        >
          <span class="text-sm font-medium">Mandje</span>
          <span
            class="min-w-[22px] h-[22px] px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="max-w-6xl mx-auto px-2 md:px-5 pb-2 overflow-x-auto">
        <div class="flex gap-2">
          <button
            v-for="t in tabs"
            :key="t.key"
            class="whitespace-nowrap px-4 py-2 rounded-full text-sm border transition"
            :class="activeTab === t.key
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'"
            @click="activeTab = t.key"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="max-w-6xl mx-auto px-3 md:px-6 py-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="p in filteredProducts"
          :key="p.kind + ':' + p.id"
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <!-- Image: add-to-cart -->
          <button
            class="w-full relative bg-[#f6f3ef] aspect-[4/3] flex items-center justify-center"
            @click="(e) => addToCart(p, (e.currentTarget as HTMLElement).querySelector('img'))"
            :aria-label="`Voeg ${p.label} toe aan mandje`"
          >
            <img
              :src="p.image"
              :alt="p.label"
              class="max-h-[78%] w-auto select-none"
              draggable="false"
            />

            <div
              v-if="(p as any).promoLabel"
              class="absolute left-3 bottom-3 bg-yellow-300 text-slate-900 text-xs font-semibold px-3 py-1 rounded-lg"
            >
              {{ (p as any).promoLabel }}
            </div>

            <div
              v-if="addingId === p.id"
              class="absolute right-3 bottom-3 bg-white/90 border border-slate-200 text-slate-900 text-xs font-semibold px-2 py-1 rounded-lg"
            >
              +1
            </div>
          </button>

          <!-- Text: open modal -->
          <div class="p-3">
            <button
              type="button"
              class="text-left w-full"
              @click="openModal(p)"
            >
              <div class="font-semibold text-slate-900 leading-tight line-clamp-2 hover:underline">
                {{ p.label }} ›
              </div>
              <div v-if="p.subLabel" class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {{ p.subLabel }}
              </div>
            </button>

            <div class="mt-2 flex items-end gap-2">
              <div v-if="getOldPrice(p)" class="text-xs text-slate-400 line-through">
                {{ fmt(getOldPrice(p)!) }}
              </div>
              <div class="text-sm font-bold text-red-600">
                {{ fmt(getUnitPrice(p)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="modalOpen && modalProduct"
      class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="w-full max-w-lg md:max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden"
        style="max-height: 85vh"
        @click.stop
      >
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <div class="font-semibold text-slate-900">
            {{ modalProduct.label }}
          </div>
          <button class="p-2 rounded-lg hover:bg-slate-100" @click="closeModal" aria-label="Sluiten">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto" style="max-height: calc(85vh - 64px)">
          <!-- Image slider -->
          <div class="bg-[#f6f3ef] p-4">
            <div class="relative rounded-2xl overflow-hidden bg-white/60 border border-slate-200">
              <img
                :src="modalImages[modalImgIndex]"
                :alt="modalProduct.label"
                class="w-full h-[260px] object-contain"
                draggable="false"
              />

              <button
                v-if="modalImages.length > 1"
                class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 rounded-full w-9 h-9 grid place-items-center"
                @click="modalImgIndex = (modalImgIndex - 1 + modalImages.length) % modalImages.length"
                aria-label="Vorige afbeelding"
              >
                ‹
              </button>
              <button
                v-if="modalImages.length > 1"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 rounded-full w-9 h-9 grid place-items-center"
                @click="modalImgIndex = (modalImgIndex + 1) % modalImages.length"
                aria-label="Volgende afbeelding"
              >
                ›
              </button>
            </div>

            <div v-if="modalImages.length > 1" class="flex gap-2 mt-3 justify-center">
              <button
                v-for="(src, i) in modalImages"
                :key="src"
                class="w-12 h-12 rounded-xl overflow-hidden border"
                :class="i === modalImgIndex ? 'border-emerald-600' : 'border-slate-200'"
                @click="modalImgIndex = i"
                aria-label="Selecteer afbeelding"
              >
                <img :src="src" :alt="modalProduct.label" class="w-full h-full object-cover" draggable="false" />
              </button>
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-end gap-2">
              <div v-if="getOldPrice(modalProduct)" class="text-sm text-slate-400 line-through">
                {{ fmt(getOldPrice(modalProduct)!) }}
              </div>
              <div class="text-lg font-extrabold text-red-600">
                {{ fmt(getUnitPrice(modalProduct)) }}
              </div>
              <span
                v-if="(modalProduct as any).promoLabel"
                class="ml-2 text-xs font-semibold bg-yellow-300 text-slate-900 px-2 py-1 rounded-lg"
              >
                {{ (modalProduct as any).promoLabel }}
              </span>
            </div>

            <p class="text-sm text-slate-700 mt-3 leading-relaxed">
              {{ modalProduct.description }}
            </p>

            <ul v-if="modalProduct.bullets?.length" class="mt-4 space-y-2">
              <li
                v-for="(b, idx) in modalProduct.bullets"
                :key="idx"
                class="text-sm text-slate-700 flex gap-2"
              >
                <span class="mt-[2px]">
                  <span v-if="b.type === 'check'">✅</span>
                  <span v-else-if="b.type === 'cross'">❌</span>
                  <span v-else>•</span>
                </span>
                <span v-if="b.text">{{ b.text }}</span>
                <span v-else v-html="b.html"></span>
              </li>
            </ul>

            <button
              class="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-3"
              @click="addToCart(modalProduct)"
            >
              Voeg toe aan mandje
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
