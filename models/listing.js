const mongoose=require("mongoose");
const Schema=mongoose.Schema; //storing mongoose.Schema in a var so that we dont have to write mongoose.Schema again and again
const review=require("./review.js");


const listingSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
  },
  image: {
     url:String,
     filename:String,
},
  //alternative way
  // image:{
  //   type:String,
  //   default:"https://images.unsplash.com/photo-1501117716987-c8e1ecb2100d",
  //   set:(v)=>
  //     v===""
  //     ?"https://images.unsplash.com/photo-1501117716987-c8e1ecb2100d":v,
  // },
  price:{
    type:Number,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry:{
    type:{
    type:String,
    enum:['Point'],
    required:true
    },
    coordinates:{
      type:[Number],
      required:true
 
    }
  },

});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
     await review.deleteMany({_id:{$in:listing.reviews}})
  }
 
})

const listing = mongoose.model("listing",listingSchema);
module.exports=listing;

