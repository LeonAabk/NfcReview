import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'google-stand-acrylic',
    name: 'Google Review Bordskilt (Akryl)',
    shortDescription: 'Frittstående hvitt akryl L-skilt med "Review us on Google", 5 stjerner, innebygd NFC-brikke og QR-kode.',
    price: 299,
    originalPrice: 399,
    badge: '299 kr · Bestseller',
    isPopular: true,
    type: 'stand',
    chipType: 'NXP NTAG216 (Høyeste skannehastighet)',
    material: 'Hvit formstøpt akryl, ripebestandig og tåler sprit/desinfeksjon',
    dimensions: '12.75 cm høyde × 7.6 cm bredde (5 cm fotdybde)',
    compatibility: 'Fungerer med alle moderne smarttelefoner via NFC Tap og QR Scan',
    features: [
      'Originalt Google Review-design med 5 gylne stjerner og fargestripe',
      'Dobbel funksjon: "Tap" med mobil eller "Scan" av QR-kode',
      'Vi koder inn din bedrifts direkte Google Review-lenke før forsendelse',
      'Frittstående L-form – perfekt på betalingsterminal, disk eller bord',
      'Ingen batterier, apper eller månedlige kostnader'
    ]
  },
  {
    id: 'menu-card-nfc',
    name: 'Meny-kort (NFC & QR)',
    shortDescription: 'Dobbelsidig sort kontaktløst bordkort: "Tap to view our MENU" på forsiden og "Scan to view our MENU" med QR på baksiden.',
    price: 99,
    originalPrice: 149,
    badge: 'Kun 99 kr / stk',
    type: 'menu',
    chipType: 'NXP NTAG216',
    material: 'Matt forsterket PVC, 100% vanntett og tåler daglig vask og søl',
    dimensions: '8.55 cm × 5.4 cm (Standard bordkort-format)',
    compatibility: 'Alle iPhones og Android-mobiler med NFC eller kamera',
    features: [
      'Dobbelsidig design: NFC-tap på den ene siden, QR-kode på den andre',
      'Ikonisk bestikk-emblem for café, restaurant og bar',
      'Vi koder inn din digitale meny-URL før vi shipper pakken',
      'Gjestene får opp menyen på mobilen på under 1 sekund',
      'Sparer servitørtid og eliminerer trykking av papirmenyer'
    ]
  },
  {
    id: 'hospitality-combo-pack',
    name: 'Serveringspakke (1x Bordskilt + 2x Menykort)',
    shortDescription: '1 stk Google Review Bordskilt i akryl for kassen + 2 stk Meny-kort for bordene. Komplett startpakke!',
    price: 399,
    originalPrice: 497,
    badge: 'Kombideal - Spar 98 kr',
    type: 'bundle',
    chipType: 'NXP NTAG216 i alle enheter',
    material: 'Kombinasjon av hvit akryl og matt vanntett PVC',
    dimensions: '1 stk Akryl bordskilt (12.75×7.6 cm) + 2 stk bordkort',
    compatibility: 'Universal kompatibilitet med alle smarttelefoner',
    features: [
      '1 stk Google Review Bordskilt (ordinær 299 kr) til kassen',
      '2 stk Meny-kort (ordinær 198 kr) til bordene',
      'Vi koder både Google Review-lenken og menylenken før sending',
      'Spar 98 kr sammenlignet med enkeltkjøp',
      'Klar til bruk umiddelbart ut av esken'
    ]
  },
  {
    id: 'menu-card-bulk-5',
    name: 'Meny-kort 5-Pakning (Bulk deal)',
    shortDescription: '5 stk ferdige kontaktløse meny-kort for bordene. Kun 89 kr per kort!',
    price: 449,
    originalPrice: 495,
    badge: 'Bulk deal · Spar 46 kr',
    type: 'menu',
    chipType: 'NXP NTAG216 i alle kort',
    material: 'Matt forsterket vanntett PVC',
    dimensions: '5 stk bordkort (8.55 × 5.4 cm)',
    compatibility: 'Alle smarttelefoner med NFC eller kamera',
    features: [
      'Inkluderer 5 stk Meny-kort for bordene (kun 89 kr/stk)',
      'Vi forhåndskoder alle kortene med din menylenke før sending',
      'Dobbelsidig design: NFC-tap og QR-kode',
      'Slitesterkt materiale som tåler daglig desinfisering og søl',
      'Rask levering med Posten'
    ]
  },
  {
    id: 'menu-card-bulk-10',
    name: 'Meny-kort 10-Pakning (Storkunde Bulk)',
    shortDescription: '10 stk ferdige kontaktløse meny-kort for hele restauranten. Kun 79 kr per kort!',
    price: 799,
    originalPrice: 990,
    badge: 'Maks bulkrabatt · Spar 191 kr',
    type: 'menu',
    chipType: 'NXP NTAG216 i alle kort',
    material: 'Matt forsterket vanntett PVC',
    dimensions: '10 stk bordkort (8.55 × 5.4 cm)',
    compatibility: 'Universal kompatibilitet iOS & Android',
    features: [
      'Inkluderer 10 stk Meny-kort (kun ~79 kr/stk – spar 191 kr!)',
      'Dekker 10 bord i lokalet eller på uteserveringen',
      'Vi koder inn din digitale meny før vi sender pakken',
      'Kvalitetstestet manuelt av vår ungdomsbedrift',
      'Fri frakt med Posten inkludert'
    ]
  },
  {
    id: 'google-stand-bulk-3',
    name: 'Google Review Bordskilt 3-Pakning (Bulk deal)',
    shortDescription: '3 stk frittstående hvite akryl bordskilt for flere disker eller bord. Kun 249 kr/stk!',
    price: 749,
    originalPrice: 897,
    badge: 'Bulk deal · Spar 148 kr',
    type: 'stand',
    chipType: 'NXP NTAG216 i alle skilt',
    material: 'Hvit formstøpt akryl av høyeste kvalitet',
    dimensions: '3 stk L-skilt (12.75 × 7.6 cm)',
    compatibility: 'Fungerer med alle moderne telefoner',
    features: [
      'Inkluderer 3 stk Bordskilt (kun ~249 kr/stk – spar 148 kr!)',
      'Ideelt for bedrifter med flere betalingsstasjoner eller avdelinger',
      'Vi koder inn din bedrifts Google Review-lenke',
      'Ferdig montert med L-fot – klar til å settes på disken',
      'Fri frakt med Posten inkludert'
    ]
  }
];

