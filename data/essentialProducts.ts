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
  bullets?: BulletItem[]
}

export const ESSENTIAL_PRODUCTS: EssentialProduct[] = [
  {
    id: 'water',
    label: 'Wateropslag',
    image: '/images/noodpakket/wateropslag.jpg',
    description:
      'Deze watervoorziening geeft tijdens een noodsituatie direct toegang tot schoon drinkwater. De watervoorziening bevat 72 uur aan drinkwater voor 1 persoon. We passen het aantal watervoorzieningen aan op het aantal personen. Vul deze watervoorziening met kraanwater. Het blijft een jaar houdbaar.',
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
    image: '/images/noodpakket/Noodradio.jpg',
    description:
      `Met deze noodradio blijf je op de hoogte van belangrijke berichten van overheid en hulpdiensten. Kies voor een Noodradio op batterijen i.p.v. een opwendbare variant zodat je tijdens die 72 uur altijd toegang hebt tot de noodzenders!* `,
    bullets: [
      {type: 'check', text: 'Werkt op batterijen'},
      {type: 'check', text: 'Ontvangt FM-noodberichten'},
      {type: 'cross', html: `
      Geen zon of fysieke kracht nodig. De Consumentenbond 
      <a
        href="https://www.nu.nl/economie/6357041/consumentenbond-waarschuwt-voor-gebrekkige-functies-in-noodradios.html"
        target="_blank"
        rel="noopener noreferrer"
        class="text-emerald-700 underline"
      >
        waarschuwt
      </a>
      voor gebrekkige opwindbare noodradio's.
    `}
    ]
  },
  {
    id: 'powerbank',
    label: 'Powerbank',
    image: '/images/noodpakket/powerbank.jpg',
    description:
      'Met deze powerbank blijft je telefoon bereikbaar voor bellen, berichten en informatie. Alles-in-één noodradio’s laden telefoons vaak slechts enkele uren en zeer traag op, daarom kiezen wij bewust voor een aparte powerbank. ',
    bullets: [
      {type: 'check', text: 'Meerdere telefoonladingen'},
      {type: 'check', text: 'Compact en makkelijk mee te nemen'},
      {type: 'check', text: 'Blijf in contact met familie en nooddiensten'}
    ]
  },
    {
    id: 'blanket',
    label: 'Deken + kussen',
    image: '/images/noodpakket/blanket.jpg',
    description:
        'Zorg voor voldoende warmte en comfort bij stroomuitval of een noodsituatie. Voor elk gezinslid hoort één volledige set in het noodpakket te zitten.',
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
  description:
    'Een fysieke kaart van je woonplaats helpt je navigeren wanneer GPS, internet of telefoons niet werken. Onmisbaar bij evacuaties of noodroutes.',
  bullets: [
    { type: 'check', text: 'Werkt zonder telefoon, internet of stroom' },
    { type: 'check', text: 'Handig voor alternatieve routes en ontmoetingspunten' },
    { type: 'check', text: 'Overzicht van straten, wijken en noodlocaties' },
    { type: 'dot',   text: 'Aanbevolen door de overheid in elk noodpakket' }
  ]
},
  {
    id: 'flashlight',
    label: 'Zaklamp',
    image: '/images/noodpakket/zaklamp.jpg',
    description:
      'Houd je telefoon opgeladen zodat je kunt bellen, berichten sturen en informatie opzoeken.',
    bullets: [
      { type: 'check', text: 'Werkt op batterijen' },
      { type: 'check', text: 'Werkt op batterijen' },
      { type: 'check', text: 'Werkt op batterijen' },
    ]
  },
  {
  id: 'batteries',
  label: 'Batterijen',
  image: '/images/noodpakket/batterijen.jpg',
  description:
    'Reservebatterijen zorgen ervoor dat je noodradio, zaklamp en andere essentiële apparaten blijven werken tijdens de eerste 72 uur van een noodsituatie.',
  bullets: [
    { type: 'check', text: 'Onmisbaar voor zaklampen en noodradio’s' },
    { type: 'check', text: 'Lang houdbaar en veilig op te slaan' },
    { type: 'check', text: 'Direct inzetbaar zonder opladen' },
    { type: 'dot',   text: 'Geadviseerd door de Nederlandse overheid' }
  ]
},
{
  id: 'firstaid',
  label: 'EHBO-kit',
  image: '/images/noodpakket/ehbo-kit.jpg',
  description:
    'Een compacte maar complete EHBO-kit voor kleine verwondingen, snijwonden, blaren of kneuzingen. Handig tijdens evacuaties of stroomstoringen.',
  bullets: [
    { type: 'check', text: 'Bevat pleisters, gaas, tape, verband en desinfectie' },
    { type: 'check', text: 'Alles bij elkaar in een stevig en overzichtelijk tasje' },
    { type: 'check', text: 'Geschikt voor thuis én onderweg' },
    { type: 'dot',   text: 'Aanbevolen door het Rode Kruis' }
  ]
},
{
  id: 'matches',
  label: 'Aansteker',
  image: '/images/noodpakket/aansteker.jpg',
  description:
    'Aanstekers geven je de zekerheid dat je altijd vuur kunt maken voor warmte, licht of noodgebruik.',
  bullets: [
    { type: 'check', text: 'Werkt ook zonder stroom of batterijen' },
    { type: 'check', text: 'Handig voor kaarsen, noodkooktoestellen of signaalvuren' },
    { type: 'check', text: 'Waterbestendige verpakking voor extra veiligheid' },
    { type: 'dot',   text: 'Compact en lichtgewicht' }
  ]
},
{
  id: 'candles',
  label: '12 Kaarsen',
  image: '/images/noodpakket/kaarsen.jpg',
  description:
    'Noodkaarsen geven langdurig licht tijdens stroomuitval en zijn een betrouwbare bron van verlichting zonder batterijen.',
  bullets: [
    { type: 'check', text: 'Brandduur van meerdere uren' },
    { type: 'check', text: 'Werkt altijd — ongeacht batterijen of stroom' },
    { type: 'check', text: 'Veilig te gebruiken met stevige houder' },
    { type: 'dot',   text: 'Handig als extra warmtebron' }
  ]
},
{
  id: 'whistle',
  label: 'Noodfluitje',
  image: '/images/noodpakket/Fluit.png',
  description:
    'Met een noodfluitje kun je jezelf hoorbaar maken in situaties waarin je hulp nodig hebt of zichtbaar zijn lastig is.',
  bullets: [
    { type: 'check', text: 'Luid en ver hoorbaar, zelfs over grote afstand' },
    { type: 'check', text: 'Ideaal bij evacuaties of verminderde zichtbaarheid' },
    { type: 'check', text: 'Geen stroom of batterijen nodig' },
    { type: 'dot',   text: 'Eenvoudig aan je sleutelbos of tas te hangen' }
  ]
},
{
  id: 'touw',
  label: 'Touw',
  image: '/images/noodpakket/touw.jpg',
  description:
    'Een stevig stuk multifunctioneel touw is onmisbaar in elk noodpakket. Je kunt het gebruiken voor het bevestigen, repareren, vastzetten of optakelen van spullen in uiteenlopende noodsituaties.',
  bullets: [
    { type: 'check', text: 'Veelzijdig inzetbaar voor noodreparaties en bevestigingen' },
    { type: 'check', text: 'Handig voor het opzetten van een tijdelijke shelter of afscherming' },
    { type: 'check', text: 'Lichtgewicht maar sterk, gemakkelijk mee te nemen' },
    { type: 'dot',   text: 'Geschikt voor zowel binnen- als buitengebruik' }
  ]
}



  // … vul de rest op dezelfde manier aan
]
