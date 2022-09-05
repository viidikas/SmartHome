const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
var fs = require('fs') //require filesystem module
var path = require('path')

const raspi = require('raspi')
const i2c = require('i2c-bus')
const I2CADDRESS = 0x10
const PUMP = 0x01
const ESIK = 0x02
const KORIDOR = 0x03
const ATTIC = 0x04

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', function (err, data) {
    //read file index.html in public folder
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' }) //display 404 on error
      return res.end('404 Not Found')
    }
    res.writeHead(200, { 'Content-Type': 'text/html' }) //write HTML
    res.write(data) //write data from index.html
    return res.end()
  })
})

io.on('connection', socket => {
  var lightvalue = 0
  console.log('A user connected')

  // const rbuf = Buffer.alloc(2)

  socket.on('light', function (data) {
    // kui readWord vastus = 255 ja socketi passed data = 1, siis saadetakse sendByte 0x10 e. relee lylitatakse sisse.
    // kui readword vastus = 0 ja socketi passed data = 0, saadetakse sendByte 0x00 e. relee lylitatakse v2lja.
    i2c
      .openPromisified(1)
      .then(i2c1 =>
        i2c1.readWord(I2CADDRESS, ESIK).then(
          rawData =>
            function () {
              if (rawData == 255 && data == 1) {
                console.log('Relee lylitati sisse.')// sendByte(..., ..., 0x10). Ainult et kas seda saab teha siinse i2c instantsi sees?
              } else {
                console.log('L2ks else ploki sisse.')//do nothing
              }
            }
        )
      )
      .then(_ => i2c1.close())
      .catch(console.log)

      // KUIDAS SEE READWORD FUNKTSIOONIST TULNUD VÄÄRTUS MUUTUJASSE VÕETAKSE???

    // See allj2rgnev ei tööta. relaystatus tuleb vastusena undefined.
    // const i2c1 = i2c.openSync(1)
    // lightvalue = data

    // const relayStatus = i2c1.sendByte(ESIK, 0xff, (err, rawData) => {
    //   if (err) throw err
    //   return rawData
    // })
    // console.log(relayStatus)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})

function turnOnLight (relay, onoff) {
  if (onoff == 1) {
    onoff = 0x10
  } else {
    onoff = 0x00
  }
  i2c.writeByte(I2CADDRESS, relay, onoff)
}

function readRelay (relay) {
  return i2c.readByte(I2CADDRESS, relay)
}

// var http = require('http').createServer(handler); //require http server, and create server with function handler()
// var fs = require('fs'); //require filesystem module
// var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
// var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
// var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
// var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

// http.listen(8080); //listen to port 8080

// function handler (req, res) {
//   //create server
//   fs.readFile(__dirname + '/public/index.html', function (err, data) {
//     //read file index.html in public folder
//     if (err) {
//       res.writeHead(404, { 'Content-Type': 'text/html' }) //display 404 on error
//       return res.end('404 Not Found')
//     }
//     res.writeHead(200, { 'Content-Type': 'text/html' }) //write HTML
//     res.write(data) //write data from index.html
//     return res.end()
//   })
// }

// io.sockets.on('connection', function (socket) {// WebSocket Connection
//   var lightvalue = 0; //static variable for current status
//     socket.on('light', function(data) { //get light switch status from client
//       lightvalue = data;
//         socket.emit('light', lightvalue); //send button status to client
//     // }
//   });
// });

// process.on('SIGINT', function () { //on ctrl+c
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport LED GPIO to free resources
//   pushButton.unexport(); // Unexport Button GPIO to free resources
//   process.exit(); //exit completely
// });
