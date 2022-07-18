const MovieModel = require('../model/MovieModel');
const UserModel = require('../model/UserModel');
const validator = require('../validator/validator')
const awsFile = require('../S3/awsFile');
const awsVideo = require('../S3/awsVideo');
const { findByIdAndDelete } = require('../model/MovieModel');

const movieCreate = async function (req,res) {
    let userId = req.params.userId;
    let userIsAdmin = await UserModel.findOne({_id:userId,isAdmin:true});
    if(!userIsAdmin){
        return res.status(404).send({msg:"User is not admin"});
    }
    let {
    movieName,
    MovieImage,
    Description,
    rating,
    date,
    movieTypes,
    videoLink,
    cast }= req.body
    rating = parseInt(rating)
    if(!validator.isValidRequestBody(req.body)){
        return res.status(400).send({msg:"please enter valid request body"})
    }

    if(!validator.isValid(movieName)){
        return res.status(404).send({msg:"Please enter movie name"})
    }

    if(!validator.isValid(Description)){
        return res.status(404).send({msg:"Please enter Description"})
    }

    if(![1,2,3,4,5].includes(rating)){
        return res.status(404).send({msg:"Please rate in between 1 to 5"})
    }

    if(!validator.isValid(date)){
        return res.status(400).send({msg:"Please enter valid date"})
    }

    if(!validator.isValid(movieTypes)){
        return res.status(400).send({msg:"Please enter valid movie Types"})
    }

    if(!validator.isValid(cast)){
        return res.status(400).send({msg:"Please enter valid cast"})
    }

    //-------------------Movie Image----------------------------------------

    // console.log(req.files)
    let file = req.files;
    let storeData = req.body;
    if(file && file.length>0){
        let uploadFileUrl = await awsFile.uploadFile(file[0]);
        storeData.MovieImage = uploadFileUrl;
        console.log("image successfully uploaded");
    }else{
        return res.send({msg:" image file is not present"})
    }



    //----------------------Video ---------------------------------------------
    console.log(req.files)
     file = req.files;
    if(file && file.length>0){
        let uploadFileUrl = await awsVideo.uploadFile(file[1]);
        storeData.videoLink = uploadFileUrl; 
        console.log("Video successfully uploaded");
    }else{
        return res.send({msg:"Video file is not present"})
    }
    

    let addMovie = await MovieModel.create(storeData)
    return res.status(201).send({msg:"Successfully",data:addMovie})
}

const getMovie = async function (req,res) {
  try {
    let queryParams = req.query;
    let obj = {};

    if(queryParams.movieName){
        obj.movieName ={$regex:queryParams.movieName} 
    }
    

    if(queryParams.rating){
        obj.rating = parseInt(queryParams.rating);
        console.log(obj.rating)
    }

   if(queryParams.movieTypes){
    obj.movieTypes =queryParams.movieTypes
   }
    let data = await MovieModel.find(obj)
    return res.status(202).send({msg:"successful",data:data})
  } catch (error) {
    return res.status(500).send({msg:"Failed",message:error.message})
  }
}

const deleteMovie = async function (req,res) {
    
    if (!req.body) {
        return res.status(400).send({msg:"Please enter the request body"})
    }

    let movieId = req.params.movieId;
    let moviePresent = await MovieModel.findOne({_id:movieId});
    
    if (!moviePresent) {
        return res.status(400).send({msg:"Movie is not present"})
    }

    let data = await MovieModel.findByIdAndDelete(movieId)
    return res.status(200).send({msg:"Successfully deleted",data:data});
}



module.exports.deleteMovie=deleteMovie
module.exports.getMovie = getMovie
module.exports.movieCreate = movieCreate