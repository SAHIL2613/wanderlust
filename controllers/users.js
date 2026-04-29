const User=require("../models/user");

module.exports.getSignupForm=(req,res)=>{
  res.render("users/signup.ejs");
}

//signup-----------------------------------

module.exports.signup=async(req,res,next)=>{
  try{
  let {username,email,password}=req.body;
  const newUser=new User({email,username});
  const registeredUser=await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
      return next(err);
    }
      req.flash("success","welcome to wanderlust!");
      res.redirect(res.locals.redirectUrl);
  });

  }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }

}

//login-form--------------------
module.exports.getLoginForm=(req,res)=>{
  res.render("users/login.ejs");
}


//log-in-------------------------------
module.exports.login= async(req,res)=>{
    
      req.flash("success","Welcome back to Wanderlust!");
      let redirectUrl=res.locals.redirectUrl|| "/listing"
      res.redirect(redirectUrl);  
}


//logout-----------------------------------

module.exports.logout=(req,res)=>{
req.logout((err)=>{
  if(err){
     return next(err);
  }
  req.flash("success","you are logged out ");
  res.redirect("/listing");
})
}