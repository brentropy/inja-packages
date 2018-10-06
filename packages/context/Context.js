"use strict";

const uuidv4 = require("uuid/v4");
const Container = require("@inja/container");

/**
 * Context allows multiple related services to be resolved with a shared
 * transient lifetime.
 */
class Context {
  static inject(provide, lifetime) {
    return [provide.resolve, provide(lifetime), provide(uuidv4)];
  }

  /**
   * 
   * @param {Function=} resolve 
   * @param {Container.Lifetime=} lifetime 
   * @param {function():string=} generateId
   */
  constructor(resolve, lifetime, generateId) {
    this._resolve = resolve;
    this._lifetime = lifetime;
    this.id = generateId();
  }

  /**
   * Resolve a provider withing this context.
   * 
   * @param {Container.Provider<T>} provider
   * @return {T}
   * @template T
   */
  resolve(provider) {
    return this._resolve(provider, this._lifetime);
  }
}

module.exports = Context;
