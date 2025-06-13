const usermodel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const code = require('../utils/statuscodemessage');
const { isvalidemail, validpassword } = require('../confige/validation');
const jwt = require('jsonwebtoken');

exports.userragister = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, age, gender } = req.body;
        const cheakmail = await usermodel.findOne({ email });
        if (cheakmail) {
            return res.status(400).json({ msg: "user alredy ragister", status: 0 })
        }
        if (!name) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "name is require" })
        }
        if (!email) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "email is require" })
        }
        if (!isvalidemail(email)) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "invalid email" })
        }
        if (!password) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is require" })
        }
        if (!confirmpassword) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "confirmpassword is require" })
        }
        if (!validpassword(password)) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "minimum password length is 5" })
        }
        if (password !== confirmpassword) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password and confirmpassword are not same" })
        }
        if (!age) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "age is require" })
        }
        if (!gender) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "gender is require" })
        }

        const hashpass = await bcrypt.hash(password, 10);

        const User = new usermodel({
            name,
            email,
            password: hashpass,
            age,
            gender
        })

        const Userdata = await User.save();
        if (Userdata) {
            return res.status(code.CREATED).json({ sucess: true, message: "user create sucessfully", Userdata: Userdata })
        }
        else {
            return res.status(400).json({ msg: "user not ragister", status: 0 })
        }

    } catch (error) {
        console.log(error);
        res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cheakmail = await usermodel.findOne({ email: email }); 

        if (!cheakmail) {
            res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "user not found" })
        }
        const cheackpass = await bcrypt.compare(password, cheakmail.password);
        if (!cheackpass) {
            res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is not valid" })
        }
        const token = jwt.sign({ userId: cheakmail._id, email: cheakmail.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ msg: "user login sucessfully", cheakmail: cheakmail, token: token });
    }
    catch (error) {
        console.log(error);
        res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}
