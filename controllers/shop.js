const Product = require('../models/product');
const Category = require('../models/category');
// const OrderItem = require('../models/orderitem');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index',
                {
                    products: products,
                    path: '/index',
                    title: 'Ana Sayfa',
                    // categories: categories,
                    isAuthenticated: req.session.isAuthenticated
                });

            // Category.findAll()
            //     .then(categories => {
            //         res.render('shop/index',
            //             {
            //                 products: products,
            //                 path: '/index',
            //                 title: 'Ana Sayfa',
            //                 categories: categories,
            //                 isAuthenticated: req.session.isAuthenticated
            //             });
            //     })
            //     .catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products',
                {
                    products: products,
                    path: '/products',
                    // categories: categories,
                    title: 'Ürünler'
                });


            // Category.findAll()
            //     .then(categories => {
            //         res.render('shop/products',
            //             {
            //                 products: products,
            //                 path: '/products',
            //                 categories: categories,
            //                 title: 'Ürünler'
            //             });
            //     })
            //     .catch(err => console.log(err));
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
    Category.findAll()
        .then(categories => {
            model.categories = categories;
            return Product.findByCategoryId(categoryid);
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
    req.user.getCart()
        .then(products => {
            res.render('shop/cart',
                {
                    path: '/cart',
                    title: 'Sepet',
                    products: products
                });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let quantity = 1;
    let userCart;

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
    req.user.getOrders()
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
        .addOrder()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

