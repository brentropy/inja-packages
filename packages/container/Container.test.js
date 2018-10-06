"use strict";

const Container = require("./Container");

test("returns an instance", () => {
  const c = new Container();
  class Foo {}
  const f = c.resolve(Foo);
  expect(f).toBeInstanceOf(Foo);
});