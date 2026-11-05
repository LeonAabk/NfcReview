import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'google-stand-acrylic',
    name: 'Google Review NFC-kort (1 stk.)',
    shortDescription:
      'Flatt, slitesterkt Google Review NFC-kort med kraftig 3M™-klistremerke bakpå. Festes rett på disk, betalingsterminal, bord eller vegg.',
    price: 349,
    badge: 'Klar på lager · 0 kr/mnd',
    type: 'stand',
    cardsInPack: 1,
    chipType: 'Høyfrekvent NTAG NFC-brikke (< 0,3 sek lesetid)',
    material: 'Ripebestandig UV-beskyttet akryl/PVC-finish med 3M™ monteringsfilm bakpå',
    dimensions: 'Flatt NFC-kort med klebende 3M™-bakside',
    compatibility: 'Fungerer kontaktløst med alle iPhone- og Android-telefoner uten app',
    features: [
      'Flatt design med kraftig 3M™-klistremerke bakpå – sitter støpt på disk, kasse, glass og tre',
      'Kundene holder bare mobilen inntil kortet – Google-anmeldelsessiden åpnes på under 1 sekund',
      'Vi koder inn din bedrifts direkte Google Review-lenke og kvalitetstester kortet før sending',
      'Tåler daglig vask med klut, sprit og desinfeksjon uten å falme',
      'Engangskjøp (inkl. mva.) – ingen batterier, apper eller månedlige gebyrer'
    ]
  },
  {
    id: 'google-stand-bulk-3',
    name: 'Synlighetspakken – 3 stk. Google Review NFC-kort',
    shortDescription:
      'Vår mest populære pakke! 3 stk. flate Google Review NFC-kort med 3M™-klistremerke bakpå til kasse, disk, inngangsparti eller flere behandlingsrom.',
    price: 890,
    originalPrice: 1047,
    badge: 'Mest populær · Spar 157 kr',
    isPopular: true,
    disableBulkDiscount: true,
    cardsInPack: 3,
    type: 'stand',
    chipType: 'Høyfrekvent NTAG NFC-brikke i alle 3 kort',
    material: 'Ripebestandig UV-beskyttet finish med industriell 3M™ monteringsfilm',
    dimensions: '3 stk. flate NFC-kort med 3M™-feste',
    compatibility: 'Fungerer med alle moderne iPhone- og Android-smarttelefoner',
    features: [
      'Inkluderer 3 stk. flate Google Review NFC-kort med 3M™-bakside (kun 297 kr/stk – spar 157 kr!)',
      'Plasser ved kassen, på disken og ved utgangen slik at ingen fornøyde kunder glemmer å gi 5 stjerner',
      'Vi forhåndsprogrammerer din bedrifts Google Review-lenke på alle kort før forsendelse',
      'Fri frakt med Posten inkludert i prisen (alle priser er inkl. mva.)',
      '0 kr i månedsgebyr – fungerer evig uten abonnement'
    ]
  },
  {
    id: 'google-stand-bulk-5',
    name: 'Bedriftspakke – 5 stk. Google Review NFC-kort',
    shortDescription:
      '5 stk. flate Google Review NFC-kort med 3M™-feste for bedrifter med flere kasser, bordsoner, frisørstoler, behandlingsrom eller avdelinger.',
    price: 1290,
    originalPrice: 1745,
    badge: 'Beste stykkpris · Spar 455 kr',
    disableBulkDiscount: true,
    cardsInPack: 5,
    type: 'stand',
    chipType: 'Høyfrekvent NTAG NFC-brikke i alle 5 kort',
    material: 'Ripebestandig UV-beskyttet finish med industriell 3M™ monteringsfilm',
    dimensions: '5 stk. flate NFC-kort med 3M™-feste',
    compatibility: 'Fungerer med alle moderne iPhone- og Android-smarttelefoner',
    features: [
      'Inkluderer 5 stk. flate Google Review NFC-kort med 3M™-bakside (kun 258 kr/stk – spar 455 kr!)',
      'Kan kodes til samme Google-profil eller fordeles på ulike avdelinger etter ønske',
      'Festes enkelt på alle slette flater uten løse stativer som velter på disken',
      'Fri frakt med Posten inkludert i prisen (inkl. mva.)',
      'Gir maksimal synlighet og jevn vekst i nye 5-stjerners Google-omtaler'
    ]
  },
  {
    id: 'menu-card-nfc',
    name: 'Meny-kort med NFC & QR (SmakSync)',
    shortDescription:
      'Kontaktløse bordkort koblet til vårt digitale menysystem SmakSync – oppdater priser, allergener og utsolgte retter i sanntid. Lanseres snart for bedrifter!',
    price: 1290,
    priceLabel: 'Kommer senere',
    badge: 'Kommer senere for bedrifter',
    comingSoon: true,
    comingSoonUrl: 'https://aabakstudio.com/SmakSync/',
    comingSoonCta: 'Prøv live meny-demo på SmakSync',
    type: 'menu',
    chipType: 'NTAG NFC + QR-sikring',
    material: 'Slitesterkt, vanntett bordkort tilpasset serveringssteder',
    dimensions: 'Bordkort-format for restaurant, kafé og bar',
    compatibility: 'Alle iPhones og Android-mobiler via NFC og kamera',
    features: [
      'Lanseres senere for restauranter, kaféer og barer gjennom Aabak Studio / SmakSync',
      'Lynrask digital meny (< 0,4 sek) rett i nettleseren – 0 % provisjon og ingen app',
      'Eget styringspanel for 1-klikks utsolgt-markering, prisendringer og 14 allergener',
      'Flerspråklig støtte (norsk/engelsk m.m.) for turister og gjester',
      'Test den interaktive live-demoen og meld uforpliktende interesse på SmakSync nå!'
    ]
  },
  {
    id: 'restaurant-pro-pack',
    name: '«Fullt Hus» Bedriftspakke (Digital Meny + Review)',
    shortDescription:
      'Komplett pakkeløsning som kombinerer SmakSync digitale menyer på bordene med Google Review NFC-kort ved kassen. Kommer senere for serveringssteder!',
    price: 1990,
    priceLabel: 'Kommer senere',
    badge: 'Kommer senere for bedrifter',
    comingSoon: true,
    comingSoonUrl: 'https://aabakstudio.com/SmakSync/#pakkelosning',
    comingSoonCta: 'Les mer & meld interesse',
    type: 'bundle',
    chipType: 'NTAG NFC i både bordkort og anmeldelseskort',
    material: 'Komplett sett med bordkort for meny + 3M™ Google Review-kort for disk/kasse',
    dimensions: 'Tilpasses antall bord og kasser i lokalet',
    compatibility: 'Universal kompatibilitet med alle iOS- og Android-enheter',
    features: [
      'Kommende totalpakke for serveringssteder: meny ved bordet + 5 stjerner ved betaling',
      'Inkluderer fullt oppsett og innlegging av hele restaurantens meny',
      'Trenger du Google Review-kortene allerede i dag? Velg Synlighetspakken (890 kr) over!',
      'Eksisterende Google Review-kunder får prioritert tilgang og pakkepris ved lansering',
      'Se interaktive menyeksempler og registrer interesse på SmakSync'
    ]
  }
];

