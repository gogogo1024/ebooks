var fs = require('fs');
fs.watch('target.txt', function(eventType, filename) {
	switch (eventType) {
		case 'rename':
			if (fs.existsSync(filename))
				console.log('create', filename, fs.statSync(filename));
			else
				console.log('remove', filename); // 文件都不存在了，也调用不了fs.statSync了
			break;
		case 'change':
			console.log('update', filename, fs.statSync(filename));
	}


	// console.log("File 'target.txt' just changed!");
});


console.log("Now watching target.txt for changes...");