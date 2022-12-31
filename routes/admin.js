const express = require('express');
const router = express.Router();

const  authentication = require('../middleware/authentication');

const adminController = require('../controllers/admin');

const isAdmin = require('../middleware/isAdmin');

const isAuthenticated = require('../middleware/isAuthenticated');


// Ürünler
router.get('/products',  isAdmin, isAuthenticated, authentication, adminController.getProducts);
// /admin/add-product=>GET
router.get('/add-product',  isAdmin, isAuthenticated, authentication, adminController.getAddProducts);
// /admin/add-product=>POST
router.post('/add-product',  isAdmin, isAuthenticated, authentication, adminController.postAddProducts);

router.get('/edit-product/:productid', isAdmin, isAuthenticated, authentication, adminController.getEditProduct);

router.post('/products', isAdmin, isAuthenticated, authentication, adminController.postEditProduct);

router.get('/detail-product/:productid', isAdmin, isAuthenticated, authentication, adminController.getDetailProduct);

router.post('/delete-product', isAdmin, isAuthenticated, authentication, adminController.postDeletProduct);

router.get('/add-admin', isAdmin, isAuthenticated, authentication, adminController.getAddAdmin);

router.post('/add-admin', isAdmin, isAuthenticated, authentication, adminController.postAddAdmin);

// Kategoriler

router.get('/categories', isAdmin, isAuthenticated, authentication, adminController.getCategories);

router.get('/add-category', isAdmin, isAuthenticated, authentication, adminController.getAddCategories);

router.post('/add-category', adminController.postAddCategories);

router.get('/edit-category/:categoryid', isAdmin, isAuthenticated, authentication, adminController.getEditCategory);

router.post('/categories', adminController.postEditCategory);

router.post('/delete-category', adminController.postDeletCategory);

router.get('/orders', isAdmin, isAuthenticated, authentication, adminController.getOrders);
//Kullanıcılar

router.get('/users', isAdmin, isAuthenticated, authentication, adminController.getUsers);

router.get('/edit-user/:userid', isAdmin, isAuthenticated, authentication, adminController.getEditUser);

router.post('/edit-user', adminController.postEditUser);

router.post('/delete-user', isAdmin, isAuthenticated, authentication, adminController.postDeletUser);


module.exports = router;
