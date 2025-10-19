'use client';

interface OfflineTransaction {
  id: string;
  data: any;
  accessToken: string;
  timestamp: number;
}

class OfflineStorage {
  private dbName = 'ExpenseManagerDB';
  private version = 1;
  private storeName = 'offlineTransactions';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async saveOfflineTransaction(data: any, accessToken: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    const offlineTransaction: OfflineTransaction = {
      id: `offline_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      data,
      accessToken,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.add(offlineTransaction);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineTransactions(): Promise<OfflineTransaction[]> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeOfflineTransaction(id: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async syncOfflineTransactions(): Promise<void> {
    if (!navigator.onLine) return;

    const offlineTransactions = await this.getOfflineTransactions();

    for (const transaction of offlineTransactions) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${transaction.accessToken}`,
          },
          body: JSON.stringify(transaction.data),
        });

        if (response.ok) {
          await this.removeOfflineTransaction(transaction.id);
        }
      } catch (error) {
        console.error('Failed to sync transaction:', error);
      }
    }
  }

  async clearAllOfflineData(): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();

// Hook for using offline storage
export function useOfflineStorage() {
  const isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

  const saveTransaction = async (data: any, accessToken: string) => {
    if (isOnline) {
      // Try to save online first
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Network request failed');
        }
      } catch (error) {
        // If online request fails, save offline
        await offlineStorage.saveOfflineTransaction(data, accessToken);
        throw error;
      }
    } else {
      // Save offline when not connected
      await offlineStorage.saveOfflineTransaction(data, accessToken);
      return { success: true, offline: true };
    }
  };

  const syncWhenOnline = async () => {
    if (isOnline) {
      await offlineStorage.syncOfflineTransactions();
    }
  };

  return {
    isOnline,
    saveTransaction,
    syncWhenOnline,
    getOfflineTransactions: offlineStorage.getOfflineTransactions.bind(offlineStorage),
    clearOfflineData: offlineStorage.clearAllOfflineData.bind(offlineStorage),
  };
}