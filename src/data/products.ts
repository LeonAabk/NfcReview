import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'google-stand-acrylic',
    name: 'Google Review Bordskilt (Akryl)',
    shortDescription: 'Frittstående hvitt akryl L-skilt med "Review us on Google", 5 stjerner, innebygd NFC-brikke og QR-kode.',
    price: 490,
    originalPrice: 590,
    badge: 'Mest solgt',
    isPopular: true,
    rating: 5.0,
    reviewsCount: 142,
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
    price: 349,
    originalPrice: 449,
    badge: 'Uunnværlig for servering',
    rating: 4.9,
    reviewsCount: 96,
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
    shortDescription: '1 stk Google Review Bordskilt i akryl for kassen + 2 stk Meny-kort for bordene.',
    price: 990,
    originalPrice: 1188,
    badge: 'Kombinasjonstilbud - Spar 198 kr',
    rating: 5.0,
    reviewsCount: 58,
    type: 'bundle',
    chipType: 'NXP NTAG216 i alle enheter',
    material: 'Kombinasjon av hvit akryl og matt vanntett PVC',
    dimensions: '1 stk Akryl bordskilt (12.75×7.6 cm) + 2 stk bordkort',
    compatibility: 'Universal kompatibilitet med alle smarttelefoner',
    features: [
      '1 stk Google Review Bordskilt til kassen eller disken',
      '2 stk Meny-kort (NFC Tap + QR Code) til bordene',
      'Vi koder både Google Review-lenken og menylenken før vi sender',
      'Klar til bruk umiddelbart ut av esken',
      'Fri frakt med Posten til din adresse'
    ]
  }
];

export const TESTIMONIALS = [
  {
    author: 'Kristoffer Eeg',
    role: 'Daglig leder',
    company: 'Café & Bistro Sentrum, Oslo',
    text: 'Vi gikk fra 38 til over 190 Google-anmeldelser på fire måneder. Snittet vårt økte fra 4.2 til 4.8 stjerner. Kortene ved kassa gjør at servitørene enkelt kan be fornøyde gjester om en vurdering mens de betaler.',
    rating: 5,
    highlight: '+152 nye anmeldelser'
  },
  {
    author: 'Silje Marie Hauge',
    role: 'Eier & Tannlege',
    company: 'Nordic Smil Tannklinikk, Bergen',
    text: 'Pasientene våre syntes det var så kult og enkelt! Bordskiltet i resepsjonen ser utrolig profesjonelt ut, og vi slipper å sende masete SMS-er i etterkant. Helt uunnværlig.',
    rating: 5,
    highlight: 'Snitt 4.9 på Google'
  },
  {
    author: 'Morten Lindberg',
    role: 'Verkstedleder',
    company: 'Autofiks Bilpleie, Trondheim',
    text: 'Kortet ligger i lommeboka til hver kundemottaker. Når vi overleverer en nypolert bil, tapper vi bare mobilen deres. Konverteringen er nesten 80% når de ser hvor raskt det går.',
    rating: 5,
    highlight: '80% konverteringsrate'
  }
];

export const FAQS = [
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
    answer: 'Vi forhåndsprogrammerer og pakker bestillinger innen 24-48 timer. Pakken sendes med Posten/Bring fra Norge, så du mottar normalt bestillingen i løpet av 2-4 virkedager. Fri frakt ved bestilling over 600 kr.'
  },
  {
    question: 'Kan jeg endre Google-lenken senere hvis bedriften flytter?',
    answer: 'Ja! Vi kan bistå med re-programmering, eller du kan bruke en hvilken som helst gratis NFC-verktøy-app (f.eks. NFC Tools på App Store/Google Play) for å oppdatere URL-en på sekunder.'
  }
];
