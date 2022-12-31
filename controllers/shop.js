const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/index',
                        {
                            products: products,
                            path: '/index',
                            title: 'Ana Sayfa',
                            categories: categories
                        });
                })
                .catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/products',
                        {
                            products: products,
                            path: '/products',
                            categories: categories,
                            title: 'Ürünler'
    
                        });
                })
                .catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });

};

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productid)
        .then((product) => {
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getproductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid;
    const model = [];

    //categoryid eşleşen productları al
    Category.find()
        .then(categories => {
            model.categories = categories;
            return Product.find({categories:categoryid});
        })
        .then(products => {
            res.render('shop/products', {
                title: "products",
                products: products,
                categories: model.categories,
                selectedCategory: categoryid,
                path: `/products`
            })
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    if(!req.user.isAdmin){
        return req.user.getCart()
        .then(products => {
            res.render('shop/cart',
                {
                    path: '/cart',
                    title: 'Sepet',
                    products: products,
                });
        })
        .catch(err => console.log(err));
    }
    res.redirect('/');
    
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })


};

exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user
        .deleteCartItem(productid)
        .then(() => {
            res.redirect('/cart?action=delete');
        }).catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    if(req.user.isAdmin) {
        return res.redirect('/');
    }
    Order.find({'user.userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    name: req.user.name,                    
                    address: user.address,
                    email: req.user.email
                },
                items: req.user.cart.items.map(p => {
                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            image: p.productId.image
                        },
                        quantity: p.quantity
                    };
                })
            });

            return order.save();
        })
        .then(() => {
            return req.user.clearCart()
                .then(() => {
                    res.redirect('/orders');
                })
        })
        .catch(err => console.log(err));
};

exports.getAddProducts = (req, res, next) => {
    if(req.user.isAdmin){
        return res.redirect('admin/add-product');
    }
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    Category.find()
        .then(categories => {
            res.render('shop/add-product', {
                path: '/add-product',
                title: 'Yeni Ürün',
                categories: categories,
                errorMessage: errorMessage
            });
        })
        .catch(err => console.log(err));

};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const ids = req.body.categoryids;

    if (name === "" || price === "" || image === "") {
        req.session.errorMessage = "Lütfen tüm alanları doldurunuz!";
        return res.redirect('/add-product');
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
            res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getMyProducts = (req, res, next) => {
    if(req.user.isAdmin){
        return res.redirect('admin/products');
    }
    Product.find({ userId: req.user._id })
        .populate('userId', 'name -_id')
        .select('image name price description userId')
        .then(products => {
            res.render('shop/my-products',
                {
                    products: products,
                    path: '/my-products',
                    title: 'Ürünlerim',
                    action: req.query.action,
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getInfo = (req, res, next) => {
    User.findOne({_id: req.user._id})
        .then(user => {
            res.render('shop/my-page',{
                user: user,
                title: user.name,
                path: '/my-page'
            })
        })
        .catch(err => console.log(err));
}

exports.getEditInfo = (req, res, next) => {
    User.findOne({_id: req.user._id})
        .then(user => {
            res.render('shop/edit-user',{
                user: user,
                title: 'Güncelle',
                path: 'shop/edit-user'
            })
        })
        .catch(err => console.log(err));
}

exports.postEditInfo = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const password = req.body.password;

    User.updateOne({_id:id},
        {
            $set: {
                name: name,
                phone: phone,
                address: address,
                password: password
            }
        }
    )
    .then(() => {
        res.redirect('/my-page?action=edit');
    }) 
    .catch(err => console.log(err));
}

exports.postDeleteMyAccount = (req, res, next) => {
    const id = req.body.userid;

    User.deleteOne({_id : id})
        .then(result => {
            if (result.deletedCount === 0) {
                return res.redirect('/my-page');
            }
            else {
                Product.deleteMany({userId: id})
                    .then(() => {
                       res.redirect('/logout'); 
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}