export const FAQS = [
  {
    question: 'Hva innebærer det at dere er en Ungdomsbedrift (UB)?',
    answer: 'Vi er elever som driver en registrert ungdomsbedrift i samarbeid med organisasjonen Ungt Entreprenørskap. Vårt mål er å lære ekte bedriftsdrift ved å tilby profesjonelle, fullverdige NFC-produkter av ypperste kvalitet. Når du handler hos oss, støtter du ungt lokalt entreprenørskap og får samtidig personlig, engasjert oppfølging og lynrask levering fra Norge!'
  },
  {
    question: 'Trenger kunden en egen app for at kortet skal fungere?',
    answer: 'Nei, absolutt ikke! Kunden trenger ingen app eller installasjon. Både iPhone og Android har innebygd støtte for kontaktløs NFC. De holder bare telefonen inntil kortet, og Google-anmeldelsesskjemaet åpner seg automatisk i nettleseren.'
  },
  {
    question: 'Hvordan kobles kortet til min bedrifts Google-profil?',
    answer: 'Det ordner vi for deg! Under bestilling oppgir du navnet på bedriften din eller lenken til din Google Bedriftsprofil. Vi programmerer brikken og genererer QR-koden profesjonelt før sending, slik at kortet er 100% klart til bruk så snart du åpner pakken.'
  },
  {
    question: 'Er det noen månedlige gebyrer eller abonnement?',
    answer: 'Nei! Dette er et engangskjøp. Det koster ingenting å bruke kortene videre, og det er ingen skjulte abonnementer eller fornyelseskostnader. Kortet varer i mange år og kan skannes ubegrenset antall ganger.'
  },
  {
    question: 'Hva om en kunde har en eldre telefon uten NFC?',
    answer: 'Alle våre produkter har en høykvalitets QR-kode trykket i tillegg. Har kunden en eldre telefon eller har slått av NFC, kan de bare åpne kameraet og skanne QR-koden for nøyaktig samme lynraske opplevelse.'
  },
  {
    question: 'Hvor raskt leverer dere?',
    answer: 'Vi forhåndsprogrammerer og pakker bestillinger innen 24-48 timer. Pakken sendes med Posten/Bring fra Norge, så du mottar normalt bestillingen i løpet av 2-4 virkedager. Fri frakt ved bestilling over 500 kr.'
  },
  {
    question: 'Kan jeg endre Google-lenken senere hvis bedriften flytter?',
    answer: 'Ja, absolutt! Hvis bedriften din flytter, bytter navn eller får ny lenke, er det bare å kontakte oss for støtte – vi hjelper deg gjerne med re-programmering og personlig oppfølging. Du kan også enkelt bruke en gratis NFC-verktøy-app (f.eks. NFC Tools på App Store eller Google Play) for å oppdatere URL-en selv på sekunder.'
  }
];
