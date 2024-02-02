import {Listener,EventManager} from "../../decorator";
let data = null;

export default class ResizeTracker extends EventManager {
  static type = "resize";
  constructor() {
    super();
  }

  @Listener("resize")
  handler() {
    let de = document.documentElement;
    // window.innerWidth includes width of the scrollbar and is not a true representation of the viewport width.
    // Therefore, when possible, use documentElement's clientWidth property.
    data = {
      width:
        de && "clientWidth" in de
          ? Math.min(de.clientWidth, window.innerWidth)
          : window.innerWidth,
      height:
        de && "clientHeight" in de
          ? Math.min(de.clientHeight, window.innerHeight)
          : window.innerHeight,
    };
    console.log("🚀 ~ ResizeTracker ~ handler ~ data:", data)
  }

}


