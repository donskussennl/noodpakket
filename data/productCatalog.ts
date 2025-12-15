// ~/data/productCatalog.ts
import type { BulletItem } from '~/data/essentialProducts'

export type CatalogKind = 'food' | 'flightbag' | 'hygiene' | 'tool'

export interface CatalogProductInfo {
  id: string
  kind: CatalogKind
  /** Wordt gebruikt voor tabs/filters op aanbod.vue */
  category: string
  label: string
  subLabel?: string
  image: string
  /** Optionele 2e afbeelding (bv. achterkant/verpakking). */
  image2?: string
  description: string
  bullets: BulletItem[]
  /**
   * Als je dit vult, tonen we een 'van'-prijs (berekend als prijs/0,85) in aanbod.vue.
   * Laat leeg = geen actie-badge en geen van-prijs.
   */
  promoLabel?: string
}

export const FOOD_INFO: CatalogProductInfo = {
  id: 'food',
  kind: 'food',
  category: 'Voeding',
  label: 'Voedselpakket',
  subLabel: '2400 kcal per dag',
  image: '/images/noodpakket/voedselpakket-nood.png',
  description:
    'Kies voor echt voedsel in blik en stevige verpakkingen; voedzamer en smakelijker dan poederzakjes. Gebaseerd op het advies van het Voedingscentrum.',
  bullets: [
    { type: 'check', text: '3–4 blikken maaltijdsoep, chili of bonen' },
    { type: 'check', text: '3 blikken groente (mais, doperwt, wortel)' },
    { type: 'check', text: '1–2 blikken saus en zak rijst/pasta' },
    { type: 'check', text: 'Aanvulling: crackers, repen, jam' },
    { type: 'dot', text: 'Voldoende energie voor 72 uur' }
  ],
  promoLabel: '15% korting'
}

export const FLIGHTBAG_INFO: CatalogProductInfo = {
  id: 'flightbag',
  kind: 'flightbag',
  category: 'Vluchttas',
  label: 'Vluchttas',
  subLabel: '30 liter (Rugzak)',
  image: '/images/noodpakket/vluchttas.png',
  description:
    'Een stevige, ruime rugzak waar je hele noodpakket in past. Zorg dat je in geval van een evacuatie direct weg kunt.',
  bullets: [
    { type: 'check', text: 'Ruim hoofdcompartiment (30 liter)' },
    { type: 'check', text: 'Stevige, comfortabele schouderbanden' },
    { type: 'check', text: 'Houdt je handen vrij tijdens evacuatie' },
    { type: 'dot', text: 'Discreet design' }
  ],
  promoLabel: '15% korting'
}

