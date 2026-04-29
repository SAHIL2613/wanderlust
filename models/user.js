const mongoose=require("mongoose");
const Schema =mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;


const userSchema=new Schema({
  email:{
    type:String, 
    required:true
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);
//we dont have to define username and password as passport-local-mongoose
//define them by default and hasing and salting too