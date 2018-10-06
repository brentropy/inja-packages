"use strict";

const Exception = require("@inja/exception");

class EnvMissingException extends Exception {

  static forVariable(variable) {
    const msg = `Environment variable must be defined: ${variable}`;
    return new this(msg, 500, this.forVariable);
  }
}

module.exports = EnvMissingException;