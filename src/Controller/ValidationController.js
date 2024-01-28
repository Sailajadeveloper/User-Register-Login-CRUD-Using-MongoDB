const { users } = require("../../imports");
const { validations, validateEmail, hashPassword, comparePassword, response, validateMobileNumber, responseObj, validatePassword } = require("../../utils/Utils");


exports.validateUserRegistration = async(req,res,next) =>{
    const data = req.body;
    let schema = [
        "name",
        "email",
        "password",
        "confirm_password",
    ];
    validations(data, schema, function (err, result) {
        if (err) {
            return res.json({status: false, statusCode: 400, Message: err});
        } else {
        if(!validatePassword(data.password)){
            return res.json({status: false, statusCode: 400, Message: 
            "Invalid password! It must contain 8 characters, including uppercase, lowercase, special characters, and numbers."});
        }
        if (data.password != data.confirm_password) {
            return res.json({status: false, statusCode: 400, Message: "Password  miss-matches to Confirm Password!"});
        }
        if (!validateEmail(data.email)) {
            return res.json({status: false, statusCode: 400, Message: "Invalid Email Id!"});
        } else {
            hashPassword(data.password, function (err, resp) {
            try {
                data.hashPassword = resp.password;
                data.email = data.email.toLowerCase();
                next();
            } catch (error) {
                console.log("Error", error);
                // return res.json(response(false, 400, false, err));
              return res.json({status: false, statusCode: 500, message: "Something Went Wrong!", Error: err});
            }
            });
        }
        }
    });
}

exports.validateUserLogin = async(req,res,next) =>{
    try{
        const data = req.body;
        let schema = [
            "email",
            "password",
        ];
        validations(data, schema,  async(err, result) =>{
            if (err) {
                return res.json({status: false, statusCode: 400, Message: err});
            } else {
                if (!validateEmail(req.body.email)) {
                    return res.json({status: false, statusCode: 400, Message: "Invalid Email Id!"});
                } else {
                    data.email = data.email.toLowerCase();
                    const userData = await users.findOne({email: data.email})
                    console.log(userData,"====userData")
                    if(!userData){
                        return res.json({status: false, statusCode: 400, Message: "Invalid Email Id!"});
                    }
                    let compPswd = await comparePassword(data.password, userData.password);
                    console.log(compPswd,"====compPswd==")
                    if(!compPswd){
                        return res.json({status: false, statusCode: 400, Message: "Invalid Password!"});
                    }else{
                        next();
                    }
                }
            }
        })
    }catch(err){
        console.log(err,"==err validat")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
    }
}

exports.validateUserList = async(req,res,next) =>{
    next()
}

exports.validateUserData = async(req,res,next) =>{
    const userId  = req.params.id;
    console.log(userId,"====userId val");
    const tokenExpired = req.body.token_expire;
    console.log(tokenExpired,"===tokenExpired==")
    if(!userId){
        console.log(res.json(response(false, 400, tokenExpired, "ID missing in Params!")),"============im sail")
        return res.json(response(false, 400, tokenExpired, "ID missing in Params!"));
    }
    next();
}

exports.validateSaveUser = async(req,res,next) =>{
    const reqData = req.body;
    const schema = ['email','mobile'];
    validations(reqData,schema, (err,resp)=>{
        if(err){
            return res.json(response(false, 400, false, err));
        }else{
            if (!validateEmail(reqData.email)) {
                return res.json({status: false, statusCode: 400, Message: "Invalid Email Id!"});
            }
            if(!validateMobileNumber(reqData.mobile)){
                return res.json({status: false, statusCode: 400, Message: "Invalid Mobile Number!"});
            }
            reqData.email = reqData.email.toLowerCase();
            next();
        }
    })
}

exports.validateUpdateUserData = async(req,res,next) => {
    const reqData = req.body;
    const schema = ['mobile'];
    validations(reqData,schema, (err,resp)=>{
        if(err){
            return res.json(response(false, 400, false, err));
        }else{
            if(!validateMobileNumber(reqData.mobile)){
                return res.json({status: false, statusCode: 400, Message: "Invalid Mobile Number!"});
            }
            next();
        }
    })
}

exports.validateDeleteUserData = async(req,res,next) => {
    next();
}

