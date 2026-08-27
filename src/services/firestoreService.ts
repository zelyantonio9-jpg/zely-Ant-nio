import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Product, 
  Order, 
  UserProfile, 
  FreightLoad, 
  B2BQuotationRequest, 
  DisputeRecord, 
  SecurityAuditEntry, 
  INSSAuditLog 
} from '../types';

export class FirestoreSyncService {
  /**
   * Initialize collections with seed data if they are empty in Firestore
   */
  public static async seedInitialDataIfEmpty(
    seedUsers: UserProfile[],
    seedProducts: Product[],
    seedOrders: Order[],
    seedFreight: FreightLoad[],
    seedRfqs: B2BQuotationRequest[],
    seedDisputes: DisputeRecord[]
  ): Promise<void> {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        console.log('[Firestore] Seeding initial database records...');
        const batch = writeBatch(db);

        seedUsers.forEach(u => {
          batch.set(doc(db, 'users', u.id), u);
        });

        seedProducts.forEach(p => {
          batch.set(doc(db, 'products', p.id), p);
        });

        seedOrders.forEach(o => {
          batch.set(doc(db, 'orders', o.id), o);
        });

        seedFreight.forEach(f => {
          batch.set(doc(db, 'freight_loads', f.id), f);
        });

        seedRfqs.forEach(r => {
          batch.set(doc(db, 'rfqs', r.id), r);
        });

        seedDisputes.forEach(d => {
          batch.set(doc(db, 'disputes', d.id), d);
        });

        await batch.commit();
        console.log('[Firestore] Initial database records seeded successfully.');
      }
    } catch (err) {
      console.warn('[Firestore] Notice during initial seed verification:', err);
    }
  }

  // --- Real-Time Subscriptions ---

  public static subscribeToProducts(onUpdate: (products: Product[]) => void): Unsubscribe {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items: Product[] = [];
        snapshot.forEach((doc) => items.push(doc.data() as Product));
        onUpdate(items);
      }
    }, (error) => {
      console.warn('[Firestore] Products subscription notice:', error);
    });
  }

  public static subscribeToOrders(onUpdate: (orders: Order[]) => void): Unsubscribe {
    const q = query(collection(db, 'orders'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items: Order[] = [];
        snapshot.forEach((doc) => items.push(doc.data() as Order));
        onUpdate(items);
      }
    }, (error) => {
      console.warn('[Firestore] Orders subscription notice:', error);
    });
  }

  public static subscribeToUsers(onUpdate: (users: UserProfile[]) => void): Unsubscribe {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items: UserProfile[] = [];
        snapshot.forEach((doc) => items.push(doc.data() as UserProfile));
        onUpdate(items);
      }
    }, (error) => {
      console.warn('[Firestore] Users subscription notice:', error);
    });
  }

  // --- Persistence Methods ---

  public static async saveProduct(product: Product): Promise<void> {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.warn('[Firestore] saveProduct notice:', e);
    }
  }

  public static async saveOrder(order: Order): Promise<void> {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (e) {
      console.warn('[Firestore] saveOrder notice:', e);
    }
  }

  public static async saveUser(user: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (e) {
      console.warn('[Firestore] saveUser notice:', e);
    }
  }

  public static async saveFreightLoad(load: FreightLoad): Promise<void> {
    try {
      await setDoc(doc(db, 'freight_loads', load.id), load);
    } catch (e) {
      console.warn('[Firestore] saveFreightLoad notice:', e);
    }
  }

  public static async saveRFQ(rfq: B2BQuotationRequest): Promise<void> {
    try {
      await setDoc(doc(db, 'rfqs', rfq.id), rfq);
    } catch (e) {
      console.warn('[Firestore] saveRFQ notice:', e);
    }
  }

  public static async saveDispute(dispute: DisputeRecord): Promise<void> {
    try {
      await setDoc(doc(db, 'disputes', dispute.id), dispute);
    } catch (e) {
      console.warn('[Firestore] saveDispute notice:', e);
    }
  }

  public static async saveAuditLog(log: SecurityAuditEntry): Promise<void> {
    try {
      await setDoc(doc(db, 'security_audit_logs', log.id), log);
    } catch (e) {
      console.warn('[Firestore] saveAuditLog notice:', e);
    }
  }

  public static async saveINSSAuditLog(log: INSSAuditLog): Promise<void> {
    try {
      await setDoc(doc(db, 'inss_audit_logs', log.id), log);
    } catch (e) {
      console.warn('[Firestore] saveINSSAuditLog notice:', e);
    }
  }
}
