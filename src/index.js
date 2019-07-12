/** @module nestext */

import Handlebars from "handlebars"
import {isString, isFunction, isArray, sample} from "lodash"
import handlebarsHelperPlural from "handlebars-helper-plural"

const handlebars = Handlebars.create()

handlebars.registerHelper("count", handlebarsHelperPlural)

const compileTemplate = templateString => {
  return handlebars.compile(templateString, {
    noEscape: true,
  })
}

/**
 * Returns a string
 * @function
 * @param {string|Object<string, string|function>} textFragments
 * @param {Object<string, *>} context
 * @returns {string}
 */
export default (textFragments, context) => {
  if (textFragments |> isString) {
    return compileTemplate(textFragments)(context)
  }

  const compiledTextFragments = {}
  const compiledContext = {}

  const processFragment = fragment => {
    if (fragment |> isString) {
      return compileTemplate(fragment)
    }
    if (fragment |> isFunction) {
      return fragment
    }
    if (fragment |> isArray) {
      return () => {
        const chosenEntry = sample(fragment)
        return processFragment(chosenEntry)(compiledContext)
      }
    }
    return fragment
  }

  for (const [key, value] of Object.entries(textFragments)) {
    if (key === "text") {
      continue
    }
    compiledTextFragments[key] = value |> processFragment
  }

  Object.assign(compiledContext, context, compiledTextFragments)
  const compiledText = processFragment(textFragments.text)(compiledContext)
  return compiledText
}