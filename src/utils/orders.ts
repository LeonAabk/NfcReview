import { OrderRecord, OrderStatus, CustomerOrderData, CartItem, OrderChecklist } from '../types';
import { saveOrderToFirestore } from './firestoreOrders';

const ORDERS_STORAGE_KEY = 'nfc_review_orders_v1';
export const STORE_NOTIFICATION_EMAIL = 'aabakstudio@gmail.com';
export const COMPANY_NAME = 'Aabakstudio Ungdomsbedrift';
export const COMPANY_ORG_NR = '938 823 014';
export const COMPANY_ADDRESS = 'Hamar katedralskole, Ringgata 235, 2315 Hamar';

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
    console.error('Feil ved lagring av ordre i localStorage:', err);
  }

  // Sanntidssynkronisering til Firestore i skyen
  saveOrderToFirestore(order).catch((err) => {
    console.warn('Firestore sync feilet, ordren er lagret lokalt:', err);
  });
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  adminNotes?: string
): OrderRecord[] {
  try {
    const existing = getStoredOrders();
    let updatedOrder: OrderRecord | null = null;
    const updated = existing.map((o) => {
      if (o.orderId === orderId) {
        updatedOrder = {
          ...o,
          status,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {})
        };
        return updatedOrder;
      }
      return o;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

    if (updatedOrder) {
      saveOrderToFirestore(updatedOrder).catch(console.error);
    }

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
    let updatedOrder: OrderRecord | null = null;
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
        updatedOrder = {
          ...o,
          checklist: nextChecklist
        };
        return updatedOrder;
      }
      return o;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

    if (updatedOrder) {
      saveOrderToFirestore(updatedOrder).catch(console.error);
    }

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
    'Google Review Lenke / Place ID',
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
    const paymentLabel = 'Kort (Stripe)';
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
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Aabakstudio-UB-Ordrer-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatAddressForPosten(customer: CustomerOrderData): string {
  return `${customer.companyName}
Att: ${customer.contactPerson}
${customer.address}
${customer.postalCode} ${customer.city}
Tlf: ${customer.phone}
E-post: ${customer.email}`;
}

export function getCustomerShippingEmailSubject(order: OrderRecord): string {
  return `Ordre #${order.orderId} er programmert og sendt med Posten! – ${COMPANY_NAME}`;
}

export function getCustomerShippingEmailBody(order: OrderRecord): string {
  const trackingText = order.trackingNumber
    ? `Spor pakken din hos Posten her:\nhttps://sporing.posten.no/sporing/${order.trackingNumber.trim()}\nSporingsnummer: ${order.trackingNumber.trim()}\n\n`
    : `Pakken din er levert til Posten og leveres normalt i løpet av 2-4 virkedager.\n\n`;

  const trackingPageUrl = `https://aabakstudio.com/NfcReview/#/ordre/${order.orderId}`;

  return `Hei ${order.customer.contactPerson || order.customer.companyName}!

Gode nyheter! Din bestilling #${order.orderId} er ferdig programmert og kvalitetstestet av vår ungdomsbedrift, og er nå overlevert til Posten.

${trackingText}Du kan følge ordrestatus og se kvittering her:
${trackingPageUrl}

Bestillingssammendrag:
Bedrift: ${order.customer.companyName}
Leveringsadresse: ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}
${order.customer.orgNumber ? `Org.nr: ${order.customer.orgNumber}\n` : ''}${order.customer.googleReviewUrl ? `Google Review: ${order.customer.googleReviewUrl}\n` : ''}
Bestilte varer:
${order.items.map((i) => `- ${i.quantity}x ${i.product.name}`).join('\n')}
Totalsum: ${order.total} kr inkl. mva.

NFC-kortene er 100% klare til bruk rett ut av esken – det er bare å feste dem på disken med 3M-baksiden!

Tusen takk for at du støtter vår ungdomsbedrift! Ta gjerne kontakt med oss på ${STORE_NOTIFICATION_EMAIL} hvis du lurer på noe.

Med vennlig hilsen,
${COMPANY_NAME}
Org.nr: ${COMPANY_ORG_NR}
E-post: ${STORE_NOTIFICATION_EMAIL}`;
}

export function generateCustomerShippingEmail(order: OrderRecord): string {
  const subject = encodeURIComponent(getCustomerShippingEmailSubject(order));
  const body = encodeURIComponent(getCustomerShippingEmailBody(order));
  return `mailto:${order.customer.email}?subject=${subject}&body=${body}`;
}
