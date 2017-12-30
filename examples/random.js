/*
 *  A Command Line Interface example
 * 
 * Randomizes entirely, no user input required to get to the story end
 * 
 */

/* global __dirname */
const argn = process.argv.length - 1;
const file = process.argv[argn] && process.argv[argn].length === 4 ? process.argv[argn] : '8v99';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const libinkle = require('../index');
const buf = fs.readFileSync(path.resolve(__dirname, '../tests/stories/'+file+'.json'));
const inkle = new libinkle({source: buf.toString()});
inkle.start();

function format(array) {
    return array.join("\n") + "\n";
}
while (inkle.isNotFinished()) {
    console.log(format(inkle.getText()));
    var choice = inkle.chooseRandom();
    console.log('Your choice: ' + choice + "\n");
}
console.log(format(inkle.getText()));
