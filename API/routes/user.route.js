//  user.route.js

const express = require("express")
const userRoute = express.Router()
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

userRoute.route('/add').post(function(req, res) {
    let user = new User({
        email: req.body.email,
        encryptedPassword: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        zipCode: req.body.zipCode,
        city: req.body.city,
        role: 'admin'
    })
    user.save().then(() => {
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }) // expires in 24 hours
        res.status(200).send({ auth: true, token: token, user: user })
    }).catch(() => {
        res.status(500).send("There was a problem registering the user.")
    })
})

userRoute.route('/login').post(function(req, res) {
    let email = req.body.email

    async function authenticate() {
        let user = await User.findOne({
            email: req.body.email
        })
        console.log(user.email)
        if (!user) return res.status(404).send('No user found.')
        let passwordIsValid = await bcrypt.compare(req.body.password, user.encryptedPassword)
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
        res.status(200).send({ auth: true, token: token, user: user })
    }

    authenticate()
})

module.exports = userRoute;