var Immutable = require('immutable');

var withPath = function(result, type, key, path) {
  var keyPath = [type, key];
  if (result.hasIn(keyPath)) {
    return result.updateIn(keyPath, function(paths) {
      return paths.push(path);
    });
  } else {
    return result.setIn(keyPath, Immutable.List([path]));
  }
};

var propertyNames = Immutable.List([
  'definition', 'field', 'reference', 'use'
]);

var analyze = function recurse(form, result, path) {
  return form.get('content').reduce(function(result, element, index) {
    var elementPath;
    var target;
    var plural;
    if (typeof element === 'string') {
      return result;
    } else {
      var name = propertyNames.find(function(name) {
        return element.has(name);
      });
      if (name) {
        plural = name + 's';
        elementPath = path.push('content', index);
        target = element.get(name);
        return withPath(result, plural, target, elementPath);
      } else if (element.has('form')) {
        elementPath = path.push('content', index);
        if (element.has('summary')) {
          var summary = element.get('summary');
          result = withPath(result, 'summaries', summary, elementPath);
        }
        var contentPath = elementPath.push('form');
        return recurse(element.get('form'), result, contentPath);
      } else {
        throw new Error('Invalid form content object');
      }
    }
  }, result);
};

var emptyMap = Immutable.Map();

var resultsTemplate = Immutable.Map({
  definitions: emptyMap,
  uses: emptyMap,
  summaries: emptyMap,
  references: emptyMap,
  fields: emptyMap
});

var rootPath = Immutable.List();

module.exports = function(form) {
  return analyze(form, resultsTemplate, rootPath);
};

module.exports.version = '0.2.0';
