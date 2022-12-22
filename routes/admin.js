const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

// Ürünler
router.get('/products', adminController.getProducts);
// /admin/add-product=>GET
router.get('/add-product', adminController.getAddProducts);
// /admin/add-product=>POST
router.post('/add-product', adminController.postAddProducts);

router.get('/edit-product/:productid', adminController.getEditProduct);

router.post('/products', adminController.postEditProduct);

router.get('/detail-product/:productid', adminController.getDetailProduct);

router.post('/delete-product', adminController.postDeletProduct);

// Kategoriler

router.get('/categories', adminController.getCategories);

router.get('/add-category', adminController.getAddCategories);

router.post('/add-category', adminController.postAddCategories);

router.get('/edit-category/:categoryid', adminController.getEditCategory);

router.post('/categories', adminController.postEditCategory);

router.post('/delete-category', adminController.postDeletCategory);


module.exports = router;
