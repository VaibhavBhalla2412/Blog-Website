const Solace = require("../models/solace");
const Review = require("../models/review");

function catchAsync(func){
    return function(req, res, next){
        func(req, res, next).catch(()=>next(console.log("error occurred")));
    }
}



// Check edit, delete authorization of a user on a solace.
const checkAuthorizationOnSolaces = async (req, res, next)=>{
    
    const solace = await Solace.findById(req.params.id).populate("creator");
    if(!solace){
        req.flash("error", "No solace found");
        res.redirect("/solaces");
    }    
    if(!solace.creator._id.equals(res.locals.user._id)){
        console.log("bad auth");
        req.flash("error", "You can't do that !!!");
        res.redirect(`/solaces/${solace._id}`);
        return;
    }
    else{console.log(" good checkauthSolace");}
    next();

}

// Check edit, delete authorization of a user on a review.

const checkAuthorizationOnReviews = catchAsync(async (req, res, next)=>{
    
    const solace = await Solace.findById(req.params.id);
    const review = await Review.findById(req.params.review_id).populate("author");
    if(!review){
        req.flash("error", "No review found");
        res.redirect(`/solaces/${solace._id}`);
    }    
    if(!review.author._id.equals(res.locals.user._id)){
        req.flash("error", "You can't do that !!!");
        res.redirect(`/solaces/${solace._id}`);
        return;
    }
    next();

});



module.exports = {checkAuthorizationOnSolaces, checkAuthorizationOnReviews};