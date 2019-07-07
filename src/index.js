/** @module nestext */

import Handlebars from "handlebars"
import mapObject from "map-obj"
import {isString, isFunction, isArrayLike, sample} from "lodash"
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
    const template = compileTemplate(fragment)
    return context => template(context)
  }
  if (fragment |> isFunction) {
    return fragment
  }
  if (fragment |> isArrayLike) {
    return () => sample(fragment.map(processFragment))
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
  return compiledTextFragments.text()
}