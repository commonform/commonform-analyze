var validate = require('commonform-validate');

var pushToKeyList = function(result, type, key, path) {
  var set = result[type];
  if (set.hasOwnProperty(key)) {
    set[key].push(path);
  } else {
    set[key] = [path];
  }
};

var analyze = function recurse(form, result, path) {
  form.content.forEach(function(element, index) {
    var elementPath;
    var target;
    if (validate.definition(element)) {
      elementPath = path.concat('content', index);
      target = element.definition;
      pushToKeyList(result, 'definitions', target, elementPath);
    } else if (validate.use(element)) {
      elementPath = path.concat('content', index);
      target = element.use;
      pushToKeyList(result, 'uses', target, elementPath);
    } else if (validate.reference(element)) {
      elementPath = path.concat('content', index);
      target = element.reference;
      pushToKeyList(result, 'references', target, elementPath);
    } else if (validate.field(element)) {
      elementPath = path.concat('content', index);
      target = element.field;
      pushToKeyList(result, 'fields', target, elementPath);
    } else if (validate.nestedSubForm(element)) {
      elementPath = path.concat('content', index);
      if (element.hasOwnProperty('summary')) {
        var summary = element.summary;
        pushToKeyList(result, 'summaries', summary, elementPath);
      }
      var contentPath = elementPath.concat('form');
      recurse(element.form, result, contentPath);
    }
  });
  return result;
};

module.exports = function(project) {
  var empty = {
    definitions: {},
    uses: {},
    summaries: {},
    references: {},
    fields: {}
  };
  return analyze(project.form, empty, []);
};

module.exports.version = '0.1.1';
