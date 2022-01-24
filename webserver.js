
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module

var io = require('socket.io')(http, {
  allowEIO3: true
})

var lightvalue = 0;


http.listen(8080); //listen to port 8080



/****  Webserver creation  ******/

function handler(req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function (err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

/******  WebSocket connection  ********/

io.sockets.on('connection', function (socket) {
  socket.emit('light', lightvalue) //Tell the client the status of the light
  console.log("New client " + lightvalue)

io.on("connect error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  

  // this gets called whenever client presses lightswitch
  socket.on("light", function (data) { 
    lightvalue = data
    io.emit('light', lightvalue)

    // if (lightvalue != LED.readSync()) {
    //   console.log(lightvalue) //only change LED if status has changed
    //   // LED.writeSync(lightvalue); //turn LED on or off
    // }
  });

});

process.on('SIGINT', function () { //on ctrl+c
  // i2c.close();
  process.exit(); //exit completely
});


