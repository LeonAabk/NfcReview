import { OrderRecord, OrderStatus, CustomerOrderData, CartItem, OrderChecklist } from '../types';

const ORDERS_STORAGE_KEY = 'nfc_review_orders_v1';
const STORE_NOTIFICATION_EMAIL = 'Leon.aabak@gmail.com';

export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((o) => o && typeof o === 'object' && typeof o.orderId === 'string');
  } catch (err) {
    console.error('Feil ved henting av ordre:', err);
    return [];
  }
}

export function saveOrder(order: OrderRecord): void {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter((o) => o.orderId !== order.orderId)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Feil ved lagring av ordre:', err);
  }
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  adminNotes?: string
): OrderRecord[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {})
        };
      }
      return o;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Feil ved oppdatering av ordre:', err);
    return [];
  }
}

export function updateOrderChecklist(
  orderId: string,
  checklistUpdates: Partial<OrderChecklist>
): OrderRecord[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => {
      if (o.orderId === orderId) {
        const currentChecklist: OrderChecklist = o.checklist || {
          programmedChip: false,
          qrTested: false,
          packed: false,
          shipped: false
        };
        const nextChecklist: OrderChecklist = {
          ...currentChecklist,
          ...checklistUpdates
        };
        return {
          ...o,
          checklist: nextChecklist
        };
      }
      return o;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Feil ved oppdatering av sjekkliste:', err);
    return [];
  }
}

export function deleteOrder(orderId: string): OrderRecord[] {
  try {
    const existing = getStoredOrders();
    const updated = existing.filter((o) => o.orderId !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Feil ved sletting av ordre:', err);
    return [];
  }
}

/**
 * Exports all orders to CSV formatted for Excel, Fiken, and Ungt Entreprenørskap accounting
 */
export function exportOrdersToCsv(orders: OrderRecord[]): void {
  if (orders.length === 0) return;

  const headers = [
    'Ordrenummer',
    'Dato',
    'Status',
    'Betalingsmetode',
    'Bedrift',
    'Organisasjonsnummer',
    'Kontaktperson',
    'E-post',
    'Telefon',
    'Gateadresse',
    'Postnummer',
    'Poststed',
    'Fakturareferanse (EHF)',
    'Faktura-epost',
    'Google Review Lenke',
    'Meny Lenke',
    'Antall varer',
    'Varelinjer',
    'Delsum (NOK)',
    'Rabatt (NOK)',
    'Frakt (NOK)',
    'Total (NOK)',
    'Sporingsnummer Posten',
    'Sjekkliste_BrikkeProgrammert',
    'Sjekkliste_QRTestet',
    'Sjekkliste_Pakket',
    'Sjekkliste_Sendt'
  ];

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = orders.map((o) => {
    const paymentLabel =
      o.customer.paymentMethod === 'invoice_ehf'
        ? 'Bedriftsfaktura / EHF (14 dager)'
        : 'Kort / Vipps';
    const totalItems = o.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsDescription = o.items
      .map((i) => `${i.quantity}x ${i.product.name}`)
      .join(', ');

    return [
      escapeCsv(o.orderId),
      escapeCsv(new Date(o.createdAt).toLocaleDateString('no-NO') + ' ' + new Date(o.createdAt).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })),
      escapeCsv(o.status),
      escapeCsv(paymentLabel),
      escapeCsv(o.customer.companyName),
      escapeCsv(o.customer.orgNumber || ''),
      escapeCsv(o.customer.contactPerson),
      escapeCsv(o.customer.email),
      escapeCsv(o.customer.phone),
      escapeCsv(o.customer.address),
      escapeCsv(o.customer.postalCode),
      escapeCsv(o.customer.city),
      escapeCsv(o.customer.invoiceReference || ''),
      escapeCsv(o.customer.invoiceEmail || ''),
      escapeCsv(o.customer.googleReviewUrl || ''),
      escapeCsv(o.customer.menuUrl || ''),
      escapeCsv(totalItems),
      escapeCsv(itemsDescription),
      escapeCsv(o.subtotal),
      escapeCsv(o.discountAmount),
      escapeCsv(o.shippingFee),
      escapeCsv(o.total),
      escapeCsv(o.trackingNumber || ''),
      escapeCsv(o.checklist?.programmedChip ? 'JA' : 'NEI'),
      escapeCsv(o.checklist?.qrTested ? 'JA' : 'NEI'),
      escapeCsv(o.checklist?.packed ? 'JA' : 'NEI'),
      escapeCsv(o.checklist?.shipped ? 'JA' : 'NEI')
    ].join(';'); // Semicolon delimiter works seamlessly in Norwegian/European Excel
  });

  // Prepend UTF-8 BOM so Excel displays æ, ø, å properly
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `NFC-Review-UB-Ordrer-Regnskap-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an address string formatted for copying directly into Posten.no
 */
export function formatAddressForPosten(customer: CustomerOrderData): string {
  return `${customer.companyName}
Att: ${customer.contactPerson}
${customer.address}
${customer.postalCode} ${customer.city}
Tlf: ${customer.phone}
E-post: ${customer.email}`;
}

/**
 * Returns clean email subject line for customer shipping notification
 */
export function getCustomerShippingEmailSubject(order: OrderRecord): string {
  return `Ordre #${order.orderId} er programmert og sendt med Posten! – NFC Review UB`;
}

