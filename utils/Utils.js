bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET='addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';
const options = { expiresIn: '600d' };

validations = (requestData, schema, cb) => {
    let keys = Object.keys(requestData)
    console.log("---validations")
    let temp_array = [];
    for (var i in schema) {
        if (!keys.includes(schema[i]) || requestData[schema[i]] == null || requestData[schema[i]] == undefined){
            temp_array.push(schema[i].toUpperCase().replace(/_/g, " "))
        }
    }
    if (temp_array.length > 0) {
        let adverb = temp_array.length > 1 ? " are" : " is"
        let message = temp_array + adverb + " missing"
        cb(message)
    } else
        cb(null, true)

}

const response = (status, statusCode, isTokenExpired, message) => {
    return { result: { status, statusCode, isTokenExpired, message } }
}
const responseObj = (status = false, statusCode = "500", isTokenExpired = false, message = messages.SomethingWentWromg, data = {}) => {
    return { result: {status, statusCode, isTokenExpired, message, data } }
}

hashPassword = (password, cb) => {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            cb(err);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err)
                cb(err, { message: "error occured", password: '' });
            else
                cb(null, { message: "successful", password: hash })
        })
    })
}
const comparePassword = async (plainPassword, hash) => {
    console.log(plainPassword, hash);
    return new Promise(async(resolve, reject) => {

        try {
            let result = await bcrypt.compare(plainPassword, hash)
            result = JSON.parse(JSON.stringify(result))
            console.log(result,"=====result =====");

            resolve(result);
        } catch (error) {
            console.log(error);

            reject(error);
        }
    })
}

const token = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : JWT_SECRET, options);
}

verifyToken = (req,res,next) =>{
    const authToken = req.headers.authorization;
    console.log(authToken,"=======authToken");
    if (!authToken) {
        return res.json({ status:false, statusCode: 400, error: 'Unauthorized: Token is missing' });
    }
    console.log(authToken, process.env.JWT_SECRET ? process.env.JWT_SECRET : JWT_SECRET);
    jwt.verify(authToken.replace('Bearer ',''), process.env.JWT_SECRET ? process.env.JWT_SECRET : JWT_SECRET, options, function (err, res) {
        if(err){
            console.log(err,"====err verify jwt");
        }
        console.log(res, 'res');
        if(res.iat > res.exp){
            req.body.token_expire = true;
            res.json({status:false, statusCode: 400, message: "Auth-Token Expired!"})
        }
        req.body.token_expire = false
        next();
    })
}

function validateEmail(email) {
    // Regular expression pattern for a valid email address
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  }

function validateMobileNumber(input) {
var pattern = /^[0-9]{10}$/;
return pattern.test(input);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    const isValidPassword = passwordRegex.test(password);

    return isValidPassword;
}

  module.exports = {response, validations, hashPassword, comparePassword, token,
     verifyToken, validateEmail, validateMobileNumber, responseObj, validatePassword
 }