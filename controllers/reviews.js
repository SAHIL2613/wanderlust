const Review=require("../models/review");
const listing=require("../models/listing")



//post review-------------------------------------

module.exports.postReview=async(req,res)=>{
 let foundListing=await listing.findById(req.params.id);
 let newReview=new Review(req.body.review);
 newReview.author=req.user._id;
 foundListing.reviews.push(newReview._id);
 await newReview.save();
 await foundListing.save();
 req.flash("success","Your Review Posted")
 res.redirect(`/listing/${req.params.id}`);
}





module.exports.deleteReview=async(req,res)=>{
let {id, reviewId}=req.params;
await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//pull operator removes from an existing array all instances of a value
//or values that match a specific condition
await Review.findByIdAndDelete(reviewId);
req.flash("success","Review  Deleted!")
res.redirect(`/listing/${id}`);
}