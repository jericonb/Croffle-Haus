// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");
const auth = require('../auth');

const {verify, verifyAdmin} = auth;



// Routing Component
const router = express.Router();

// Route for user registration @@@@@@@@@@@@@@@@@
router.post("/register", (req, res) => {
	userController.userRegister(req.body).then(resultFromController => {
		res.send(resultFromController)
	})
})

//[SECTION] Routes - POST
router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
})

//  Route for user authentication @@@@@@@@@@@@@@@@@@@@@@@@
router.post("/login", userController.userLogin);

// Route to order a product@@@@@@@@@@@@@@@@@@@
router.post("/order", verify, userController.userOrderProduct)

// Get Logged User's Order Route
 router.get('/userOrder', verify, userController.getOrder)

 // Get Logged User details Route @@@@@@@@@@@@@@
 router.get("/details", verify, userController.getDetails);

 router.get("/:userId", userController.getUser);

 // Update to Admin Route
 router.put("/updateAdmin", verify, verifyAdmin, userController.updateAdmin)

 //[ACTIVITY] Update enrollment status route
 router.put('/productStatusUpdate', userController.updateProductStatus);	

 //[SECTION] Reset Password @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 router.put('/reset-password', verify, userController.resetPassword);

 //[SECTION] Update Profile	 @@@@@@@@@@@@@@@@@@@@@@@
 router.put('/profile', verify, userController.updateProfile);


// Export Route System
module.exports = router;


