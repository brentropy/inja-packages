// @ts-nocheck
"use strict";

const Config = require("./Config");

test("reads nested paths from config", () => {
  const c = new Config();
  c.setConfig(() => ({ a: { b: { c: 123 } } }));
  expect(c.require("a.b.c")).toBe(123);
})