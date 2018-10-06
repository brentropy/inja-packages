"use strict";

const EnvMissingException = require("./EnvMissingException");

/**
 * Env provides access to envrionment variables.
 * 
 * @interface
 */
class Env {

  static get singleton() {
    return true;
  }

  static inject(provide) {
    return [provide(process.env)];
  }

  /**
   * @param {Object=} environment 
   */
  constructor(environment) {
    this.environment = environment;
  }

  /**
   * Get the value of a variable from the envrionment with an optional fallback.
   *
   * @param {string} variable The name of the envrionment variable
   * @param {string} fallback A default string to be returned if not set
   * @return {string}
   */
  get(variable, fallback) {
    return this.environment[variable] || fallback;
  }

  /**
   * Get the value of a variable and throw if not defined.
   *
   * @param {string} variable The name of the envrionment variable
   * @throws {EnvMissingException}
   * @return {string}
   */
  require(variable) {
    const value = this.get(variable, "");
    if (value === "") {
      throw EnvMissingException.forVariable(variable);
    }
    return value;
  }
}

module.exports = Env;
