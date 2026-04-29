const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware");

const reviewController=require("../controllers/reviews.js");


// post reviews route
router.post("/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports=router;