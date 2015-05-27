var test = require('tape');
var analyze = require('..');

test('Blanks', function(test) {
  test.deepLooseEqual(
    analyze({content: [{blank: 'Seller'}]})
      .blanks,
    {Seller: [['content', 0]]},
    'reports blanks made');

  test.deepLooseEqual(
    analyze({content: [{form: {content: [{blank: 'Seller'}]}}]})
      .blanks,
    {Seller: [['content', 0, 'form', 'content', 0]]},
    'reports nested blanks');

  test.deepLooseEqual(
    analyze({content: [{blank: 'Date'}, {blank: 'Date'}]})
      .blanks,
    {Date: [['content', 0], ['content', 1]]},
    'reports multiple blanks');

  test.end();
});

