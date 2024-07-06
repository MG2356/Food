const mongoose=require('mongoose')

const FoodSchema=new mongoose.Schema({
   FoodImage:String,
   FoodName:String,
   FoodMRP:String,
   FoodPrice:String,
   FoodType:String,
    status: String
})
const FoodModel=mongoose.model("FoodDetail",FoodSchema)
module.exports=FoodModel