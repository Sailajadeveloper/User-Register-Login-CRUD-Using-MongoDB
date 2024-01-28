const { users } = require("../../imports");
const { token, responseObj } = require("../../utils/Utils");

exports.userRegistration = async(req,res) =>{
    try{
        const {email,name,password,hashPassword} = req.body;
        console.log(hashPassword,"====hashPassword")
        const emailExists = await users.find({email});
        console.log(emailExists,"====emailExists===")
        if(emailExists.length > 0){
            return res.json({status:false, statusCode: 204, message: "Email Id already Existed! Use Different Email Id."});
        }
        const createUser = await users.create({email, name, password: req.body.hashPassword});
        console.log(createUser,'====createUser userRegisteration');
        const selectedFields = createUser.toObject({ transform: (doc, ret) => ({ name: ret.name, email: ret.email }) });
        console.log(selectedFields, '====createUser userRegistration');
        if(createUser){
            return res.json({status:false, statusCode: 200, message: "Users List Found!", data: selectedFields});
        }
    }catch(err){
        console.log(err, "=====err userRegistration")
        return res.json({statusCode: 500, message: "Something Went Wrong!", Error: err.message});
    }
}

exports.userLogin = async(req,res) =>{
    try{
        const {email, password} = req.body;
        let userData = await users.findOne({email},{_id:1,name:1,email:1})
        console.log(userData,"====userData")
        if(!userData){
            return res.json({status:false, statusCode: 204, message: "User Data Not Found!", data: userData});
        }
        const payload = {
            email: userData.email,
            id: userData._id
        }
        console.log(payload,"====payload")
        const tokengen = token(payload);
        console.log(tokengen,"====tokengen");
        const finalResponse = {...userData._doc, tokengen}
        console.log(finalResponse,"===after finalResponse")
        return res.json({status:true, statusCode: 200, message: "User Data Found!", data: finalResponse});
    }catch(err){
        console.log(err, "===err login")
        return res.json({status:false, statusCode: 500, message: "Something Went Wrong!", Error: err.message});
    }
}

// Get Users List Start 
exports.userList = async(req,res) =>{
    try{
        const usersList = await users.find();
        console.log(usersList,"===usersList");
        if(!usersList.length>0){
            return res.json({statusCode: 204, message: "Users List Not Found!", data: usersList});
        }
        return res.json({statusCode: 200, message: "Users List Found!", data: usersList});
    }catch(err){
        console.log(err,"====err userList")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
    }
}
// Get Users List End 

// Get User Data By ID Start 
exports.userData = async(req,res) =>{
    const tokenExpired = req.body.token_expire;
    try{
        const userId = req.params.id;
        const userData = await users.findById(userId);
        console.log(userData,"======userData");
        if(!userData){
            return res.json(responseObj(false, 204, tokenExpired, "User Data Not Found!", userData));
        }
        return res.json(responseObj(false, 204, tokenExpired, "User Data Found!", userData));
        // return res.json({status:false, statusCode: 200, message: "User Data Found!", data: userData});
    }catch(err){
        console.log(err,"====err userData")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
        // return res.json({status:false, statusCode: 500, message: "Something Went Wrong!", Error: err});
    }
}
// Get User Data By ID End 

// Save User Data Start 
exports.saveUser = async(req,res) =>{
    const tokenExpired = req.body.token_expire;
    try{
        const {email, mobile} = req.body
        console.log(req.body,"====createUser req.body")
        const getUserEmail = await users.findOne({email})
        console.log(getUserEmail,"====getUserEmail");
        if(!getUserEmail){
            return res.json({status:false, statusCode: 204, message: "User Email Not Found!"});
        }
        const updateUser = await users.findOneAndUpdate(
            {email},
            {$set:{mobile,updated_at: Date.now()}},
            { new: true }
            ).select('_id name email mobile');
        console.log(updateUser,"====updateUser");
        if(updateUser){
            return res.json(responseObj(false, 200, tokenExpired, "User Saved Successfully!", updateUser));
        }else{
            return res.json(responseObj(false, 204, tokenExpired, "User Not Saved Successfully!", updateUser));
        }
        // return res.json({statusCode: 200, message: "User Saved Successfully!", data: updateUser});
    }catch(err){
        console.log(err,"====err createUser")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
    }
}
// Save User Data End

// Update User Data By ID Start
exports.updateUserData = async(req,res) =>{
    const tokenExpired = req.body.token_expire;
    try{
        const userId = req.params.id;
        const {mobile} = req.body;
        const findId = await users.findById(userId)
        if(!findId){
            return res.json(responseObj(false, 204, tokenExpired, "User ID Not Found!"));
        }
        const updateUserMob = await users.findByIdAndUpdate(
            userId, 
            {mobile, updated_at: Date.now()},
            { new: true }
        ).select('_id name email mobile');
        console.log(updateUserMob,"=====updateUserMob");
        if(!updateUserMob){
            return res.json(responseObj(false, 204, tokenExpired, "User Data Not Found!", updateUserMob));
        }
        return res.json(responseObj(false, 200, tokenExpired, "User Data Updated Successfully!", updateUserMob));
    }catch(err){
        console.log(err,"====err updateUserData")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
    }
}
// Update User Data By ID End

// Delete User Data By ID Start
exports.DeleteUserData = async(req,res) =>{
    const tokenExpired = req.body.token_expire;
    try{
        const userId = req.params.id;
        const findId = await users.findById(userId)
        if(!findId){
            return res.json(responseObj(false, 204, tokenExpired, "User ID Not Found!"));
        }
        const deleteUser = await users.findByIdAndDelete(userId);
        if(!deleteUser){
            return res.json(responseObj(false, 204, tokenExpired, "User Data Not Found!", deleteUser));
            // return res.json({statusCode: 204, message: "User Data Not Found!", data: deleteUser});
        }
        return res.json(responseObj(false, 200, tokenExpired, "User Data Deleted Successfully!"));
        // return res.json({statusCode: 200, message: "User Data Deleted Successfully!"});

    }catch(err){
        console.log(err,"====err DeleteUserData")
        return res.json(responseObj(false, 500, tokenExpired, "Something Went Wrong!", err));
    }
}
// Delete User Data By ID End

