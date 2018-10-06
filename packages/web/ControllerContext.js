"use strict";

const express = require("express");

class ControllerContext {

  /**
   * @param {express.Request} request 
   * @param {express.Response} response 
   */
  set(request, response) {
    this.request = request;
    this.response = response;
  }
}

module.exports = ControllerContext;
