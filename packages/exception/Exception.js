"use strict";

const Container = require("@inja/container");

/**
 * Extendable base exception class.
 */
class Exception extends Error {

  /**
   * @param {string} message 
   * @param {number=} status 
   * @param {Function=} factory 
   */
  constructor (message, status = 500, factory) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, factory || this.constructor);
  }

  /**
   * @return {boolean}
   */
  get report() {
    return true;
  }

  /**
   * @return {?Container.Provider<*>}
   */
  get handler() {
    return null;
  }

  /**
   * 
   */
};

module.exports = Exception;