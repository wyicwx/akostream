var delayStream = require('../').delay;

describe('interval', function() {
	it('没有设置时间，不延时', function(done) {
		var stream = delayStream();
		var timestamp = Date.now();
		var availd = true;

		stream.on('data', function(chunk) {
			// js自身运行时间
			if(timestamp - Date.now() > 10) {
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
			stream.write(new Buffer(1));
			count--;
			if(!count) {
				stream.end();
			}
		}
	});

	it('设置延时时间，快速输入', function(done) {
		var delayTime = 50;
		var stream = delayStream(delayTime);
		var timestamp = Date.now();
		var availd = true;

		stream.on('data', function(chunk) {
			if(Date.now() - timestamp < delayTime) {
				availd = false;
			}
			timestamp = Date.now(); 
		});

		stream.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});

		var count = 20;
		while(count) {
			stream.write(new Buffer(1));
			count--;
			if(!count) {
				stream.end();
			}
		}
	});

	it('设置延时时间, 输入间隔超过延时', function(done) {
		var delayTime = 50;
		var stream = delayStream(delayTime);
		var timestamp = Date.now();
		var availd = true;
		var timeout = 60;

		stream.on('data', function(chunk) {
			if(Date.now() - timestamp > (timeout+10)) {
				availd = false;
			}
			timestamp = Date.now(); 
		});

		stream.on('end', function() {
			if(availd) {
				done();
			} else {
				done(false);
			}
		});
		var count = 20;
		function next() {
			stream.write(new Buffer(1));
			count--;
			if(!count) {
				stream.end();
			} else {
				setTimeout(function() {
					next();
				}, timeout);
			}
		}

		next();
	});
});