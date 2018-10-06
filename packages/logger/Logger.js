"use strict";

const Config = require("@inja/config");
const Context = require("@inja/context");

const ALL_LEVELS = ["trace", "info", "debug", "warn", "error", "fatal"];

class Logger {

  static inject(provide) {
    return [Config, Context, provide(console.log)];
  }

  /**
   * @param {Config=} config 
   * @param {Context=} context 
   * @param {function(string)=} write 
   */
  constructor(config, context, write) {
    this.config = config;
    this.context = context;
    this.write = write;
  }

  log(level, message, attrs) {
    if (this.config.get("logger.levels", ALL_LEVELS).includes(level)) {
      this.write(JSON.stringify({
        lvl: level.toUpperCase(),
        msg: message,
        ctx: this.context.id,
        ...attrs
      }));
    }
  }

  trace(message, attrs) {
    this.log("trace", message, attrs);
  }

  info(message, attrs) {
    this.log("info", message, attrs);
  }

  debug(message, attrs) {
    this.log("debug", message, attrs);
  }

  warn(message, attrs) {
    this.log("warn", message, attrs);
  }

  error(message, attrs) {
    this.log("error", message, attrs);
  }

  fatal(message, attrs) {
    this.log("fatal", message, attrs);
  }
}

module.exports = Logger;