export const HYGIENE_OPTS: CatalogProductInfo[] = [
  {
    id: 'handgel',
    kind: 'hygiene',
    category: 'Hygiëne',
    label: 'Desinfectie gel',
    subLabel: '250 ml',
    image: '/images/noodpakket/handgel.jpg',
    description:
      'Houd je handen schoon, ook als er geen stromend water beschikbaar is. Cruciaal om ziektes te voorkomen.',
    bullets: [
      { type: 'check', text: 'Doodt 99.9% van de bacteriën' },
      { type: 'check', text: 'Geen water nodig' },
      { type: 'check', text: 'Sneldrogend' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'wcpapier',
    kind: 'hygiene',
    category: 'Hygiëne',
    label: 'Wc-papier',
    subLabel: '4 rollen',
    image: '/images/noodpakket/wcpapier.jpg',
    description:
      'Een basisbehoefte die vaak als eerste opraakt in winkels tijdens noodsituaties.',
    bullets: [
      { type: 'check', text: '4 rollen per pakket' },
      { type: 'check', text: 'Zacht en stevig' },
      { type: 'dot', text: 'Compact verpakt' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'doekjes',
    kind: 'hygiene',
    category: 'Hygiëne',
    label: 'Natte doekjes',
    subLabel: 'Pak van 50 stuks',
    image: '/images/noodpakket/doekjes.jpg',
    description: 'Voor snelle lichamelijke hygiëne of het schoonmaken van oppervlakken.',
    bullets: [
      { type: 'check', text: 'Verfrissend en reinigend' },
      { type: 'check', text: 'Hersluitbare verpakking' },
      { type: 'check', text: 'Geschikt voor lichaam en gezicht' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'tandenborstel',
    kind: 'hygiene',
    category: 'Hygiëne',
    label: 'Tandpasta + tandenborstel',
    subLabel: 'Setje',
    image: '/images/noodpakket/tandenborstel.jpg',
    description: 'Mondhygiëne is belangrijk voor je gezondheid en moraal.',
    bullets: [
      { type: 'check', text: 'Inclusief tandpasta' },
      { type: 'check', text: 'Reisformaat, makkelijk mee te nemen' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'maandverband',
    kind: 'hygiene',
    category: 'Hygiëne',
    label: 'Maandverband',
    subLabel: '1 pak (normaal)',
    image: '/images/noodpakket/maandverband.jpg',
    description:
      'Essentieel voor vrouwen in het huishouden. Kan in nood ook dienen als verbandmateriaal.',
    bullets: [
      { type: 'check', text: 'Hoog absorptievermogen' },
      { type: 'check', text: 'Individueel verpakt' }
    ],
    promoLabel: '15% korting'
  }
]

export const TOOL_OPTS: CatalogProductInfo[] = [
  {
    id: 'hammer',
    kind: 'tool',
    category: 'Gereedschap',
    label: 'Hamer',
    subLabel: 'Klauwhamer',
    image: '/images/noodpakket/hamer.png',
    description:
      'Een hamer is onmisbaar voor noodreparaties, het openbreken van obstakels of het bevestigen van beschutting.',
    bullets: [
      { type: 'check', text: 'Stevige klauwhamer' },
      { type: 'check', text: 'Anti-slip handvat' },
      { type: 'dot', text: 'Multifunctioneel inzetbaar' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'opener',
    kind: 'tool',
    category: 'Gereedschap',
    label: 'Blikopener',
    subLabel: 'RVS',
    image: '/images/noodpakket/blikopener.png',
    description:
      'Zonder blikopener is je noodvoorraad in blik waardeloos. Een eenvoudig, onverwoestbaar model.',
    bullets: [
      { type: 'check', text: 'Werkt altijd, geen stroom nodig' },
      { type: 'check', text: 'Roestvrij staal' },
      { type: 'cross', text: 'Niet afhankelijk van lipjes op blikken' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'saw',
    kind: 'tool',
    category: 'Gereedschap',
    label: 'Zaag',
    subLabel: 'Handzaag (hout)',
    image: '/images/noodpakket/zaag.png',
    description:
      'Om hout te zagen voor warmte, of om obstakels (zoals omgevallen bomen) weg te werken.',
    bullets: [
      { type: 'check', text: 'Scherp getand blad' },
      { type: 'check', text: 'Compact formaat' }
    ],
    promoLabel: '15% korting'
  },
  {
    id: 'tang',
    kind: 'tool',
    category: 'Gereedschap',
    label: 'Kniptang',
    subLabel: 'Gehard staal',
    image: '/images/noodpakket/tang.png',
    description:
      'Voor het doorknippen van draden, kabels of het losmaken van vastzittende objecten.',
    bullets: [
      { type: 'check', text: 'Sterke knipkracht' },
      { type: 'check', text: 'Geïsoleerde handvaten' }
    ],
    promoLabel: '15% korting'
  }
]

export const CATALOG_PRODUCTS: CatalogProductInfo[] = [
  FOOD_INFO,
  FLIGHTBAG_INFO,
  ...HYGIENE_OPTS,
  ...TOOL_OPTS
]
