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

	var destStream = through2();

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

function originStream(data) {
	var stream = through2();
 
	stream.write(data);
	stream.end();
	return stream;
}

module.exports.origin = originStream;

function aggreStream(comining) {
	var stream = through2();
	var buffer = [];

	comining.on('data', function(chunk) {
		buffer.push(chunk);
	});

	comining.on('end', function() {
		buffer = Buffer.concat(buffer);
		stream.end(buffer);
	});

	return stream;
}

module.exports.aggre = aggreStream;

function whenStream(streamArr, callback) {
	if(!Array.isArray(streamArr)) {
		streamArr = [streamArr];
	}
	var donelist = [];
	var end = function() {
		var isEnd = true;
		donelist.forEach(function(value) {
			if(!value) {
				isEnd = false;
			}
		});

		if(isEnd) {
			callback && callback();
		}
	};

	streamArr.forEach(function(stream, key) {
		donelist[key] = false;
		stream.on('end', function() {
			donelist[key] = true;
			end();
		});
	});
}

module.exports.when = whenStream;