const express = require('express');
const routs = express.Router();
const { userragister, userlogin, viewalluser } = require('../controllers/usercontroller');
const verifyToken = require('../confige/auth');


routs.post('/userragister', userragister);
routs.post('/userlogin', userlogin);
// routs.get('/viewalluser',verifyToken, viewalluser);


module.exports = routs