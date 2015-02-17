/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var analyze = require('..');

var formWith = function(content) {
  return Immutable.fromJS({
    content: content
  });
};

describe('analyze', function() {
  it('is a function', function() {
    expect(analyze)
      .to.be.a('function');
  });

  it('produces an object', function() {
    expect(analyze(formWith(['test'])))
      .to.be.an('object');
  });

  describe('of definitions', function() {
    it('produces an object', function() {
      expect(analyze(formWith(['test'])).get('definitions').toJS())
        .to.be.an('object');
    });

    it('reports term definitions', function() {
      expect(analyze(formWith([
        {definition: 'Agreement'}
      ])).get('definitions').toJS())
        .to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested definitions', function() {
      expect(analyze(formWith([
        {definition: 'Agreement'},
        {form: {content: [{definition: 'Termination'}]}}
      ])).get('definitions').toJS())
        .to.eql({
          Agreement: [['content', 0]],
          Termination: [['content', 1, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1 definitions', function() {
      expect(analyze(formWith([
        {definition: 'Agreement'},
        {definition: 'Agreement'}
      ])).get('definitions').toJS())
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
      expect(analyze(formWith(['test'])).get('uses').toJS())
        .to.be.an('object');
    });

    it('reports term uses', function() {
      expect(analyze(formWith([{use: 'Agreement'}])).get('uses').toJS())
        .to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested uses', function() {
      expect(analyze(formWith([
        {use: 'Agreement'},
        {form: {content: [{use: 'Termination'}]}}
      ])).get('uses').toJS())
        .to.eql({
          Agreement: [['content', 0]],
          Termination: [['content', 1, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1 uses', function() {
      expect(analyze(formWith([
        {use: 'Agreement'},
        {use: 'Agreement'}
      ])).get('uses').toJS())
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
      expect(analyze(formWith(['test'])).get('summaries').toJS())
        .to.be.an('object');
    });

    it('reports summaries used', function() {
      expect(analyze(formWith([
        {
          summary: 'Indemnity',
          form: {content:['test']}
        }
      ])).get('summaries').toJS())
        .to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested summaries', function() {
      expect(analyze(formWith([
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
      ])).get('summaries').toJS())
        .to.eql({
          Indemnity: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple paths for >1', function() {
      expect(analyze(formWith([
        {
          summary: 'Indemnity',
          form: {content:['test']}
        },
        {
          summary: 'Indemnity',
          form: {content:['test']}
        }
      ])).get('summaries').toJS())
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
      expect(analyze(formWith(['test'])).get('references').toJS())
        .to.be.an('object');
    });

    it('reports references made', function() {
      expect(analyze(formWith([
        {reference: 'Indemnity'}
      ])).get('references').toJS())
        .to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested references', function() {
      expect(analyze(formWith([
        {
          form: {
            content: [
              {reference: 'Indemnity'}
            ]
          }
        }
      ])).get('references').toJS())
        .to.eql({
          Indemnity: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple references', function() {
      expect(analyze(formWith([
        {reference: 'Indemnity'},
        {reference: 'Indemnity'}
      ])).get('references').toJS())
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
      expect(analyze(formWith(['test'])).get('fields').toJS())
        .to.be.an('object');
    });

    it('reports fields made', function() {
      expect(analyze(formWith([
        {field: 'Seller'}
      ])).get('fields').toJS())
        .to.eql({Seller: [['content', 0]]});
    });

    it('reports nested fields', function() {
      expect(analyze(formWith([
        {
          form: {
            content: [
              {field: 'Seller'}
            ]
          }
        }
      ])).get('fields').toJS())
        .to.eql({
          Seller: [['content', 0, 'form', 'content', 0]]
        });
    });

    it('reports multiple fields', function() {
      expect(analyze(formWith([
        {field: 'Seller'},
        {field: 'Seller'}
      ])).get('fields').toJS())
        .to.eql({
          Seller: [
            ['content', 0],
            ['content', 1]
          ]
        });
    });
  });

  describe('of invalid content objects', function() {
    it('throws an error', function() {
      expect(function() {
        analyze(formWith([
          {invalid: 'object'}
        ]));
      })
        .to.throw('Invalid form content object');
    });
  });
});
