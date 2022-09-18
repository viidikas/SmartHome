const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
var fs = require('fs') //require filesystem module
var path = require('path')

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

const i2c1 = i2c.open(1, err => {
  if (err) throw err
})
var lightvalue = 0
io.on('connection', socket => {
  console.log('A user connected')
  socket.emit('light', lightvalue)
    socket.on('light', function (data) {
    if (data) {
      i2c1.writeByteSync(I2CADDRESS, ESIK, 0x10)
      console.log('Esiku valgus ON')
      i2c
        .openPromisified(1)
        .then(i2c1 =>
          i2c1
            .readWord(I2CADDRESS, ESIK)
            .then(rawData => (lightvalue = rawData))
            .then(_ => i2c1.close())
        )
        .catch(console.log)
      // console.log(lightvalue)
      socket.broadcast.emit('light', 1)
    } else {
      i2c1.writeByteSync(I2CADDRESS, ESIK, 0x00)
      console.log('Esiku valgus OFF')
      i2c
        .openPromisified(1)
        .then(i2c1 =>
          i2c1
            .readWord(I2CADDRESS, ESIK)
            .then(rawData => (lightvalue = rawData))
            .then(_ => i2c1.close())
        )
        .catch(console.log)
      socket.broadcast.emit('light', 0)

    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})

process.on('SIGINT', function () {
  i2c1.writeByteSync(I2CADDRESS, ESIK, 0x00)
  process.exit()
})
