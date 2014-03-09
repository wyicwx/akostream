var trickleStream = require('../').trickle;

describe('trickle', function() {
	describe('输入在水平线之下，输出同输入', function() {
		it('输入大小随机', function(done) {
			var highWaterMark = 100;
			var stream = trickleStream(highWaterMark);
			var availd = true;
			var length = 0;

			stream.on('data', function(trunk) {
				var l = trunk.length;

				if(l <= 0 && l > highWaterMark) {
					availd = false;
				}
				length -= l;
			});

			stream.on('end', function() {
				if(availd && !length) {
					done();
				} else {
					done(false);
				}
			});

			var count = 100;
			while(count) {
				var random = parseInt(Math.random()*100);
				length += random;
				stream.write(new Buffer(random));
				count--;
				if(!count) {
					stream.end();
				}
			}
		});

		it('输入固定值', function(done) {
			var highWaterMark = 100;
			var stream = trickleStream(highWaterMark);
			var availd = true;
			var random = parseInt(Math.random()*100);

			stream.on('data', function(trunk) {
				var length = trunk.length;
				if(length != random && length <= 0 && length > highWaterMark) {
					availd = false;
				}
			});

			stream.on('end', function() {
				if(availd) {
					done();
				} else {
					done(false);
				}
			});

			var count = 100;
			while(count) {
				stream.write(new Buffer(random));
				count--;
				if(!count) {
					stream.end();
				}
			}
		});
	});

	describe('输入在水平线至上，按水平线大小输出', function() {
		it('输入大小随机', function(done) {
			var highWaterMark = 1000;
			var stream = trickleStream(highWaterMark);
			var length = 0;
			var availd = true;
			var random = parseInt(Math.random()*100);

			stream.on('data', function(trunk) {
				if(length > highWaterMark) {
					if(trunk.length != highWaterMark) {
						availd = false;
					}
				} else {
					if(trunk.length != length) {
						availd = false;
					}
				}
				length -= trunk.length;
			});

			stream.on('end', function() {
				if(availd && !length) {
					done();
				} else {
					done(false);
				}
			});

			var count = 100;
			while(count) {
				var random = parseInt(Math.random()*100);
				length += random+highWaterMark;
				stream.write(new Buffer(random+highWaterMark));
				count--;
				if(!count) {
					stream.end();
				}
			}
		});
	});

	it('水平线上下波动情况', function(done) {
		var highWaterMark = 100;
		var stream = trickleStream(highWaterMark);
		var length = 0;
		var availd = true;

		stream.on('data', function(chunk) {
			if(chunk > highWaterMark || chunk.length >= length) {
				availd = false;
			}
			length -= chunk.length;
		});

		stream.on('end', function() {
			if(!availd && !length) {
				done();
			} else {
				done(false);
			}
		});

		var count = 100;
		while(count) {
			var random = parseInt(Math.random()*100);
			length += random+50;
			stream.write(new Buffer(random+50));
			count--;
			if(!count) {
				stream.end();
			}
		}
	});


	it('没有设置水平线情况下，写入多少则输出多少', function(done) {
		var stream = trickleStream();
		var availd = true;
		var random = 0;

		stream.on('data', function(chunk) {
			if(chunk.length != random) {
				availd = false;
			}
		});

		stream.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});

		var count = 100;
		function next() {
			random = parseInt(Math.random()*1000);
			stream.write(new Buffer(random));
			count--;
			if(!count) {
				stream.end();
			} else {
				next();
			}
		}

		next();
	});
});