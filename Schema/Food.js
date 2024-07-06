const mongoose=require('mongoose')

const FoodSchema=new mongoose.Schema({
  "image":String,
    "title":String,
    "Mrp": mongoose.Schema.Types.Decimal128,
  "price": mongoose.Schema.Types.Decimal128,
    "category":String,
    "description":String,
    "status":String
})
const FoodModel=mongoose.model("FoodDetail",FoodSchema)
module.exports=FoodModel