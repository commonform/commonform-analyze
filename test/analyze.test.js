/* jshint mocha: true */
var expect = require('chai').expect;
var analyze = require('..');

describe('analyze', function() {
  it('is a function', function() {
    expect(
      analyze
    ).to.be.a('function');
  });

  it('produces an object', function() {
    expect(
      analyze({content: ['test']})
    ).to.be.an('object');
  });

  describe('of definitions', function() {
    it('produces an object', function() {
      expect(
        analyze({content: ['test']})
          .definitions
      ).to.be.an('object');
    });

    it('reports term definitions', function() {
      expect(
        analyze({
          content: [
            {definition: 'Agreement'}]})
          .definitions
      ).to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested definitions', function() {
      expect(
        analyze({
          content: [
            {definition: 'Agreement'},
            {form: {content: [{definition: 'Termination'}]}}]})
          .definitions
      ).to.eql({
        Agreement: [['content', 0]],
        Termination: [['content', 1, 'form', 'content', 0]]});
    });

    it('reports multiple paths for >1 definitions', function() {
      expect(
        analyze({
          content: [
            {definition: 'Agreement'},
            {definition: 'Agreement'}]})
          .definitions
      ).to.eql({
        Agreement: [
          ['content', 0],
          ['content', 1]]});
    });
  });

  describe('of term uses', function() {
    it('produces an object', function() {
      expect(
        analyze({content: ['test']}).uses
      ).to.be.an('object');
    });

    it('reports term uses', function() {
      expect(
        analyze({content: [{use: 'Agreement'}]}).uses
      ).to.eql({Agreement: [['content', 0]]});
    });

    it('reports nested uses', function() {
      expect(
        analyze({
          content: [
            {use: 'Agreement'},
            {form: {content: [{use: 'Termination'}]}}]})
          .uses
      ).to.eql({
        Agreement: [['content', 0]],
        Termination: [['content', 1, 'form', 'content', 0]]});
    });

    it('reports multiple paths for >1 uses', function() {
      expect(
        analyze({
          content: [
            {use: 'Agreement'},
            {use: 'Agreement'}]})
          .uses
      ).to.eql({
        Agreement: [
          ['content', 0],
          ['content', 1]]});
    });
  });

  describe('of child headings', function() {
    it('produces an object', function() {
      expect(
        analyze({content: ['test']})
          .headings
      ).to.be.an('object');
    });

    it('reports headings used', function() {
      expect(
        analyze({
          content: [
            {
              heading: 'Indemnity',
              form: {content:['test']}}]})
          .headings
      ).to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested headings', function() {
      expect(
        analyze({
          content: [
            {
              form: {
                content: [
                  {
                    heading: 'Indemnity',
                    form: {content:['test']}}]}}]})
          .headings
      ).to.eql({
        Indemnity: [['content', 0, 'form', 'content', 0]]});
    });

    it('reports multiple paths for >1', function() {
      expect(
        analyze({
          content: [
            {
              heading: 'Indemnity',
              form: {content:['test']}},
            {
              heading: 'Indemnity',
              form: {content:['test']}}]})
          .headings
      ).to.eql({
        Indemnity: [
          ['content', 0],
          ['content', 1]]});
    });
  });

  describe('of references', function() {
    it('produces an object', function() {
      expect(
        analyze({content: ['test']})
          .references
      ).to.be.an('object');
    });

    it('reports references made', function() {
      expect(
        analyze({
          content: [
            {reference: 'Indemnity'}]})
          .references
      ).to.eql({Indemnity: [['content', 0]]});
    });

    it('reports nested references', function() {
      expect(
        analyze({
          content: [
            {
              form: {
                content: [
                  {reference: 'Indemnity'}]}}]})
          .references
      ).to.eql({
        Indemnity: [['content', 0, 'form', 'content', 0]]});
    });

    it('reports multiple references', function() {
      expect(
        analyze({
          content: [
            {reference: 'Indemnity'},
            {reference: 'Indemnity'}]})
          .references
      ).to.eql({
        Indemnity: [
          ['content', 0],
          ['content', 1]]});
    });
  });

  describe('of blanks', function() {
    it('produces an object', function() {
      expect(
        analyze({content: ['test']})
          .blanks
      ).to.be.an('object');
    });

    it('reports blanks made', function() {
      expect(
        analyze({
          content: [
            {blank: 'Seller'}]})
          .blanks
      ).to.eql({Seller: [['content', 0]]});
    });

    it('reports nested blanks', function() {
      expect(
        analyze({
          content: [
            {
              form: {
                content: [
                  {blank: 'Seller'}]}}]})
          .blanks
      ).to.eql({
        Seller: [['content', 0, 'form', 'content', 0]]});
    });

    it('reports multiple blanks', function() {
      expect(
        analyze({
          content: [
            {blank: 'Seller'},
            {blank: 'Seller'}]})
          .blanks
      ).to.eql({
        Seller: [
          ['content', 0],
          ['content', 1]]});
    });
  });

  describe('of invalid content objects', function() {
    it('throws an error', function() {
      expect(
        function() {
          analyze({
            content: [
              {invalid: 'object'}]});
        }
      ).to.throw('Invalid form content object');
    });
  });
});
