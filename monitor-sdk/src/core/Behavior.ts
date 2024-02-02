import Monitor from "./Monitor";
import {initializeEventListeners} from "../decorator";
import { Click,Input,Resize,Selection,Clipboard,Submit} from "./interaction";
export default class Behavior {
  public Events: Object = {};

  constructor() {}

  static start() {
    initializeEventListeners(Monitor);
    initializeEventListeners(Click);
    initializeEventListeners(Input);
    initializeEventListeners(Selection);
    initializeEventListeners(Resize);
    initializeEventListeners(Clipboard);
    initializeEventListeners(Submit);
  }
}
