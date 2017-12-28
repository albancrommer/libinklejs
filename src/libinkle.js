const _ = require('lodash');
libinkle = {}


/** story model **/
var storyModel = function( string  ) {
    this.story =  JSON.parse( string )
    this.stitches = this.story.data.stitches;
    this.stats = {
        updatedAt: this.story.updated_at,
        title: this.story.title,
        initial: this.story.data.initial,
        stitchesCount:  _.size( this.stitches ),
    };
    return this
}

storyModel.prototype.getStitch = function( stitch_name ){
    if( _.has( stitch_name, this.story.data )){
        return new stitchModel( this.story.data.stitch_name );
    }
}

/** stitch model **/
var stitchModel = function( stitch ){
    return this;
}


/** agent **/
libinkle.agent = function( options ){
    _.assign( this, options );
    var state = this.state||null;
    var story = this.story||null;
    if( _.has( this, 'source' ) ){
        this.story = new storyModel( this.source);
    }
}

libinkle.agent.prototype.parse = libinkle.parse;
libinkle.agent.prototype.stats = libinkle.stats;

libinkle.agent.prototype.get = function( stitch_name ){
    var stitch = this.story.getStitch( stitch_name );
    return stitch;
}

libinkle.parse = function( string ){
    const story = new storyModel( string );
    return story;
}

libinkle.stats = function( story ){
    var story = ( typeof story == 'string' ) ? libinkle.parse(story):story;
    var stats = story.stats;
    return stats;
}

module.exports = libinkle;
