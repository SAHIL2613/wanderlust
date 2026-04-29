const listing=require("../models/listing");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;

const geocodingClient=mbxGeocoding({accessToken:mapToken});


//index-----------------------------------------

module.exports.index=async (req,res)=>{
 req.session.visited = true; //copied from chat gpt
 const allListing= await listing.find({});
 res.render("listings/index.ejs",{allListing});
};

//search-----------------------------------------




//new listing form-------------------------------

module.exports.rendernew=(req,res)=>{
 
  res.render("listings/new.ejs");

}


//show-------------------------------------------

module.exports.show=async(req,res,next)=>{
let {id}=req.params;

const showlisting=await listing.findById(id)
.populate({path:"reviews",   // this how we nest populate
  populate:{              
    path:"author",
  },

}).populate("owner");

if(!showlisting){
 req.flash("error","Listing You requested for does not exist!");
 return res.redirect("/listing");
}
res.render("listings/show",{
  listing:showlisting,
  mapToken:process.env.MAP_TOKEN,
});
}


//create----------------------------------------

module.exports.create=async(req,res,next)=>{ 
 
  let response=await geocodingClient
  .forwardGeocode({
    query:req.body.listing.location,
    limit:1,
  })
  .send();


 let url=req.file.path;
 let filename=req.file.filename;

 const newlisting=new listing(req.body.listing);
 newlisting.owner=req.user._id;//storing curr user as owner
 newlisting.image={url,filename};

 newlisting.geometry=response.body.features[0].geometry;

 await newlisting.save();
 req.flash("success","New Listing Created!");
 res.redirect("/listing"); 
  }

  //edit----------------------------------------

  module.exports.edit=async (req,res)=>{
   let {id}=req.params;
   const editlisting=await listing.findById(id);
   if(!editlisting){
   req.flash("error","Listing You requested for does not exist!");
   return res.redirect("/listing");
  }
   let orignalImageUrl=editlisting.image.url;
   orignalImageUrl=orignalImageUrl.replace("/upload","/upload/h_300,w_250");
   res.render("listings/edit.ejs",{listing:editlisting,orignalImageUrl});
  }


module.exports.update = async (req, res) => {

  let { id } = req.params;

  let foundListing = await listing.findById(id);

  // update text fields
  foundListing.title = req.body.listing.title;
  foundListing.description = req.body.listing.description;
  foundListing.price = req.body.listing.price;
  foundListing.location = req.body.listing.location;
  foundListing.country = req.body.listing.country;


  // IMPORTANT: re-geocode location
    const response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

    foundListing.geometry = response.body.features[0].geometry;

  //  only update image if new image uploaded
  if (typeof req.file !=="undefined") {

    let url = req.file.path;
    let filename = req.file.filename;

    foundListing.image = { url, filename };
  }

  await foundListing.save();

  req.flash("success", "Listing Updated!");

  res.redirect(`/listing/${id}`);
};

//delete----------------------------------------


module.exports.delete=async(req,res)=>{
  let {id}=req.params;
  let deletedlisting=await listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success","Listing Deleted!")
  res.redirect("/listing")
}