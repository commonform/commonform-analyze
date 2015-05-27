var test = require('tape');
var analyze = require('..');

test('Uses', function(test) {
  test.deepLooseEqual(
    analyze({content: [{use: 'Agreement'}]})
      .uses,
    {Agreement: [['content', 0]]},
    'reports term uses');

  test.deepLooseEqual(
    analyze({
      content: [
        {use: 'Agreement'},
        {form: {content: [{use: 'Termination'}]}}]})
      .uses,
    {
      Agreement: [['content', 0]],
      Termination: [['content', 1, 'form', 'content', 0]]},
    'reports nested uses');

  test.deepLooseEqual(
    analyze({
      content: [
        {use: 'Agreement'},
        {use: 'Agreement'}]})
      .uses,
    {
      Agreement: [
        ['content', 0],
        ['content', 1]]},
   'reports multiple paths for >1 uses');

  test.end();
});

