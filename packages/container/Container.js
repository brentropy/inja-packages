"use strict";

/**
 * @typedef {Object} ClosureProvider<T>
 * @property {function():T} init
 * @property {?boolean} singleton
 * @property {?InjectFunc} inject
 * @template T
 */

/**
 * @typedef {function(new:T)} ClassProvider
 * @property {?boolean} singleton
 * @property {?InjectFunc} inject
 * @template T
 */

/**
 * @typedef {function(ProvideFunc<*>):Array<Provider<*>>} InjectFunc
 */

/**
 * @typedef {function(T):Provider<T>} ProvideFunc
 * @property {function(Provider<T>):function():T} factory
 * @property {function(Provider<T>, Lifetime):T} resovle
 * @template T
 */

/**
 * @typedef {(ClosureProvider<T>|ClassProvider<T>)} Provider<T>
 * @property {boolean} [singleton]
 * @property {function(ProvideFunc):Array<Provider<*>>} [inject]
 * @template T
 */

/**
 * @typedef {Map<Provider<*>, *>} Lifetime
 */

/**
 * Inja depenency injection container.
 */
class Container {

  constructor() {
    this._singletons = this._lifetime();
    this._overrides = new Map();
    this._provide = value => ({ init: () => value });
    // @ts-ignore
    this._provide.factory = (provider, lifetime) => this._provide(
      () => this.resolve(provider, lifetime)
    );
    // @ts-ignore
    this._provide.resolve = this._provide(this.resolve.bind(this));
  }

  /**
   * Resolve a provider and its dependencies returning a service.
   *
   * @param {Provider<T>} provider
   * @param {Lifetime} [transients]
   * @param {Provider<*>} [dependent]
   * @template T
   * @return {T}
   */
  resolve(provider, transients, dependent) {
    transients = transients || this._lifetime();
    provider = this.getImplementation(provider, dependent);
    // @ts-ignore
    /** @type {!{singleton: ?boolean, inject: ?Function}} */ const _provider = provider;
    const lifetime = _provider.singleton ? this._singletons : transients;
    let instance = lifetime.get(provider);
    if (!instance) {
      let deps = [];
      if (_provider.inject) {
        // @ts-ignore
        this._provide.defer = (provider) => {
          return this._provide(() => this.resolve(provider, lifetime));
        };
        deps = _provider.inject(this._provide, transients).map(
          dep => this.resolve(dep, transients, provider)
        );
        // @ts-ignore
        this._provide.defer = null;
      }
      if (typeof provider === "function") {
        // @ts-ignore
        instance = new provider(...deps);
      } else {
        // @ts-ignore
        instance = provider.init(...deps);
      }
      lifetime.set(provider, instance);
    }
    return instance;
  }

  /**
   * Supply a provider to use in place of another.
   * 
   * This may optionally be scoped to when it is resolved as a depenency of a
   * specific provider.
   *
   * @param {Provider<T>} iface Provider to replaced with other implementation.
   * @param {Provider<T>} provider Provider to be used 
   * @param {Provider<*>} [dependent] Scope to dependencies of this provider.
   * @template T
   */
  implement(iface, provider, dependent) {
    let override = this._overrides.get(iface);
    if (!override) {
      override = {
        scoped: new Map(),
        global: iface
      };
      this._overrides.set(iface, override);
    }
    if (dependent) {
      override.scoped.set(dependent, provider);
    } else {
      override.global = provider;
    }
  }

  /**
   * Get the concrete implementation of a provider.
   * 
   * A dependent provider may be given to check for scoped implementations
   * first.
   *
   * @param {Provider<T>} iface
   * @param {Provider<*>} [dependent]
   * @return {Provider<T>}
   * @template T
   */
  getImplementation(iface, dependent) {
    const override = this._overrides.get(iface);
    if (!override) {
      return iface;
    }
    if (dependent) {
      const scoped = override.scoped.get(dependent);
      if (scoped) {
        return scoped;
      }
    }
    return override.global;
  }

  /**
   * @private
   * @return {Lifetime}
   */
  _lifetime() {
    return new Map();
  }
}

module.exports = Container;
