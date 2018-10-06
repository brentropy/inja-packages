"use strict";

const Exception = require("@inja/exception");

class ConfigMissingException extends Exception {

  /**
   * Create exception for missing config path
   * 
   * @param {string} path 
   */
  static forPath(path) {
    const msg = `Configuration missing for path: ${path}`;
    return new this(msg, 500, this.forPath);
  }
}

module.exports = ConfigMissingException;