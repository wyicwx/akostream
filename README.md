#AKOStream
=========
![travis](https://api.travis-ci.org/wyicwx/AKOStream.png)  

各种各样的流(all kinds of stream)

##INSTALL
```
npm install AKOStream
```

*trickle*
```
var trickle = trickleStream(size);

writeableStream.pipe(trickle).pipe(readableStream);
```
size限制流输出的大小，保证输出数据大小在size之下.




