const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//rendering newlisting form
router.get("/new",
  isLoggedIn,
  listingController.rendernew);





  //edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,upload.single("listing[image]"),
  wrapAsync(listingController.edit)
);

//showlisting && create new listing
router
  .route("/")
  .get( wrapAsync(listingController.index))
  .post(isLoggedIn,validateListing,
    upload.single("listing[image]"),
 wrapAsync(listingController.create)
);




//show selected listing && update selected listing && delete selected listing
router
   .route("/:id")
   .get(wrapAsync(listingController.show))
   .put( isLoggedIn, isOwner,validateListing,upload.single("listing[image]"),
    wrapAsync(listingController.update))
   .delete(isLoggedIn,isOwner,
    wrapAsync(listingController.delete));



module.exports=router;