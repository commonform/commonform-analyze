/* jshint mocha: true */
var expect = require('chai').expect;
var analyze = require('..');

describe('module', function() {
  it('exports a function', function() {
    expect(analyze).to.be.a('function');
  });

  it('returns objects', function() {
    expect(analyze({content: ['test']})).to.be.an('object');
  });
});
