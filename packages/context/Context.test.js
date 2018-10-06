"use strict";

const Context = require("./Context");
const Container = require("@inja/container");

test("resolve", () => {
  class Provider {}
  const c = new Container().resolve(Context);
  expect(c.resolve(Provider)).toBe(c.resolve(Provider));
})