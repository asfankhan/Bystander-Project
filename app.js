var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
//var mongoose = require('mongoose');

var Connected_Users = []

var Disconnected_Users = []

var Alerts = []

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/Client/index.html');
});

app.use(express.static(__dirname + '/Client'));

var server = app.listen(3000, function(){
   console.log('listening on 3000');
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){

  console.log("===================== User Connected =====================");

  socket.emit('get data', {alert:Alerts,user:Connected_Users});

  socket.on('new person', function(obj){
    Connected_Users.push({id:socket.id,pos:obj.pos});
    console.log(Connected_Users)
  });

  socket.on('update Person', function(obj){
    Connected_Users.push(obj);
    console.log(Connected_Users)

  });

  socket.on('update location', function(obj){
    console.log(Connected_Users)

  });


  socket.on('alert', function(obj){

  	Alerts.push(obj);
  	console.log(Alerts);
    io.sockets.emit('alert', obj);
  
  });

  socket.on('disconnect', function(){

    Connected_Users.splice(Connected_Users.indexOf(socket),1);

  console.log("===================== User disconnect =====================");

  });

});


