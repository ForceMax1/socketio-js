var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, name){
  console.log('Ein Nutzer ist beigreten.');
  io.emit('user join', {for: 'everyone'});
  socket.on('disconnect', () => {
    console.log('Ein Nutzer hat den Server verlassen.');
    io.emit('user leave', {for: 'everyone'});
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});