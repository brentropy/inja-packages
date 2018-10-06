"use strict";

const ControllerContext = require("./ControllerContext")

class Controller {

  /**
   * @return {Array<*>}
   */
  static inject() {
    return [ControllerContext]
  }

  /**
   * @param {ControllerContext=} context 
   */
  constructor(context) {
    this.request = context.request;
    this.response = context.response;
  }
}

Controller.Context = ControllerContext;

module.exports = Controller;
