const express = require('express');
const router = express.Router();
const {review_schema} = require('../schema');
const isLoggedIn = require('../middlewares/checkLogin');
const {checkAuthorizationOnReviews} = require('../middlewares/checkAuthorization');
const review = require('../controllers/review');

function catchAsync(func){
    return function(req, res, next){
        func(req, res, next).catch(()=>next(console.log("error occurred")));
    }
}


const validateReviewSchema=(req, res, next)=>{
    const result=review_schema.validate(req.body);
    if(result.error){
        const msg=result.error.details.map((e)=>e.message).join(", ");
        console.log(msg);
    }else{
        next(); 
    }    
}



router.post("/:id/reviews", isLoggedIn ,validateReviewSchema, catchAsync(review.postReview));


router.post("/:id/reviews/:review_id", isLoggedIn , checkAuthorizationOnReviews, catchAsync(review.deleteReview));

module.exports = router;
