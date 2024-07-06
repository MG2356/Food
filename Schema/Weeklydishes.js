const mongoose=require('mongoose')

const WeeklydishesSchema=new mongoose.Schema({
  "image":String,
    "title":String,
    "Mrp":Number,
  "price":Number,
    "category":String,
    "description":String,
    "status":String
})
const WeeklydishesModel=mongoose.model("WeeklyDishes",WeeklydishesSchema)
module.exports=WeeklydishesModel