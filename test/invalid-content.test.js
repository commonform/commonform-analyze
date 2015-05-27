var test = require('tape');
var analyze = require('..');

test('Invalid Content', function(test) {
  test.throws(
    function() { analyze({content: [{invalid: 'object'}]}); },
    'Invalid form content object',
    'throws an error for invalid content');

  test.end();
});
