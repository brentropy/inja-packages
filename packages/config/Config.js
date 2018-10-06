"use strict";

const  Env = require("@inja/env");
const ConfigMissingException = require("./ConfigMissingException");

/**
 * Config provides a standard interface for accessing configuration.
 */
class Config {
  static get singleton() {
    return true;
  }

  static inject(provide) {
    return [Env];
  }

  /**
   * @param {Env=} env 
   */
  constructor(env) {
    /** @type {Env} */
    this.env = env;
    this.config = {};
  }

  /**
   * Set configuration.
   * 
   * @param {function(Env=):Object} config 
   */
  setConfig(config) {
    this.config = config(this.env);
  }

  /**
   * Get a config value with a fallback.
   * 
   * @param {string} path 
   * @param {*} fallback 
   * @return {*}
   */
  get(path, fallback) {
    const value = this.lookup(path);
    return value != null ? value : fallback;
  }

  /**
   * Get a config value throwing if not defined.
   * 
   * @param {string} path 
   * @return {*}
   * @throws {ConfigMissingException}
   */
  require(path) {
    const value = this.lookup(path);
    if (value == null) {
      throw ConfigMissingException.forPath(path);
    }
    return value;
  }

  /**
   * @private
   * @param {string} path 
   * @return {*}
   */
  lookup(path) {
    const keys = path.split(".");
    let next = this.config;
    for (let key of keys) {
      if (typeof next === "object") {
        next = next[key];
      } else {
        next = null;
      }
      if (next == null) {
        break;
      }
    }
    return next;
  }
}

module.exports = Config;