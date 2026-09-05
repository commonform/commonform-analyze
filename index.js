import * as predicate from 'commonform-predicate'

const withPath = function (result, type, key, path) {
  const hasType = Object.hasOwn(result, type)
  if (hasType && Object.hasOwn(result[type], key)) {
    result[type][key].push(path)
  } else {
    result[type][key] = [path]
  }
  return result
}

const propertyNames = ['definition', 'blank', 'reference', 'use']

function recurse (form, result, path) {
  return form.content.reduce(function (result, element, index) {
    let elementPath
    let target
    let plural
    let heading
    if (predicate.text(element)) {
      return result
    } else {
      const name = propertyNames.find(function (name) {
        return Object.hasOwn(element, name)
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
        if (Object.hasOwn(element, 'heading')) {
          heading = element.heading
          result = withPath(result, 'headings', heading, elementPath)
        }
        const contentPath = elementPath.concat('form')
        return recurse(element.form, result, contentPath)

      // Components
      } else if (predicate.component(element)) {
        elementPath = path.concat('content', index)
        // Heading, if any
        if (Object.hasOwn(element, 'heading')) {
          heading = element.heading
          result = withPath(result, 'headings', heading, elementPath)
        }
        // Iterate substitutions, treating them as uses and references.
        const substitutions = element.substitutions
        Object.keys(substitutions.terms).forEach(function (key) {
          const substitute = substitutions.terms[key]
          const substitutePath = path.concat(
            'content', index, 'substitutions', 'terms', substitute
          )
          result = withPath(result, 'uses', substitute, substitutePath)
        })
        Object.keys(substitutions.headings).forEach(function (key) {
          const substitute = substitutions.headings[key]
          const substitutePath = path.concat(
            'content', index, 'substitutions', 'headings', substitute
          )
          result = withPath(result, 'headings', substitute, substitutePath)
        })
        result.components.push(
          [
            {
              component: element.component,
              version: element.version,
              substitutions: structuredClone(element.substitutions)
            },
            elementPath
          ]
        )
        return result
      } else {
        return result
      }
    }
  }, result)
}

function sortComponents (a, b) {
  const keyOrder = ['component', 'version']
  for (let index = 0; index < keyOrder.length; index++) {
    const key = keyOrder[index]
    const comparison = a[0][key].localeCompare(b[0][key])
    if (comparison === 0 && index < (keyOrder.length - 1)) {
      continue
    } else {
      return comparison
    }
  }
}

export default function (form) {
  const result = recurse(
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
