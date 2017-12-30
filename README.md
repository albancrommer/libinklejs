# Why libinkle?

Introduce [Inklestudios](https://www.inklestudios.com "The Inklestudios website") [Writer](https://writer.inklestudios.com "The Inklestudios Writer editor"), a non free-as-in-speech software. 

It is still free-as-in-beer, pretty and simple interactive stories editor and is able to [export to JSON](https://www.inklestudios.com/2017/09/12/inklewriter-status.html) :
> *Can I rescue my data?*
> 
>  Yes. You can capture the raw .json file that stores your story, but to use it elsewhere you'll need to write code to parse and run it. (The format is pretty straight-forward, however.)
>

In order to experiment with the subject, I needed a tool to use these JSON exports, so here's the module ad hoc.

 * pretty simple builder with few interface methods required, mainly `inkle.start()` and `inkle.choose()`
 * single npm dependancy: lodash 
 * works in browser / with node
 * tests and examples available
 * GPL licence


# Usage


```
// Load the lib
const libinkle = require('libinkle');

// Read a JSON export
const buf = fs.readFileSync('XXXX.json');

// Create a story runner
const inkle = new libinkle(buf.toString());

// Initiate the story whose state is recorded in the object
inkle.start();

// Retrieve the current text
var paragraphList = inkle.getText();

// Retrieve the current choices
var choicesList = inkle.getChoices();

// Choose a random solutio
inkle.chooseRandom();
```

# The Inkle Writer JSON format 

As the Inklewriter team said, the format is pretty straight-forward.

Apart from metadata, the content is structured through a list of **"stitches"** which are nodes in a graph, if that concept makes sense for you.

In a more general way **stitches** are text paragraphs with links. They are either: 

 * connected to some other stitch : the story flows
 * connected to multiple stitches : the story stops and a path has to be decided, a choice has to be made

So the stitches are the partial atoms of the interactive story, which navigates from a stitch to another, etc.

Each stitch can be tagged. These tags can be later used as conditionals.




# Things to do 

  * Error management is rather inexistant
  * Flags and if conditions
  * Sections
  * Images

# Contributing, bugs, pull requests

All are very welcome. Don't hesitate to push me on my mail github_albancrommer.com if feeback is slow.