/**
 * 涓流，继承自双工流
 */
var Stream = require('stream');
var util = require('util');

util.inherits(TrickleStream, Stream.Transform);

function State(options) {
	options = options || {};
	this.highWaterMark = options.highWaterMark;
	this.buffer = null;
}

function TrickleStream(options) {
	this._trickleState = new State(options);

	Stream.Transform.call(this);
}

function splice(state) {
	var buffer = state.buffer,
		result;

	result = buffer.slice(0, state.highWaterMark);

	state.buffer = buffer.slice(state.highWaterMark, buffer.length);
	return result;
}

TrickleStream.prototype._transform = function(chunk, encoding, cb) {
	var ts = this._transformState,
		rs = this._readableState,
		state = this._trickleState,
		buffer,
		Self = this;

	if(state.buffer) {
		state.buffer = Buffer.concat([state.buffer, chunk]);
	} else {
		state.buffer = chunk;
	}

	if(state.highWaterMark && state.buffer.length > state.highWaterMark) {
		rs.needReadable = true;
		// this.push(splice(state));
		cb(null, splice(state));
	} else {
		buffer = state.buffer;
		state.buffer = null;
		cb(null, buffer);
	}	
};

// TrickleStream.prototype._read = function(n) {
// 	var state = this._trickleState,
// 		readableState = this._readableState,
// 		Self = this;

// 	setImmediate(function() {
// 		if(state.bufferLength) {
// 			if(state.highWaterMark && state.bufferLength > state.highWaterMark) {
// 				push(Self, state, state.highWaterMark);
// 			} else {
// 				push(Self, state);
// 			}
// 		} else {
// 			if(state.writeFinish) {
// 				if(state.bufferLength) {
// 					push(Self, state, state.bufferLength);
// 				} else {
// 					Self.push(null);
// 				}
// 			} else {
// 				if(state.bufferLength) {
// 					push(Self, state, state.bufferLength);
// 				} else {
// 					function await() {
// 						Self._read(n);
// 						Self.removeListener('writeArrived', await);
// 						Self.removeListener('finish', await);
// 					}
// 					Self.once('writeArrived', await);
// 					Self.once('finish', await);
// 				}
// 			}
// 		}
// 	});
// };

// TrickleStream.prototype._write = function(chunk, encoding, callback) {
// 	var state = this._trickleState;

// 	if(!Buffer.isBuffer(chunk)) {
// 		chunk = new Buffer(chunk, encoding);
// 	}

// 	state.buffer = Buffer.concat([state.buffer, chunk]);
// 	state.bufferLength = state.buffer.length;

// 	this.emit('writeArrived');
// 	callback();
// };

module.exports = TrickleStream;