/**
 * Returns clean plain text email body ready to be copied into Gmail / Outlook
 */
export function getCustomerShippingEmailBody(order: OrderRecord): string {
  const isInvoice = order.customer.paymentMethod === 'invoice_ehf';
  const paymentInfoText = isInvoice
    ? `Betaling: Bedriftsfaktura / EHF (14 dagers forfall sendes separat til ${order.customer.invoiceEmail || order.customer.email})\n${order.customer.invoiceReference ? `Fakturareferanse: ${order.customer.invoiceReference}\n` : ''}`
    : `Betaling: Betalt med Kort/Vipps\n`;

  const trackingText = order.trackingNumber
    ? `Spor pakken din hos Posten her:\nhttps://sporing.posten.no/sporing/${order.trackingNumber.trim()}\nSporingsnummer: ${order.trackingNumber.trim()}\n\n`
    : `Pakken din er sendt med Posten som Norgespakke og leveres normalt i løpet av 2-4 virkedager.\n\n`;

  return `Hei ${order.customer.contactPerson || order.customer.companyName}!

Gode nyheter! Din bestilling #${order.orderId} er ferdig programmert og kvalitetstestet av vår ungdomsbedrift, og er nå overlevert til Posten.

${trackingText}Bestillingssammendrag:
Bedrift: ${order.customer.companyName}
Leveringsadresse: ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}
${order.customer.orgNumber ? `Org.nr: ${order.customer.orgNumber}\n` : ''}${paymentInfoText}${order.customer.googleReviewUrl ? `Google Review-lenke: ${order.customer.googleReviewUrl}\n` : ''}${order.customer.menuUrl ? `Meny-lenke: ${order.customer.menuUrl}\n` : ''}
Bestilte varer:
${order.items.map((i) => `- ${i.quantity}x ${i.product.name}`).join('\n')}
Totalsum: ${order.total} kr

Kortene og bordskiltene er 100% klare til bruk rett ut av esken – det er bare å plassere dem på disken eller bordene!

Tusen takk for at du støtter vår ungdomsbedrift! Ta gjerne kontakt med oss på ${STORE_NOTIFICATION_EMAIL} hvis du lurer på noe.

Med vennlig hilsen,
NFC Review UB (Ungdomsbedrift)
E-post: ${STORE_NOTIFICATION_EMAIL}`;
}

/**
 * Creates a mailto link to send a shipping update with Posten tracking link to customer
 */
export function generateCustomerShippingEmail(order: OrderRecord): string {
  const subject = encodeURIComponent(getCustomerShippingEmailSubject(order));
  const body = encodeURIComponent(getCustomerShippingEmailBody(order));
  return `mailto:${order.customer.email}?subject=${subject}&body=${body}`;
}

/**
 * Generates email notification link to store owner
 */
export function generateStoreOwnerNotificationEmail(order: OrderRecord): string {
  const isInvoice = order.customer.paymentMethod === 'invoice_ehf';
  const subject = encodeURIComponent(`🚨 NY ORDRE #${order.orderId} fra ${order.customer.companyName} (${order.total} kr)${isInvoice ? ' [EHF FAKTURA]' : ''}`);
  const body = encodeURIComponent(
    `NY BESTILLING MOTTATT I NETTBUTIKKEN!

Ordrenummer: #${order.orderId}
Dato: ${new Date(order.createdAt).toLocaleString('no-NO')}
Betalingsmetode: ${isInvoice ? 'BEDRIFTSFAKTURA / EHF (14 dager)' : 'Kort / Vipps'}
Totalsum: ${order.total} kr (Frakt: ${order.shippingFee} kr)

KUNDEINFORMASJON:
Bedrift: ${order.customer.companyName}
Kontaktperson: ${order.customer.contactPerson}
Org.nr: ${order.customer.orgNumber || 'Ikke oppgitt'}
E-post: ${order.customer.email}
Telefon: ${order.customer.phone}
${isInvoice ? `EHF/Faktura-referanse: ${order.customer.invoiceReference || 'Ikke oppgitt'}\nFaktura-epost: ${order.customer.invoiceEmail || order.customer.email}\n` : ''}
LEVERINGSADRESSE:
${order.customer.address}
${order.customer.postalCode} ${order.customer.city}

LENKER SOM SKAL PROGRAMMERES PÅ NFC-BRIKKENE:
${order.customer.googleReviewUrl ? `Google Review-lenke: ${order.customer.googleReviewUrl}` : 'Ingen Google-lenke'}
${order.customer.menuUrl ? `Meny-lenke: ${order.customer.menuUrl}` : 'Ingen Meny-lenke'}

BESTILTE VARER:
${order.items.map((i) => `- ${i.quantity}x ${i.product.name} (${i.product.price * i.quantity} kr)`).join('\n')}

NESTE STEG:
1. Gå til adminpanelet i nettbutikken for å administrere ordren.
2. Test lenkene over for å verifisere at de åpner riktig side.
3. Klargjør og programmer NFC-brikkene med NFC Tools-appen.
4. Gå gjennom kvalitetskontrollen (1. Brikke programmert -> 2. QR testet -> 3. Pakket -> 4. Sendt).
5. Kjøp fraktetikett på posten.no/sende eller skriv ut pakkeseddel og adresselapp fra adminpanelet.
6. Send oppdatering med sporingsnummer til kunden.`
  );

  return `mailto:${STORE_NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}
