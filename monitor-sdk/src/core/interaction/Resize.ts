import { Listener, EventManager } from '../../decorator';
import MessageQueueDBWrapper from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';
import { getCurrentUnix, getTime,formatDate,normalizeUrlForPath } from '../../utils';

let data = null;

export default class ResizeTracker extends EventManager {
  type = 'resize';
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
      timestamp: getCurrentUnix(),
    };
    console.log('🚀 ~ ResizeTracker ~ handler ~ data:', data);
    this.messageWrapper.enqueue(
      {
        timestamp: getCurrentUnix(),
        createTime: formatDate(new Date()),
        pageUrl: normalizeUrlForPath(window.location.href), 
        // event: event,
        type: this.type,
        data: JSON.stringify(data),
        session: new Date().getDate(),
      },
      DB_CONFIG.ACTION_STORE_NAME
    );
  }
}
