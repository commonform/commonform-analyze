var test = require('tape');
var analyze = require('..');

test('References', function(test) {
  test.deepLooseEqual(
    analyze({content: [{reference: 'Price'}]})
      .references,
    {Price: [['content', 0]]},
    'reports references made');

  test.deepLooseEqual(
    analyze({content: [{form: {content: [{reference: 'Price'}]}}]})
      .references,
    {Price: [['content', 0, 'form', 'content', 0]]},
    'reports nested references');

  test.deepLooseEqual(
    analyze({content: [{reference: 'Price'}, {reference: 'Price'}]})
      .references,
    {Price: [['content', 0], ['content', 1]]},
    'reports multiple references');

  test.end();
});
