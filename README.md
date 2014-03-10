#akostream
![travis](https://api.travis-ci.org/wyicwx/akostream.png)  

> 各种各样的流(all kinds of stream)

##INSTALL
```
npm install akostream
```

```
var akostream = require('akostream');
```
*trickle*
```
var size = 100;
var trickle = akostream.trickle(size);

writeableStream.pipe(trickle).pipe(readableStream);
```
size限制流输出的大小，保证输出数据大小在size之下.

*delay*
```
var delay = 100;
var trickle = akostream.delay(delay);

writeableStream.pipe(trickle).pipe(readableStream);
```
延迟输出，delay控制延迟时间


*combine*
```
var toCombine = [readSteam1, readStream2, readStream3, readStream4];
var combine = akostream.combine(toCombine);

combine.pipe(readableStream);
```
按顺序顺序合并流



