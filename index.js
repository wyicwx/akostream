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