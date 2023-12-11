import {listener} from "@/decorator";

export class Monitor {
  constructor(config) {}

  @listener("test")
  listenToPageData() {
    console.log(222222222222222222222);
  }
}


