export class customizedDB {
  monitorZDB: IDBFactory;
  onerror: any;
  onsuccess: any;
  onupgradeneeded: any;
  db: any;
  useupgrad: boolean;
  // 构造
  constructor(opt) {
    if (!opt) return;
    this.onsuccess = opt.onsuccess;
    this.onerror = opt.onerror;
    this.onupgradeneeded = opt.onupgradeneeded;
  }

  /**
   * @CreatedTime：2019/06/20 18:24:18
   * @params：
   * @Description：统一对数据库开启，使用回调
   */
  initdb(opt) {
    if (!opt) {
      console.log("缺少配置项");
      return;
    }
    let that = this;
    this.monitorZDB = window.indexedDB;
    //    ||
    //   window.webkitIndexedDB ||
    //   window.mozIndexedDB ||
    //   window.msIndexedDB;
    if (!this.monitorZDB) {
      console.log("你的浏览器不支持IndexedDB");
      return;
    }

    return new Promise((success, error) => {
      let request = this.monitorZDB.open(opt.dbname, opt.version);

      request.onerror = function (e) {
        that.onerror && that.onerror(e);
        error(e);
      };

      request.onsuccess = function (e) {
        console.log("成功打开DB");
        if (!that.useupgrad) {
          that.db = (e.target as any).result;
          success(e);
        }
        that.onsuccess && that.onsuccess(e);
      };

      request.onupgradeneeded = function (e) {
        that.db = (e.target as any).resul;
        that.useupgrad = true;
        console.log("数据库版本更改为： " + opt.version);
        that.onupgradeneeded && that.onupgradeneeded(e);
        that.deleteStore(opt);
        success(e);
      };
    });
  }

  /**
   * @CreatedTime：2019/06/20 18:19:44
   * @params：{dbname:数据库名称,version:数据库版本号,
   * stores:表信息数组
   * [
   *   {
   *    storename:表名,keys:主键
   *     {
   *       name:主键名称,
   *       unique:是否可重复
   *     }
   *   }
   * ],
   * delstore:表名数组}
   * @Description：数据库开启/创建表/删除表
   */
  open(opt) {
    let that = this;
    this.initdb(opt).then((e) => {
      if (opt.stores && opt.stores.length) {
        opt.stores.forEach((store) => {
          if (!that.db.objectStoreNames.contains(store.storename)) {
            // 如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            let objectStore = that.db.createObjectStore(store.storename, {
              keyPath: "id",
              autoIncrement: true,
            });

            // 指定可以被索引的字段，unique字段是否唯一
            if (store.keys && store.keys.length) {
              store.keys.forEach((key) => {
                objectStore.createIndex(key.name, key.name, {
                  unique: key.unique,
                });
              });
            }
          }
        });
      }
    });
  }

  /**
   * @CreatedTime：2019/06/20 18:08:29
   * @params：{storeName:表名， data:添加的数据}
   * @Description：添加数据
   */
  add(opt) {
    let that = this;
    return new Promise((success, error) => {
      // 创建事务
      let request = that.db
        .transaction([opt.storeName], "readwrite")
        .objectStore(opt.storeName)
        .add(opt.data);

      request.onsuccess = (e) => {
        success(e.target.result);
      };
      request.onerror = (e) => {
        error(e);
      };
    });
  }

  /**
   * @CreatedTime：2019/06/20 18:09:04
   * @params：{storeName:表名，key:主键,value:主键值}
   * @Description：删除数据
   */
  delete(opt) {
    let that = this;
    return new Promise((success, error) => {
      let store = that.db
        .transaction(opt.storeName, "readwrite")
        .objectStore(opt.storeName);
      let request = null;
      if (opt.key) {
        request = store.index(opt.key || "id")["delete"](opt.value);
      } else {
        request = store["delete"](opt.value);
      }
      request.onsuccess = (e) => {
        success(e.target.result);
      };
      request.onerror = (e) => {
        error(e);
      };
    });
  }

  /**
   * @CreatedTime：2019/06/20 18:10:03
   * @params：{storeName:表名，key:主键,value:主键值}
   * @Description：获取数据
   */
  get(opt) {
    let that = this;
    return new Promise((success, error) => {
      let request,
        store = that.db
          .transaction(opt.storeName, "readwrite")
          .objectStore(opt.storeName);

      if (opt.key) {
        request = store.index(opt.key || "id").get(opt.value);
      } else {
        request = store.get(opt.value);
      }

      request.onsuccess = (e) => {
        success(e.target.result);
      };
      request.onerror = (e) => {
        error(e);
      };
    });
  }

  /**
   * @CreatedTime：2019/06/20 17:59:33
   * @params：{storeName:表名 key:键值 newData：新数据}
   * @Description：更新数据
   */
  update(opt) {
    let that = this;
    return new Promise((success, error) => {
      let transaction = that.db.transaction(opt.storeName, "readwrite");

      let request,
        store = transaction.objectStore(opt.storeName);

      if (opt.key) {
        request = store.index(opt.key || "id").get(opt.value);
      } else {
        request = store.get(opt.value);
      }
      request.onsuccess = (e) => {
        var data = e.target.result;
        for (let a in opt.newData) {
          // 除了keypath之外
          data[a] = opt.newData[a];
        }
        store.put(data);
        success(e.target.result);
      };
      request.onerror = (e) => {
        error(e);
      };
    });
  }

  /**
   * @CreatedTime：2019/06/20 17:57:35
   * @params：{delstores:空间名称数组}
   * @Description：删除空间
   */
  deleteStore(opt) {
    let that = this;
    if (opt.delstores && opt.delstores.length) {
      opt.delstores.forEach((store) => {
        if (that.db.objectStoreNames.contains(store)) {
          // 如果存在表格，则删除
          that.db.deleteObjectStore(store);
        }
      });
    }
  }

  /**
   * @CreatedTime：2019/06/20 17:58:27
   * @params：{db:indexedDB对象}
   * @Description：关闭数据库
   */
  closeDB(db) {
    db.close();
  }

  /**
   * @CreatedTime：2019/06/20 17:58:58
   * @params：{name:数据库名称}
   * @Description：删除数据库
   */
  deleteDB(name) {
    this.monitorZDB.deleteDatabase(name);
  }
}
