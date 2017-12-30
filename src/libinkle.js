const _ = require('lodash');

/**
 * story model
 * */
var storyModel = function( string  ) {
    this.story =  JSON.parse( string )
    this.stitches = this.story.data.stitches;
    this.stats = {
        updatedAt: this.story.updated_at,
        title: this.story.title,
        initial: this.story.data.initial,
        stitchesCount:  _.size( this.stitches ),
    };
    var stitches = this.story.data.stitches
    var stitchesKeys = _.keys(this.story.data.stitches).sort()
    return this;
}

storyModel.prototype.getStitch = function( stitch_name ){
    if( _.has( this.story.data.stitches, stitch_name )){
        return new stitchModel( this.story.data.stitches[stitch_name], stitch_name  );
    }
    throw `no stitch found for ${stitch_name}`
}

/**
 * stitch model
 * */
var stitchModel = function( stitch, name  ){
    var content = stitch.content
    this.name = name || 'unknown';
    this.isFinal = function(){
        return content.length == 1;
    }
    this.isChoice = function(){
        return content.length > 1 && ! _.has( content[1], 'divert');
    }
    this.nextStitch = function(){
        return content[1]['divert'];
    }
    this.getText = function(){
        return content[0]
    }
    this.getChoices = function(){
        var choicesList = [];
        for( i=1; i < content.length; i++){
            choicesList[content[i]['linkPath']] = content[i]['option'];
        }
        return choicesList;
    }
    return this;
}

/**
 * agent
 * */
inkle = function( options ){
    _.assign( this, options );
    var text = null;
    var choicesList = null;
    var story = this.story||null;
    if( _.has( this, 'source' ) ){
        this.story = new storyModel( this.source);
    }
}

inkle.prototype.parse = function( string ){
    const story = new storyModel( string );
    return story;
}

inkle.prototype.stats = function( story ){
    var story = ( typeof story == 'string' ) ? inkle.prototype.parse(story):story;
    var stats = story.stats;
    return stats;
}
inkle.prototype.start = function(){
    const initial = this.story.getStitch( this.story.stats.initial );
    this.currentStitches = this.getAllStitches( initial );
    return true;
}
inkle.prototype.start = function( stitch_name ){
    stitch_name = stitch_name || this.story.stats.initial;
    const initial = this.story.getStitch( stitch_name );
    this.currentStitches = this.getAllStitches( initial );
    return true;
}

inkle.prototype.getAllStitches = function(currentStitch){
    var final = false
    var choice = false
    this.paragraphList = [];
    this.choicesList = [];
    var nextStitch = '';
    while ( final === false && choice === false ){
        this.paragraphList.push( currentStitch.getText() );
        if( currentStitch.isChoice() ){
            choice = true;
            this.choicesList = currentStitch.getChoices();
        }
        else if( currentStitch.isFinal() ){
            final = true;
        }else{
            nextStitch = currentStitch.nextStitch();
            currentStitch = this.story.getStitch( nextStitch )
        }
    }
    return true;
}

inkle.prototype.getText = function(){
    return this.paragraphList;
}

inkle.prototype.getChoices = function(){
    return this.choicesList;
}

inkle.prototype.choose = function( stitch_name ){
    return this.start(stitch_name);
}



module.exports = inkle;
