//Dependencies and Modules
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");



// User Registration
// newUser.email === req.email

module.exports.userRegister = (reqBody) => {

	// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
	// Uses the information from the request body to provide all the necessary information
	let newUser = new User({
		firstName : reqBody.firstName,
		lastName : reqBody.lastName,
		email : reqBody.email,
		mobileNo : reqBody.mobileNo,
		password : bcrypt.hashSync(reqBody.password, 10)
	})

	// Saves the created object to our database
	return newUser.save().then((user, error) => {

		// User registration failed
		if (error) {
			return false;

		// User registration successful
		} else {
			return true;
		}
	})
	.catch(err => err)
};

//[SECTION] Check if the email already exists

module.exports.checkEmailExists = (reqBody) => {

	// The result is sent back to the frontend via the "then" method found in the route file
	return User.find({email : reqBody.email}).then(result => {

		// The "find" method returns a record if a match is found
		if (result.length > 0) {
			return true;

		// No duplicate email found
		// The user is not yet registered in the database
		} else {
			return false;
		}
	})
	.catch(err => res.send(err))
};


// Login and User Authentication

module.exports.userLogin = (req, res) => {
	User.findOne({ email : req.body.email} ).then(result => {

		console.log(result);

		// User does not exist
		if(result == null){

			return res.send(false);

		// User exists
		} else {
			
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
			// If the passwords match/result of the above code is true
			if (isPasswordCorrect) {

				return res.send({ access : auth.createAccessToken(result) })

			// Passwords do not match
			} else {

				return res.send(false);
			}
		}
	})
	.catch(err => res.send(err))
};

// Non-admin user checkout / create order of product

module.exports.userOrderProduct = async (req, res) => {
	console.log(req.user.id)
	console.log(req.body.productId)

	if(req.user.isAdmin){
		return res.send("Action Forbidden")
	}

	let isUserUpdated = await User.findByIdAndUpdate(req.user.id).then(user => {
		
		let { productId, productName, quantity, totalAmount } = req.body;
		
  		let newOrderedProduct = {
			products: {
				productId,
				productName,
				quantity
			},
			totalAmount
  		};

		console.log(productId, productName, quantity, totalAmount);

		user.orderedProduct.push(newOrderedProduct);

		console.log(newOrderedProduct)
		return user.save()
		.then(user => true)
		.catch(err => err.message);
	})
	if(isUserUpdated !== true){
		return res.send({message: isUserUpdated})
	}
	let isProductUpdated = await Product.findById(req.body.productId).then(product => {

		let userOrder = {
			userId: req.user.id
		}
		product.userOrders.push(userOrder)
		return product.save().then((product, error) => true).catch(err => err.message)
	})

	if(isProductUpdated !== true){
		return res.send({message: isProductUpdated})
	}
	if(isUserUpdated && isProductUpdated){
		return res.send({message: "Order Successful"})
	}
}

// Getting user's order product

module.exports.getOrder = (req, res) => {
    User.findById(req.user.id)
        .populate({
            path: 'orderedProduct.products.productId',
            model: 'Product',
            select: 'name price quantity' 
        })
        .select('orderedProduct.purchasedOn')
        .then((user) => {
            const orders = user.orderedProduct.map(order => {
                const totalAmount = order.products.reduce((total, product) => {
                    return total + (product.productId.price * product.quantity);
                }, 0);

                const quantity = order.products.reduce((total, product) => {
                    return total + product.quantity;
                }, 0);

                return {
                    products: order.products,
                    totalAmount,
                    purchasedOn: order.purchasedOn,
                    quantity
                };
            });

            res.send(orders);
        })
        .catch(err => res.send(err))
}

// Getting user's details
module.exports.getDetails = (req, res) => {
    return User.findById(req.user.id).then((result, error) => {
        result.password = "";
        return res.send(result);
    })
    .catch(err => res.send(err))
};

module.exports.getUser = (req, res) => {
	return User.findById(req.params.userId).then((result, error) => {
		return res.send(result)
	})
}

// Update to Admin
module.exports.updateAdmin = (req, res) => {
	let updatedAdminUser = {
		isAdmin: true
	}

	return User.findByIdAndUpdate(req.body.userId, updatedAdminUser).then((result, error) => {
		if(error){
			return res.send(false)
		}
		else {
			return res.send({message: "User updated as admin successfully"})
		}

	})
}

module.exports.resetPassword = async (req, res) => {
	try {

	//console.log(req.user)
	//console.log(req.body)

	  const { newPassword } = req.body;
	  const { id } = req.user; // Extracting user ID from the authorization header
  
	  // Hashing the new password
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
	  // Updating the user's password in the database
	  await User.findByIdAndUpdate(id, { password: hashedPassword });
  
	  // Sending a success response
	  res.status(200).send({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Internal server error' });
	}
};

module.exports.updateProfile = async (req, res) => {
	try {

		console.log(req.user);
		console.log(req.body);
		
	// Get the user ID from the authenticated token
	  const userId = req.user.id;
  
	  // Retrieve the updated profile information from the request body
	  const { firstName, lastName, mobileNo } = req.body;
  
	  // Update the user's profile in the database
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ firstName, lastName, mobileNo },
		{ new: true }
	  ).exec();
  
	  res.send(updatedUser);
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Failed to update profile' });
	}
  }

  module.exports.updateProductStatus = async (req, res) => {
	try {
	  const { userId, productId, isActive } = req.body;
  
	  // Find the user and update the enrollment status
	  const user = await User.findById(userId);
  
	  // Find the enrollment for the course in the user's enrollments array
	  const product = user.products.find((product) => {product.productId === productId});
  
	  if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	  }
  
	  product.isActive = isActive;
	  
  
	  // Save the updated user document
	  await user.save();
  
	  res.status(200).json({ message: 'Product status updated successfully' });
	} catch (error) {
	  res.status(500).json({ error: 'An error occurred while updating the product status' });
	}
  };	

  module.exports.updateUserOrder = async (req, res) => {
	try {

		console.log(req.user);
		console.log(req.body);
		
	// Get the user ID from the authenticated token
	  const userId = req.user.id;
  
	  // Retrieve the updated profile information from the request body
	  const { quantity } = req.body;
  
	  // Update the user's profile in the database
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ quantity },
		{ new: true }
	  ).exec();
  
	  res.send(updatedUser);
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Failed to update profile' });
	}
  }