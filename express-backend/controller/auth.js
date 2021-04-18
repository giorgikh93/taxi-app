const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/jwtSecret')

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            const token = jwt.sign(user.email, jwtSecret);
            return res.send({ token })
        }
        return res.send(`Password does not match email ${email}`)
    }
    return res.status(401).send(`this email ${email} doesn't exists!`)
}

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const isUserExists = await User.findOne({ email })
        if (isUserExists) {
            const error = new Error(`user with the email - ${email} already exists!`)
                error.statusCode = 409;
                throw error;
        }
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        const result = await user.save();
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message)
    }



}