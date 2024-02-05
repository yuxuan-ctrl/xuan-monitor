import { Listener, EventManager } from '../../decorator';
import MessageQueueDBWrapper, { IMessage } from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';

let data = null;

export default class ResizeTracker extends EventManager {
  type = 'resize';
  messageWrapper: MessageQueueDBWrapper;
  constructor() {
    super();
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
  }

  @Listener('resize')
  handler() {
    let de = document.documentElement;
    // window.innerWidth includes width of the scrollbar and is not a true representation of the viewport width.
    // Therefore, when possible, use documentElement's clientWidth property.
    data = {
      width:
        de && 'clientWidth' in de
          ? Math.min(de.clientWidth, window.innerWidth)
          : window.innerWidth,
      height:
        de && 'clientHeight' in de
          ? Math.min(de.clientHeight, window.innerHeight)
          : window.innerHeight,
        type: this.type,
    };
    console.log('🚀 ~ ResizeTracker ~ handler ~ data:', data);
    this.messageWrapper.enqueue(
      { ...data, session: new Date().getDate() },
      DB_CONFIG.ACTION_STORE_NAME
    );
  }
}
