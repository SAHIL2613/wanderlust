
require('dotenv').config();

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");//helps to create many templates eg navbar
const expressError=require("./utils/expressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");




//this is required from routes folder
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


// app.get("/",(req,res)=>{
//   res.send("i am root api");
// });


main()
.then(()=>{
  console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
 
   await mongoose.connect(dbUrl);
}

const store = new MongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET || "mySuperSecretKey12345",
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("error at mongo session store")
})

const sessionOptions={
  store,
 secret:process.env.SESSION_SECRET || "mySuperSecretKey12345",
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:Date.now() +7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  },
};



app.listen(8080,()=>{
  console.log("server started");
});

app.use(session(sessionOptions));
app.use(flash()); //always use before passing route

//passport to will use sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

//to store user related data in session
passport.serializeUser(user.serializeUser());
//to remove user related data after the session 
//eg as we logout data get released
passport.deserializeUser(user.deserializeUser());


//this middleware ....
app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();
})

//after flash
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);








//this should be placed at the before ERROR HANDLER always 
app.use((req,res,next)=>{
  next(new expressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500 ,message="something went wrong"}=err;
  res.status(statusCode).render("error",{err})
});








