const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const libinkle = require('../src/libinkle');
const expect    = require("chai").expect;
const assert = require('assert');
const buf = fs.readFileSync(path.resolve( __dirname, 'stories/8v99.json'));
describe('General functions', function() {
    it('should return an object', function(){
        const inkle = new libinkle();
        const story = inkle.parse(buf.toString());
        expect(story).to.be.an('object')
       }
      )
    it('should return stats given a string', function(){
        const inkle = new libinkle();
        const stats  = inkle.stats(buf.toString());
        expect(stats).to.be.an('object')
       }
      )
    it('should return stats given an object', function(){
        const inkle = new libinkle();
        const story = inkle.parse(buf.toString());
        const stats  = inkle.stats(story);
        expect(stats).to.be.an('object')
        expect(stats.title).to.be.a('string')
        expect(stats.initial).to.be.a('string')
       }
    )
});
describe('Story running', function() {

    it('should return a story master', function(){
        const inkle = new libinkle({name:"name"});
        expect(inkle).to.be.an('object')
        expect(inkle.name).to.be.a('string')
       }
   )
    it('should return a story from string', function(){
        const inkle = new libinkle({source:buf.toString()});
        expect(inkle.story).to.be.an('object')
       }
   )
    it('should return an initial stitch', function(){
        const inkle = new libinkle({source:buf.toString()});
        const initial = inkle.story.stats.initial;
        expect(initial).to.be.a('string')
        const stitch = inkle.story.getStitch(initial);
        expect(stitch).to.be.an('object')
       }
   )
    it('should start the story', function(){
        const inkle = new libinkle({source:buf.toString()});
        var success = inkle.start();
        expect(success).to.be.equal(true,success)
        var paragraphList = inkle.getText();
        expect(paragraphList).to.be.an('array')
        var choicesList = inkle.getChoices();
        expect(choicesList).to.be.an('array')
       }
   )
    it('should iterate through the story', function(){
        const inkle = new libinkle({source:buf.toString()});
        inkle.start();
        const choicesList = inkle.getChoices();
        const choice = _.keys(choicesList)[0]
        expect(choice).to.be.an('string')
        const success = inkle.choose(choice)
        assert.deepEqual( _.keys(inkle.getChoices()), ['duHautDeSesMtres','vousRetournezSur'])
       }
   )
});





