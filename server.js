const express = require('express');
const app = express();
const dotenv = require('dotenv');
const conectdb = require('./confige/db');
const http = require('http')
const { Server } = require('socket.io');
const socketHandler = require('./socket/sockethandler');

dotenv.config();
conectdb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

socketHandler(io);




const api1router = require('./routs/indexrout')
app.use('/api/v1', api1router)

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("server running sucessfully on port", PORT);
})