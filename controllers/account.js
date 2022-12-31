const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const validator = require('validator');

var transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'erhan.koyuncu5406@gmail.com',
        pass: 'leoyyhivrpfxqezj'
    }
});

exports.getLogin = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/login', {
        path: '/login',
        title: 'Giriş',
        errorMessage: errorMessage
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                if (password === user.password) {
                    req.session.user = user;
                    req.session.isAuthenticated = true;
                    return req.session.save(function (err) {
                        var url = req.session.redirectTo || '/';
                        delete req.session.redirectTo;
                        res.redirect(url);
                    })
                }
                else {
                    req.session.errorMessage = 'Hatalı Şifre!';
                    req.session.save(function (err) {
                        console.log(err);
                    })
                    res.redirect('/login');
                }
            }
            else {
                if (email === "") {
                    req.session.errorMessage = 'e-mail kısmını doldurunuz!';
                }
                else req.session.errorMessage = 'Bu e-mail ile kayıt bulunamadı!';
                req.session.save(function (err) {
                    console.log(err);
                })
                res.redirect('/login');
            }
        })
        .catch(err => console.log(err));

}

exports.getRegister = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/register', {
        path: '/register',
        title: 'Kayıt',
        errorMessage: errorMessage
    })
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;

    if(name === "" || phone === "" || email === "" || password ===""){
        req.session.errorMessage = "Lütfen tüm alanları doldurunuz!";
        return res.redirect('/register');
    }

    if(!validator.isEmail(email)){
        req.session.errorMessage = "Geçersiz e-mail formatı!";
        return res.redirect('/register');
    }

    if(!validator.isMobilePhone(phone, 'tr-TR')){
        req.session.errorMessage = "Geçersiz telefon formatı!";
        return res.redirect('/register');
    }

    if(password.length < 4){
        req.session.errorMessage = "Şifre en az 4 karakter olmalıdır!";
        return res.redirect('/register');
    }
    
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu e-mail zaten kullanılıyor!';
                req.session.save(function (err) {
                    console.log(err);
                })
                return res.redirect('/register');
            }

            const newUser = new User({
                name: name,
                phone: phone,
                email: email,
                password: password,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(() => {
            res.redirect('/login');

            const msg = {
                to: email,
                from: 'erhan.koyuncu5406@gmail.com',
                subject: 'Hesap Oluşturuldu',
                html: '<h1>Hesabınız Oluşturuldu</h1> <br><p>Hoşgeldin. Hesap bilgilerin ile giriş yapabilirsin.</p>'
            };
            transpoter.sendMail(msg, function (err, info) {
                if (err) {
                    console.log(err);
                }
            });
        })
        .catch(err => {
            console.log(err);
            
        });

}

exports.getResetPassword = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/reset-password', {
        path: '/reset-password',
        title: 'Şifre Yenileme',
        errorMessage: errorMessage
    })
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = 'Kayıtlı email adresi bulunamadı.';
                    req.session.save(function (err) {
                        console.log(err);
                        return res.redirect('/reset-password')
                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save();
            })
            .then(result => {
                res.redirect('/');

                const msg = {
                    to: email,
                    from: 'erhan.koyuncu5406@gmail.com',
                    subject: 'Şifre Yenileme',
                    html: `
                        <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                        <p>
                            <a href="http://localhost:3000/reset-password/${token}">Şifre yenile</a>
                        </p>    
                    `
                };
                transpoter.sendMail(msg, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                });
            })
            .catch(err => console.log(err));
    })

}

exports.getNewPassword = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    const token = req.params.token;

    User.findOne({
        resetToken: token, resetTokenExpiration: {
            $gt: Date.now()
        }
    })
        .then(user => {
            res.render('account/new-password', {
                path: '/new-password',
                title: 'Yeni Şifre',
                errorMessage: errorMessage,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    const userId = req.body.userId;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    })
    .then(user => {
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
    })
    .then(() => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
}

exports.getLogout = (req, res, next) => {
   
    req.session.isAuthenticated = false;
    res.redirect('/login');
}