#AKOStream
![travis](https://api.travis-ci.org/wyicwx/AKOStream.png)  

> 各种各样的流(all kinds of stream)

##INSTALL
```
npm install AKOStream
```

```
var AKOStream = require('AKOStream');
```
*trickle*
```
var size = 100;
var trickle = AKOStream.trickle(size);

writeableStream.pipe(trickle).pipe(readableStream);
```
size限制流输出的大小，保证输出数据大小在size之下.

*delay*
```
var delay = 100;
var trickle = AKOStream.delay(delay);

writeableStream.pipe(trickle).pipe(readableStream);
```
延迟输出，delay控制延迟时间



