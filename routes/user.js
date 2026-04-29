const express=require("express");
const router=express.Router();
const passport=require("passport");
const wrapAsync=require("../utils/wrapAsync.js");
const { saveRedirectUrl}=require("../middleware.js");


const userController=require("../controllers/users.js");

//getsignupform && signupdone
router
 .route("/signup")
 .get(userController.getSignupForm)
 .post(wrapAsync(userController.signup));


//getloginform  && logindone
router
  .route("/login")
  .get(userController.getLoginForm)
  .post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:'/login',
      failureFlash:true}),
 userController.login);


// log out
router.get("/logout",userController.logout)

module.exports=router;
