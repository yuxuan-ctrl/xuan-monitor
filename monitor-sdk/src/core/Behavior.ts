import {EventManager} from "../decorator";

// 将所有交互行为类合并到一个对象中导出，提高代码可读性
import * as InteractionBehaviors from "./interaction";

// 定义 Behavior 类并导出
export default class Behavior {
  public Events: Record<string, any> = {};

  constructor() {}

  static start(root?: HTMLElement) {
    Object.values(InteractionBehaviors).forEach((Class) => {
      EventManager.start(Class, root);
    });
  }
}

// 合并并导出所有需要的模块和类
export const {Click, Input, Resize, Selection, Clipboard, Submit} =
  InteractionBehaviors;
