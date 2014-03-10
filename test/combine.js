var combineStream = require('../').combine;
var trickleStream = require('../').trickle;

describe('combine', function() {
	it('多个可写流合并, 顺序写入', function(done) {
		var buffer = [],
			srcStream = [],
			length = parseInt(Math.random() * 100) + 1;

		for(var i = 0; i<length; i++) {
			srcStream[i] = trickleStream();
		}
		
		for(var i = 0; i<length; i++) {
			buffer[i] = new Buffer(String(i));
			srcStream[i].write(buffer[i]);
			srcStream[i].end();
		}

		var dest = combineStream(srcStream);

		var count = 0,
			availd = true;
		dest.on('data', function(chunk) {
			if(chunk.toString() != buffer[count].toString()) {
				availd = false;
			}
			count++;
		});

		dest.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});
	});

	it('多个可写流合并，乱序写入', function(done) {
		var buffer = [],
			srcStream = [],
			bf,
			random,
			length = parseInt(Math.random() * 100) + 1;

		for(var i = 0; i<length; i++) {
			srcStream[i] = trickleStream();

			random = parseInt(Math.random()*3) + 1;
			bf = new Buffer(String(i));
			for(var j = 0; j<random; j++) {
				buffer.push(bf);
			}

			_write(srcStream[i], bf, random, 0);
		}

		function _write(stream, buffer, count, time) {
			if(time == count) {
				stream.end();
				return;
			}
			var timeout = parseInt(Math.random()*5)+1;
			setTimeout(function() {
				stream.write(buffer);
				time++;
				_write(stream, buffer, count, time);
			}, timeout);
		}
		

		var dest = combineStream(srcStream);

		var count = 0,
			availd = true;
		dest.on('data', function(chunk) {
			if(chunk.toString() != buffer[count].toString()) {
				availd = false;
			}
			count++;
		});

		dest.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});
	});

	it('多个可写流合并, 顺序写入，合并结果相同', function(done) {
		var buffer = [],
			srcStream = [],
			length = parseInt(Math.random() * 100) + 1;

		for(var i = 0; i<length; i++) {
			srcStream[i] = trickleStream();
		}
		
		for(var i = 0; i<length; i++) {
			buffer[i] = new Buffer(String(i));
			srcStream[i].write(buffer[i]);
			srcStream[i].end();
		}

		var dest = combineStream(srcStream);

		var ret = [];
		dest.on('data', function(chunk) {
			ret.push(chunk);
		});

		dest.on('end', function() {
			if(Buffer.concat(buffer).toString() == Buffer.concat(ret).toString()) {
				done();
			} else {
				done(false);
			}
		});
	});

	it('多个可写流合并，乱序写入，合并结果相同', function(done) {
		var buffer = [],
			srcStream = [],
			bf,
			random,
			length = parseInt(Math.random() * 100) + 1;

		for(var i = 0; i<length; i++) {
			srcStream[i] = trickleStream();

			random = parseInt(Math.random()*3) + 1;
			bf = new Buffer(String(i));
			for(var j = 0; j<random; j++) {
				buffer.push(bf);
			}

			_write(srcStream[i], bf, random, 0);
		}

		function _write(stream, buffer, count, time) {
			if(time == count) {
				stream.end();
				return;
			}
			var timeout = parseInt(Math.random()*5)+1;
			setTimeout(function() {
				stream.write(buffer);
				time++;
				_write(stream, buffer, count, time);
			}, timeout);
		}
		

		var dest = combineStream(srcStream);

		var ret = [];
		dest.on('data', function(chunk) {
			ret.push(chunk);
		});

		dest.on('end', function() {
			if(Buffer.concat(buffer).toString() == Buffer.concat(ret).toString()) {
				done();
			} else {
				done(false);
			}
		});
	});

	it('空参数', function(done) {
		var dest = combineStream();
		var availd = true;

		dest.on('data', function() {
			availd = false;
		});

		dest.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});
	});
});