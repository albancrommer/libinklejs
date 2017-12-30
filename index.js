/**
 * The libinkle module component
 * 
 * Exports an object builder able to import, read and run through an inkle writer story
 * 
 * 
 * 
 * 
 * @type module
 */
const _ = require('lodash');

/**
 * Story Model
 * Encapsulates an inkle history metadata and stitches list
 * @param {string} string   Stringified JSON object
 * @class 
 */
var storyModel = function (string) {
    this.story = JSON.parse(string);
    this.stitches = this.story.data.stitches;
    /**
     * A simple object to access the critical story informations
     */
    this.stats = {
        updatedAt: this.story.updated_at,
        title: this.story.title,
        initial: this.story.data.initial,
        stitchesCount: _.size(this.stitches),
    };
    var stitches = this.story.data.stitches;
    var stitchesKeys = _.keys(this.story.data.stitches).sort();
    return this;
};
/*
 * Retrieve a single "stitch" by string
 * @method getStitch
 * @param {string} stitch_name
 * @returns {nm$_libinkle.stitchModel}
 */
storyModel.prototype.getStitch = function (stitch_name) {
    if (_.has(this.story.data.stitches, stitch_name)) {
        return new stitchModel(this.story.data.stitches[stitch_name], stitch_name);
    }
    msg = 'No stitch found for '+stitch_name;
    throw msg ;
};

/**
 * Encapsulates a single stitch
 * @class
 * @param {object} stitch A serialized stitch to be hydrated
 * @param {string} name the ID of the stitch
 */
var stitchModel = function (stitch, name) {

    var content = stitch.content;
    this.name = name || 'unknown';
    this.isFinal = function () {
        return content.length === 1;
    };
    this.isChoice = function () {
        return content.length > 1 && !_.has(content[1], 'divert');
    };
    this.nextStitch = function () {
        return content[1]['divert'];
    };
    this.getText = function () {
        return content[0];
    };
    this.getChoices = function () {
        var choicesList = [];
        for (i = 1; i < content.length; i++) {
            choicesList[content[i]['linkPath']] = content[i]['option'];
        }
        return choicesList;
    };
    return this;
};

/**
 * 
 * @param {object} options
 * @returns {nm$_libinkle.inkle}
 * @class
 */
inkle = function (options) {
    _.assign(this, options);
    var text = null;
    var choicesList = null;
    var story = this.story || null;
    if (_.has(this, 'source')) {
        this.story = new storyModel(this.source);
    }
};

/**
 * Static story models factory
 * 
 * @param {string} string a JSON file
 * @returns {nm$_libinkle.storyModel|Object.prototype.parse.story}
 */
inkle.prototype.parse = function (string) {
    const story = new storyModel(string);
    return story;
};

/**
 * Static story model stats builder
 * 
 * @param {string} story
 * @returns {inkle.prototype.stats.story.stats|.inkle.prototype@call;parse.stats|Object.prototype.stats.stats}
 */
inkle.prototype.stats = function (story) {
    var story = (typeof story === 'string') ? inkle.prototype.parse(story) : story;
    var stats = story.stats;
    return stats;
};

/**
 * Retrieves from a single stich all connected stitches 
 * 
 * @param {string} stitch_name  A stitch key  
 * @returns {Boolean}
 */
inkle.prototype.start = function (stitch_name) {
    stitch_name = stitch_name || this.story.stats.initial;
    const initial = this.story.getStitch(stitch_name);
    this.currentStitches = this.getAllStitches(initial);
    return this;
};

/**
 * From a single Stitch Model, retrieves all related stitches until choice occurs
 * 
 * @param {type} currentStitch
 * @returns {Boolean}
 */
inkle.prototype.getAllStitches = function (currentStitch) {
    debugger
    var final = false;
    var choice = false;
    this.paragraphList = [];
    this.choicesList = [];
    var nextStitch = '';
    while (final === false && choice === false) {
        this.paragraphList.push(currentStitch.getText());
        if (currentStitch.isChoice()) {
            choice = true;
            this.choicesList = currentStitch.getChoices();
        } else if (currentStitch.isFinal()) {
            final = true;
        } else {
            nextStitch = currentStitch.nextStitch();
            currentStitch = this.story.getStitch(nextStitch)
        }
    }
    return true;
};

/**
 * Return text paragraphs at current stage
 * 
 * @returns {Array} 
 */
inkle.prototype.getText = function () {
    return this.paragraphList;
};

/**
 * Return choices paragraphs at current stage in the form
 *  stitch_link => question paragraph
 * 
 * @returns {Array}
 */
inkle.prototype.getChoices = function () {
    return this.choicesList;
};

/**
 * Returns a list of current choices only by stitch name
 * 
 * @returns {Boolean}
 */
inkle.prototype.getChoicesByName = function () {
    return _.keys(this.choicesList);
};

/**
 * Decide to progress based on a given choice, by stitch_name
 * 
 * @param {type} stitch_name
 * @returns {Boolean}
 */
inkle.prototype.choose = function (stitch_name) {
    return this.start(stitch_name);
};

/**
 * Let chance decide the next story move
 * 
 * @returns {Array|nm$_libinkle.inkle.prototype.chooseRandom.choices}
 */
inkle.prototype.chooseRandom = function () {
    var choices = this.getChoices();
    var choicesList = this.getChoicesByName();
    var choice = Math.floor(Math.random() * choicesList.length);
    this.choose(choicesList[choice]);
    return choices[choicesList[choice]];
};

/**
 * Simple helper : is story not fnished?
 * 
 * @returns {Boolean}
 */
inkle.prototype.isNotFinished = function () {
    return this.getChoicesByName().length !== 0;
};

/**
 * Simple helper : is story fnished?
 * 
 * @returns {Boolean}
 */
inkle.prototype.isFinished = function () {
    return this.getChoicesByName().length === 0;
};


module.exports = inkle;
