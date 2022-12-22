const Product = require('../models/product');
const Category = require('../models/category');

//----------- Product --------------
exports.getProducts = (req, res, next) => {
    Product.find()
        .populate('userId', 'name -_id')
        .select('image name price description userId')
        .then(products => {
            console.log(products)
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
    res.render('admin/add-product', {
        path: '/admin/add-product',
        title: 'Yeni Ürün'
    })
};

exports.postAddProducts = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    // const categoryid = req.body.categoryid;

    const product = new Product({
        name: name,
        price: price,
        image: image,
        description: description,
        userId: req.user._id
    });

    product.save()
        .then(() => {
            res.redirect('/admin/products');
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
    Product.findById(req.params.productid)
        .then((product) => {
            res.render('admin/edit-product', {
                title: product.name,
                product: product,
                path: '/admin/products'
                // categories: categories
            });
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
    const categories = req.body.categoryids;

    Product.update({ _id: id },
        {
            $set: {
                name: name,
                price: price,
                image: image,
                description: description,
                userId: req.user._id
                // category: category,
            }
        }
    )
        .then(() => {
            res.redirect('/admin/products?action=edit');
        }).catch(err => console.log(err));
};

exports.postDeletProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.body.productid })
        .then(result => {
            res.redirect('/admin/products?action=delete')
        })
        .catch((err) => {
            console.log(err);
        });
};

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
    res.render('admin/add-category', {
        path: '/admin/add-category',
        title: 'Yeni Kategori'
    });
};

exports.postAddCategories = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;

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
    Category.deleteOne({_id: req.body.categoryid})
        .then(result => {
            res.redirect('/admin/categories?action=delete')
        })
        .catch((err) => {
            console.log(err);
        });
};

