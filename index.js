var predicate = require('commonform-predicate')
var has = require('has')

var withPath = function (result, type, key, path) {
  var hasType = has(result, type)
  if (hasType && has(result[type], key)) {
    result[type][key].push(path)
  } else {
    result[type][key] = [path]
  }
  return result
}

var propertyNames = ['definition', 'blank', 'reference', 'use']

var analyze = function recurse (form, result, path) {
  return form.content.reduce(function (result, element, index) {
    var elementPath
    var target
    var plural
    var heading
    if (predicate.text(element)) {
      return result
    } else {
      var name = propertyNames.find(function (name) {
        return has(element, name)
      })

      // Blanks
      if (name && name === 'blank') {
        result.blanks.push(path.concat('content', index))
        return result

      // Other Content Elements
      } else if (name) {
        plural = name + 's'
        elementPath = path.concat('content', index)
        target = element[name]
        return withPath(result, plural, target, elementPath)

      // Children
      } else if (predicate.child(element)) {
        elementPath = path.concat('content', index)
        // Heading, if any
        if (has(element, 'heading')) {
          heading = element.heading
          result = withPath(result, 'headings', heading, elementPath)
        }
        var contentPath = elementPath.concat('form')
        return recurse(element.form, result, contentPath)

      // Components
      } else if (predicate.component(element)) {
        elementPath = path.concat('content', index)
        // Heading, if any
        if (has(element, 'heading')) {
          heading = element.heading
          result = withPath(result, 'headings', heading, elementPath)
        }
        // Iterate substitutions, treating them as uses and references.
        var substitutions = element.substitutions
        Object.keys(substitutions.terms).forEach(function (key) {
          var substitute = substitutions.terms[key]
          var substitutePath = path.concat(
            'content', index, 'substitutions', 'terms', substitute
          )
          result = withPath(result, 'uses', substitute, substitutePath)
        })
        Object.keys(substitutions.headings).forEach(function (key) {
          var substitute = substitutions.headings[key]
          var substitutePath = path.concat(
            'content', index, 'substitutions', 'headings', substitute
          )
          result = withPath(result, 'headings', substitute, substitutePath)
        })
        result.components.push(
          [
            {
              repository: element.repository,
              publisher: element.publisher,
              project: element.project,
              edition: element.edition,
              upgrade: element.upgrade,
              substitutions: clone(element.substitutions)
            },
            elementPath
          ]
        )
        return result
      } else {
        throw new Error('Invalid form content object')
      }
    }
  }, result)
}

function sortComponents (a, b) {
  var keyOrder = ['repository', 'publisher', 'project', 'edition']
  for (var index = 0; index < keyOrder.length; index++) {
    var key = keyOrder[index]
    var comparison = a[0][key].localeCompare(b[0][key])
    if (comparison === 0 && index < (keyOrder.length - 1)) {
      continue
    } else {
      return comparison
    }
  }
}

module.exports = function (form) {
  var result = analyze(
    form,
    {
      definitions: {},
      uses: {},
      headings: {},
      references: {},
      blanks: [],
      components: []
    },
    []
  )
  result.components.sort(sortComponents)
  return result
}

function clone (argument) {
  return JSON.parse(JSON.stringify(argument))
}
