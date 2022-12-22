const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('account/login', {
        path: '/login',
        title: 'Giriş'
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(email === user.email && password === user.password) {
                req.session.isAuthenticated = true;
                res.redirect('/');
            }
            else{
                res.redirect('/login');
            }
        })
    
    
}

exports.getRegister = (req, res, next) => {
    res.render('account/register', {
        path: '/register',
        title: 'Kayıt'
    })
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail({email: email})
        .then(user => {
            if(user) {
                return res.redirect('/register');
            }
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                cart: {items: []}
            });
            return newUser.save();
        })
        .then(()=>{
            res.redirect('/login');
        })
        .catch(err => console.log(err));
    
}

exports.getResetPassword = (req, res, next) => {
    res.render('account/reset-password', {
        path: '/reset-password',
        title: 'Şifre Yenileme'
    })
}