interface IData {
  timestamp?: any;
  id?: number;
  name?: string;
  age?: number;
  email?: string;
  status?: "pending" | "consumed";
  // Add other properties based on your data structure
}

export default class IndexedDBWrapper {
  private dbName: string;
  // 数据库版本号
  private version: number;
  // 存储名称
  private storeName: string;
  // 数据库实例
  private db: IDBDatabase | null = null;
  constructor(dbName: string, version: number, storeName: string) {
    this.dbName = dbName;
    this.version = version;
    this.storeName = storeName;
  }

  public async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // 打开数据库
      const request = indexedDB.open(this.dbName, this.version);

      // 数据库打开失败时触发
      request.onerror = (event) => {
        reject(`Failed to open database: ${(event.target as any)?.error}`);
      };

      // 数据库打开成功时触发
      request.onsuccess = (event) => {
        this.db = (event.target as any)?.result as IDBDatabase;
        resolve(this.db);
      };

      // 数据库升级时触发
      request.onupgradeneeded = (event) => {
        this.db = (event.target as any)?.result as IDBDatabase;

        // 如果数据库中不包含指定的对象存储，则创建它
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          const objectStore = this.db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });

          // You can add indexes if needed
          // 添加索引，如果需要的话
          // objectStore.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  public closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  protected ensureDatabaseOpen(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    } else {
      return this.openDatabase();
    }
  }

  // 新增一些数据操作方法，使用 ensureDatabaseOpen 保证数据库已打开

  public async add(data: IData): Promise<number> {
    const db = await this.ensureDatabaseOpen();
    const transaction = db.transaction([this.storeName], "readwrite");
    const objectStore = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);

      request.onsuccess = (event) => {
        resolve((event.target as any)?.result as number);
      };

      request.onerror = (event) => {
        reject(`Failed to add data: ${(event.target as any)?.error}`);
      };
    });
  }

  public async get(id: number): Promise<IData | undefined> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      // 获取事务对象
      const transaction = db.transaction([this.storeName], "readonly");
      // 获取对象存储对象
      const objectStore = transaction?.objectStore(this.storeName);

      if (transaction && objectStore) {
        // 获取指定id的数据
        const request = objectStore.get(id);

        // 请求成功时
        request.onsuccess = (event) => {
          // 获取数据
          const data = (event.target as any)?.result as IData;
          // 返回数据
          resolve(data);
        };

        // 请求失败时
        request.onerror = (event) => {
          // 返回错误信息
          reject(`Failed to get data: ${(event.target as any)?.error}`);
        };
      } else {
        // 返回错误信息
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async update(id: number, newData: IData): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction?.objectStore(this.storeName);

      if (transaction && objectStore) {
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = (event) => {
          const existingData = (event.target as any)?.result as IData;

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
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async delete(id: number): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction?.objectStore(this.storeName);

      if (transaction && objectStore) {
        const request = objectStore.delete(id);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject(`Failed to delete data: ${(event.target as any)?.error}`);
        };
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async getAll(): Promise<IData[]> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const objectStore = transaction?.objectStore(this.storeName);
      const data: IData[] = [];

      if (transaction && objectStore) {
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
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async query(condition: (data: IData) => boolean): Promise<IData[]> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const objectStore = transaction?.objectStore(this.storeName);
      const data: IData[] = [];

      if (transaction && objectStore) {
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as any)?.result as IDBCursorWithValue;

          if (cursor) {
            const currentData = cursor.value as IData;
            if (condition(currentData)) {
              data.push(currentData);
            }

            cursor.continue();
          } else {
            resolve(data);
          }
        };

        request.onerror = (event) => {
          reject(`Failed to query data: ${(event.target as any)?.error}`);
        };
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async clear(): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction?.objectStore(this.storeName);

      if (transaction && objectStore) {
        const request = objectStore.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject(
            `Failed to clear object store: ${(event.target as any)?.error}`
          );
        };
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async getCount(): Promise<number> {
    const db = await this.ensureDatabaseOpen();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const objectStore = transaction?.objectStore(this.storeName);

      if (transaction && objectStore) {
        const request = objectStore.count();

        request.onsuccess = (event) => {
          const count = (event.target as any)?.result as number;
          resolve(count);
        };

        request.onerror = (event) => {
          reject(`Failed to get record count: ${(event.target as any)?.error}`);
        };
      } else {
        reject("Transaction or objectStore is null.");
      }
    });
  }

  public async getBaseInfo(): Promise<IDBDatabaseInfo> {
    if (this.db) {
      return this.db;
    } else {
      throw new Error("Database is not open.");
    }
  }
}
