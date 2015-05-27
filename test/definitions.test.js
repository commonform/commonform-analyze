var test = require('tape');
var analyze = require('..');

test('Definitions', function(test) {
  test.deepLooseEqual(
    analyze({content: [{definition: 'Agreement'}]})
      .definitions,
    {Agreement: [['content', 0]]},
    'reports term definitions');

  test.deepLooseEqual(
    analyze({
      content: [
        {definition: 'Agreement'},
        {form: {content: [{definition: 'Termination'}]}}]})
      .definitions,
    {
      Agreement: [['content', 0]],
      Termination: [['content', 1, 'form', 'content', 0]]},
    'reports nested definitions');

  test.deepLooseEqual(
    analyze({
      content: [
        {definition: 'Agreement'},
        {definition: 'Agreement'}]})
      .definitions,
    {
      Agreement: [
        ['content', 0],
        ['content', 1]]},
    'reports multiple paths for >1 definitions');

  test.end();
});

