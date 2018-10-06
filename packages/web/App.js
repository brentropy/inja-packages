"use strict";

const Config = require("@inja/config");
const Exception = require("@inja/exception");
const ControllerContext = require("./ControllerContext");
const express = require("express");
const Context = require("@inja/context");
const ExceptionHandler = require("./ExceptionHandler");
const wrapMiddleware = require("./wrapMiddleware");
const { METHODS } = require("http");

/**
 * Wrapped express application.
 */
class App {
  static inject(provide) {
    return [Config, provide(express()), provide.factory(Context)];
  }

  /**
   * @param {Config=} config 
   * @param {express.Express=} app 
   * @param {function():Context=} createContext 
   */
  constructor(config, app, createContext) {
    this.config = config;
    this.createContext = createContext;
    this.app = app;
    this.registeredMiddlware = [];
    this.reqisteredExceptionHandlers = [];
    this.routeHelpers = {};

    for (const method of METHODS) {
      this.routeHelpers[method] = this.route.bind(this, method);
    }
  }

  use(handler) {
    const isExpress = handler.prototype.handle == null;
    if (this.registeredMiddlware.length === 0 && isExpress) {
      this.app.use(handler);
    } else if (isExpress) {
      this.registeredMiddlware.push(wrapMiddleware(handler));
    } else {
      this.registeredMiddlware.push(handler);
    }
  }

  route(method, path, Contorller, action) {
    this.app[method.toLowerCase()](path, this.handlerFor(Contorller, action));
  }

  routes(config) {
    config(this.routeHelpers);
  }

  port() {
    return this.config.get('app.port', 3000);
  }

  listen() {
    this.app.listen(this.port());
  }

  async middleware(context) {
    for (const handler of this.registeredMiddlware) {
      await context.resolve(handler).handle();
    }
  }

  handlerFor(Controller, action) {
    return async (request, response, next) => {
      const context = this.createContext();
      try {
        context.resolve(ControllerContext).set(request, response);
        await this.middleware(context);
        await context.resolve(Controller)[action]();
      } catch (err) {
        try {
          await this.handleException(err, context);
        } catch (err) {
          next(err)
        }
      }
    }
  }

  async handleException(err, context) {
    const handlers = [];
    if (err instanceof Exception && err.handler) {
      handlers.push(err.handler);
    }
    handlers.push(...this.reqisteredExceptionHandlers);
    handlers.push(ExceptionHandler);
    let nextErr = err;
    for (const handler of handlers) {
      try {
        await context.resolve(handler).handleException(nextErr);
      } catch(err) {
        nextErr = err
        continue;
      }
      return;
    }
    throw nextErr;
  }
} 

module.exports = App;
