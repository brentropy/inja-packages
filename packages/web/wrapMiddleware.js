"use strict";

const Controller = require("./Controller");

function provideMiddleware(middleware) {
  return class extends Controller {

    static get singleton() {
      return true;
    }

    handle() {
      return new Promise((resolve, reject) => {
        middleware(this.request, this.response, err => {
          if (err) {
            return reject(err);
          }
          resolve();
        })
      });
    }
  }
}

module.exports = provideMiddleware;
