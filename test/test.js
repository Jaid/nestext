import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: nestext} = indexModule

it("Basic", () => {
  const result = nestext({
    text: "hello",
  })
  expect(result).toBe("hello")
})

it("With context", () => {
  const context = {
    bananas: 4,
  }
  const result = nestext({
    text: "There are {{count bananas 'banana'}}.",
  }, context)
  expect(result).toBe("There are 4 bananas.")
})

it("Nested", () => {
  const context = {
    bananas: 4,
  }
  const result = nestext({
    text: "There are {{bananas}} bananas.",
    name: "",
  }, context)
  expect(result).toBe("There are 4 bananas.")
})