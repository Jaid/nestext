import path from "path"

import Handlebars from "Handlebars"
import {sample} from "lodash"
import handlebarsHelperPlural from "handlebars-helper-plural"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: nestext} = indexModule

const handlebars = Handlebars.create()
handlebars.registerHelper("count", handlebarsHelperPlural)

it("Basic", () => {
  const result = nestext("hello")
  expect(result).toBe("hello")
})

it("With context", () => {
  const context = {
    bananas: 4,
    name: "Toph",
  }
  const result = nestext({
    text: "There are {{count bananas 'banana'}}, {{name}}!",
  }, context)
  expect(result).toBe("There are 4 bananas, Toph!")
})

it("Nested", () => {
  const context = {
    bananas: 4,
  }
  const result = nestext({
    text: "{{greeting}}, there are {{bananas}} bananas!",
    greeting: ["Hey {{name}}, my friend", "Hello, dear {{name}}"],
    name: ["John", "Lisa"],
  }, context)
  const possibleResults = [
    "Hey Lisa, my friend, there are 4 bananas!",
    "Hey John, my friend, there are 4 bananas!",
    "Hello, dear Lisa, there are 4 bananas!",
    "Hello, dear John, there are 4 bananas!",
  ]
  expect(possibleResults.includes(result)).toBeTruthy()
})

it("Making sure I understand Handlebars correctly", () => {
  expect(handlebars.compile("a")()).toBe("a")
  expect(handlebars.compile("{{a}}")({
    a: () => "x",
  })).toBe("x")
  expect(["a", "b"].includes(handlebars.compile("{{a}}")({
    a: () => sample(["a", "b"]),
  }))).toBeTruthy()
})