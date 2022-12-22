const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

app.set('view engine', 'pug');
app.set('views', './views');

const errorController = require('./controllers/errors');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/account');

const mongoose = require('mongoose');

const User = require('./models/user');

var store = new mongoDbStore({
    uri: 'mongodb://localhost/node-app',
    collection: 'mySessions'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findOne({name: 'yusuf'})
        .then(user => {
            req.user = user;
            next();             
        })
        .catch(err => console.log(err));

})

app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}))

// routes
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);


app.use(errorController.get404Page);

mongoose.connect('mongodb://localhost/node-app')
    .then(() => { 
        console.log('Mongodb bağlanıldı');
        
        User.findOne({name: 'erhan'})
            .then(user => {
                if(!user){
                    user = new User({
                        name: 'erhan',
                        email: 'erhan@gmail.com',
                        password: '1234',
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                }
                return user;
            })
            .then(user => {
                console.log(user);
                app.listen(3000);
            })
    })
