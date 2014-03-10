var through2 = require('through2');

function trickleStream(size) {
	return through2(function(chunk, encoding, callback) {
		if(chunk && size && chunk.length > size) {
			this.push(chunk.slice(0, size));
			this._transform(chunk.slice(size, chunk.length), encoding, callback);
		} else {
			callback(null, chunk);
		}
	});
}

module.exports.trickle = trickleStream;

function delayStream(interval) {
	var timestamp;
	interval = interval || 0;
	return through2(function(chunk, encoding, callback) {
		var Self = this,
			now = Date.now();
		if(!timestamp) {
			delay = interval;
		} else {
			if((now - timestamp) > interval) {
				delay = interval;
			} else {
				delay = now - timestamp;
			}
		}
		timestamp = now;

		setTimeout(function() {
			callback(null, chunk);
		}, delay);
	});
}

module.exports.delay = delayStream;

function combineStream(srcStream) {
	if(!Array.isArray(srcStream)) {
		srcStream = [srcStream];
	}
// console.log('length');
// console.log(srcStream.length);
	var destStream = through2(function(chunk, encoding, callback) {
		callback(null, chunk);
	});

	_flow(srcStream, destStream);

	return destStream;
}

function _flow(srcs, dest) {
	var src = srcs.shift();

	if(!src) {
		dest.end();
	} else {
		if(!src.readable) {
			throw new Error('streams must be readable');
		}
		src.pipe(dest, {end: false});
		src.on('end', function() {
			_flow(srcs, dest);
		});
	}
}

module.exports.combine = combineStream;