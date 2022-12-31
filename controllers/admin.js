const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const Order = require('../models/order');
const validator = require('validator');

//----------- Product --------------
exports.getProducts = (req, res, next) => {
    Product.find()
        .populate('userId', 'name -_id')
        .select('image name price description userId')
        .then(products => {
            res.render('admin/products',
                {
                    products: products,
                    path: '/admin/products',
                    title: 'Admin Ürünler',
                    action: req.query.action
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getAddProducts = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    Category.find()
        .then(categories => {
            res.render('admin/add-product', {
                path: '/admin/add-product',
                title: 'Yeni Ürün',
                categories: categories,
                errorMessage: errorMessage
            });
        })
        .catch(err => console.log(err));

};

exports.postAddProducts = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const ids = req.body.categoryids;

    if (name === "" || price === "" || image === "") {
        req.session.errorMessage = "Lütfen tüm alanları doldurunuz!";
        return res.redirect('/admin/add-product');
    }

    const product = new Product({
        name: name,
        price: price,
        image: image,
        description: description,
        userId: req.user._id,
        categories: ids
    });

    product.save()
        .then(() => {
            if(!req.user.isAdmin){
                return res.redirect('/my-products');
            }
            else res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getDetailProduct = (req, res, next) => {
    Product.findById(req.params.productid)
        .then((product) => {
            if (!product) {
                return res.redirect('/shop/index');
            }
            res.render('admin/detail-product', {
                title: product.name,
                product: product,
                path: '/admin/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {

    Product.findOne({ _id: req.params.productid})
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            return product;
        })
        .then(product => {
            Category.find()
                .then(categories => {
                    categories = categories.map(category => {
                        if (product.categories) {
                            product.categories.find(item => {
                                if (item.toString() === category._id.toString()) {
                                    category.selected = true;
                                }
                            })
                        }
                        return category;
                    })
                    res.render('admin/edit-product', {
                        title: product.name,
                        product: product,
                        path: '/admin/products',
                        categories: categories
                    });
                })
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.body.imageUrl;
    const ids = req.body.categoryids;

    Product.updateOne({ _id: id},
        {
            $set: {
                name: name,
                price: price,
                image: image,
                description: description,
                categories: ids
            }
        }
    )
        .then(() => {
            if(!req.user.isAdmin){
                return res.redirect('/my-products?action=edit');
            }
            else res.redirect('/admin/products?action=edit');
        }).catch(err => console.log(err));
};

exports.postDeletProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.body.productid })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.redirect('/admin/products');
            }
            if(!req.user.isAdmin){
                return res.redirect('/my-products?action=delete');
            }
            else res.redirect('/admin/products?action=delete')
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find()
        .then(orders => {
            res.render('admin/orders',{
                orders: orders,
                path: '/admin/orders',
                title: 'Siparişler'
            })
        })
        .catch(err => console.log(err));
}

//----------- Category--------------
exports.getCategories = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render('admin/categories',
                {
                    categories: categories,
                    path: '/admin/categories',
                    title: 'Kategoriler',
                    action: req.query.action
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getAddCategories = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('admin/add-category', {
        path: '/admin/add-category',
        title: 'Yeni Kategori',
        errorMessage: errorMessage
    });
};

exports.postAddCategories = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;

    if(name === "" || description==="") {
        req.session.errorMessage = "Lütfen tüm alanları doldurunuz!";
        return res.redirect('/admin/add-category');
    }

    const category = new Category({
        name: name,
        description: description
    });

    category.save()
        .then(() => {
            res.redirect('/admin/categories');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.categoryid })
        .then((category) => {
            res.render('admin/edit-category', {
                title: category.name,
                category: category,
                path: '/admin/categories'
            })
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEditCategory = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.update({ _id: id },
        {
            $set: {
                name: name,
                description: description
            }
        })
        .then(result => {
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => console.log(err));
};

exports.postDeletCategory = (req, res, next) => {
    Category.deleteOne({ _id: req.body.categoryid })
        .then(result => {
            res.redirect('/admin/categories?action=delete')
        })
        .catch((err) => {
            console.log(err);
        });
};

// Kullanıcılar
exports.getAddAdmin = (req, res, next) => {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('admin/add-admin',{
        path:'admin/add-admin',
        title: 'Admin Ekle',
        errorMessage: errorMessage
    });
}

exports.postAddAdmin = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;

    if(name === "" || phone === "" || email === "" || password ===""){
        req.session.errorMessage = "Lütfen tüm alanları doldurunuz!";
        return res.redirect('/admin/add-admin');
    }

    if(!validator.isEmail(email)){
        req.session.errorMessage = "Geçersiz e-mail formatı!";
        return res.redirect('/admin/add-admin');
    }

    if(!validator.isMobilePhone(phone, 'tr-TR')){
        req.session.errorMessage = "Geçersiz telefon formatı!";
        return res.redirect('/admin/add-admin');
    }

    if(password.length < 4){
        req.session.errorMessage = "Şifre en az 4 karakter olmalıdır!";
        return res.redirect('/admin/add-admin');
    }

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu e-mail zaten kullanılıyor!';
                req.session.save(function (err) {
                    console.log(err);
                })
                return res.redirect('/admin/add-admin');
            }

            const newUser = new User({
                name: name,
                phone: phone,
                email: email,
                password: password,
                isAdmin: true,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(() => {
            res.redirect('/admin/users');

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

exports.getUsers = (req, res, next) => {
    User.find()
    .then(users => {
        res.render('admin/users',
            {
                users: users,
                path: '/admin/users',
                title: 'Kullanıcılar',
                action: req.query.action,
                myId: req.user._id.toString()
            });
    })
    .catch((err) => {
        console.log(err);
    });
};

exports.getEditUser = (req, res, next) => {
    const userid = req.params.userid;

    User.findOne({_id: userid})
        .then(user => {
            res.render('admin/edit-user', {
                user: user,
                title: user.name,
                path: '/admin/edit-user'
            })
        })
        .catch(err => console.log(err));
}

exports.postEditUser = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;

    User.updateOne({_id: id},
        {
            $set: {
                name: name,
                phone: phone,
                address: address
            }
        }
    )
    .then(() => {
        res.redirect('/admin/users?action=edit');
    }) 
    .catch(err => console.log(err));

}

exports.postDeletUser = (req, res, next) => {
    const id = req.body.userid;

    User.deleteOne({_id : id})
        .then(result => {
            if (result.deletedCount === 0) {
                return res.redirect('/');
            }
            else {
                Product.deleteMany({userId: id})
                    .then(() => {
                        res.redirect('/admin/users?action=delete'); 
                    })
                    .catch(err => console.log(err));
                
            }
        })
        .catch(err => console.log(err));
}