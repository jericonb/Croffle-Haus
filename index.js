//Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
require('dotenv').config();

// Environment Setup
const port = 4002;

// Server Setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Static images
app.use('/Images', express.static('./Images'))

//Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);


// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true    
});

// Prompts a message in the terminal once the connection is "open" and we are ablt to successfully connect to our database
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// Server gateway response

if(require.main === module){
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${process.env.PORT || port}`)
	})
}

// export mongoose only for checking
module.exports = {app, mongoose};


