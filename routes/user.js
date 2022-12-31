const express = require('express');
const router = express.Router();

const authentication= require('../middleware/authentication');

const shopController = require('../controllers/shop');

const isAuthenticated = require('../middleware/isAuthenticated');

const isAdmin = require('../middleware/isAdmin');

router.get('/', isAdmin, isAuthenticated, shopController.getIndex);

router.get('/products', isAdmin, isAuthenticated, shopController.getProducts);

router.get('/products/:productid', isAdmin, isAuthenticated, shopController.getProduct);

router.get('/categories/:categoryid', isAdmin, isAuthenticated, shopController.getproductsByCategoryId);

router.get('/my-products', isAdmin, isAuthenticated,authentication, shopController.getMyProducts);

router.get('/add-product', isAdmin, isAuthenticated,authentication, shopController.getAddProducts);

router.post('/add-product', isAdmin, isAuthenticated,authentication, shopController.postAddProduct);

router.get('/cart', isAdmin, isAuthenticated, authentication, shopController.getCart);

router.post('/cart', isAdmin, isAuthenticated, authentication, shopController.postCart);

router.post('/delete-cartitem', isAdmin, isAuthenticated, authentication, shopController.postCartItemDelete);

router.get('/orders', isAdmin, isAuthenticated, authentication, shopController.getOrders);

router.post('/create-order', isAdmin, isAuthenticated, authentication, shopController.postOrder);

//account
router.get('/my-page', isAdmin, isAuthenticated, authentication, shopController.getInfo);

router.get('/edit-info', isAdmin, isAuthenticated, authentication, shopController.getEditInfo);

router.post('/edit-info',authentication, shopController.postEditInfo);

router.post('/delete-account', isAuthenticated, authentication, shopController.postDeleteMyAccount);

module.exports = router;