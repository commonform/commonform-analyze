```javascript
var analyze = require('commonform-analyze')
```

# Blanks

```javascript
var assert = require('assert')
assert.deepEqual(
  analyze({content: [{blank: ''}]}).blanks,
  [['content', 0]],
  'reports blanks made'
)

assert.deepEqual(
  analyze({content: [{form: {content: [{blank: ''}]}}]}).blanks,
  [['content', 0, 'form', 'content', 0]],
  'reports nested blanks'
)

assert.deepEqual(
  analyze({content: [{blank: ''}, {blank: ''}]}).blanks,
  [['content', 0], ['content', 1]],
  'reports multiple blanks'
)
```

# Definitions

```javascript
assert.deepEqual(
  analyze({content: [{definition: 'Agreement'}]}).definitions,
  {Agreement: [['content', 0]]},
  'reports term definitions'
)

assert.deepEqual(
  analyze({
    content: [
      {definition: 'Agreement'},
      {form: {content: [{definition: 'Termination'}]}}
    ]
  }).definitions,
  {
    Agreement: [['content', 0]],
    Termination: [['content', 1, 'form', 'content', 0]]
  },
  'reports nested definitions'
)

assert.deepEqual(
  analyze({
    content: [
      {definition: 'Agreement'},
      {definition: 'Agreement'}
    ]
  }).definitions,
  {
    Agreement: [
      ['content', 0],
      ['content', 1]
    ]
  },
  'reports multiple paths for >1 definitions'
)
```

# Headings

```javascript
assert.deepEqual(
  analyze({
    content: [{heading: 'Price', form: {content: ['x']}}]
  }).headings,
  {Price: [['content', 0]]},
  'reports headings used'
)

assert.deepEqual(
  analyze({
    content: [
      {
        form: {
          content: [
            {
              heading: 'Price',
              form: {content: ['test']}
            }
          ]
        }
      }
    ]
  }).headings,
  {Price: [['content', 0, 'form', 'content', 0]]},
  'reports nested headings'
)

assert.deepEqual(
  analyze({
    content: [
      {heading: 'Price', form: {content: ['test']}},
      {heading: 'Price', form: {content: ['test']}}
    ]
  }).headings,
  {Price: [['content', 0], ['content', 1]]},
  'reports multiple paths for >1'
)
```

# References

```javascript
assert.deepEqual(
  analyze({content: [{reference: 'Price'}]}).references,
  {Price: [['content', 0]]},
  'reports references made'
)

assert.deepEqual(
  analyze({
    content: [{form: {content: [{reference: 'Price'}]}}]
  }).references,
  {Price: [['content', 0, 'form', 'content', 0]]},
  'reports nested references'
)

assert.deepEqual(
  analyze({
    content: [{reference: 'Price'}, {reference: 'Price'}]
  }).references,
  {Price: [['content', 0], ['content', 1]]},
  'reports multiple references'
)
```

# Uses

```javascript
assert.deepEqual(
  analyze({content: [{use: 'Agreement'}]}).uses,
  {Agreement: [['content', 0]]},
  'reports term uses'
)

assert.deepEqual(
  analyze({
    content: [
      {use: 'Agreement'},
      {form: {content: [{use: 'Termination'}]}}
    ]
  }).uses,
  {
    Agreement: [['content', 0]],
    Termination: [['content', 1, 'form', 'content', 0]]
  },
  'reports nested uses'
)

assert.deepEqual(
  analyze({
    content: [
      {use: 'Agreement'},
      {use: 'Agreement'}
    ]
  }).uses,
  {
    Agreement: [
      ['content', 0],
      ['content', 1]
    ]
  },
 'reports multiple paths for >1 uses'
)
```

# Components

```javascript
var component = {
  repository: 'api.commonform.org',
  publisher: 'kemitchell',
  project: 'orthodox-software-copyright-license',
  edition: '1e',
  upgrade: 'yes',
  substitutions: {
    terms: {
      'Licensor': 'Vendor',
      'Licensee': 'Customer',
      'Program': 'Software'
    },
    headings: {
      'Express Warranties': 'Guarantees'
    }
  }
}

var withHeading = Object.assign(
  {heading: 'Disclaimer'},
  component
)

assert.deepEqual(
  analyze({content: [withHeading]}).components,
  [[component, ['content', 0]]],
  'reports component uses'
)

assert.deepEqual(
  analyze({content: [withHeading]}).headings,
  {Disclaimer: [['content', 0]]},
  'reports component heading'
)
```

# Invalid Content

```javascript
assert.throws(
  function () {
    analyze({content: [{invalid: 'object'}]})
  },
  'Invalid form content object',
  'throws an error for invalid content'
)
```
