var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class IndexedDBWrapper {
    constructor(dbName, version, storeName) {
        // 数据库实例
        this.db = null;
        this.dbName = dbName;
        this.version = version;
        this.storeName = storeName;
    }
    openDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // 打开数据库
                const request = indexedDB.open(this.dbName, this.version);
                // 数据库打开失败时触发
                request.onerror = (event) => {
                    var _a;
                    reject(`Failed to open database: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                };
                // 数据库打开成功时触发
                request.onsuccess = (event) => {
                    var _a;
                    this.db = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                    resolve(this.db);
                };
                // 数据库升级时触发
                request.onupgradeneeded = (event) => {
                    var _a;
                    this.db = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
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
        });
    }
    closeDatabase() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
    ensureDatabaseOpen() {
        if (this.db) {
            return Promise.resolve(this.db);
        }
        else {
            return this.openDatabase();
        }
    }
    // 新增一些数据操作方法，使用 ensureDatabaseOpen 保证数据库已打开
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            const transaction = db.transaction([this.storeName], "readwrite");
            const objectStore = transaction.objectStore(this.storeName);
            return new Promise((resolve, reject) => {
                const request = objectStore.add(data);
                request.onsuccess = (event) => {
                    var _a;
                    resolve((_a = event.target) === null || _a === void 0 ? void 0 : _a.result);
                };
                request.onerror = (event) => {
                    var _a;
                    reject(`Failed to add data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                };
            });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                // 获取事务对象
                const transaction = db.transaction([this.storeName], "readonly");
                // 获取对象存储对象
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                if (transaction && objectStore) {
                    // 获取指定id的数据
                    const request = objectStore.get(id);
                    // 请求成功时
                    request.onsuccess = (event) => {
                        var _a;
                        // 获取数据
                        const data = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                        // 返回数据
                        resolve(data);
                    };
                    // 请求失败时
                    request.onerror = (event) => {
                        var _a;
                        // 返回错误信息
                        reject(`Failed to get data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    // 返回错误信息
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    update(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                if (transaction && objectStore) {
                    const getRequest = objectStore.get(id);
                    getRequest.onsuccess = (event) => {
                        var _a;
                        const existingData = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                        if (existingData) {
                            const updatedData = Object.assign(Object.assign({}, existingData), newData);
                            const updateRequest = objectStore.put(updatedData);
                            updateRequest.onsuccess = () => {
                                resolve();
                            };
                            updateRequest.onerror = (event) => {
                                var _a;
                                reject(`Failed to update data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                            };
                        }
                        else {
                            reject(`Data with ID ${id} not found.`);
                        }
                    };
                    getRequest.onerror = (event) => {
                        var _a;
                        reject(`Failed to get data for update: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                if (transaction && objectStore) {
                    const request = objectStore.delete(id);
                    request.onsuccess = () => {
                        resolve();
                    };
                    request.onerror = (event) => {
                        var _a;
                        reject(`Failed to delete data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readonly");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                const data = [];
                if (transaction && objectStore) {
                    const request = objectStore.openCursor();
                    request.onsuccess = (event) => {
                        var _a;
                        const cursor = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                        if (cursor) {
                            data.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            resolve(data);
                        }
                    };
                    request.onerror = (event) => {
                        var _a;
                        reject(`Failed to get all data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    query(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readonly");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                const data = [];
                if (transaction && objectStore) {
                    const request = objectStore.openCursor();
                    request.onsuccess = (event) => {
                        var _a;
                        const cursor = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                        if (cursor) {
                            const currentData = cursor.value;
                            if (condition(currentData)) {
                                data.push(currentData);
                            }
                            cursor.continue();
                        }
                        else {
                            resolve(data);
                        }
                    };
                    request.onerror = (event) => {
                        var _a;
                        reject(`Failed to query data: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readwrite");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                if (transaction && objectStore) {
                    const request = objectStore.clear();
                    request.onsuccess = () => {
                        resolve();
                    };
                    request.onerror = (event) => {
                        var _a;
                        reject(`Failed to clear object store: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    getCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.ensureDatabaseOpen();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], "readonly");
                const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(this.storeName);
                if (transaction && objectStore) {
                    const request = objectStore.count();
                    request.onsuccess = (event) => {
                        var _a;
                        const count = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                        resolve(count);
                    };
                    request.onerror = (event) => {
                        var _a;
                        reject(`Failed to get record count: ${(_a = event.target) === null || _a === void 0 ? void 0 : _a.error}`);
                    };
                }
                else {
                    reject("Transaction or objectStore is null.");
                }
            });
        });
    }
    getBaseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                return this.db;
            }
            else {
                throw new Error("Database is not open.");
            }
        });
    }
}
