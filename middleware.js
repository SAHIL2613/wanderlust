const listing=require("./models/listing");
const expressError=require("./utils/expressError.js");
const { listingSchema,reviewSchema }=require("./schema.js");
const Review=require("./models/review");


module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    //storing the orignalUrl/path if user is not logged in
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in first!");
    return res.redirect("/login");
  }
  next();
}

//passport will delete/reset the value of redirectUrl
//as soon as we log in so to save the redirectUrl 
//we will create a middleware to save the session value
//or redirectUrl value

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    //local can be accessed anywhere anytime in that session
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

//  check owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  const foundListing = await listing.findById(id);

  if (!req.user || !foundListing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner!");
    return res.redirect(`/listing/${id}`);
  }

  next();
};


module.exports.validateListing=(req,res,next)=>{
 let {error}= listingSchema.validate(req.body);//checking server site schema validation
 if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new expressError(400,errMsg)
 }else{
  next();
 }
};

module.exports.validateReview=(req,res,next)=>{
 let {error}= reviewSchema.validate(req.body);//checking server site schema validation
 if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new expressError(400,errMsg)
 }else{
  next();
 }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;

  const review= await Review.findById(reviewId);

    if (!review) {
    req.flash("error", "Review does not exist!");
    return res.redirect(`/listing/${id}`);
  }
   
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this review!");
    return res.redirect(`/listing/${id}`);
  }

  next();
};