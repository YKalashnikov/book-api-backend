import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: {type:String, required:true},
  pages: {type:Number, required:true},
  author: {type:String, required:true},
  id: {type:String},
  userId: {type:mongoose.Schema.Types.ObjectId, required:true},
})


export default mongoose.model("Book", schema)