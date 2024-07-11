const express = require('express')
const router = express.Router();
const {solace_schema} = require('../schema');
const isLoggedIn = require('../middlewares/checkLogin');
const {checkAuthorizationOnSolaces} = require("../middlewares/checkAuthorization");
const solace = require('../controllers/solace');
const multer = require('multer');

// for storing images to cloudinary
const {storage} = require('../cloudinary/index');
var upload = multer({storage});



function catchAsync(func){
    return function(req, res, next){
        func(req, res, next).catch(()=>next(console.log("error occurred")));
    }
}


const validate_schema=(req, res, next)=>{
    const result=solace_schema.validate(req.body);
    if(result.error){
        const msg=result.error.details.map((e)=>e.message).join(", ");
        console.log(msg);
    }else{
        next(); 
    }    
}

router.get("/", catchAsync(solace.showAllSolaces));

router.post("/", isLoggedIn , upload.array('test') ,validate_schema , catchAsync(solace.createNewSolace));

router.get("/new", isLoggedIn , solace.renderNewSolaceForm);

router.get("/:id", catchAsync(solace.showSolace));

router.get("/edit/:id", isLoggedIn , checkAuthorizationOnSolaces, catchAsync(solace.renderEditSolaceForm));

router.post("/:id", isLoggedIn ,validate_schema, checkAuthorizationOnSolaces ,catchAsync(solace.editSolace));

router.post("/delete/:id", isLoggedIn , checkAuthorizationOnSolaces ,catchAsync(solace.deleteSolace));

module.exports = router;