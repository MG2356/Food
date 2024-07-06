const mongoose=require('mongoose')

const FoodSchema=new mongoose.Schema({
  "image":String,
    "title":String,
    "Mrp":String,
    "price":String,
    "type":String,
    "description":String,
    "status":String
})
const FoodModel=mongoose.model("FoodDetail",FoodSchema)
module.exports=FoodModel