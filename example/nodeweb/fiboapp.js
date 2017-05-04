var http = require('http');
var url  = require('url');

var fibonacci = function(n) {
    if (n === 1 || n === 2)
        return 1;
    else
        return fibonacci(n-1) + fibonacci(n-2);
}

var fibonacciAsync = exports.fibonacciAsync = function(n, done){
    if (n=== 1 || n ===2) done(1);
    else {
        process.nextTick(function(){
            fibonacciAsync(n-1,function(val1){
                process.nextTick(function(){
                    fibonacciAsync(n-2, function(val2){
                        done(val1+val2);
                    })
                })
            })
        })
    }
}

http.createServer(function (req, res) {
  var urlP = url.parse(req.url, true);
  var fibo;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  if (urlP.query['n']) {
    fibo = fibonacci(urlP.query['n']);
    res.end('Fibonacci '+ urlP.query['n'] +'='+ fibo);
  } else {
    res.end('USAGE: http://0.0.0.0:8888?n=## where ## is the Fibonacci number desired');
  }
}).listen(8888, '0.0.0.0');
console.log('Server running at http://0.0.0.0:8888');
