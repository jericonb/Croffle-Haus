//Modules and Dependencies
const mongoose = require("mongoose");

//Schema/Blueprint
const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
    },
    lastName: {
        type : String,
    },
    mobileNo: {
        type : Number,
    },
    email : {
        type : String,
        required : [true, "Email is required"]
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    orderedProduct :
        [{
            products : 
            [{
                productId : {
                    type : String,
                    required : [true, "Product ID is required"]
                },
                productName : {
                    type : String
                    
                },
                quantity : {
                    type : Number
                }
            }],
            totalAmount : {
                type : Number
                
            },
            purchasedOn : {
                type: Date,
				default: new Date()
            }
        }]
})

//Model
    module.exports = mongoose.model("User", userSchema);