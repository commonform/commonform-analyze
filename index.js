/* Copyright 2015 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var predicate = require('commonform-predicate')
var find = require('array-find')

var withPath = function(result, type, key, path) {
  var hasType = result.hasOwnProperty(type)
  if (hasType && result[type].hasOwnProperty(key)) {
    result[type][key].push(path) }
  else {
    result[type][key] = [path] }
  return result }

var propertyNames = [ 'definition', 'blank', 'reference', 'use' ]

var analyze = function recurse(form, result, path) {
  return form.content.reduce(function(result, element, index) {
    var elementPath
    var target
    var plural
    if (predicate.text(element)) {
      return result }
    else {
      var name = find(propertyNames, function(name) {
        return element.hasOwnProperty(name) })
      if (name) {
        plural = name + 's'
        elementPath = path.concat(['content', index])
        target = element[name]
        return withPath(result, plural, target, elementPath) }
      else if (predicate.child(element)) {
        elementPath = path.concat(['content', index])
        if (element.hasOwnProperty('heading')) {
          var heading = element.heading
          result = withPath(result, 'headings', heading, elementPath) }
        var contentPath = elementPath.concat(['form'])
        return recurse(element.form, result, contentPath) }
      else {
        throw new Error('Invalid form content object') } } },
  result) }

module.exports = function(form) {
  return analyze(
    form,
    { definitions: { },
      uses: { },
      headings: { },
      references: { },
      blanks: { } },
    [ ]) }
