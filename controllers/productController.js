//Dependencies and Modules
const Product = require("../models/Product");
const User = require("../models/User");
const multer = require('multer');
const path = require('path');

// Create product
module.exports.addProduct = (req, res) => {

  let newProduct = new Product({
      name : req.body.name,
      description : req.body.description,
      price : req.body.price,
      image : req.file.path
  });

  return newProduct.save().then((result, error) => {

      if (error) {
          return res.send(false);
      } else {
          return res.send(`Successfully add the ${req.body.name}`);
      }
  })
  .catch(err => res.send(err))
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

module.exports.uploadImage = multer({

        storage: storage,
        limits: {fileSize: '100000000'},
        fileFilter: (req, file, cb) => {
          const fileTypes = /jpeg|jpg|png|gif/
          const mimeType = fileTypes.test(file.mimetype)
          const extname = fileTypes.test(path.extname(file.originalname))
        
          if(mimeType && extname) {
            return cb(null, true)
          }
          cb('Give proper file format to upload')
        }
      }).single('image')


// Retrieve all products
module.exports.getAllProducts = (req, res) => {
	return Product.find({}).then((result, error) => {
		return res.send(result)
	});
};

// Retrieve all active products
module.exports.getAllActive = (req, res) => {
    return Product.find({isActive : true}).then((result, error) => {
        return res.send(result)
    });
};

// Retrieving a specific products
module.exports.getProductById = (req, res) => {
    return Product.findById(req.params.productId).then((result, error) => {
        return res.send(result);
    })
}

// Updating a product
module.exports.updateProduct = (req, res) => {
    let updatedProduct = {
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    };

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then((result, error) => {
        if(error){
            return res.send(false)
        }
        else {
            return res.send(true)
        }
    })
}

// Archive a product

module.exports.archiveProduct = (req, res) => {

    let deActivateProduct = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.productId, deActivateProduct).then((product, error) => {
        if(error){
            return res.send(false)
        } else {
            return res.send(true)
        }
    })
    .catch(err => res.send(err))
}

// Activate a product
module.exports.activateProduct = (req, res) => {
	let activateProduct = {
		isActive: "true"
	}
	return Product.findByIdAndUpdate(req.params.productId, activateProduct).then((result, error) => {
		if(error){
			return res.send(false)
		}
		else {
			return res.send(true)
		}
	})
}

module.exports.searchProductsByName = async (req, res) => {
	try {
	  const { productName } = req.body;
  
	  // Use a regular expression to perform a case-insensitive search
	  const products = await Product.find({
		name: { $regex: productName, $options: 'i' }
	  });
  
	  res.json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports.searchProductsByPriceRange = async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.body;
  
      // Find products within the price range
      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });
  
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for products' });
    }
  };

  module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
    const productId = req.params.productId;
  
    try {
      // Find the course by courseId
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Get the userIds of enrolled users from the course
      const userIds = product.userOrders.map(customer => customer.userId);
  
      // Find the users with matching userIds
      const enrolledUsers = await User.find({ _id: { $in: userIds } });
  
      // Extract the emails from the enrolled users
      const emails = enrolledUsers.map(user => user.email);
  
      res.status(200).json({ emails });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while retrieving customer users' });
    }
  };