//JSON Web Tokens
const jwt = require("jsonwebtoken");

// Secret Keyword
    const secret = "CourseBookingAPI";


// JSON Web Tokens


// Token creation 
    module.exports.createAccessToken = (user) => {
        const data = {
            id : user._id,
            email : user.email,
            isAdmin : user.isAdmin
        };
        return jwt.sign(data, secret, {});      
    };



//Token Verification
 
    module.exports.verify = (req, res, next) => {
        console.log(req.headers.authorization);

    
        let token = req.headers.authorization;

        if(typeof token === "undefined"){
            return res.send({auth: "Failed. No Token"});
        } else {
            console.log(token);     
            token = token.slice(7, token.length);
            console.log(token);

//Token decryption
  
            jwt.verify(token, secret, function(err, decodedToken){
                if(err){
                    return res.send({
                        auth: "Failed",
                        message: err.message
                    });
                } else {
                    console.log(decodedToken);               
                    req.user = decodedToken
                    next();
                }
            })
        }
    };




// verifyAdmin will also be used a middleware.
module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        next();
    } else {
        return res.send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
}







