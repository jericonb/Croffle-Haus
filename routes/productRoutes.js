//Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth");

//Routing Component
const router = express.Router();

const {verify, verifyAdmin} = auth;

//Creating Product (Admin) @@@@@@@@@@@@@@@@@@@@@@@@@@
    router.post("/add", verify, verifyAdmin, productController.uploadImage, productController.addProduct);

//Retrieving all the products @@@@@@@@@@@@@@@@@@@@@@@
    router.get("/all", productController.getAllProducts);

//Retrieving all ACTIVE products @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    router.get("/active", productController.getAllActive);

//Route for retrieving a specific product @@@@@@@@@@@@@@@@@@@
    router.get("/:productId", verify, productController.getProductById);

// Route for updating a product(Admin) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

//Route to archiving a product (Admin) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route to activating a product (Admin) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//[SECTION] Route for Search Product by Name @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	router.post('/searchByName', productController.searchProductsByName);	

//[ACTIVITY] Search Courses By Price Range @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	router.post('/searchByPrice', productController.searchProductsByPriceRange);

// [SECTION]Route to get the emails of users ordered the product
router.get('/:productId/enrolled-users', productController.getEmailsOfEnrolledUsers);

// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
