import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
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
   * Check if users exist in Firestore
   */
  public static async hasExistingData(): Promise<boolean> {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      return !usersSnap.empty;
    } catch (e) {
      console.warn('[Firestore] Checking data error:', e);
      return false;
    }
  }

  /**
   * Completely clear test data in Firestore cloud database
   */
  public static async clearAllCloudData(): Promise<void> {
    try {
      const collectionsToClear = [
        'users',
        'orders',
        'freight_loads',
        'rfqs',
        'disputes',
        'security_audit_logs',
        'inss_audit_logs'
      ];

      for (const colName of collectionsToClear) {
        const snap = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        snap.forEach((d) => {
          batch.delete(doc(db, colName, d.id));
        });
        if (!snap.empty) {
          await batch.commit();
        }
      }
      console.log('[Firestore] All cloud test data wiped successfully.');
    } catch (err) {
      console.warn('[Firestore] Error clearing cloud data:', err);
    }
  }

  // --- Real-Time Subscriptions ---

  public static subscribeToProducts(onUpdate: (products: Product[]) => void): Unsubscribe {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      const items: Product[] = [];
      const mockIdsToDelete: string[] = [];
      snapshot.forEach((d) => {
        const p = d.data() as Product;
        const isMock = 
          !p.id ||
          p.id.startsWith('prod_milho') ||
          p.id.startsWith('prod_soja') ||
          p.id.startsWith('prod_mandioca') ||
          p.id.startsWith('prod_cafe') ||
          p.id.startsWith('prod_cimento') ||
          p.id.startsWith('prod_feijao') ||
          p.id.startsWith('prod_tomate') ||
          p.id.startsWith('prod_banana') ||
          p.id.startsWith('prod_carne') ||
          p.id.startsWith('prod_peixe') ||
          p.id.startsWith('prod_mel') ||
          p.id.startsWith('prod_demo') ||
          (p.images && p.images.some(img => typeof img === 'string' && (img.includes('unsplash.com') || img.includes('via.placeholder') || img.includes('picsum.photos'))));

        if (isMock) {
          mockIdsToDelete.push(d.id);
        } else {
          items.push(p);
        }
      });

      // Cleanup any mock artifacts from cloud Firestore
      if (mockIdsToDelete.length > 0) {
        const batch = writeBatch(db);
        mockIdsToDelete.forEach(id => batch.delete(doc(db, 'products', id)));
        batch.commit().catch(e => console.warn('[Firestore] Error deleting legacy mock products:', e));
      }

      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] Products subscription notice:', error);
    });
  }

  public static subscribeToOrders(onUpdate: (orders: Order[]) => void): Unsubscribe {
    const q = query(collection(db, 'orders'));
    return onSnapshot(q, (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach((d) => items.push(d.data() as Order));
      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] Orders subscription notice:', error);
    });
  }

  public static subscribeToUsers(onUpdate: (users: UserProfile[]) => void): Unsubscribe {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      const items: UserProfile[] = [];
      snapshot.forEach((d) => items.push(d.data() as UserProfile));
      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] Users subscription notice:', error);
    });
  }

  public static subscribeToFreightLoads(onUpdate: (loads: FreightLoad[]) => void): Unsubscribe {
    const q = query(collection(db, 'freight_loads'));
    return onSnapshot(q, (snapshot) => {
      const items: FreightLoad[] = [];
      snapshot.forEach((d) => items.push(d.data() as FreightLoad));
      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] Freight loads subscription notice:', error);
    });
  }

  public static subscribeToRfqs(onUpdate: (rfqs: B2BQuotationRequest[]) => void): Unsubscribe {
    const q = query(collection(db, 'rfqs'));
    return onSnapshot(q, (snapshot) => {
      const items: B2BQuotationRequest[] = [];
      snapshot.forEach((d) => items.push(d.data() as B2BQuotationRequest));
      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] RFQ subscription notice:', error);
    });
  }

  public static subscribeToDisputes(onUpdate: (disputes: DisputeRecord[]) => void): Unsubscribe {
    const q = query(collection(db, 'disputes'));
    return onSnapshot(q, (snapshot) => {
      const items: DisputeRecord[] = [];
      snapshot.forEach((d) => items.push(d.data() as DisputeRecord));
      onUpdate(items);
    }, (error) => {
      console.warn('[Firestore] Disputes subscription notice:', error);
    });
  }

  // --- Real-time Persistence Methods directly to Firebase Firestore ---

  public static async saveProduct(product: Product): Promise<void> {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.warn('[Firestore] saveProduct notice:', e);
    }
  }

  public static async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.warn('[Firestore] deleteProduct notice:', e);
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

  public static async saveUserProfile(user: UserProfile): Promise<void> {
    return this.saveUser(user);
  }

  public static async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.warn('[Firestore] deleteUser notice:', e);
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
