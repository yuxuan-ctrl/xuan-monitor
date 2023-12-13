var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import IndexedDBWrapper from "../db/index.js";
class MessageQueueDBWrapper extends IndexedDBWrapper {
    constructor(dbName, version) {
        super(dbName, version, MessageQueueDBWrapper.MESSAGE_STORE_NAME);
    }
    // 获取实例
    static getInstance(dbName, dbVersion) {
        if (!window.instance) {
            this.instance = new MessageQueueDBWrapper(dbName, dbVersion);
            window.instance = this.instance;
        }
        return window.instance;
    }
    // 添加消息
    enqueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const message = Object.assign(Object.assign({}, data), { timestamp, status: "pending" });
            yield this.add(message);
        });
    }
    // 获取消息
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingMessages = yield this.query((message) => message.status === "pending");
            if (pendingMessages.length > 0) {
                const newestPendingMessage = pendingMessages.reduce((newest, current) => current.timestamp > newest.timestamp ? current : newest);
                yield this.update(newestPendingMessage.id, { status: "consumed" });
                return newestPendingMessage;
            }
            return undefined;
        });
    }
}
// 消息存储名称
MessageQueueDBWrapper.MESSAGE_STORE_NAME = "messages";
export default MessageQueueDBWrapper;
