/*
 *  A Command Line Interface example
 * 
 * Handles user feedback trough 1-X keyboard keys to move through the story
 * 
 */

/* global __dirname */

const keypress = require('keypress');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const libinkle = require('../index');

const buf = fs.readFileSync(path.resolve(__dirname, '../tests/stories/8v99.json'));
const inkle = new libinkle({source: buf.toString()});
inkle.keySet = [];
inkle.getChoicesByKeys = function () {
    var choices = this.getChoices();
    var choicesList = this.getChoicesByName();
    this.keySet = _.keys(choicesList);
    _.each(choicesList, function (val, key) {
        console.log("[" + key + "] " + choices[val]);
    });
};

inkle.start();
console.log(format(inkle.getText()));
inkle.getChoicesByKeys();

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name === 'c') {
        process.stdin.pause();
    }
    if (!_.has(key, 'sequence')) {
        return;
    }
    chosenKey = key.sequence;
    if (_.indexOf(inkle.keySet, chosenKey) === -1) {
        return;
    }
    // Progress story
    inkle.choose(inkle.getChoicesByName()[chosenKey]);
    console.log();
    console.log(format(inkle.getText()));
    if (inkle.isFinished()) {
        process.stdin.pause();
    }
    inkle.getChoicesByKeys();
});


function format(array) {
    return array.join("\n") + "\n";
}
process.stdin.setRawMode(true);
process.stdin.resume();

