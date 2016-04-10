
/*
Kevin Lai

CMPE 172 Homework 3
*/

var Transform = require('stream').Transform;
var util= require("util" ).inherits;
var program = require('commander');
var fs = require('fs');
var inputStream = fs.createReadStream('./input-sensor.txt' );

if (!Transform) {
 Transform = require('readable-stream/transform');
}

function PatternMatch(parameter){
Transform.call(this, {objectMode: true});
this.pattern = parameter;
}

util(PatternMatch, Transform);

PatternMatch.prototype._transform = function (chunk, encoding, getNextChunk){

// Pushes the Input title onto the stream
this.push("------------------------------Input-----------------------------\n");

var data = chunk.toString();

// Pushes the input data onto the stream
this.push(data);

// Pushes the Output title onto the stream
this.push("-----------------------------Output-----------------------------\n");

var text = data.split(this.pattern);

// Splices the split lines of data
this._lastLineData = text.splice(text.length-1,1)[0];

// After splicing the text, push each line of data to output
for(var i in text){

this.push(text[i]);

}


}

PatternMatch.prototype._flush = function (flushCompleted){

if(this.lastLineData){

this.push(this._lastLineData);
this.lastLineData = null;
done();

}

}


program.option('-p, --pattern <pattern>', 'Input Pattern such as . ,').parse(process.argv);

var patternStream = inputStream.pipe( new PatternMatch(program.pattern));

// Prints the contents of the stream to the console
patternStream.on('readable', function(){
var nextLine;
while( (nextLine = this.read()) != null){
console.log(nextLine.toString());
}

})
