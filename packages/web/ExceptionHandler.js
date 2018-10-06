"use strict";

const Controller = require("./Controller");
const Env = require("@inja/env");
const Exception = require("@inja/exception");

class ExceptionHandler extends Controller {

  static inject(provide) {
    return [Controller.Context, Env];
  }

  /**
   * @param {Controller.Context=} context 
   * @param {Env=} env 
   */
  constructor(context, env) {
    super(context);
    this.env = env;
  }

  /**
   * @param {Exception} err
   */
  async handleException(err) {
    /** @type {Exception} */
    this.response.status(err.status || 500);
    this.response.send(err.stack);
  }
}

module.exports = ExceptionHandler;