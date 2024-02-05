/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-01-31 15:35:16
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-05 08:39:10
 * @FilePath: \monitor-sdk\src\core\interaction\click.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { getTime, layout, link, target, text } from '../../utils';
import { Listener, EventManager } from '../../decorator';

export default class ClickTracker extends EventManager {
  static type = 'click';
  constructor() {
    super();
  }

  @Listener('click')
  public async handler(event: any) {
    const pageCoords = {
      x: event.pageX ?? event.clientX + document.documentElement.scrollLeft,
      y: event.pageY ?? event.clientY + document.documentElement.scrollTop,
    };

    const targetElement = target(event);
    const linkElement = link(targetElement);
    const layoutRect = layout(targetElement as Element);

    if (event.detail === 0 && layoutRect) {
      pageCoords.x = Math.round(layoutRect.x + layoutRect.w / 2);
      pageCoords.y = Math.round(layoutRect.y + layoutRect.h / 2);
    }

    const relativeCoords = {
      eX: layoutRect
        ? Math.max(
            Math.floor(((pageCoords.x - layoutRect.x) / layoutRect.w) * 32132),
            0,
          )
        : 0,
      eY: layoutRect
        ? Math.max(
            Math.floor(((pageCoords.y - layoutRect.y) / layoutRect.h) * 32132),
            0,
          )
        : 0,
    };

    if (pageCoords.x !== null && pageCoords.y !== null) {
      const eventData = {
        time: getTime(event),
        event,
        data: {
          target: targetElement,
          x: pageCoords.x,
          y: pageCoords.y,
          ...relativeCoords,
          button: event.button,
          text: text(targetElement),
          link: linkElement?.href ?? null,
          hash: null,
        },
      };
    }
  }
}
