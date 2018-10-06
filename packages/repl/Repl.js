"use strict";

const repl = require("repl");
const vm = require("vm");
const Config = require("@inja/config");
const Context = require("@inja/context");

class Repl {

  static inject(provide) {
    return [Config, Context, provide(repl.start)];
  }

  /**
   * @param {Config=} config 
   * @param {Context=} context 
   * @param {function(string | repl.ReplOptions): repl.REPLServer=} startRepl
   */
  constructor(config, context, startRepl) {
    this.config = config;
    this.context = context;
    this.startRepl = startRepl;
  }

  start() {
    const session = this.startRepl({
      prompt: "> ",
      eval: (cmd, context, _, callback) => {
        const result = vm.runInContext(cmd, context);
        if (result instanceof Promise) {
          result
            .then(val => callback(null, val))
            .catch(callback)
          return;
        }
        callback(null, result);
      }
    });
    const globalServices = this.config.get("repl.globalServices", {});
    Object.keys(globalServices).forEach(key => {
      session.context[key] = this.context.resolve(globalServices[key]);
    });
  }
}

module.exports = Repl;