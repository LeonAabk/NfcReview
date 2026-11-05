import { OrderRecord, OrderStatus, OrderChecklist, CustomerOrderData, CartItem } from '../types';

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/smaksync/databases/(default)/documents/restaurants/aabakstudio/orders';

interface FirestoreField {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
}

interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreField>;
  createTime: string;
  updateTime: string;
}

/**
 * Konverterer et internt OrderRecord-objekt til Firestore Document REST-format
 */
function orderToFirestoreFields(order: OrderRecord): Record<string, FirestoreField> {
  return {
    orderId: { stringValue: order.orderId },
    createdAt: { stringValue: order.createdAt },
    status: { stringValue: order.status },
    total: { integerValue: Math.round(order.total).toString() },
    subtotal: { integerValue: Math.round(order.subtotal).toString() },
    discountAmount: { integerValue: Math.round(order.discountAmount).toString() },
    shippingFee: { integerValue: Math.round(order.shippingFee).toString() },
    companyName: { stringValue: order.customer.companyName || '' },
    contactPerson: { stringValue: order.customer.contactPerson || '' },
    email: { stringValue: order.customer.email || '' },
    phone: { stringValue: order.customer.phone || '' },
    address: { stringValue: order.customer.address || '' },
    postalCode: { stringValue: order.customer.postalCode || '' },
    city: { stringValue: order.customer.city || '' },
    orgNumber: { stringValue: order.customer.orgNumber || '' },
    googleReviewUrl: { stringValue: order.customer.googleReviewUrl || '' },
    reviewInputMode: { stringValue: order.customer.reviewInputMode || 'url' },
    googleLookupName: { stringValue: order.customer.googleLookupName || '' },
    googleLookupCity: { stringValue: order.customer.googleLookupCity || '' },
    trackingNumber: { stringValue: order.trackingNumber || '' },
    adminNotes: { stringValue: order.adminNotes || '' },
    paymentMethod: { stringValue: order.customer.paymentMethod || 'vipps_card' },
    itemsJson: { stringValue: JSON.stringify(order.items || []) },
    checklistJson: { stringValue: JSON.stringify(order.checklist || { programmedChip: false, qrTested: false, packed: false, shipped: false }) },
    updatedAt: { stringValue: new Date().toISOString() }
  };
}

/**
 * Parser et Firestore-dokument tilbake til et fullverdig OrderRecord
 */
function firestoreDocToOrder(doc: FirestoreDocument): OrderRecord {
  const f = doc.fields || {};

  let items: CartItem[] = [];
  try {
    if (f.itemsJson?.stringValue) {
      items = JSON.parse(f.itemsJson.stringValue);
    }
  } catch {
    items = [];
  }

  let checklist: OrderChecklist = {
    programmedChip: false,
    qrTested: false,
    packed: false,
    shipped: false
  };
  try {
    if (f.checklistJson?.stringValue) {
      checklist = JSON.parse(f.checklistJson.stringValue);
    }
  } catch {
    // fallback
  }

  const customer: CustomerOrderData = {
    companyName: f.companyName?.stringValue || '',
    contactPerson: f.contactPerson?.stringValue || '',
    email: f.email?.stringValue || '',
    phone: f.phone?.stringValue || '',
    address: f.address?.stringValue || '',
    postalCode: f.postalCode?.stringValue || '',
    city: f.city?.stringValue || '',
    orgNumber: f.orgNumber?.stringValue || undefined,
    googleReviewUrl: f.googleReviewUrl?.stringValue || undefined,
    reviewInputMode: (f.reviewInputMode?.stringValue as 'url' | 'lookup') || 'url',
    googleLookupName: f.googleLookupName?.stringValue || undefined,
    googleLookupCity: f.googleLookupCity?.stringValue || undefined,
    paymentMethod: (f.paymentMethod?.stringValue as any) || 'vipps_card'
  };

  return {
    orderId: f.orderId?.stringValue || doc.name.split('/').pop() || '',
    createdAt: f.createdAt?.stringValue || doc.createTime,
    status: (f.status?.stringValue as OrderStatus) || 'ny',
    items,
    subtotal: parseInt(f.subtotal?.integerValue || '0', 10),
    discountAmount: parseInt(f.discountAmount?.integerValue || '0', 10),
    shippingFee: parseInt(f.shippingFee?.integerValue || '0', 10),
    total: parseInt(f.total?.integerValue || '0', 10),
    customer,
    trackingNumber: f.trackingNumber?.stringValue || undefined,
    adminNotes: f.adminNotes?.stringValue || undefined,
    checklist
  };
}

/**
 * Lagrer eller oppdaterer en ordre i Firestore
 */
export async function saveOrderToFirestore(order: OrderRecord): Promise<boolean> {
  try {
    const url = `${FIRESTORE_BASE}/${encodeURIComponent(order.orderId)}`;
    const fields = orderToFirestoreFields(order);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    return res.ok;
  } catch (err) {
    console.error('Feil ved lagring til Firestore:', err);
    return false;
  }
}

/**
 * Henter en bestemt ordre fra Firestore basert på ID
 */
export async function fetchOrderFromFirestore(orderId: string): Promise<OrderRecord | null> {
  try {
    const cleanId = orderId.trim();
    if (!cleanId) return null;
    const url = `${FIRESTORE_BASE}/${encodeURIComponent(cleanId)}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Firestore status: ${res.status}`);
    }
    const doc: FirestoreDocument = await res.json();
    return firestoreDocToOrder(doc);
  } catch (err) {
    console.error('Feil ved henting fra Firestore:', err);
    return null;
  }
}

/**
 * Henter alle ordrer fra Firestore (for Admin-panelet)
 */
export async function fetchAllOrdersFromFirestore(): Promise<OrderRecord[]> {
  try {
    const res = await fetch(FIRESTORE_BASE);
    if (!res.ok) return [];
    const data = await res.json();
    const documents: FirestoreDocument[] = data.documents || [];
    return documents.map(firestoreDocToOrder);
  } catch (err) {
    console.error('Feil ved uthenting av alle ordrer fra Firestore:', err);
    return [];
  }
}
