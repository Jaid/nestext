/** @module nestext */

import Handlebars from "handlebars"
import mapObject from "map-obj"
import {isString, isFunction, isArray, sample, omit} from "lodash"
import handlebarsHelperPlural from "handlebars-helper-plural"

const handlebars = Handlebars.create()

handlebars.registerHelper("count", handlebarsHelperPlural)

const compileTemplate = templateString => {
  return handlebars.compile(templateString, {
    noEscape: true,
  })
}

const processFragment = fragment => {
  if (fragment |> isString) {
    return compileTemplate(fragment)
  }
  if (fragment |> isFunction) {
    return fragment
  }
  if (fragment |> isArray) {
    return () => fragment.map(x => processFragment(x))[0](context)
  }
  return () => fragment
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
  const compiledTextFragments = mapObject(textFragments, (key, value) => {
    return [key, value |> processFragment]
  })
  return compiledTextFragments.text({
    ...context,
    ...omit(compiledTextFragments, "text"),
  })
}