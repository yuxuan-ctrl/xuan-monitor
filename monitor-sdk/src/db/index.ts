import { IMessage } from '../core/Message';

interface IIndexedDBConfig {
  dbName?: string;
  version?: number;
  storeName?: string;
}

const DEFAULT_CONFIG: IIndexedDBConfig = {
  dbName: 'myDatabase',
  version: 1,
  storeName: 'myObjectStore',
};

interface IDBDatabaseInfo extends IDBDatabase {}
export default class IndexedDBWrapper {
  private config: IIndexedDBConfig;
  private db: IDBDatabase | null = null;

  constructor(config?: IIndexedDBConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async openDatabase(storeNames: Array<string>): Promise<IDBDatabase> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await new Promise<IDBOpenDBRequest>(
          (resolve, reject) => {
            const request = indexedDB.open(
              this.config.dbName,
              this.config.version
            );
            request.onerror = (event) => {
              reject(
                `Failed to open database: ${(event.target as any)?.error}`
              );
            };
            request.onupgradeneeded = (event) => {
              const db = (event.target as any)?.result as IDBDatabase;
              storeNames.forEach((storeName) => {
                if (!db.objectStoreNames.contains(storeName)) {
                  const objectStore = db.createObjectStore(storeName, {
                    keyPath: 'id',
                    autoIncrement: true,
                  });
                  objectStore.createIndex('id', 'id', { unique: false });
                  objectStore.createIndex('timestamp', 'timestamp', {
                    unique: false,
                  });
                  
                }
              });
            };
            resolve(request);
          }
        );

        result.onsuccess = (event) => {
          this.db = (event.target as any)?.result as IDBDatabase;
          resolve(this.db);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  protected async ensureDatabaseOpen(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    } else {
      return this.openDatabase(['DEFAULT_CONFIG.storeName']);
    }
  }

  public async add(data: IMessage, storeName: string): Promise<number> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.add(data);

      request.onsuccess = (event) => {
        resolve((event.target as any)?.result as number);
      };

      request.onerror = (event) => {
        reject(`Failed to add data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async get(
    id: number,
    storeName: string
  ): Promise<IMessage | undefined> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.get(id);

      request.onsuccess = (event) => {
        resolve((event.target as any)?.result as IMessage);
      };

      request.onerror = (event) => {
        reject(`Failed to get data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async update(
    id: number,
    newData: IMessage,
    storeName: string
  ): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const getRequest = objectStore.get(id);

      getRequest.onsuccess = (event) => {
        const existingData = (event.target as any)?.result as IMessage;

        if (existingData) {
          const updatedData = { ...existingData, ...newData };

          const updateRequest = objectStore.put(updatedData);

          updateRequest.onsuccess = () => {
            resolve();
          };

          updateRequest.onerror = (event) => {
            reject(`Failed to update data: ${(event.target as any)?.error}`);
          };
        } else {
          reject(`Data with ID ${id} not found.`);
        }
      };

      getRequest.onerror = (event) => {
        reject(
          `Failed to get data for update: ${(event.target as any)?.error}`
        );
      };
    });
  }

  public async delete(id: number, storeName: string): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(`Failed to delete data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async getAll(storeName: string): Promise<IMessage[]> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const data: IMessage[] = [];

      const request = objectStore.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as any)?.result as IDBCursorWithValue;

        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve(data);
        }
      };

      request.onerror = (event) => {
        reject(`Failed to get all data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async query(
    condition: (data: IMessage) => boolean,
    storeName: string,
    order?: { field: keyof IMessage; direction: 'asc' | 'desc' },
    limit?: number
  ): Promise<IMessage[]> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const data: IMessage[] = [];
      let cursorRequest: IDBRequest;

      if (order && limit) {
        const index = objectStore.index(order.field);
        cursorRequest = index.openCursor(
          null,
          order.direction === 'desc' ? 'prev' : 'next'
        );
      } else {
        cursorRequest = objectStore.openCursor();
      }

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as any)?.result as IDBCursorWithValue;

        if (cursor) {
          const currentData = cursor.value as IMessage;
          if (condition(currentData)) {
            data.push(currentData);

            if (limit && data.length >= limit) {
              resolve(data);
              return;
            }
          }

          cursor.continue();
        } else {
          resolve(data);
        }
      };

      cursorRequest.onerror = (event) => {
        reject(`Failed to query data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async clear(storeName: string): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(`Failed to clear object store: ${(event.target as any)?.error}`);
      };
    });
  }

  public async getCount(storeName: string): Promise<number> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.count();

      request.onsuccess = (event) => {
        const count = (event.target as any)?.result as number;
        resolve(count);
      };

      request.onerror = (event) => {
        reject(`Failed to get record count: ${(event.target as any)?.error}`);
      };
    });
  }

  public async getBaseInfo(): Promise<IDBDatabaseInfo> {
    if (this.db) {
      return this.db;
    } else {
      throw new Error('Database is not open.');
    }
  }
}
