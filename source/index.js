var predicate = require('commonform-predicate');
var find = require('array-find');

var withPath = function(result, type, key, path) {
  var hasType = result.hasOwnProperty(type);
  if (hasType && result[type].hasOwnProperty(key)) {
    result[type][key].push(path);
  } else {
    if (!hasType) {
      result[type] = {};
    }
    result[type][key] = [path];
  }
  return result;
};

var propertyNames = ['definition', 'field', 'reference', 'use'];

var analyze = function recurse(form, result, path) {
  return form.content.reduce(function(result, element, index) {
    var elementPath;
    var target;
    var plural;
    if (predicate.text(element)) {
      return result;
    } else {
      var name = find(propertyNames, function(name) {
        return element.hasOwnProperty(name);
      });
      if (name) {
        plural = name + 's';
        elementPath = path.concat(['content', index]);
        target = element[name];
        return withPath(result, plural, target, elementPath);
      } else if (predicate.child(element)) {
        elementPath = path.concat(['content', index]);
        if (element.hasOwnProperty('heading')) {
          var heading = element.heading;
          result = withPath(result, 'headings', heading, elementPath);
        }
        var contentPath = elementPath.concat(['form']);
        return recurse(element.form, result, contentPath);
      } else {
        throw new Error('Invalid form content object');
      }
    }
  }, result);
};

module.exports = function(form) {
  return analyze(
    form,
    {
      definitions: {},
      uses: {},
      headings: {},
      references: {},
      fields: {}
    },
    []
  );
};

module.exports.version = '1.0.0-rc1';
