const jwt = require('jsonwebtoken');
const userModel = require('../model/UserModel');
const validator = require('../validator/validator');

const auth = async function (req,res,next) {
    try {
        let token = req.headers["x-auth-token"];
        // console.log(token);
        if(!token){
            return res.status(404).send({msg:"Token is not present"})
        }

        let tokenIsVerify = jwt.verify(token,"Shubham")

        if(!tokenIsVerify){
            return res.status(404).send({msg:"not a correct token"})
        }

        next();

    } catch (error) {
        return res.status(500).send({msg:error.message})
    }
}

const autho = async function (req,res,next) {
    let token = req.headers["x-auth-token"]
//    console.log(token);
    let userId = req.params.userId;
 
    let userPresent = await userModel.findOne({
        _id:userId
      })


      if(!userPresent){
        return res
        .status(404)
        .send({ status: false, msg: `user with this ID: ${userId} is not found` });
      }

      let decodedToken =jwt.verify(token, "Shubham")

      if (decodedToken.userId!=userId) {
        return res.status(403).send({status:false,message:"you are not authorized"})
      }else{
        next();
      }
}

module.exports.autho = autho;
module.exports.auth = auth;