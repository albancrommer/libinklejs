const fs = require('fs');
const path = require('path');
const libinkle = require('../src/libinkle');
const expect    = require("chai").expect;
const assert = require('assert');
const buf = fs.readFileSync(path.resolve( __dirname, 'stories/8v99.json'));
describe('General functions', function() {
    it('should return an object', function(){
        const story = libinkle.parse(buf.toString());
        expect(story).to.be.an('object')
       }
      )
    it('should return stats given a string', function(){
        const stats  = libinkle.stats(buf.toString());
        expect(stats).to.be.an('object')
       }
      )
    it('should return stats given an object', function(){
        const story = libinkle.parse(buf.toString());
        const stats  = libinkle.stats(story);
        expect(stats).to.be.an('object')
        expect(stats.title).to.be.a('string')
       }
      )
});



