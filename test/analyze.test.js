/* jshint mocha: true */
var expect = require('chai').expect;
var precompute = require('..');

var testProject = function(content, values) {
  return {
    commonform: '0.0.0',
    metadata: {title: 'Test'},
    preferences: {},
    values: values || {},
    form: {content: content}
  };
};

describe('analyze', function() {
  it('is a function', function() {
    expect(precompute)
      .to.be.a('function');
  });

  it('produces an object', function() {
    expect(precompute(testProject(['test'])))
      .to.be.an('object');
  });

  describe('of definitions', function() {
    it('produces an object', function() {
      expect(precompute(testProject(['test'])).definitions)
        .to.be.an('object');
    });

    it('reports term definitions', function() {
      expect(precompute(testProject([
        {definition: 'Agreement'}
      ])).definitions)
        .to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested definitions', function() {
      expect(precompute(testProject([
        {definition: 'Agreement'},
        {form: {content: [{definition: 'Termination'}]}}
      ])).definitions)
        .to.eql({
          Agreement: [['content', 0]],
          Termination: [['content', 1, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1 definitions', function() {
      expect(precompute(testProject([
        {definition: 'Agreement'},
        {definition: 'Agreement'}
      ])).definitions)
        .to.eql({
          Agreement: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });

  describe('of term uses', function() {
    it('produces an object', function() {
      expect(precompute(testProject(['test'])).uses)
        .to.be.an('object');
    });

    it('reports term uses', function() {
      expect(precompute(testProject([{use: 'Agreement'}])).uses)
        .to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested uses', function() {
      expect(precompute(testProject([
        {use: 'Agreement'},
        {form: {content: [{use: 'Termination'}]}}
      ])).uses)
        .to.eql({
          Agreement: [['content', 0]],
          Termination: [['content', 1, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1 uses', function() {
      expect(precompute(testProject([
        {use: 'Agreement'},
        {use: 'Agreement'}
      ])).uses)
        .to.eql({
          Agreement: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });

  describe('of sub-form summaries', function() {
    it('produces an object', function() {
      expect(precompute(testProject(['test'])).summaries)
        .to.be.an('object');
    });

    it('reports summaries used', function() {
      expect(precompute(testProject([
        {
          summary: 'Indemnity',
          form: {content:['test']}
        }
      ])).summaries)
        .to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested summaries', function() {
      expect(precompute(testProject([
        {
          form: {
            content: [
              {
                summary: 'Indemnity',
                form: {content:['test']}
              }
            ]
          }
        }
      ])).summaries)
        .to.eql({
          Indemnity: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1', function() {
      expect(precompute(testProject([
        {
          summary: 'Indemnity',
          form: {content:['test']}
        },
        {
          summary: 'Indemnity',
          form: {content:['test']}
        }
      ])).summaries)
        .to.eql({
          Indemnity: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });

  describe('of references', function() {
    it('produces an object', function() {
      expect(precompute(testProject(['test'])).references)
        .to.be.an('object');
    });

    it('reports references made', function() {
      expect(precompute(testProject([
        {reference: 'Indemnity'}
      ])).references)
        .to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested references', function() {
      expect(precompute(testProject([
        {
          form: {
            content: [
              {reference: 'Indemnity'}
            ]
          }
        }
      ])).references)
        .to.eql({
          Indemnity: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple references', function() {
      expect(precompute(testProject([
        {reference: 'Indemnity'},
        {reference: 'Indemnity'}
      ])).references)
        .to.eql({
          Indemnity: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });

  describe('of fields', function() {
    it('produces an object', function() {
      expect(precompute(testProject(['test'])).fields)
        .to.be.an('object');
    });

    it('reports fields made', function() {
      expect(precompute(testProject([
        {field: 'Seller'}
      ])).fields)
        .to.eql({Seller: [['content', 0]]});
    });

    it('reports nested fields', function() {
      expect(precompute(testProject([
        {
          form: {
            content: [
              {field: 'Seller'}
            ]
          }
        }
      ])).fields)
        .to.eql({
          Seller: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple fields', function() {
      expect(precompute(testProject([
        {field: 'Seller'},
        {field: 'Seller'}
      ])).fields)
        .to.eql({
          Seller: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });
});
