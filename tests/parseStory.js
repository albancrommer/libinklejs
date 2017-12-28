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
        expect(stats.initial).to.be.a('string')
       }
      )

});
describe('Agent', function() {

    it('should return an agent', function(){
        const agent = new libinkle.agent({name:"name"});
        expect(agent).to.be.an('object')
        expect(agent.name).to.be.a('string')
       }
   )
    it('should return a story from string', function(){
        const agent = new libinkle.agent({source:buf.toString()});
        expect(agent.story).to.be.an('object')
       }
   )
    it('should return an initial stitch', function(){
        const agent = new libinkle.agent({source:buf.toString()});
        expect(agent.story.stats.initial).to.be.a('string')

       }
   )


});





