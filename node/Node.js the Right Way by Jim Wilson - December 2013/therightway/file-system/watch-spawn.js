"use strict"
//How would you pass an arbitrary number of 
//additional parameters from
//process.argv to the spawned
//process (e.g., node --harmony watcher-hw.js ls -l -h)?
const
	fs = require('fs'),
	spawn = require('child_process').spawn,
	filename = process.argv[2],
	ls=process.argv[3],
	leftArgs=process.argv.slice(4);
	leftArgs.push(filename);
	console.log(process.argv);
if (!filename) {
	throw Error('A file to watch must be specified!');
}
fs.watch(filename, function() {
	// ls=process.argv[3];
	console.log(leftArgs);
	 // ls = spawn(ls, ['-lh', filename]);
	 var lt;
	 lt= spawn(ls, leftArgs);


	lt.stdout.pipe(process.stdout);
});
console.log('Now watching ' + filename + ' for changes...');