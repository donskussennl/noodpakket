// ~/data/essentialProducts.ts
export type EssentialProductKey =
  | 'water'
  | 'radio'
  | 'powerbank'
  | 'flashlight'
  | 'batteries'
  | 'firstaid'
  | 'matches'
  | 'candles'
  | 'blanket'
  | 'whistle'
  | 'map'
  | 'touw'

export type BulletType = 'check' | 'cross' | 'dot'

export interface BulletItem {
  type: 'check' | 'cross' | 'dot'
  text?: string
  html?: string
}

export interface EssentialProduct {
  id: EssentialProductKey
  label: string
  image: string
  description: string
  price: number          // Nieuw: losse prijs
  multiplies: boolean    // Nieuw: true als dit x aantal personen moet (bv water)
  subLabel?: string  // <--- NIEUW: Optioneel veld voor specificaties
  bullets?: BulletItem[]
}

export const ESSENTIAL_PRODUCTS: EssentialProduct[] = [
  {
    id: 'water',
    label: 'Wateropslag',
    image: '/images/noodpakket/wateropslag.png',
    description: 'Deze watervoorziening geeft tijdens een noodsituatie direct toegang tot schoon drinkwater. De watervoorziening bevat 72 uur aan drinkwater voor 1 persoon.',
    price: 7.90,
    subLabel: '9 liter',
    multiplies: true,
    bullets: [
      {type: 'check', text: 'Direct toegang tot schoon drinkwater tijdens een noodsituatie'},
      {type: 'check', text: 'Makkelijk te vullen en 1 jaar te bewaren'},
      {type: 'check', text: 'Afgestemd op aantal personen in je huishouden'},
      {type: 'cross', text: 'Geen rivier of waterzuiveringstablet nodig, gewoon kraanwater'}
    ]
  },
  {
    id: 'radio',
    label: 'FM-Noodradio',
    image: '/images/noodpakket/noodradio.png',
    description: `Met deze noodradio blijf je op de hoogte van belangrijke berichten van overheid en hulpdiensten.`,
    price: 19.90,
    subLabel: 'op AAA-batterijen',
    multiplies: false,
    bullets: [
      {type: 'check', text: 'Werkt op batterijen'},
      {type: 'check', text: 'Ontvangt FM-noodberichten'},
      {type: 'cross', html: `Geen zon of fysieke kracht nodig.`}
    ]
  },
  {
    id: 'powerbank',
    label: 'Powerbank',
    image: '/images/noodpakket/powerbank.png',
    description: 'Met deze powerbank blijft je telefoon bereikbaar voor bellen, berichten en informatie.',
    price: 19.90,
    subLabel: '3x je telefoon opladen',
    multiplies: false,
    bullets: [
      {type: 'check', text: 'Meerdere telefoonladingen'},
      {type: 'check', text: 'Compact en makkelijk mee te nemen'},
      {type: 'check', text: 'Blijf in contact met familie en nooddiensten'}
    ]
  },
  {
    id: 'blanket',
    label: 'Deken + kussen',
    image: '/images/noodpakket/blanket.png',
    description: 'Zorg voor voldoende warmte en comfort bij stroomuitval of een noodsituatie.',
    price: 9.90,
    subLabel: 'Extra warm',
    multiplies: true,
    bullets: [
        { type: 'check', text: 'Houdt je warm tijdens kou, evacuaties of stroomuitval' },
        { type: 'check', text: 'Comfortabeler en duurzamer dan een goudkleurige nooddeken' },
        { type: 'check', text: 'Per persoon één deken en één kussen nodig' }
    ]
  },
  {
    id: 'map',
    label: 'Plattegrond',
    image: '/images/noodpakket/kaart.png',
    description: 'Een fysieke kaart van je woonplaats helpt je navigeren wanneer GPS, internet of telefoons niet werken.',
    price: 0.50,
    subLabel: 'van je woonplaats',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Werkt zonder telefoon, internet of stroom' },
      { type: 'check', text: 'Handig voor alternatieve routes en ontmoetingspunten' },
      { type: 'dot',   text: 'Aanbevolen door de overheid in elk noodpakket' }
    ]
  },
  {
    id: 'flashlight',
    label: 'Zaklamp',
    image: '/images/noodpakket/zaklamp.png',
    description: 'Een betrouwbare zaklamp is essentieel bij stroomuitval.',
    price: 1.65,
    subLabel: 'op AAA-batterijen',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Werkt op batterijen of is op te laden' },
      { type: 'check', text: 'Lange brandduur' },
      { type: 'check', text: 'Sterke, heldere lichtbundel' }
    ]
  },
  {
    id: 'batteries',
    label: 'AAA Batterijen',
    image: '/images/noodpakket/batterijen.png',
    description: 'Reservebatterijen zorgen ervoor dat je noodradio en zaklamp blijven werken.',
    price: 3.80,
    subLabel: '10 stuks',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Onmisbaar voor zaklampen en noodradio’s' },
      { type: 'check', text: 'Lang houdbaar en veilig op te slaan' },
      { type: 'dot',   text: 'Geadviseerd door de Nederlandse overheid' }
    ]
  },
  {
    id: 'firstaid',
    label: 'EHBO-kit',
    image: '/images/noodpakket/ehbo-kit.png',
    description: 'Een compacte maar complete EHBO-kit voor kleine verwondingen.',
    price: 7.90,
    subLabel: 'O.a. Pleister, gaas, tape en verband.',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Bevat pleisters, gaas, tape, verband en desinfectie' },
      { type: 'check', text: 'Alles bij elkaar in een stevig en overzichtelijk tasje' },
      { type: 'dot',   text: 'Aanbevolen door het Rode Kruis' }
    ]
  },
  {
    id: 'matches',
    label: 'Aanstekers',
    image: '/images/noodpakket/aansteker.png',
    description: 'Aanstekers geven je de zekerheid dat je altijd vuur kunt maken.',
    price: 1.50,
    subLabel: '3 stuks',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Werkt ook zonder stroom of batterijen' },
      { type: 'check', text: 'Waterbestendige verpakking voor extra veiligheid' }
    ]
  },
  {
    id: 'candles',
    label: 'Kaarsen',
    image: '/images/noodpakket/kaarsen.png',
    description: 'Noodkaarsen geven langdurig licht tijdens stroomuitval.',
    price: 0.90,
    subLabel: '12 stuks',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Brandduur van meerdere uren' },
      { type: 'check', text: 'Werkt altijd — ongeacht batterijen of stroom' },
      { type: 'dot',   text: 'Handig als extra warmtebron' }
    ]
  },
  {
    id: 'whistle',
    label: 'Noodfluitje',
    image: '/images/noodpakket/fluit.png',
    description: 'Met een noodfluitje kun je jezelf hoorbaar maken.',
    price: 3.65,
    subLabel: 'Metaal',
    multiplies: false,
    bullets: [
      { type: 'check', text: 'Luid en ver hoorbaar, zelfs over grote afstand' },
      { type: 'check', text: 'Geen stroom of batterijen nodig' }
    ]
  }
]