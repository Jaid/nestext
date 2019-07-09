import path from "path"

import {sample} from "lodash"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: nestext} = indexModule

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
  expect(result).toBe("There are 4 bananas")
})