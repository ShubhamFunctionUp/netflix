const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    movieName:{
        type:String,
        required:true,
        trim:true
    },
    MovieImage:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true,
        min:25,
        trim:true
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    },
    date:{
        type:String,
        required:true
    },
    movieTypes:{
        type:String,
        required:true
    },
    videoLink:{
        type:String,
        required:true
    },
    cast:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model('Movie',MovieSchema)