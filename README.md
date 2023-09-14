# commonform-analyze

analyze relationships within [Common Forms](https://www.npmjs.com/package/commonform-validate)

```javascript
var analyze = require('commonform-analyze')
```

# Blanks

```javascript
var assert = require('assert')
assert.deepStrictEqual(
  analyze({ content: [{ blank: '' }] }).blanks,
  [['content', 0]],
  'reports blanks made'
)

assert.deepStrictEqual(
  analyze({ content: [{ form: { content: [{ blank: '' }] } }] }).blanks,
  [['content', 0, 'form', 'content', 0]],
  'reports nested blanks'
)

assert.deepStrictEqual(
  analyze({ content: [{ blank: '' }, { blank: '' }] }).blanks,
  [['content', 0], ['content', 1]],
  'reports multiple blanks'
)
```

# Definitions

```javascript
assert.deepStrictEqual(
  analyze({ content: [{ definition: 'Agreement' }] }).definitions,
  { Agreement: [['content', 0]] },
  'reports term definitions'
)

assert.deepStrictEqual(
  analyze({
    content: [
      { definition: 'Agreement' },
      { form: { content: [{ definition: 'Termination' }] } }
    ]
  }).definitions,
  {
    Agreement: [['content', 0]],
    Termination: [['content', 1, 'form', 'content', 0]]
  },
  'reports nested definitions'
)

assert.deepStrictEqual(
  analyze({
    content: [
      { definition: 'Agreement' },
      { definition: 'Agreement' }
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
assert.deepStrictEqual(
  analyze({
    content: [{ heading: 'Price', form: { content: ['x'] } }]
  }).headings,
  { Price: [['content', 0]] },
  'reports headings used'
)

assert.deepStrictEqual(
  analyze({
    content: [
      {
        form: {
          content: [
            {
              heading: 'Price',
              form: { content: ['test'] }
            }
          ]
        }
      }
    ]
  }).headings,
  { Price: [['content', 0, 'form', 'content', 0]] },
  'reports nested headings'
)

assert.deepStrictEqual(
  analyze({
    content: [
      { heading: 'Price', form: { content: ['test'] } },
      { heading: 'Price', form: { content: ['test'] } }
    ]
  }).headings,
  { Price: [['content', 0], ['content', 1]] },
  'reports multiple paths for >1'
)
```

# References

```javascript
assert.deepStrictEqual(
  analyze({ content: [{ reference: 'Price' }] }).references,
  { Price: [['content', 0]] },
  'reports references made'
)

assert.deepStrictEqual(
  analyze({
    content: [{ form: { content: [{ reference: 'Price' }] } }]
  }).references,
  { Price: [['content', 0, 'form', 'content', 0]] },
  'reports nested references'
)

assert.deepStrictEqual(
  analyze({
    content: [{ reference: 'Price' }, { reference: 'Price' }]
  }).references,
  { Price: [['content', 0], ['content', 1]] },
  'reports multiple references'
)
```

# Uses

```javascript
assert.deepStrictEqual(
  analyze({ content: [{ use: 'Agreement' }] }).uses,
  { Agreement: [['content', 0]] },
  'reports term uses'
)

assert.deepStrictEqual(
  analyze({
    content: [
      { use: 'Agreement' },
      { form: { content: [{ use: 'Termination' }] } }
    ]
  }).uses,
  {
    Agreement: [['content', 0]],
    Termination: [['content', 1, 'form', 'content', 0]]
  },
  'reports nested uses'
)

assert.deepStrictEqual(
  analyze({
    content: [
      { use: 'Agreement' },
      { use: 'Agreement' }
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
  component: 'https://example.com/component',
  version: '1.0.0',
  substitutions: {
    terms: {
      'Licensor': 'Vendor',
      'Licensee': 'Customer',
      'Program': 'Software'
    },
    headings: {
      'Express Warranties': 'Guarantees'
    },
    blanks: {}
  }
}

var withHeading = Object.assign(
  { heading: 'Disclaimer' },
  component
)

assert.deepStrictEqual(
  analyze({ content: [withHeading] }).components,
  [[component, ['content', 0]]],
  'reports component uses'
)

assert.deepStrictEqual(
  analyze({ content: [withHeading] }).headings['Disclaimer'],
  [['content', 0]],
  'reports component heading'
)
```

# Ignores Links

```
assert.doesNotThrow(() => {
  analyze({ content: ['test'] })
}, 'no error')
```
