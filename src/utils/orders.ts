import { OrderRecord, OrderStatus, CustomerOrderData, CartItem } from '../types';

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
  const trackingText = order.trackingNumber
    ? `Spor pakken din hos Posten her:\nhttps://sporing.posten.no/sporing/${order.trackingNumber.trim()}\nSporingsnummer: ${order.trackingNumber.trim()}\n\n`
    : `Pakken din er sendt med Posten som Norgespakke og leveres normalt i løpet av 2-4 virkedager.\n\n`;

  return `Hei ${order.customer.contactPerson || order.customer.companyName}!

Gode nyheter! Din bestilling #${order.orderId} er ferdig programmert og kvalitetstestet av vår ungdomsbedrift, og er nå overlevert til Posten.

${trackingText}Bestillingssammendrag:
Bedrift: ${order.customer.companyName}
Leveringsadresse: ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}
${order.customer.googleReviewUrl ? `Google Review-lenke: ${order.customer.googleReviewUrl}\n` : ''}${order.customer.menuUrl ? `Meny-lenke: ${order.customer.menuUrl}\n` : ''}
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
  const subject = encodeURIComponent(`🚨 NY ORDRE #${order.orderId} fra ${order.customer.companyName} (${order.total} kr)`);
  const body = encodeURIComponent(
    `NY BESTILLING MOTTATT I NETTBUTIKKEN!

Ordrenummer: #${order.orderId}
Dato: ${new Date(order.createdAt).toLocaleString('no-NO')}
Totalsum: ${order.total} kr (Frakt: ${order.shippingFee} kr)

KUNDEINFORMASJON:
Bedrift: ${order.customer.companyName}
Kontaktperson: ${order.customer.contactPerson}
Org.nr: ${order.customer.orgNumber || 'Ikke oppgitt'}
E-post: ${order.customer.email}
Telefon: ${order.customer.phone}

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
4. Gå til posten.no/sende for å kjøpe fraktetikett.
5. Send oppdatering med sporingsnummer til kunden.`
  );

  return `mailto:${STORE_NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}
