// setup definitions and imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4002;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
//adminbro imports
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
//route imports
const userRoute = require('./routes/user.route')
const quizRoute = require('./routes/quiz.route')

//model imports
const User = require('./models/user.model')
const Quiz = require('./models/quiz.model')

//server code
AdminBro.registerAdapter(AdminBroMongoose)

mongoose.Promise = global.Promise;
const connection = mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
)

const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role == 'admin'
const adminBro = new AdminBro({
    resources: [
        Quiz,
        {
            resource: User,
            options: {
                properties: {
                    encryptedPassword: {
                        isVisible: false,
                    }
                },

                actions: {
                    edit: { isAccessible: canModifyUsers },
                    delete: { isAccessible: canModifyUsers },
                    new: { isAccessible: canModifyUsers },
                },
            }
        }
    ],
    rootPath: '/admin',
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async(email, password) => {
        const user = await User.findOne({ email })
        if (user) {
            const matched = await bcrypt.compare(password, user.encryptedPassword)
            if (matched
                /* && user.role != "normal"*/
            ) {
                return user
            }
        }
        return false
    },
    cookiePassword: 'secret-password',
})

app.use(cors())
app.use(cookieParser())
app.use(adminBro.options.rootPath, router)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', userRoute)
app.use('/quiz', quizRoute)
app.listen(PORT, function() {
    console.log('Server is running on Port:', PORT)
})