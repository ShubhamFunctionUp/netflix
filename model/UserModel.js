const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        max:15,
        min:8
    },
    subscription:{
        type:Boolean,
        trim:true,
        default:false
    },
    profileImage:{
        type:String,
        required:true
    },
    movieWatched:[String],
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model('User',UserSchema);