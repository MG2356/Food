const mongoose=require('mongoose')

const FoodSchema=new mongoose.Schema({
  "image":String,
    "title":String,
    "Mrp":Number,
  "price":Number,
    "category":String,
    "description":String,
    "status":String
})
const FoodModel=mongoose.model("FoodDetail",FoodSchema)
module.exports=FoodModel