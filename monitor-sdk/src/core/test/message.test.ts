// test/MessageQueueDBWrapper.test.ts

import MessageQueueDBWrapper from "../Message";
import fakeIndexedDB from "fake-indexeddb";
import fakeIDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import "fake-indexeddb/auto";

beforeAll(() => {
  global.indexedDB = fakeIndexedDB;
  global.IDBKeyRange = fakeIDBKeyRange;
  global.structuredClone = jest.fn((val) => {
    return JSON.parse(JSON.stringify(val));
  });
});

afterEach(() => {
  // 清除所有数据以准备下一个测试用例
});

it("should be able to enqueue and dequeue messages", async () => {
  const queue = MessageQueueDBWrapper.getInstance({
    dbName: "test-db",
    dbVersion: 1,
    storeName: "messages",
  });

  await queue.enqueue({ data: "Hello" });
  await queue.enqueue({ data: "World" });

  const dequeuedMessage1 = await queue.dequeue();
  expect(dequeuedMessage1?.data.data).toBe("Hello");

  const dequeuedMessage2 = await queue.dequeue();
  expect(dequeuedMessage2?.data.data).toBe("World");
});

it("should handle empty queue when dequeuing", async () => {
  const queue = MessageQueueDBWrapper.getInstance({
    dbName: "test-db",
    dbVersion: 1,
    storeName: "messages",
  });

  const dequeuedMessage = await queue.dequeue();
  expect(dequeuedMessage).toBeUndefined();
});

it("should handle duplicate IDs when enqueueing", async () => {
  const queue = MessageQueueDBWrapper.getInstance({
    dbName: "test-db",
    dbVersion: 1,
    storeName: "messages",
  });

  await queue.enqueue({ data: "Hello" });
  await queue.enqueue({ data: "World" });

  const messages = await queue.getAll();
  expect(messages.length).toBe(2);
  expect(messages[0].data.data).toBe("Hello");
});
