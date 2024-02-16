import { Listener, EventManager } from '../../decorator';
import { getTime, layout, link, target, text } from '../../utils';
import MessageQueueDBWrapper, { IMessage } from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';

export default class ClipboardTracker extends EventManager {
  type = 'clipboard';
  messageWrapper: MessageQueueDBWrapper;
  constructor() {
    super();
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
  }

  @Listener(['cut', 'copy', 'paste'])
  handler(event: ClipboardEvent) {
    console.log('🚀 ~ ClipboardTracker ~ handler ~ event:', event);
    let clipboardData = event.clipboardData;

    // 创建一个对象来存储不同类型的剪贴板内容
    let dataObject: { type: string; content: any; fileName?: string } | null =
      null;

    if (clipboardData) {
      // 获取纯文本内容
      const plainTextContent = clipboardData.getData('text/plain');
      if (plainTextContent) {
        dataObject = { type: 'text/plain', content: plainTextContent };
      }

      // 获取HTML内容（如果存在）
      const htmlContent = clipboardData.getData('text/html');
      if (htmlContent) {
        dataObject = { type: 'text/html', content: htmlContent };
      }

      // 处理文件类型
      const files = clipboardData.files;
      if (files.length > 0) {
        const file = files[0];
        dataObject = {
          type: file.type,
          fileName: file.name,
          content: file, // 或者根据需要提取其他文件信息
        };
      }
    }
    // 输出事件相关信息
    if (dataObject) {
      console.log({
        time: getTime(event),
        // event: event,
        type: this.type,
        data: {
          target: JSON.stringify(event.target),
          clipboardData: dataObject,
        },
      });
      this.messageWrapper.enqueue(
        {
          time: getTime(event),
          // event: event,
          type: this.type,
          data: {
            // target: JSON.stringify(event.target),
            clipboardData: dataObject,
          },
          session: new Date().getDate(),
        },
        DB_CONFIG.ACTION_STORE_NAME
      );
    }
  }
}
