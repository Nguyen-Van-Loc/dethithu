const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1/All')
const Schema=mongoose.Schema;
const all=new Schema({
    msp:String,
    gia:Number,
    ten:String,
    image:String,
    size:Number
},{collection:'all'})
const SanPhamModel=mongoose.model('all',all);
module.exports=SanPhamModel