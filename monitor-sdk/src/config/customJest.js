import fakeIndexedDB from 'fake-indexeddb';
import fakeIDBKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import JSDOMEnvironment from 'jest-environment-jsdom';

class CustomEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();

    // 获取全局对象并设置属性
    const { global } = this;
    global.indexedDB = fakeIndexedDB;
    global.IDBKeyRange = fakeIDBKeyRange;
    global.structuredClone = structuredClone;
  }

  async teardown() {
    // 删除全局属性
    delete global.indexedDB;
    delete global.IDBKeyRange;

    await super.teardown();
  }

  getVmContext() {}
}

export default CustomEnvironment;
