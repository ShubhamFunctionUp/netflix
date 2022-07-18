const userModel = require('../model/UserModel');
const awsFile = require('../S3/awsFile');
const jwt = require('jsonwebtoken');
const validator = require('../validator/validator');
const MovieModel = require('../model/MovieModel');

const register = async function (req, res) {
    try {
        const requestBody = req.body;
        const {
            name,
            email,
            password,          
        } = requestBody;


        if(!validator.isValid(requestBody)  ){
            return res.status(400).send({status:false,message:"not valid request body"})
        }


        // -----------Name--------------------------------------------

        if (!validator.isValid(name)) {
            return res
              .status(400)
              .send({ status: false, message: "enter valid name" });
          }

          let isName = /^[A-Za-z ]*$/;
          if (!isName.test(name)) {
            return res
              .status(422)
              .send({ status: false, message: "enter valid name" });
          }


        //   ----------------------Email Validation----------------------


        if (!validator.isValid(email)) {
            return res
              .status(400)
              .send({ status: false, message: "enter valid email" });
          }
          if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
            // john45665@gmail.com
            return res
              .status(422)
              .send({
                status: false,
                message: "email is invalid please enter valid email",
              });
          }
    
          const isEmailAlreadyUsed = await userModel.findOne({
            email
          });
    
          if (isEmailAlreadyUsed) {
            return res.status(409).send({
              status: false,
              message: `${email} is already used so please put valid input`,
            });
          }

        //   -------------Password--------------------------------
        if (!validator.isValid(password)) {
            return res
              .status(400)
              .send({ status: false, message: "enter valid password" });
          }
    
          let isPasswordPresent = await userModel.findOne({password:password});
            
          if(isPasswordPresent){
              return res.status(409).send({status:false,msg:"Password is already Present"})
          }

        //   ------------------AWSFile------------------------
          console.log(req.files)
        let file = req.files;
        let storeData = req.body;
        if(file && file.length>0){
            let uploadFileUrl = await awsFile.uploadFile(file[0]);
            storeData.profileImage = uploadFileUrl;
            console.log("Image successfully uploaded");
        }else{
            return res.send({msg:"file is not present"})
        }


        let registerUser = await userModel.create(storeData)
        return res.status(201).send({status:true,data:registerUser});
    } catch (error) {
        return res.send({msg:err.message})
    }   
}

const login = async function (req,res){
    let {email,password} = req.body;
    if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid email" });
      }
      if (!/^([a-z0-9\.-]+)@([a-z-]+).([a-z]+)$/.test(email)) {
        // john45665@gmail.com
        return res
          .status(422)
          .send({
            status: false,
            message: "email is invalid please enter valid email",
          });
      }
      let userPresent = await userModel.findOne({email:email,password:password})
      if(!userPresent){
        return res.status(404).send({msg:"User is not present"});
      }
      let token = jwt.sign({userId:userPresent._id},"Shubham")
      return res.status(200).send({msg:"Successfully login",data:token})

}


const getDetails = async function (req,res) {
  try {
    let userId = req.params.userId;
    let userHasSubscription = await userModel.findOne({_id:userId,subscription:true});
    if (!userHasSubscription) {
      return res.status(404).send({msg:"Subscription is not active "})
    }

    let movieData = await MovieModel.find({isDeleted:false});
    return res.status(200).send({msg:"successfull",data:movieData});

  } catch (error) {
    return res.status(500).send({msg:error.message})
  }
}

const addSubscription = async function (req,res){
  try {
      let userId = req.params.userId;
      let userIsPresent = await userModel.findOne({_id:userId});
      if(!userIsPresent){
        return res.status(404).send({msg:"User is not present"})
      }

      let subsciptionIsTaken = await userModel.findOneAndUpdate({_id:userId},{$set:{subscription:true}},{new:true})

      return res.status(200).send({msg:"Subscription is activated",data:subsciptionIsTaken})


  } catch (error) {
      
  }
}

module.exports.addSubscription = addSubscription
module.exports.getDetails = getDetails
module.exports.login = login
module.exports.register = register;