export const FAQS = [
  {
    question: 'Hva innebærer det at dere er en Ungdomsbedrift (UB)?',
    answer:
      'Vi er elever som driver en registrert ungdomsbedrift gjennom skolen og organisasjonen Ungt Entreprenørskap, som en del av Aabak Studio-økosystemet. Når du handler hos oss, støtter du ungt lokalt entreprenørskap og får ferdigprogrammerte, kvalitetstestede NFC-kort med personlig oppfølging og rask levering fra Norge!'
  },
  {
    question: 'Hvordan ser kortene ut, og hvordan festes de?',
    answer:
      'Google Review-kortene våre er flate, slitesterke NFC-kort med kraftig industriell 3M™-klistremerke på hele baksiden (se gjerne produktvideoen på siden her!). Du drar bare av beskyttelsesfilmen og fester kortet rett på disken, ved betalingsterminalen, på kassaapparatet, bordet eller veggen – så sitter det støpt uten stativer som velter.'
  },
  {
    question: 'Når kommer meny-kort og digitale menyer (SmakSync) for bedrifter?',
    answer:
      'Akkurat nå er det kun våre flate Google Review NFC-kort som er åpne for direkte bestilling i nettbutikken. Meny-kort og våre digitale menyer (SmakSync) lanseres senere for bedrifter og serveringssteder. Du kan allerede nå teste live-demoen og melde uforpliktende interesse på SmakSync-nettsiden vår!'
  },
  {
    question: 'Er merverdiavgift (mva.) inkludert i prisene?',
    answer:
      'Ja! Alle oppgitte priser i nettbutikken (349 kr for 1 stk., 890 kr for Synlighetspakken med 3 stk., og 1 290 kr for 5-pakningen) er sluttpriser inkludert mva. Vi dekker mva., og det tilkommer aldri skjulte gebyrer eller abonnementer.'
  },
  {
    question: 'Trenger kunden en egen app for at kortet skal fungere?',
    answer:
      'Nei, absolutt ikke! Både iPhone og Android har innebygd støtte for kontaktløs NFC. Kunden holder bare toppen av mobilen inntil kortet på disken, så åpner bedriftens Google-anmeldelsesskjema seg automatisk i nettleseren.'
  },
  {
    question: 'Hvordan kobles kortet til min bedrifts Google-profil?',
    answer:
      'Det ordner vi for deg før vi sender pakken! I kassen limer du enten inn Google Review-lenken din (vi har en enkel 3-stegs veileder i kassen), eller så skriver du bare bedriftsnavnet og byen din – så finner og programmerer vi riktig lenke for deg helt kostnadsfritt.'
  },
  {
    question: 'Er det noen månedlige gebyrer eller abonnement på Google Review-kortene?',
    answer:
      'Nei! Google Review NFC-kortene er 100 % engangskjøp (0 kr/mnd). Kortene trenger verken strøm eller batteri og kan brukes ubegrenset antall ganger i mange år.'
  },
  {
    question: 'Hvor raskt leverer dere, og hva koster frakten?',
    answer:
      'Vi programmerer, tester og pakker bestillinger fortløpende innen 24–48 timer. Pakken sendes med Posten i Norge (normalt 2–4 virkedager). Frakt koster 59 kr på enkeltkort, og vi spanderer fri frakt på alle bestillinger over 500 kr – inkludert Synlighetspakken (890 kr) og 5-pakningen (1 290 kr)!'
  },
  {
    question: 'Kan Google-lenken endres senere hvis bedriften bytter profil eller flytter?',
    answer:
      'Ja! Ta gjerne kontakt med oss dersom bedriften flytter eller får ny Google-profil, så hjelper vi deg med oppdatering og oppfølging.'
  }
];
