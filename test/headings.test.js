var test = require('tape');
var analyze = require('..');

test('Headings', function(test) {
  test.deepLooseEqual(
    analyze({content: [{heading: 'Price', form: {content:['test']}}]})
      .headings,
    {Price: [['content', 0]]},
    'reports headings used');

  test.deepLooseEqual(
    analyze({
      content: [
        {
          form: {
            content: [{heading: 'Price', form: {content:['test']}}]}}]})
      .headings,
    {Price: [['content', 0, 'form', 'content', 0]]},
    'reports nested headings');

  test.deepLooseEqual(
    analyze({
      content: [
        {heading: 'Price', form: {content:['test']}},
        {heading: 'Price', form: {content:['test']}}]})
      .headings,
    {Price: [['content', 0], ['content', 1]]},
    'reports multiple paths for >1');

  test.end();
});
