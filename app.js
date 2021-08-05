var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const url = require("url");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

var http = require('http');
var server = http.createServer(app);
//websocket
var WebSocket = require('ws');

const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//多个websocket连接
wss1.on('connection', function connection(ws) {
	console.log('链接成功！1',ws);
	ws.on('message', function incoming(data) {
		/**
		 * 把消息发送到所有的客户端
		 * wss.clients获取所有链接的客户端
		 */
		let mess_ = data.toString()
		wss1.clients.forEach(function each(client) {
			client.send(mess_);		
		});
	});
});
wss2.on('connection', function connection(ws) {
	console.log('链接成功！2',ws);
	ws.on('message', function incoming(data) {
		/**
		 * 把消息发送到所有的客户端
		 * wss.clients获取所有链接的客户端
		 */
		let mess_ = data.toString()
		wss2.clients.forEach(function each(client) {
			client.send(mess_);			
		});
	});
});
server.on('upgrade', function upgrade(request, socket, head) {
	const pathname = url.parse(request.url).pathname;
	if (pathname === '/users/') {
		wss1.handleUpgrade(request, socket, head, function done(ws) {
		  wss1.emit('connection', ws, request);
		});
	} else if (pathname === '/') {
		wss2.handleUpgrade(request, socket, head, function done(ws) {
		  wss2.emit('connection', ws, request);
		});
	} else {
		socket.destroy();
	}
})
module.exports = server;
