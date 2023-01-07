const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const mongoDbStore = require('connect-mongodb-session')(session);
require('dotenv').config()

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

app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 72000000
    },
    store: store
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// routes
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

const isAuthenticated = require('./middleware/isAuthenticated');
const isAdmin = require('./middleware/isAdmin');

app.use(isAdmin, isAuthenticated, errorController.get404Page);

const port = process.env.PORT;
const url = process.env.DB_CONNECTION_STRING;

mongoose.connect(url)
    .then(() => { 
        console.log('Mongodb bağlanıldı');
        app.listen(port);
    })
    .catch(err => console.log(err));
